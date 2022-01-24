import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";
import { JSDOM } from "jsdom";

class Profile {
  user: string;
  status: string;
  private scratchUserHTML: any;
  session: Session;
  constructor({ username, session }: { username: string, session: Session }) {
    this.user = username;
    this.session = session;
  }

  /**
   * Gets the status of the user
   * Can either be Scratcher, New Scratcher, or Scratch Team.
   * @returns {string} The status of the user.
   */
  async getStatus() {
    const dom = new JSDOM(await this.getUserHTML());
    return dom.window.document.querySelector(".group").innerHTML.trim();
  }
  
  /**
   * Deletes a comment
   * @param id The comment ID, for example 12345, *not* comment-12345
   * @returns {number} The status code of the request.
   */
  async deleteComment(id: string | number) {
    const delFetch = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.user}/del/`,
      {
        method: "POST",
        body: JSON.stringify({
          id: id.toString(),
        }),
        headers: {
          "x-csrftoken": this.session.csrfToken,
          "X-Token": this.session.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.cookieSet,

          referer: `https://scratch.mit.edu/users/${this.user}`,
          "User-Agent": UserAgent,
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

  /**
   * Gets comments on the user's profile
   * @param page The page to look at.
   * @returns {Array} An array of comments. There is id, username, content, and apiID keys.
   * apiID is used to input into deleteComment
   */
  async getComments(page: number = 1) {
    const commentFetch = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.user}/?page=${page}`
    );
    if (!commentFetch.ok) {
      if (page == 1) {
        throw new Error("! Error in fetching comments");
      } else {
        return [];
      }
    }
    const commentHTML = await commentFetch.text();
    const dom = new JSDOM(commentHTML);
    const items = dom.window.document.getElementsByClassName("top-level-reply");
  
    let comments = [];
    for (let elID in items) {
      const element = items[elID];
      if (typeof element == "function") break;
      const commentID = element.getElementsByClassName("comment")[0].id;
      const commentPoster = element
        .getElementsByClassName("comment")[0]
        .getElementsByTagName("a")[0]
        .getAttribute("data-comment-user");
      const commentContent = element
        .getElementsByClassName("comment")[0]
        .getElementsByClassName("info")[0]
        .getElementsByClassName("content")[0]
        .innerHTML.trim();
      comments.push({
        id: commentID,
        username: commentPoster,
        content: commentContent,
        apiID: commentID.substring(9),
      });
    }
    if (comments.length == 0) {
      throw new Error("No comments found.");
    }
    return comments;
  }
}

export default Profile;
