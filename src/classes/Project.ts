import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";

interface ProjectAPIResponse {
  id: number,
  title: string,
  description: string,
  instructions: string,
  visibility: string,
  public: boolean,
  comments_allowed: boolean,
  is_published: boolean,
  author: {
    id: number,
    username: string,
    scratchteam: boolean,
    history: {
      joined: string
    },
    profile: {
      id: null | number, // unsure about this one
      images: {
        '90x90': string,
        '60x60': string,
        '55x55': string,
        '50x50': string,
        '32x32': string
      }
    }
  }
  image: string,
  images: {
    '282x218': string,
    '216x163': string,
    '200x200': string,
    '144x108': string,
    '135x102': string,
    '100x80': string
  },
  history: {
    created: string,
    modified: string,
    shared: string
  },
  stats: {
    views: number,
    loves: number,
    favorites: number,
    remixes: number
  },
  remix: {
    parent: null | number,
    root: null | number
  }
}

class Project {
  creator: string;
  id: number;
  session: Session;
  scratchProjectAPI: any;
  constructor({ id, session }: { id: number, session: Session }) {
    this.id = id;
    this.session = session;
  }

  /**
   * Gets the api.scratch.mit.edu response of the project
   */
  async getAPIData(): Promise<ProjectAPIResponse> {
    if (typeof this.scratchProjectAPI === "undefined") {
      const apiFetch = await fetch(`https://api.scratch.mit.edu/projects/${this.id}`, {
        headers: {
          'User-Agent': UserAgent
        }
      });
      if (!apiFetch.ok) {
        throw new Error("Cannot find project.")
      };
      this.scratchProjectAPI = await apiFetch.json();
    }
    return this.scratchProjectAPI;
  }

  /**
   * Gets comments in the project
   * @param offset The offset of comments
   * @param limit The limit of comments to return
   * @returns The API response
   */
  async getComments(offset = 0, limit = 20) {
    const apiData = await this.getAPIData()
    const commentFetch = await fetch(`https://api.scratch.mit.edu/users/${apiData.author.username}/projects/${this.id}/comments?offset=${offset}&limit=${limit}`, {
      headers: {
        'User-Agent': UserAgent
      }
    })
    if (!commentFetch.ok) {
      throw new Error(
        `Comments returned status ${commentFetch.status} - ${commentFetch.statusText}`
      )
    }
    return await commentFetch.json();
  }

  /**
   * Sets the title of the project (requires ownership of the project)
   * @param value The value you want to set the title to
   */
  async setTitle(value: string) {
    const setFetch = await fetch(`https://api.scratch.mit.edu/projects/${this.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: value
      }),
      headers: {
        "x-csrftoken": this.session.csrfToken,
        "X-Token": this.session.sessionJSON.user.token,
        "x-requested-with": "XMLHttpRequest",
        referer: `https://scratch.mit.edu/projects/${this.id}/`,
        "User-Agent": UserAgent,
        accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    if (!setFetch.ok) {
      throw new Error(`Error in setting title. ${await setFetch.text()}`)
    }
  }
}

export default Project;
