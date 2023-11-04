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
  data?: {
    sticky?: boolean;
    title: string;
    replyCount: number;
  };
  constructor(
    session: Session,
    id: number,
    data?: {
      sticky: boolean;
      title: string;
      replyCount: number;
    }
  ) {
    this.id = id;
    this.session = session;
    if (data) this.data = data;
  }

  /**
   * Gets data from the Scratch website and sets the Topic.data
   */
  async setData() {
    const request = await fetch(
      `https://scratch.mit.edu/discuss/m/topic/${this.id}`
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    const dom = parse(await request.text());
    const pageCount =
      Number(dom.querySelector(".pagination > li:last-child span")?.text) || 1;
    let replyCount = 0;
    if (pageCount === 1)
      replyCount = dom.querySelectorAll("article").length - 1;
    else {
      const lastPageReq = await fetch(
        `https://scratch.mit.edu/discuss/m/topic/${this.id}/?page=${pageCount}`
      );
      if (!lastPageReq.ok)
        throw Error(`Request failed with status ${request.status}`);
      const lastPageDom = parse(await lastPageReq.text());
      replyCount =
        (pageCount - 1) * 20 +
        lastPageDom.querySelectorAll("article").length -
        1;
    }

    this.data = {
      title: dom
        .querySelector("nav > h1")!
        .childNodes.filter((node) => node.nodeType === 3)
        .map((node) => node.text)
        .join("")
        .trim(),
      replyCount
    };
  }

  /**
   * Gets some the posts in the topic.
   * @returns An array of posts in the topic.
   */
  async getPosts(page: number = 1) {
    let posts: Post[] = [];

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
      .querySelector(".content")!
      .getElementsByTagName("article");
    children.forEach((child) => {
      const id = child.getAttribute("id")!.split("-")[1];
      const content = child.querySelector(".post-content")!.innerHTML;
      const parsableContent = child.querySelector(".post-content")!;
      const time = new Date(
        child.querySelector("time")!.getAttribute("datetime")!
      );
      const post = new Post(this.session, Number(id), {
        content: content,
        time: time,
        parsableContent: parsableContent,
        author: child
          .getElementsByTagName("header")[0]
          .getElementsByTagName("h1")[0].text
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
    if (!this.session?.auth) throw Error("You need to be logged in");
    const form = new FormData();
    form.append("csrfmiddlewaretoken", this.session.auth.csrfToken);
    form.append("body", body);
    form.append("AddPostForm", "");
    const encoder = new FormDataEncoder(form);
    const request = await fetch(
      `https://scratch.mit.edu/discuss/topic/${this.id}/`,
      {
        method: "POST",
        body: await streamToString(Readable.from(encoder.encode())),
        headers: {
          Cookie: this.session.auth.cookieSet,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "X-CSRFToken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": encoder.contentType,
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
    if (!this.session?.auth) throw Error("You need to be logged in");
    const followFetch = await fetch(
      `https://scratch.mit.edu/discuss/subscription/topic/${this.id}/add/`,
      {
        method: "POST",
        headers: {
          Cookie: this.session.auth.cookieSet,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "X-CSRFToken": this.session.auth.csrfToken,
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
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
    if (!this.session?.auth) throw Error("You need to be logged in");
    const unfollowFetch = await fetch(
      `https://scratch.mit.edu/discuss/subscription/topic/${this.id}/delete/`,
      {
        method: "POST",
        headers: {
          Cookie: this.session.auth.cookieSet,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "X-CSRFToken": this.session.auth.csrfToken,
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
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
