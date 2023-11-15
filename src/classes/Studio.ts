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
/**
 * Class for studios.
 * @param session The ScratchSession that will be used.
 * @param id The id of the studio you want to get.
 */
class Studio {
  id: number;
  session: Session;
  constructor(session: Session, id: number) {
    this.id = id;
    this.session = session;
  }

  /**
   * Get the API data of the studio
   */
  async getAPIData() {
    const response = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    return (await response.json()) as StudioAPIResponse;
  }

  /**
   * Follow the studio
   */
  async follow() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://scratch.mit.edu/site-api/users/bookmarkers/${this.id}/add/?usernames=${this.session.auth.sessionJSON.user.username}`,
      {
        method: "PUT",
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          referer: `https://scratch.mit.edu/studios/${this.id}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Unfollow the studio
   */
  async unfollow() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://scratch.mit.edu/site-api/users/bookmarkers/${this.id}/remove/?usernames=${this.session.auth.sessionJSON.user.username}`,
      {
        method: "PUT",
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          referer: `https://scratch.mit.edu/studios/${this.id}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Sets the title of the studio.
   * @param value The value to set the title to.
   */
  async setTitle(value: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const setFetch = await fetch(
      `https://scratch.mit.edu/site-api/galleries/all/${this.id}/`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.auth.csrfToken,
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/studios/${this.id}`
        },
        body: JSON.stringify({
          title: value
        })
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Could not set title - ${setFetch.statusText}`);
    }
  }

  /**
   * Sets the description of the studio.
   * @param value The value to set the description to.
   */
  async setDescription(value: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const setFetch = await fetch(
      `https://scratch.mit.edu/site-api/galleries/all/${this.id}/`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.auth.csrfToken,
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/studios/${this.id}`
        },
        body: JSON.stringify({
          description: value
        })
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Could not set description - ${setFetch.statusText}`);
    }
  }

  /**
   * Invites a curator to the studio.
   * @param username The username of the user to add.
   */
  async inviteCurator(username: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const inviteFetch = await fetch(
      `https://scratch.mit.edu/site-api/users/curators-in/${this.id}/invite_curator/?usernames=${username}`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.auth.csrfToken,
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/studios/${this.id}/curators`
        }
      }
    );
    if (!inviteFetch.ok) {
      throw new Error(`Could not invite curator - ${inviteFetch.statusText}`);
    }
  }

  /**
   * Removes a curator from the studio.
   * @param username The username of the user to remove.
   */
  async removeCurator(username: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const removeFetch = await fetch(
      `https://scratch.mit.edu/site-api/users/curators-in/${this.id}/remove/?usernames=${username}`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.auth.csrfToken,
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/studios/${this.id}/curators`
        }
      }
    );
    if (!removeFetch.ok) {
      throw new Error(`Could not remove curator - ${removeFetch.statusText}`);
    }
  }

  /**
   * Accepts an invite to a studio
   * You can check if you have an invite with the getUserData function
   */
  async acceptInvite() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const req = await fetch(
      `https://scratch.mit.edu/site-api/users/curators-in/${this.id}/add/?usernames=${this.session.auth.sessionJSON.user.username}`,
      {
        method: "PUT",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.auth.csrfToken,
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/studios/${this.id}/curators`
        }
      }
    );
    if (!req.ok) {
      throw Error(
        `Could not join studio -- did you get an invite? ${req.statusText}`
      );
    }
  }

  /**
   * Check if you are a manager, a curator, invited, or following the studio
   */
  async getUserData() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const req = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/users/${this.session.auth.sessionJSON.user.username}`,
      {
        headers: {
          "User-Agent": UserAgent,
          "X-Token": this.session.auth.sessionJSON.user.token
        }
      }
    );
    if (!req.ok) {
      throw new Error(`Could not get data - ${req.statusText}`);
    }
    return (await req.json()) as {
      manager: boolean;
      curator: boolean;
      invited: boolean;
      following: boolean;
    };
  }

  /**
   * Adds a project to the studio.
   * @param project The project ID to add to the studio.
   */
  async addProject(project: number) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const addFetch = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/project/${project}`,
      {
        method: "POST",
        headers: {
          "User-Agent": UserAgent,
          "X-Token": this.session.auth.sessionJSON.user.token
        }
      }
    );
    if (!addFetch.ok) {
      throw new Error(`Could not add project - ${addFetch.statusText}`);
    }
  }

  /**
   * Removes a project from the studio.
   * @param project The project ID to remove from the studio.
   */
  async removeProject(project: number) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const removeFetch = await fetch(
      `https://api.scratch.mit.edu/studios/${this.id}/project/${project}`,
      {
        method: "DELETE",
        headers: {
          "User-Agent": UserAgent,
          "X-Token": this.session.auth.sessionJSON.user.token
        }
      }
    );
    if (!removeFetch.ok) {
      throw new Error(`Could not remove project - ${removeFetch.statusText}`);
    }
  }

  /**
   * Comment on a studio
   * @param content The content of the
   * @param parent_id The comment ID of the parent
   * @param commentee_id The ID of the user to ping in the starting
   */
  async comment(content: string, parent_id?: number, commentee_id?: number) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://api.scratch.mit.edu/proxy/comments/studio/${this.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          content: content,
          commentee_id: commentee_id || "",
          parent_id: parent_id || ""
        }),
        headers: {
          "X-CSRFToken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          Cookie: this.session.auth.cookieSet,
          Referer: `https://scratch.mit.edu/`,
          "Content-Type": "application/json",
          TE: "trailers",
          "User-Agent": UserAgent,
          Accept: "application/json",
          "Accept-Language": "en, en;q=0.8",
          Origin: "https://scratch.mit.edu",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Connection: "keep-alive",
          "Accept-Encoding": "gzip, deflate, br"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    return Number((await request.json())["id"]);
  }

  /**
   * Toggle comments on or off
   */
  async toggleComments() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://scratch.mit.edu/site-api/comments/gallery/${this.id}/toggle-comments/`,
      {
        method: "POST",
        headers: {
          "User-Agent": UserAgent,
          "X-CSRFToken": this.session.auth.csrfToken,
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/studios/${this.id}/comments`
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Gets the curators in a studio.
   * @param limit The limit of curators to return.
   * @param offset The offset of the curators to return.
   * @returns An array of curators.
   */
  async getCurators(limit: number = 24, offset: number = 0) {
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
    return (await getFetch.json()) as UserAPIResponse[];
  }

  /**
   * Gets the managers in a studio.
   * @param limit The limit of managers to return.
   * @param offset The offset of the managers to return.
   * @returns An array of managers.
   */
  async getManagers(limit: number = 24, offset: number = 0) {
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
    return (await getFetch.json()) as UserAPIResponse[];
  }

  /**
   * Gets the projects in a studio.
   * @param limit The limit of projects to return.
   * @param offset The offset of the projects to return.
   * @returns An array of users.
   */
  async getProjects(limit: number = 24, offset: number = 0) {
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
    return (await getFetch.json()) as OldProjectResponse[];
  }
}

export default Studio;
