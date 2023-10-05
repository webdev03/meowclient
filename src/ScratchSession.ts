import { SessionJSON, UserAgent } from "./Consts";
import { createHash } from "node:crypto";

type PartialMessage = {
  id: number;
  datetime_created: string;
  actor_username: string;
  actor_id: number;
}

type Message = PartialMessage & ({
  type: "studioactivity";
  gallery_id: number;
  title: string;
} | {
  type: "forumpost";
  topic_id: number;
  topic_title: string;
} | {
  type: "addcomment";
  comment_type: number;
  comment_obj_id: number;
  comment_id: number;
  comment_fragment: string;
  comment_obj_title: string;
  commentee_username: string;
} | {
  type: "followuser";
  followed_user_id: number;
  followed_username: string;
} | {
  type: "loveproject";
  project_id: number;
  title: string;
} | {
  type: "favoriteproject";
  project_id: number;
  project_title: string;
} | {
  type: "remixproject";
  title: string;
  parent_id: number;
  parent_title: string;
} | {
  type: "becomehoststudio";
  former_host_username: string;
  recipient_id: number;
  recipient_username: string;
  gallery_id: number;
  gallery_title: string;
  admin_actor: boolean;
} | {
  type: "curatorinvite";
  title: string;
  gallery_id: number;
});

/**
 * Manages a Scratch session.
 */
class ScratchSession {
  username: string;
  csrfToken: string;
  token: string;
  cookieSet: string;
  sessionJSON: SessionJSON;

  /**
   * Sets up the ScratchSession to use authenticated functions.
   * @param user The username of the user you want to log in to.
   * @param pass The password of the user you want to log in to.
   */
  async init(user: string, pass: string) {
    this.username = user;
    // a lot of this code is taken from
    // https://github.com/CubeyTheCube/scratchclient/blob/main/scratchclient/ScratchSession.py
    // thanks!
    const headers = {
      "x-csrftoken": "a",
      "x-requested-with": "XMLHttpRequest",
      Cookie: "scratchcsrftoken=a;scratchlanguage=en;",
      referer: "https://scratch.mit.edu",
      "User-Agent": UserAgent
    };
    const loginReq = await fetch("https://scratch.mit.edu/login/", {
      method: "POST",
      body: JSON.stringify({
        username: user,
        password: pass
      }),
      headers: headers
    });
    if (!loginReq.ok) {
      throw new Error("Login failed.");
    }

    this.csrfToken = /scratchcsrftoken=(.*?);/gm.exec(
      loginReq.headers.get("set-cookie")
    )[1];
    this.token = /"(.*)"/gm.exec(loginReq.headers.get("set-cookie"))[1];
    this.cookieSet =
      "scratchcsrftoken=" +
      this.csrfToken +
      ";scratchlanguage=en;scratchsessionsid=" +
      this.token +
      ";";
    const sessionFetch = await fetch("https://scratch.mit.edu/session", {
      method: "GET",
      headers: {
        Cookie: this.cookieSet,
        "User-Agent": UserAgent,
        Referer: "https://scratch.mit.edu/",
        Host: "scratch.mit.edu",
        "Cache-Control": "max-age=0, no-cache",
        "X-Requested-With": "XMLHttpRequest",
        Pragma: "no-cache",
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br"
      }
    });
    this.sessionJSON = (await sessionFetch.json()) as SessionJSON;
  }

  /**
   * Uploads a file to assets.scratch.mit.edu.
   * This can be used for adding images to be used in a forum post or signature.
   * @param buffer The buffer of the file you want to upload.
   * @param fileExtension The extension of the file you want to upload, for example "png".
   * @returns The URL to access the file you have uploaded.
   * @example
   * await session.uploadToAssets(fs.readFileSync("photo.png"), "png"); // returns URL to image
   */
  async uploadToAssets(buffer: Buffer, fileExtension: string) {
    const md5hash = createHash("md5").update(buffer).digest("hex");
    const upload = await fetch(
      `https://assets.scratch.mit.edu/${md5hash}.${fileExtension}`,
      {
        method: "POST",
        body: buffer,
        headers: {
          Cookie: this.cookieSet,
          "User-Agent": UserAgent,
          Referer: "https://scratch.mit.edu/",
          Host: "assets.scratch.mit.edu",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br"
        }
      }
    );
    if (!upload.ok) {
      throw new Error("Upload failed");
    }
    return `https://assets.scratch.mit.edu/${md5hash}.${fileExtension}`;
  }

  /**
   * Search projects
   * @param query The query to search for
   * @param limit The limit of
   * @param offset The number of projects to offset
   * @param mode Search using Popular or Trending mode
   */
  async searchProjects(
    query: string,
    limit: number = 16,
    offset: number = 0,
    mode: "popular" | "trending" = "popular"
  ) {
    const request = await fetch(
      `https://api.scratch.mit.edu/search/projects?limit=${limit}&offset=${offset}&language=en&mode=${mode}&q=${query}`
    );
    if (!request.ok) {
      throw new Error("Request failed");
    }
    return (await request.json()) as {
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
          id: unknown;
          images: {
            "90x90": string;
            "60x60": string;
            "55x55": string;
            "50x50": string;
            "32x32": string;
          };
        };
      };
    }[];
  }

  /**
   * Get messages
   * @param limit The limit of messages to get
   * @param offset The offset of messages
   */
  async getMessages(limit: number = 40, offset: number = 0) {
    const request = await fetch(`https://api.scratch.mit.edu/users/${this.username}/messages?limit=${limit}&offset=${offset}`, {
      headers: {
        Origin: "https://scratch.mit.edu",
        Referer: "https://scratch.mit.edu/",
        "X-Token": this.sessionJSON.user.token
      }
    });
    if(!request.ok) throw Error(`Request failed with status ${request.status}`);
    return (await request.json()) as Message[];
  }

  /**
   * Logs out of Scratch.
   */
  async logout() {
    if (!this.csrfToken || !this.token) return;
    const logoutFetch = await fetch(
      "https://scratch.mit.edu/accounts/logout/",
      {
        method: "POST",
        body: `csrfmiddlewaretoken=${this.csrfToken}`,
        headers: {
          Cookie: this.cookieSet,
          "User-Agent": UserAgent,
          accept: "application/json",
          Referer: "https://scratch.mit.edu/",
          Origin: "https://scratch.mit.edu",
          Host: "scratch.mit.edu",
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br"
        }
      }
    );
    if (!logoutFetch.ok) {
      throw new Error(`Error in logging out. ${logoutFetch.status}`);
    }
  }
}

export default ScratchSession;
