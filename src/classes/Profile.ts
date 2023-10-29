import { Session, UserAgent } from "../Consts";
import { parse } from "node-html-parser";
import ScratchSession from "../ScratchSession";

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
    return dom.querySelector(".group")!.innerHTML.trim() as
      | "Scratcher"
      | "New Scratcher"
      | "Scratch Team";
  }

  /**
   * Follow the user
   */
  async follow() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://scratch.mit.edu/site-api/users/followers/${this.user}/add/?usernames=${this.session.auth.sessionJSON.user.username}`,
      {
        method: "PUT",
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          referer: `https://scratch.mit.edu/users/${this.user}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Unfollow the user
   */
  async unfollow() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://scratch.mit.edu/site-api/users/followers/${this.user}/remove/?usernames=${this.session.auth.sessionJSON.user.username}`,
      {
        method: "PUT",
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          referer: `https://scratch.mit.edu/users/${this.user}/`,
          "User-Agent": UserAgent,
          accept: "application/json",
          "Content-Type": "application/json"
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }

  /**
   * Comment on a profile
   */
  async comment(content: string, parent_id?: number, commentee_id?: number) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const req = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.user}/add/`,
      {
        method: "POST",
        body: JSON.stringify({
          content,
          parent_id: parent_id || "",
          commentee_id: commentee_id || ""
        }),
        headers: {
          "X-CSRFToken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/users/${this.user}`,
          "User-Agent": UserAgent
        }
      }
    );
    if (!req.ok) throw new Error("Error adding comment.");
  }

  /**
   * Deletes a comment.
   * @param id The comment ID, for example 12345, *not* comment-12345.
   */
  async deleteComment(id: string | number) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const delFetch = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.user}/del/`,
      {
        method: "POST",
        body: JSON.stringify({
          id: id.toString()
        }),
        headers: {
          "x-csrftoken": this.session.auth.csrfToken,
          "X-Token": this.session.auth.token,
          "x-requested-with": "XMLHttpRequest",
          Cookie: this.session.auth.cookieSet,
          referer: `https://scratch.mit.edu/users/${this.user}`,
          "User-Agent": UserAgent
        }
      }
    );
    if (!delFetch.ok) throw new Error("Error deleting comment.");
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
    return (await scratchUserFetch.json()) as UserAPIResponse;
  }

  /**
   * Get the message count
   * @returns The number of messages
   */
  async getMessageCount() {
    const request = await fetch(
      `https://api.scratch.mit.edu/users/${this.user}/messages/count`
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
    return Number((await request.json()).count);
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
      const commentID = element.querySelector(".comment")!.id;
      const commentPoster = element
        .querySelector(".comment")!
        .getElementsByTagName("a")[0]
        .getAttribute("data-comment-user")!;
      const commentContent = element
        .querySelector(".comment")!
        .querySelector(".info")!
        .querySelector(".content")!
        .innerHTML.trim();

      // get replies
      let replies: ProfileCommentReply[] = [];
      let replyList = element
        .querySelector(".replies")!
        .querySelectorAll(".reply");
      for (let replyID in replyList) {
        const reply = replyList[replyID];
        if (reply.tagName === "A") continue;
        if (typeof reply === "function") continue;
        if (typeof reply === "number") continue;
        const commentID = reply.querySelector(".comment")!.id;
        const commentPoster = reply
          .querySelector(".comment")!
          .getElementsByTagName("a")[0]
          .getAttribute("data-comment-user")!;

        // regex here developed at https://scratch.mit.edu/discuss/post/5983094/
        const commentContent = reply
          .querySelector(".comment")!
          .querySelector(".info")!
          .querySelector(".content")!
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

  /**
   * Toggle the comments section on the profile
   */
  async toggleComments() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const request = await fetch(
      `https://scratch.mit.edu/site-api/comments/user/${this.user}/toggle-comments/`,
      {
        method: "POST",
        headers: {
          "X-CSRFToken": this.session.auth.csrfToken,
          Cookie: this.session.auth.cookieSet,
          Origin: "https://scratch.mit.edu",
          Referer: `https://scratch.mit.edu/users/${this.user}/`
        }
      }
    );
    if (!request.ok)
      throw Error(`Request failed with status ${request.status}`);
  }
}

export { Profile as default, UserAPIResponse };
