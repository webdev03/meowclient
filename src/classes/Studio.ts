import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";
import { UserAPIResponse } from "./Profile";

interface StudioAPIResponse {
  id: number;
  title: string;
  host: number;
  description: string;
  visibility: "visible" | "hidden";
  public: boolean;
  open_to_all: boolean;
  comments_allowed: boolean;
  image: string;
  history: {
    created: string;
    modified: string;
  };
  stats: {
    comments: number,
    followers: number,
    managers: number,
    projects: number,
  };
}

class Studio {
  id: number;
  session: Session;
  scratchStudioAPI: StudioAPIResponse;
  constructor({ id, session }: { id: number; session: Session }) {
    this.id = id;
    this.session = session;
  }

  async getAPIData(): Promise<StudioAPIResponse> {
    if (typeof this.scratchStudioAPI === "undefined") {
      const response = await fetch(`https://api.scratch.mit.edu/studios/${this.id}/`, {
        headers: {
          "User-Agent": UserAgent
        }
      });
      this.scratchStudioAPI = await response.json();
    }
    return this.scratchStudioAPI;
  }

  /**
   * Sets the title of the studio.
   * @param value The value to set the title to
   * @returns {number} The status of the request
   */
  async setTitle(value: string): Promise<number> {
    const setFetch = await fetch(`https://scratch.mit.edu/site-api/galleries/all/${this.id}/`, {
      method: "PUT",
      headers: {
        "User-Agent": UserAgent,
        "X-CSRFToken": this.session.csrfToken,
        Cookie: this.session.cookieSet
      },
      body: JSON.stringify({
        title: value
      })
    });
    if (!setFetch.ok) {
      throw new Error(`Could not set title - ${setFetch.statusText}`);
    }
    return setFetch.status;
  }

  /**
   * Sets the description of the studio.
   * @param value The value to set the description to
   * @returns {number} The status of the request
   */
  async setDescription(value: string): Promise<number> {
    const setFetch = await fetch(`https://scratch.mit.edu/site-api/galleries/all/${this.id}/`, {
      method: "PUT",
      headers: {
        "User-Agent": UserAgent,
        "X-CSRFToken": this.session.csrfToken,
        Cookie: this.session.cookieSet
      },
      body: JSON.stringify({
        description: value
      })
    });
    if (!setFetch.ok) {
      throw new Error(`Could not set description - ${setFetch.statusText}`);
    }
    return setFetch.status;
  }

  /**
   * Invites a curator to the studio.
   * @param username The username of the user to add
   * @returns {number} The status of the request
   */
  async inviteCurator(username: string): Promise<number> {
    const inviteFetch = await fetch(`https://scratch.mit.edu/site-api/users/curators-in/${this.id}/invite_curator/?usernames=${username}`, {
      method: "PUT",
      headers: {
        "User-Agent": UserAgent,
        "X-CSRFToken": this.session.csrfToken,
        Cookie: this.session.cookieSet
      }
    });
    if (!inviteFetch.ok) {
      throw new Error(`Could not invite curator - ${inviteFetch.statusText}`);
    }
    return inviteFetch.status;
  }

  /**
   * Removes a curator from the studio.
   * @param username The username of the user to remove
   * @returns {number} The status of the request
   */
  async removeCurator(username: string): Promise<number> {
    const removeFetch = await fetch(`https://scratch.mit.edu/site-api/users/curators-in/${this.id}/remove/?usernames=${username}`, {
      method: "PUT",
      headers: {
        "User-Agent": UserAgent,
        "X-CSRFToken": this.session.csrfToken,
        Cookie: this.session.cookieSet
      }
    });
    if (!removeFetch.ok) {
      throw new Error(`Could not remove curator - ${removeFetch.statusText}`);
    }
    return removeFetch.status;
  }

  /**
   * Adds a project to the studio.
   * @param project The project ID to add to the studio
   * @returns {number} The status of the request
   */
  async addProject(project: number): Promise<number> {
    const addFetch = await fetch(`https://api.scratch.mit.edu/studios/${this.id}/project/${project}`, {
      method: "POST",
      headers: {
        "User-Agent": UserAgent,
        "X-Token": this.session.sessionJSON.user.token
      }
    });
    if (!addFetch.ok) {
      throw new Error(`Could not add project - ${addFetch.statusText}`);
    }
    return addFetch.status;
  }

  /**
   * Removes a project from the studio.
   * @param project The project ID to remove from the studio
   * @returns {number} The status of the request
   */
   async removeProject(project: number): Promise<number> {
    const removeFetch = await fetch(`https://api.scratch.mit.edu/studios/${this.id}/project/${project}`, {
      method: "DELETE",
      headers: {
        "User-Agent": UserAgent,
        "X-Token": this.session.sessionJSON.user.token
      }
    });
    if (!removeFetch.ok) {
      throw new Error(`Could not remove project - ${removeFetch.statusText}`);
    }
    return removeFetch.status;
  }

  /**
   * Gets the curators in a studio.
   * @param limit The limit of curators to return
   * @param offset The offset of the curators to return
   * @returns An array of curators
   */
  async getCurators(limit: number = 24, offset: number = 0): Promise<UserAPIResponse[]> {
    const getFetch = await fetch(`https://api.scratch.mit.edu/studios/${this.id}/curators/?limit=${limit}&offset=${offset}`, {
      headers: {
        "User-Agent": UserAgent
      }
    });
    if(!getFetch.ok) {
      throw new Error(`Could not get curators - ${getFetch.statusText}`);
    }
    return await getFetch.json();
  }
  
  /**
   * Gets the managers in a studio.
   * @param limit The limit of managers to return
   * @param offset The offset of the managers to return
   * @returns An array of managers
   */
  async getManagers(limit: number = 24, offset: number = 0): Promise<UserAPIResponse[]> {
    const getFetch = await fetch(`https://api.scratch.mit.edu/studios/${this.id}/managers/?limit=${limit}&offset=${offset}`, {
      headers: {
        "User-Agent": UserAgent
      }
    });
    if(!getFetch.ok) {
      throw new Error(`Could not get managers - ${getFetch.statusText}`);
    }
    return await getFetch.json();
  }
}

export default Studio;
