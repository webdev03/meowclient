import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";

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

  async inviteCurator(username: string) {
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
}

export default Studio;
