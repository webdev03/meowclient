import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";
import { JSDOM } from "jsdom";

interface UserAPIResponse {
  id: number,
  username: string,
  scratchteam: boolean,
  history: {
    joined: string
  },
  profile: {
    id: number,
    images: {
      '90x90': string,
      '60x60': string,
      '55x55': string,
      '50x50': string,
      '32x32': string
    },
    status: string,
    bio: string,
    country: string
  }
}

interface ProfileCommentReply {
  id: string,
  username: string,
  content: string,
  apiID: string
}

interface ProfileComment {
  id: string,
  username: string,
  content: string,
  apiID: string,
  replies: Array<ProfileCommentReply>
}

class Profile {
  user: string;
  status: string;
  private scratchUserHTML: string;
  session: Session;
  scratchUserAPI: UserAPIResponse;
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
   * Gets the API response of the user in the Profile
   * @returns The API response of the user
   */
  async getUserAPI() {
    if (typeof this.scratchUserAPI === "undefined") {
      const scratchUserFetch = await fetch(`https://api.scratch.mit.edu/users/${this.user}`);
      if (!scratchUserFetch.ok) {
        throw new Error("Cannot find user.")
      };
      this.scratchUserAPI = await scratchUserFetch.json();
    }
    return this.scratchUserAPI;
  }

  /**
   * Gets comments on the user's profile
   * @param page The page to look at.
   * @returns {Array} An array of comments.
   * apiID is used to input into deleteComment
   */
  async getComments(page: number = 1): Promise<Array<ProfileComment>> {
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
    let comments: Array<ProfileComment> = [];
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

      // get replies
      let replies: Array<ProfileCommentReply> = [];
      let replyList = element.getElementsByClassName("replies")[0].getElementsByClassName("reply");
      for (let replyID in replyList) {
        const reply = replyList[replyID];
        if (reply.nodeName === "A") continue;
        if (typeof reply === "function") continue;
        if (typeof reply === "number") continue;
        const commentID = reply.getElementsByClassName("comment")[0].id;
        const commentPoster = reply
          .getElementsByClassName("comment")[0]
          .getElementsByTagName("a")[0]
          .getAttribute("data-comment-user");

        // regex here developed at https://scratch.mit.edu/discuss/post/5983094/
        const commentContent = reply
          .getElementsByClassName("comment")[0]
          .getElementsByClassName("info")[0]
          .getElementsByClassName("content")[0]
          .textContent.trim().replace(/\n+/gm, "").replace(/\s+/gm, " ");
        replies.push({
          id: commentID,
          username: commentPoster,
          content: commentContent,
          apiID: commentID.substring(9),
        })
      }

      comments.push({
        id: commentID,
        username: commentPoster,
        content: commentContent,
        apiID: commentID.substring(9),
        replies: replies
      });
    }
    if (comments.length == 0) {
      throw new Error("No comments found.");
    }
    return comments;
  }
}

export default Profile;
