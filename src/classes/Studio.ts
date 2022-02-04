import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";

interface StudioAPIResponse {
  id: number;
  title: string;
  host: number;
  description: string;
  visibility: "visible" | "hidden";
  public: boolean;
  open_to_all: boolean;
  comments_allowed: boolean;
  image: string;
  history: {
    created: string;
    modified: string;
  };
  stats: {
    comments: number,
    followers: number,
    managers: number,
    projects: number,
  };
}

class Studio {
  id: number;
  session: Session;
  scratchStudioAPI: StudioAPIResponse;
  constructor({ id, session }: { id: number; session: Session }) {
    this.id = id;
    this.session = session;
  }

  async getAPIData(): Promise<StudioAPIResponse> {
    if (typeof this.scratchStudioAPI === "undefined") {
      const response = await fetch(`https://api.scratch.mit.edu/studios/${this.id}/`, {
        headers: {
          "User-Agent": UserAgent
        }
      });
      this.scratchStudioAPI = await response.json();
    }
    return this.scratchStudioAPI;
  }
}

export default Studio;
