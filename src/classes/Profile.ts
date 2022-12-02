import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";
import { parse } from "node-html-parser";

interface UserAPIResponse {
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
    status: string;
    bio: string;
    country: string;
  };
}

interface ProfileCommentReply {
  id: string;
  username: string;
  content: string;
  apiID: string;
}

interface ProfileComment {
  id: string;
  username: string;
  content: string;
  apiID: string;
  replies: ProfileCommentReply[];
}
/**
 * Class for profiles.
 * @param session The ScratchSession that will be used.
 * @param username The username of the profile you want to get.
 */
class Profile {
  user: string;
  session: Session;
  constructor(session: Session, username: string) {
    this.user = username;
    this.session = session;
  }

  /**
   * Gets the status of the user.
   * Can either be Scratcher, New Scratcher, or Scratch Team.
   * @returns {string} The status of the user.
   */
  async getStatus() {
    const dom = parse(await this.getUserHTML());
    return dom.querySelector(".group").innerHTML.trim() as
      | "Scratcher"
      | "New Scratcher"
      | "Scratch Team";
  }

  /**
   * Deletes a comment.
   * @param id The comment ID, for example 12345, *not* comment-12345.
   */
  async deleteComment(id: string | number) {
    const delFetch = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.user}/del/`,
      {
        method: "POST",
        body: JSON.stringify({
          id: id.toString()
        }),
        headers: {
          "x-csrftoken": this.session.csrfToken,
          "X-Token": this.session.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.cookieSet,

          referer: `https://scratch.mit.edu/users/${this.user}`,
          "User-Agent": UserAgent
        }
      }
    );
    if (!delFetch.ok) {
      console.log(delFetch.status, await delFetch.text());
      throw new Error("Error deleting comment.");
    }
  }

  private async getUserHTML() {
    const scratchUserFetch = await fetch(
      `https://scratch.mit.edu/users/${this.user}`
    );
    if (!scratchUserFetch.ok) {
      throw new Error("Cannot find user.");
    }
    return await scratchUserFetch.text();
  }

  /**
   * Gets the API response of the user in the Profile.
   * @returns The API response of the user.
   */
  async getUserAPI() {
    const scratchUserFetch = await fetch(
      `https://api.scratch.mit.edu/users/${this.user}`
    );
    if (!scratchUserFetch.ok) {
      throw new Error("Cannot find user.");
    }
    return await scratchUserFetch.json();
  }

  /**
   * Gets comments on the user's profile.
   * @param page The page to look at.
   * @returns An array of comments.
   * apiID is used to input into deleteComment.
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
    const dom = parse(commentHTML);
    const items = dom.querySelectorAll(".top-level-reply");
    let comments: ProfileComment[] = [];
    for (let elID in items) {
      const element = items[elID];
      if (typeof element == "function") break;
      const commentID = element.querySelector(".comment").id;
      const commentPoster = element
        .querySelector(".comment")
        .getElementsByTagName("a")[0]
        .getAttribute("data-comment-user");
      const commentContent = element
        .querySelector(".comment")
        .querySelector(".info")
        .querySelector(".content")
        .innerHTML.trim();

      // get replies
      let replies: ProfileCommentReply[] = [];
      let replyList = element
        .querySelector(".replies")
        .querySelectorAll(".reply");
      for (let replyID in replyList) {
        const reply = replyList[replyID];
        if (reply.tagName === "A") continue;
        if (typeof reply === "function") continue;
        if (typeof reply === "number") continue;
        const commentID = reply.querySelector(".comment").id;
        const commentPoster = reply
          .querySelector(".comment")
          .getElementsByTagName("a")[0]
          .getAttribute("data-comment-user");

        // regex here developed at https://scratch.mit.edu/discuss/post/5983094/
        const commentContent = reply
          .querySelector(".comment")
          .querySelector(".info")
          .querySelector(".content")
          .textContent.trim()
          .replace(/\n+/gm, "")
          .replace(/\s+/gm, " ");
        replies.push({
          id: commentID,
          username: commentPoster,
          content: commentContent,
          apiID: commentID.substring(9)
        });
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

export { Profile as default, UserAPIResponse };
