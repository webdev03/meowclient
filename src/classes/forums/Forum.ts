import Topic from "./Topic";
import { parse } from "node-html-parser";
import { Session, UserAgent } from "../../Consts";
import { Readable } from "node:stream";
import { FormData } from "formdata-node";
import { FormDataEncoder } from "form-data-encoder";
import { streamToString } from "../../utils";

/**
 * Class for profiles.
 * @param session The ScratchSession that will be used.
 * @param [id] The ID of the forum you want to get.
 */
class Forum {
  id?: number;
  session: Session;
  constructor(session: Session, id?: number) {
    this.id = id;
    this.session = session;
  }

  /**
   * Gets a list of topics.
   * @returns An array of topics.
   */
  async getTopics(page: number = 1) {
    let topics: Topic[] = [];

    const res = await fetch(
      `https://scratch.mit.edu/discuss/m/${this.id}/?page=${page}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!res.ok) {
      throw new Error(
        `Error fetching topics for forum ${this.id} - ${res.statusText}`
      );
    }
    const dom = parse(await res.text());
    const listDOMElement = dom.querySelector(".topic.list")!;
    const children = listDOMElement.getElementsByTagName("li");
    children.forEach((child) => {
      const id = child
        .getElementsByTagName("a")[0]
        .getAttribute("href")!
        .split("/")
        .splice(1)[3];
      const title = child.querySelector("strong")!.text;
      const replyCount = Number(
        child.querySelector(".item span")!.innerText.split(" ")[0]
      );
      const isSticky = child.classList.contains("sticky");
      const topic = new Topic(this.session, Number(id), {
        title: title,
        replyCount: replyCount,
        sticky: isSticky
      });
      topics.push(topic);
    });

    return topics;
  }

  /**
   * Create a topic
   * @param title The title of the topic
   * @param body The body of the topic
   */
  async createTopic(title: string, body: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    if (!this.id) throw Error("You need to add a forum id");
    const form = new FormData();
    form.append("csrfmiddlewaretoken", this.session.auth.csrfToken);
    form.append("name", title);
    form.append("body", body);
    form.append("subscribe", "on");
    form.append("AddPostForm", "");
    const encoder = new FormDataEncoder(form);
    const request = await fetch(
      `https://scratch.mit.edu/discuss/${this.id}/topic/add/`,
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
          Referer: `https://scratch.mit.edu/discuss/${this.id}/topic/add`
        }
      }
    );

    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Sets the currently logged in user's signature
   * @param content The content to set the signature to
   */
  async setSignature(content: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const editFetch = await fetch(
      `https://scratch.mit.edu/discuss/settings/${this.session.auth.sessionJSON.user.username}/`,
      {
        headers: {
          Cookie: this.session.auth.cookieSet,
          "User-Agent": UserAgent,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/discuss/settings/${this.session.auth.sessionJSON.user.username}/`
        },
        method: "POST",
        body: `csrfmiddlewaretoken=${
          this.session.auth.csrfToken
        }&signature=${encodeURIComponent(content)}&update=`
      }
    );
    if (!editFetch.ok) {
      throw new Error(`Error editing signature - ${editFetch.statusText}`);
    }
  }
}

export default Forum;
