import { Session, UserAgent } from "../../Consts";
import { HTMLElement } from "node-html-parser";
import fetch from "cross-fetch";

class Post {
  id: number;
  session: Session;
  content: string;
  parsableContent: HTMLElement;
  author: string;
  time: Date;
  constructor({
    id,
    session,
    content,
    parsableContent,
    author,
    time
  }: {
    id: number;
    session: Session;
    content: string;
    parsableContent: HTMLElement;
    author: string;
    time: Date;
  }) {
    this.id = id;
    this.session = session;
    this.content = content;
    this.author = author;
    this.parsableContent = parsableContent;
    this.time = time;
  }

  /**
   * Edits the post (requires ownership of the post)
   * @param content The new content of the post
   * @returns The status of the request
   */
  async edit(content: string) {
    const editFetch = await fetch(
      `https://scratch.mit.edu/discuss/post/${this.id}/edit/`,
      {
        headers: {
          Cookie: this.session.cookieSet,
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
          this.session.csrfToken
        }&body=${encodeURIComponent(content)
          .replace("%20", "+")
          .replace("\n", "\r\n")}`
      }
    );
    if (!editFetch.ok) {
      throw new Error(
        `Error editing post ${this.id} - ${editFetch.statusText}`
      );
    }
    return editFetch;
  }
}

export default Post;
