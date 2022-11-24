import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";
import { UserAPIResponse } from "./Profile";

interface OldProjectResponse {
  id: number;
  title: string;
  image: string;
  creator_id: number;
  username: string;
  avatar: {
    "90x90": string;
    "60x60": string;
    "55x55": string;
    "50x50": string;
    "32x32": string;
  };
  actor_id: number;
}

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
    comments: number;
    followers: number;
    managers: number;
    projects: number;
  };
}

class Studio {
  id: number;
  session: Session;
  constructor({ id, session }: { id: number; session: Session }) {
    this.id = id;
    this.session = session;
  }

  async getAPIData(): Promise<StudioAPIResponse> {
      const response = await fetch(
        `https://api.scratch.mit.edu/studios/${this.id}/`,
        {
          headers: {
            "User-Agent": UserAgent
          }
        }
      );
      return await response.json();
  }

  /**
   * Sets the title of the studio.
   * @param value The value to set the title to
   */
  async setTitle(value: string) {
    const setFetch = await fetch(
      `https://scratch.mit.edu/site-api/galleries/all/${this.id}/`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.csrfToken,
          Cookie: this.session.cookieSet
        },
        body: JSON.stringify({
          title: value
        })
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Could not set title - ${setFetch.statusText}`);
    }
    return setFetch;
  }

  /**
   * Sets the description of the studio.
   * @param value The value to set the description to
   */
  async setDescription(value: string) {
    const setFetch = await fetch(
      `https://scratch.mit.edu/site-api/galleries/all/${this.id}/`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.csrfToken,
          Cookie: this.session.cookieSet
        },
        body: JSON.stringify({
          description: value
        })
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Could not set description - ${setFetch.statusText}`);
    }
    return setFetch;
  }

  /**
   * Invites a curator to the studio.
   * @param username The username of the user to add
   */
  async inviteCurator(username: string) {
    const inviteFetch = await fetch(
      `https://scratch.mit.edu/site-api/users/curators-in/${this.id}/invite_curator/?usernames=${username}`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.csrfToken,
          Cookie: this.session.cookieSet
        }
      }
    );
    if (!inviteFetch.ok) {
      throw new Error(`Could not invite curator - ${inviteFetch.statusText}`);
    }
    return inviteFetch;
  }

  /**
   * Removes a curator from the studio.
   * @param username The username of the user to remove
   */
  async removeCurator(username: string) {
    const removeFetch = await fetch(
      `https://scratch.mit.edu/site-api/users/curators-in/${this.id}/remove/?usernames=${username}`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.csrfToken,
          Cookie: this.session.cookieSet
        }
      }
    );
    if (!removeFetch.ok) {
      throw new Error(`Could not remove curator - ${removeFetch.statusText}`);
    }
    return removeFetch;
  }

  /**
   * Adds a project to the studio.
   * @param project The project ID to add to the studio
   */
  async addProject(project: number) {
    const addFetch = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/project/${project}`,
      {
        method: "POST",
        headers: {
          "User-Agent": UserAgent,
          "X-Token": this.session.sessionJSON.user.token
        }
      }
    );
    if (!addFetch.ok) {
      throw new Error(`Could not add project - ${addFetch.statusText}`);
    }
    return addFetch;
  }

  /**
   * Removes a project from the studio.
   * @param project The project ID to remove from the studio
   */
  async removeProject(project: number) {
    const removeFetch = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/project/${project}`,
      {
        method: "DELETE",
        headers: {
          "User-Agent": UserAgent,
          "X-Token": this.session.sessionJSON.user.token
        }
      }
    );
    if (!removeFetch.ok) {
      throw new Error(`Could not remove project - ${removeFetch.statusText}`);
    }
    return removeFetch;
  }

  /**
   * Gets the curators in a studio.
   * @param limit The limit of curators to return
   * @param offset The offset of the curators to return
   * @returns An array of curators
   */
  async getCurators(
    limit: number = 24,
    offset: number = 0
  ): Promise<UserAPIResponse[]> {
    const getFetch = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/curators/?limit=${limit}&offset=${offset}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!getFetch.ok) {
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
  async getManagers(
    limit: number = 24,
    offset: number = 0
  ): Promise<UserAPIResponse[]> {
    const getFetch = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/managers/?limit=${limit}&offset=${offset}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!getFetch.ok) {
      throw new Error(`Could not get managers - ${getFetch.statusText}`);
    }
    return await getFetch.json();
  }

  /**
   * Gets the projects in a studio.
   * @param limit The limit of projects to return
   * @param offset The offset of the projects to return
   * @returns An array of users
   */
  async getProjects(
    limit: number = 24,
    offset: number = 0
  ): Promise<OldProjectResponse[]> {
    const getFetch = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/projects/?limit=${limit}&offset=${offset}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!getFetch.ok) {
      throw new Error(`Could not get projects - ${getFetch.statusText}`);
    }
    return await getFetch.json();
  }
}

export default Studio;
