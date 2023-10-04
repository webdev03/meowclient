import Topic from "./Topic";
import { parse } from "node-html-parser";
import { Session, UserAgent } from "../../Consts";
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
  async getTopics() {
    let topics: Topic[] = [];

    const res = await fetch(`https://scratch.mit.edu/discuss/m/${this.id}`, {
      headers: {
        "User-Agent": UserAgent
      }
    });
    if (!res.ok) {
      throw new Error(
        `Error fetching topics for forum ${this.id} - ${res.statusText}`
      );
    }
    const dom = parse(await res.text());
    const listDOMElement = dom.querySelector(".topic.list");
    const children = listDOMElement.getElementsByTagName("li");
    children.forEach((child) => {
      const id = child
        .getElementsByTagName("a")[0]
        .getAttribute("href")
        .split("/")
        .splice(1)[3];
      const title = child.querySelector("strong").innerText;
      const replyCount = Number(
        child.querySelector(".item span").innerText.split(" ")[0]
      );
      const isSticky = child.classList.contains("sticky");
      const topic = new Topic({
        id: Number(id),
        title: title,
        replyCount: replyCount,
        sticky: isSticky,
        session: this.session
      });
      topics.push(topic);
    });

    return topics;
  }

  /**
   * Sets the currently logged in user's signature
   * @param content The content to set the signature to
   */
  async setSignature(content: string) {
    const editFetch = await fetch(
      `https://scratch.mit.edu/discuss/settings/${this.session.sessionJSON.user.username}/`,
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
          Referer: `https://scratch.mit.edu/discuss/settings/${this.session.sessionJSON.user.username}/`
        },
        method: "POST",
        body: `csrfmiddlewaretoken=${
          this.session.csrfToken
        }&signature=${encodeURIComponent(content)}&update=`
      }
    );
    if (!editFetch.ok) {
      throw new Error(`Error editing signature - ${editFetch.statusText}`);
    }
  }
}

export default Forum;
