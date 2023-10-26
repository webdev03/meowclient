import { Session, UserAgent } from "../../Consts";
import { parse, HTMLElement } from "node-html-parser";

class Post {
  id: number;
  session: Session;
  data?: {
    content: string;
    parsableContent: HTMLElement;
    author: string;
    time: Date;
  };

  constructor(
    session: Session,
    id: number,
    data?: {
      content: string;
      parsableContent: HTMLElement;
      author: string;
      time: Date;
    }
  ) {
    this.id = id;
    this.session = session;
    if (data) this.data = data;
  }

  /**
   * Gets data from the Scratch website and sets the Post.data
   */
  async setData() {
    const request = await fetch(
      `https://scratch.mit.edu/discuss/m/post/${this.id}`
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    const dom = parse(await request.text());
    const postEl = dom.getElementById(`post-${this.id}`);
    this.data = {
      parsableContent: postEl.querySelector(".post-content")!,
      content: postEl.querySelector(".post-content")!.text,
      author: postEl
        .getElementsByTagName("header")[0]
        .getElementsByTagName("h1")[0].text,
      time: new Date(postEl.querySelector("time")!.getAttribute("datetime")!)
    };
  }

  /**
   * Get the BBCode source of the post
   * @returns The source of the post
   */
  async getSource() {
    const request = await fetch(
      `https://scratch.mit.edu/discuss/post/${this.id}/source/`
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    return await request.text();
  }

  /**
   * Edits the post (requires ownership of the post)
   * @param content The new content of the post
   */
  async edit(content: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const editFetch = await fetch(
      `https://scratch.mit.edu/discuss/post/${this.id}/edit/`,
      {
        headers: {
          Cookie: this.session.auth.cookieSet,
          "User-Agent": UserAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
          Host: "scratch.mit.edu",
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/discuss/post/${this.id}/edit/`
        },
        method: "POST",
        body: `csrfmiddlewaretoken=${
          this.session.auth.csrfToken
        }&body=${encodeURIComponent(content)}`
      }
    );
    if (!editFetch.ok) {
      throw new Error(
        `Error editing post ${this.id} - ${editFetch.statusText}`
      );
    }
  }
}

export default Post;
