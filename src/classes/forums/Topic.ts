import { Session, UserAgent } from "../../Consts";
import { parse } from "node-html-parser";
import Post from "./Post";
import fetch from "cross-fetch";

class Topic {
  id: number;
  session: Session;
  sticky?: boolean;
  title?: string;
  replyCount?: number;
  constructor({ id, session, sticky, title, replyCount }: { id: number; session: Session, sticky?: boolean, title?: string, replyCount?: number }) {
    this.id = id;
    this.session = session;
    this.sticky = sticky;
    this.title = title;
    this.replyCount = replyCount;
  }

  /**
   * Gets the posts in the topic
   * @returns An array of posts in the topic
   */
  async getPosts() {
    let posts = [];

    const res = await fetch(
      `https://scratch.mit.edu/discuss/m/topic/${this.id}`,
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
      const time = new Date(child.querySelector("time").getAttribute("datetime"));
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
   * Follows the topic
   * @returns The status code of the request
   */
  async follow() {
    const followFetch = await fetch(`https://scratch.mit.edu/discuss/subscription/topic/${this.id}/add/`, {
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
    });
    if (!followFetch.ok) {
      throw new Error(
        `Error following topic ${this.id} - ${followFetch.statusText}`
      );
    }
    return followFetch.status;
  }

  /**
   * Unfollows the topic
   * @returns The status code of the request
   */
  async unfollow() {
    const unfollowFetch = await fetch(`https://scratch.mit.edu/discuss/subscription/topic/${this.id}/delete/`, {
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
    });
    if (!unfollowFetch.ok) {
      throw new Error(
        `Error unfollowing topic ${this.id} - ${unfollowFetch.statusText}`
      );
    }
    return unfollowFetch.status;
  }
}
export default Topic;
