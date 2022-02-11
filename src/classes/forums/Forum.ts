import fetch from "cross-fetch";
import Topic from "./Topic";
import { parse } from "node-html-parser";
import { Session, UserAgent } from "../../Consts";

class Forum {
  id?: number;
  session: Session;
  constructor({ id, session }: { id?: number, session: Session }) {
    this.id = id;
    this.session = session;
  }

  /**
   * Gets a list of topics
   * @returns {Promise<Topic[]>} An array of topics
   */
  async getTopics() {
    let topics: Topic[] = [];

    const res = await fetch(`https://scratch.mit.edu/discuss/m/${this.id}`, {
      headers: {
        "User-Agent": UserAgent
      }
    });
    if (!res.ok) {
      throw new Error(`Error fetching topics for forum ${this.id} - ${res.statusText}`);
    }
    const dom = parse(await res.text());
    const listDOMElement = dom.querySelector(".topic.list");
    const children = listDOMElement.getElementsByTagName("li");
    children.forEach((child) => {
      const id = child.getElementsByTagName("a")[0].getAttribute("href").split("/").splice(1)[3];
      const topic = new Topic({
        id: Number(id),
        session: this.session
      });
      topics.push(topic);
    });
    
    return topics;
  };

  /**
   * Gets a topic
   * @param id The ID of the topic
   * @returns {Topic} The topic
   */
  getTopic(id: number): Topic {
    return new Topic({
      id: id,
      session: this.session
    });
  }
}

export default Forum;
