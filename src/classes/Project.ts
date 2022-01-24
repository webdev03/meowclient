import fetch from "cross-fetch";
import { Session, UserAgent } from "../Consts";

class Project {
  creator: string;
  id: number;
  status: string;
  private scratchUserHTML: any;
  session: Session;
  scratchUserAPI: any;
  constructor({ id, session }: { id: number, session: Session }) {
    this.id = id;
    this.session = session;
  }
  
  /**
   * Gets the api.scratch.mit.edu response of the project
   */
  async getAPIData() {
    
  }

  async getComments(offset = 0, limit = 20) {
    // Check/get data
    const commentFetch = await fetch("")
    // https://api.scratch.mit.edu/users/god286/projects/614027907/comments?offset=0&limit=20
  }
}

export default Project;
