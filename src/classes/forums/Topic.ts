import { Session, UserAgent } from "../../Consts";
import { parse } from "node-html-parser";
import Post from "./Post";
import fetch from "cross-fetch";

class Topic {
  id: number;
  session: Session;
  constructor({ id, session }: { id: number, session: Session }) {
    this.id = id;
    this.session = session;
  }

  async getPosts() {
    let posts = [];

    const res = await fetch(`https://scratch.mit.edu/discuss/m/topic/${this.id}`, {
      headers: {
        "User-Agent": UserAgent
      }
    });
    if (!res.ok) {
      throw new Error(`Error fetching posts for topic ${this.id} - ${res.statusText}`);
    }
    const dom = parse(await res.text());
    const children = dom.querySelector(".content").getElementsByTagName("article");
    children.forEach((child) => {
      const id = child.getAttribute("id").split("-")[1];
      const content = child.querySelector(".post-content").innerHTML;
      const parsableContent = child.querySelector(".post-content");
      const post = new Post({
        id: Number(id),
        session: this.session,
        content: content,
        parsableContent: parsableContent,
        author: child.getElementsByTagName("header")[0].getElementsByTagName("h1")[0].innerText
      });
      posts.push(post);
    });

    return posts;
  }
};
export default Topic;
