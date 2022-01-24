import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";

class Project {
  creator: string;
  id: number;
  session: Session;
  scratchProjectAPI: any;
  constructor({ id, session }: { id: number, session: Session }) {
    this.id = id;
    this.session = session;
  }
  
  /**
   * Gets the api.scratch.mit.edu response of the project
   */
  async getAPIData() {
    if (typeof this.scratchProjectAPI === "undefined") {
      console.log("wow")
      const apiFetch = await fetch(`https://api.scratch.mit.edu/projects/${this.id}`);
      if (!apiFetch.ok) {
        throw new Error("Cannot find project.")
      };
      this.scratchProjectAPI = await apiFetch.json();
    }
    return this.scratchProjectAPI;
  }

  async getComments(offset = 0, limit = 20) {
    const apiData = await this.getAPIData()
    const commentFetch = await fetch(`https://api.scratch.mit.edu/users/${apiData.author.username}/projects/${this.id}/comments?offset=${offset}&limit=${limit}`)
    if (!commentFetch.ok) {
      throw new Error(
        `Comments returned status ${commentFetch.status} - ${commentFetch.statusText}`
      )
    }
    return await commentFetch.json();
  }
}

export default Project;
