// manages authentication, and is the main handler of every other function
import Profile from "./classes/Profile";
import Consts from "./Consts";
import fetch from "cross-fetch";

/**
 * Logs into Scratch
 */
class ScratchSession {
  username: string;
  csrfToken: string;
  token: string;
  cookieSet: string;
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
      "User-Agent": Consts.UserAgent,
    };
    const loginReq = await fetch("https://scratch.mit.edu/login/", {
      method: "POST",
      body: JSON.stringify({
        username: user,
        password: pass,
      }),
      headers: headers,
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
  }

  getProfile(username: string): Profile {
    return new Profile(username=username, this);
  }
}

export default ScratchSession;
