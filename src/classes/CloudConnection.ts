// a lot of this has been taken from https://github.com/meow-js/meow-js/blob/master/src/classes/CloudConnection.js thank you so much!

import WebSocket from "ws";
import { Session } from "../Consts";

class CloudConnection {
  creator: string;
  id: number;
  session: Session;
  server: string;
  connection: WebSocket;
  variables: object;
  constructor({ id, session, server = "wss://clouddata.scratch.mit.edu" }: { id: number, session: Session, server?: string }) {
    this.id = id;
    this.session = session;
    this.server = server;

    this.connect()
  }

  private connect() {
    this.connection = new WebSocket(this.server, {
      headers: {
        Cookie: this.session.cookieSet
      }
    })
    this.connection.on('open', () => {
      this.send({
        method: 'handshake',
        user: this.session.sessionJSON.user.username,
        project_id: this.id.toString(),
      });
    });
  }

  private send(data) {
    this.connection.send(`${JSON.stringify(data)}\n`)
  }
}

export default CloudConnection;
