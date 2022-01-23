import fetch from "cross-fetch";
import { JSDOM } from "jsdom";

class Profile {
  user: string;
  status: string;
  private scratchUserHTML: any;
  constructor(username) {
    this.user = username;
  }

  async init() {


  }

  async getStatus() {
    const dom = new JSDOM(await this.getUserHTML());
    return dom.window.document.querySelector(".group").innerHTML.trim();
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
