import { Session, UserAgent } from "../Consts";

interface ProjectAPIResponse {
  id: number;
  title: string;
  description: string;
  instructions: string;
  visibility: string;
  public: boolean;
  comments_allowed: boolean;
  is_published: boolean;
  author: {
    id: number;
    username: string;
    scratchteam: boolean;
    history: {
      joined: string;
    };
    profile: {
      id: number;
      images: {
        "90x90": string;
        "60x60": string;
        "55x55": string;
        "50x50": string;
        "32x32": string;
      };
    };
  };
  image: string;
  images: {
    "282x218": string;
    "216x163": string;
    "200x200": string;
    "144x108": string;
    "135x102": string;
    "100x80": string;
  };
  history: {
    created: string;
    modified: string;
    shared: string;
  };
  stats: {
    views: number;
    loves: number;
    favorites: number;
    remixes: number;
  };
  remix: {
    parent: null | number;
    root: null | number;
  };
  project_token: string;
}

interface ProjectComment {
  id: number;
  parent_id: null;
  commentee_id: null;
  content: string;
  datetime_created: string;
  datetime_modified: string;
  visibility: "visible" | "hidden";
  author: {
    id: number;
    username: string;
    scratchteam: boolean;
    image: string;
  };
}

interface ProjectCommentReply {
  id: number;
  parent_id: number;
  commentee_id: number;
  content: string;
  datetime_created: string;
  datetime_modified: string;
  visibility: "visible" | "hidden";
  author: {
    id: number;
    username: string;
    scratchteam: boolean;
    image: string;
  };
  reply_count: number;
}
/**
 * Class for projects.
 * @param session The ScratchSession that will be used.
 * @param id The id of the project you want to get.
 */
class Project {
  id: number;
  session: Session;
  constructor(session: Session, id: number) {
    this.id = id;
    this.session = session;
  }

  /**
   * Gets the api.scratch.mit.edu response of the project.
   */
  async getAPIData() {
    const apiFetch = await fetch(
      `https://api.scratch.mit.edu/projects/${this.id}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!apiFetch.ok) {
      throw new Error("Cannot find project.");
    }
    return (await apiFetch.json()) as ProjectAPIResponse;
  }

  /**
   * Gets comments in the project.
   * @param offset The offset of comments.
   * @param limit The limit of comments to return.
   * @returns The comments.
   */
  async getComments(offset = 0, limit = 20) {
    const apiData = await this.getAPIData();
    const commentFetch = await fetch(
      `https://api.scratch.mit.edu/users/${apiData.author.username}/projects/${this.id}/comments?offset=${offset}&limit=${limit}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!commentFetch.ok) {
      throw new Error(
        `Comments returned status ${commentFetch.status} - ${commentFetch.statusText}`
      );
    }
    return (await commentFetch.json()) as ProjectComment[];
  }

  /**
   * Gets the replies to a comment.
   * @param offset The offset of comments.
   * @param limit The limit of comments to return.
   * @param id The id of the comment to get.
   * @returns The comment replies.
   */
  async getCommentReplies(id: number | string, offset = 0, limit = 20) {
    const apiData = await this.getAPIData();
    const commentFetch = await fetch(
      `https://api.scratch.mit.edu/users/${apiData.author.username}/projects/${this.id}/comments/${id}/replies?offset=${offset}&limit=${limit}`,
      {
        headers: {
          "User-Agent": UserAgent
        }
      }
    );
    if (!commentFetch.ok) {
      throw new Error(
        `Comments returned status ${commentFetch.status} - ${commentFetch.statusText}`
      );
    }
    return (await commentFetch.json()) as ProjectCommentReply[];
  }

