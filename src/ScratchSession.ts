// manages authentication, and is the main handler of every other function
import Profile from "./classes/Profile";
import Project from "./classes/Project";
import Studio from "./classes/Studio";
import Forum from "./classes/forums/Forum";
import { SessionJSON, UserAgent } from "./Consts";
import fetch from "cross-fetch";
import { createHash } from "node:crypto";
/**
 * Logs into Scratch
 */
class ScratchSession {
  username: string;
  csrfToken: string;
  token: string;
  cookieSet: string;
  sessionJSON: SessionJSON;

  /**
   * Sets up the ScratchSession to use authenticated functions
   * @param user The username of the user you want to log in to
   * @param pass The password of the user you want to log in to
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

    // Awesome regexes by ScratchClient - https://github.com/CubeyTheCube/scratchclient/blob/main/scratchclient/ScratchSession.py
    this.csrfToken = /scratchcsrftoken=(.*?);/gm.exec(
      loginReq.headers.get("set-cookie")
    )[1];
    this.token = /"(.*)"/gm.exec(loginReq.headers.get("set-cookie"))[1];
    // taken from scratchclient
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
    this.sessionJSON = await sessionFetch.json();
  }

  /**
   * Gets a profile
   * @param username The username of the profile you want to get
   * @returns {Profile} The profile of the user
   */
  getProfile(username: string): Profile {
    return new Profile({ username: username, session: this });
  }

  /**
   * Gets a project
   * @param id The project ID
   * @returns {Project} The project
   */
  getProject(id: number): Project {
    return new Project({ id: id, session: this });
  }

  /**
   * Gets a studio
   * @param id The studio ID
   * @returns {Studio} The studio
   */
  getStudio(id: number): Studio {
    return new Studio({ id: id, session: this });
  }

  /**
   * Gets a forum
   * @param id (optional) The ID of the forum you want to get (for example, 31 for the "Advanced Topics" forum)
   * @returns {Forum} The forum
   */
  getForum(id?: number): Forum {
    return new Forum({ id: id, session: this });
  }

  /**
   * Uploads a file to assets.scratch.mit.edu.
   * This can be used for adding images to be used in a forum post or signature.
   * @param buffer The buffer of the file you want to upload
   * @param fileExtension The extension of the file you have uploaded, for example "png"
   * @returns The URL to access the file you have uploaded
   * @example
   * await session.uploadToAssets(fs.readFileSync("photo.png"), "png"); // returns URL to image
   */
  async uploadToAssets(buffer: Buffer, fileExtension: string) {
    const md5hash = createHash("md5").update(buffer).digest("hex");
    const upload = await fetch(`https://assets.scratch.mit.edu/${md5hash}.${fileExtension}`, {
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
    });
    if(!upload.ok) {
      throw new Error("Upload failed");
    }
    return `https://assets.scratch.mit.edu/${md5hash}.${fileExtension}`;
  }

  /**
   * Logs out of Scratch
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
