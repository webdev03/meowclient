import { Session, UserAgent } from "../../Consts";
import { parse } from "node-html-parser";
import { Readable } from "node:stream";
import { FormData } from "formdata-node";
import { FormDataEncoder } from "form-data-encoder";
import Post from "./Post";
import { streamToString } from "../../utils";

class Topic {
  id: number;
  session: Session;
  sticky?: boolean;
  title?: string;
  replyCount?: number;
  constructor({
    id,
    session,
    sticky,
    title,
    replyCount
  }: {
    id: number;
    session: Session;
    sticky?: boolean;
    title?: string;
    replyCount?: number;
  }) {
    this.id = id;
    this.session = session;
    this.sticky = sticky;
    this.title = title;
    this.replyCount = replyCount;
  }

  /**
   * Gets some the posts in the topic.
   * @returns An array of posts in the topic.
   */
  async getPosts(page: number = 1) {
    let posts = [];

    const res = await fetch(
      `https://scratch.mit.edu/discuss/m/topic/${this.id}/?page=${page}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!res.ok) {
      throw new Error(
        `Error fetching posts for topic ${this.id} - ${res.statusText}`
      );
    }
    const dom = parse(await res.text());
    const children = dom
      .querySelector(".content")
      .getElementsByTagName("article");
    children.forEach((child) => {
      const id = child.getAttribute("id").split("-")[1];
      const content = child.querySelector(".post-content").innerHTML;
      const parsableContent = child.querySelector(".post-content");
      const time = new Date(
        child.querySelector("time").getAttribute("datetime")
      );
      const post = new Post({
        id: Number(id),
        session: this.session,
        content: content,
        time: time,
        parsableContent: parsableContent,
        author: child
          .getElementsByTagName("header")[0]
          .getElementsByTagName("h1")[0].innerText
      });
      posts.push(post);
    });

    return posts;
  }

  /**
   * Reply to the topic
   * @param body The body of the post
   */
  async reply(body: string) {
    const form = new FormData();
    form.append("csrfmiddlewaretoken", this.session.csrfToken);
    form.append("body", body);
    form.append("AddPostForm", "");
    const encoder = new FormDataEncoder(form);
    const request = await fetch(
      `https://scratch.mit.edu/discuss/topic/${this.id}/`,
      {
        method: "POST",
        body: await streamToString(Readable.from(encoder.encode())),
        headers: {
          Cookie: this.session.cookieSet,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "X-CSRFToken": this.session.csrfToken,
          "X-Token": this.session.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": encoder.contentType,
          Host: "scratch.mit.edu",
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/discuss/topic/${this.id}/`
        }
      }
    );

    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Follows the topic.
   */
  async follow() {
    const followFetch = await fetch(
      `https://scratch.mit.edu/discuss/subscription/topic/${this.id}/add/`,
      {
        method: "POST",
        headers: {
          Cookie: this.session.cookieSet,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "X-CSRFToken": this.session.csrfToken,
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
          Host: "scratch.mit.edu",
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/discuss/topic/${this.id}/`
        }
      }
    );
    if (!followFetch.ok) {
      throw new Error(
        `Error following topic ${this.id} - ${followFetch.statusText}`
      );
    }
  }

  /**
   * Unfollows the topic.
   */
  async unfollow() {
    const unfollowFetch = await fetch(
      `https://scratch.mit.edu/discuss/subscription/topic/${this.id}/delete/`,
      {
        method: "POST",
        headers: {
          Cookie: this.session.cookieSet,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "X-CSRFToken": this.session.csrfToken,
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
          Host: "scratch.mit.edu",
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/discuss/topic/${this.id}/`
        }
      }
    );
    if (!unfollowFetch.ok) {
      throw new Error(
        `Error unfollowing topic ${this.id} - ${unfollowFetch.statusText}`
      );
    }
  }
}

export default Topic;
