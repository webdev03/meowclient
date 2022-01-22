// manages authentication
/**
 * Logs into Scratch
 */
class ScratchSession {
  username: string;
  private _headersLogin: Headers;
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
      "user-agent": "Mozilla/5.0 ScratchSpamProtection",
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
    this._headersLogin = loginReq.headers;

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
  async deleteComment(id) {
    const delFetch = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.username}/del/`,
      {
        method: "POST",
        body: JSON.stringify({
          id: id.toString(),
        }),
        headers: {
          "x-csrftoken": this.csrfToken,
          "X-Token": this.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.cookieSet,

          referer: `https://scratch.mit.edu/users/${this.username}`,
          "user-agent": "Mozilla/5.0 ScratchSpamProtection",
        },
      }
    );
    if (!delFetch.ok) {
      console.log(delFetch.status, await delFetch.text());
      throw new Error("Error deleting comment.");
    }
    return delFetch.status;
  }
}

export { ScratchSession };
