import fetch from "cross-fetch";
import Consts from "../Consts";
import { JSDOM } from "jsdom";

class Profile {
  user: string;
  status: string;
  private scratchUserHTML: any;
  auth: any;
  constructor(username: string, session: any) {
    this.user = username;
    this.auth = session;
  }

  async getStatus() {
    const dom = new JSDOM(await this.getUserHTML());
    return dom.window.document.querySelector(".group").innerHTML.trim();
  }
  
  async deleteComment(id: { toString: () => string; }) {
    const delFetch = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.user}/del/`,
      {
        method: "POST",
        body: JSON.stringify({
          id: id.toString(),
        }),
        headers: {
          "x-csrftoken": this.auth.csrfToken,
          "X-Token": this.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.auth.cookieSet,

          referer: `https://scratch.mit.edu/users/${this.user}`,
          "User-Agent": Consts.UserAgent,
        },
      }
    );
    if (!delFetch.ok) {
      console.log(delFetch.status, await delFetch.text());
      throw new Error("Error deleting comment.");
    }
    return delFetch.status;
  }

  private async getUserHTML() {
    if (!(typeof this.scratchUserHTML === "string")) {
      const scratchUserFetch = await fetch(`https://scratch.mit.edu/users/${this.user}`);
      if (!scratchUserFetch.ok) {
        throw new Error("Cannot find user.")
      };
      this.scratchUserHTML = await scratchUserFetch.text();
    }
    return this.scratchUserHTML;
  }
}

export default Profile;