  /**
   * Comment on a project
   * @param content The content of the
   * @param parent_id The comment ID of the parent
   * @param commentee_id The ID of the user to ping in the starting
   */
  async comment(content: string, parent_id?: number, commentee_id?: number) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://api.scratch.mit.edu/proxy/comments/project/${this.id}`,
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
   * Set if comments should be allowed or not
   */
  async setCommentsAllowed(state: boolean) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://api.scratch.mit.edu/projects/${this.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          comments_allowed: state
        }),
        headers: {
          "X-Token": this.session.auth.sessionJSON.user.token,
          "Content-Type": "application/json",
          Origin: "https://scratch.mit.edu",
          Referer: "https://scratch.mit.edu/"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Sets the title of the project (requires ownership of the project).
   * @param value The value you want to set the title to.
   */
  async setTitle(value: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const setFetch = await fetch(
      `https://api.scratch.mit.edu/projects/${this.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          title: value
        }),
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          referer: `https://scratch.mit.edu/projects/${this.id}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Error in setting title. ${setFetch.status}`);
    }
  }
  /**
   * Sets the instructions of the project (requires ownership of the project).
   * @param value The value you want to set the instructions to.
   */
  async setInstructions(value: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const setFetch = await fetch(
      `https://api.scratch.mit.edu/projects/${this.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          instructions: value
        }),
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          referer: `https://scratch.mit.edu/projects/${this.id}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Error in setting instructions. ${setFetch.status}`);
    }
  }

  /**
   * Sets the Notes and Credits of the project (requires ownership of the project).
   * @param value The value you want to set the Notes and Credits to.
   */
  async setNotesAndCredits(value: string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const setFetch = await fetch(
      `https://api.scratch.mit.edu/projects/${this.id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          description: value
        }),
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          referer: `https://scratch.mit.edu/projects/${this.id}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Error in setting Notes and Credits. ${setFetch.status}`);
    }
  }

  /**
   * Set the thumbnail of the project
   * @param buffer The buffer of the thumbnail image file
   */
  async setThumbnail(buffer: Buffer) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://scratch.mit.edu/internalapi/project/thumbnail/${this.id}/set/`,
      {
        method: "POST",
        body: buffer,
        headers: {
          "X-CSRFToken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          Cookie: this.session.auth.cookieSet,
          "User-Agent": UserAgent
        }
      }
    );
    if (!request.ok) throw Error("Request not ok");
    return;
  }

  /**
   * Unshares the project (requires ownership of the project).
   */
  async unshare() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const setFetch = await fetch(
      `https://scratch.mit.edu/site-api/projects/all/${this.id}/`,
      {
        method: "PUT",
        body: JSON.stringify({
          isPublished: false
        }),
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          referer: `https://scratch.mit.edu/projects/${this.id}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Error in unsharing. ${setFetch.status}`);
    }
  }

  /**
   * Check if the user is loving the project
   */
  async isLoving() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://api.scratch.mit.edu/projects/${this.id}/loves/user/${this.session.auth.sessionJSON.user.username}`,
      {
        headers: {
          "User-Agent": UserAgent,
          Accept: "*/*",
          "Accept-Language": "en, en;q=0.8",
          "X-Token": this.session.auth.sessionJSON.user.token,
          Pragma: "no-cache",
          "Cache-Control": "no-cache"
        },
        referrer: "https://scratch.mit.edu/"
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    return (await request.json())["userLove"] as boolean;
  }

  /**
   * Check if the user is favoriting the project
   */
  async isFavoriting() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://api.scratch.mit.edu/projects/${this.id}/favorites/user/${this.session.auth.sessionJSON.user.username}`,
      {
        headers: {
          "User-Agent": UserAgent,
          Accept: "*/*",
          "Accept-Language": "en, en;q=0.8",
          "X-Token": this.session.auth.sessionJSON.user.token,
          Pragma: "no-cache",
          "Cache-Control": "no-cache"
        },
        referrer: "https://scratch.mit.edu/"
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    return (await request.json())["userFavorite"] as boolean;
  }

  /**
   * Set the state for loving the project
   * Note that if you want to set up a toggle you want to also use the Project.isLoving() function
   * @param loving Either true or false
   */
  async setLoving(loving: boolean) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://api.scratch.mit.edu/proxy/projects/${this.id}/loves/user/${this.session.auth.sessionJSON.user.username}`,
      {
        method: loving ? "POST" : "DELETE",
        headers: {
          "X-CSRFToken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          Referer: `https://scratch.mit.edu/projects/${this.id}/`,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "Content-Length": "0",
          Origin: "https://scratch.mit.edu",
          "Cache-Control": "max-age=0, no-cache",
          Pragma: "no-cache",
          "Accept-Encoding": "gzip, deflate, br"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    return;
  }

  /**
   * Set the state for favoriting the project
   * Note that if you want to set up a toggle you want to also use the Project.isFavoriting() function
   * @param favoriting Either true or false
   */
  async setFavoriting(favoriting: boolean) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://api.scratch.mit.edu/proxy/projects/${this.id}/favorites/user/${this.session.auth.sessionJSON.user.username}`,
      {
        method: favoriting ? "POST" : "DELETE",
        headers: {
          "X-CSRFToken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          Referer: `https://scratch.mit.edu/projects/${this.id}/`,
          "User-Agent": UserAgent,
          Accept: "*/*",
          "Content-Length": "0",
          Origin: "https://scratch.mit.edu",
          "Cache-Control": "max-age=0, no-cache",
          Pragma: "no-cache",
          "Accept-Encoding": "gzip, deflate, br"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    return;
  }

  /**
   * Shares the project (requires ownership of the project).
   */
  async share() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const setFetch = await fetch(
      `https://api.scratch.mit.edu/proxy/projects/${this.id}/share/`,
      {
        method: "PUT",
        headers: {
          "X-CSRFToken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.sessionJSON.user.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          Referer: `https://scratch.mit.edu/projects/${this.id}/`,
          "User-Agent": UserAgent,
          Accept: "application/json",
          "Content-Type": "application/json",
          "Content-Length": "0",
          Origin: "https://scratch.mit.edu",
          "Cache-Control": "max-age=0, no-cache",
          Pragma: "no-cache",
          "Accept-Encoding": "gzip, deflate, br"
        }
      }
    );
    if (!setFetch.ok) {
      throw new Error(`Error in sharing. ${setFetch.status}`);
    }
  }
}

export default Project;
