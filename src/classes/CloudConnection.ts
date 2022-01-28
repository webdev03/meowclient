// a lot of this has been taken from https://github.com/meow-js/meow-js/blob/master/src/classes/CloudConnection.js thank you so much!

import WebSocket from "ws";
import { Session } from "../Consts";

class CloudConnection {
  creator: string;
  id: number;
  session: Session;
  server: string;
  connection: WebSocket;
  variables: object = {};
  constructor({ id, session, server = "wss://clouddata.scratch.mit.edu" }: { id: number, session: Session, server?: string }) {
    this.id = id;
    this.session = session;
    this.server = server;

    this.connect()
  }

  private connect() {
    this.connection = new WebSocket(this.server, {
      headers: {
        Cookie: this.session.cookieSet,
        Origin: 'https://scratch.mit.edu'
      }
    });
    this.connection.on('message', (e) => {
      if (!e) return;
      for (const message of e.toString().split('\n')) {
        const obj = JSON.parse(message || '{"method": "err"}');
        if (obj.method == 'set') {
          this.variables[obj.name] = obj.value;
        }
      }
    })
    this.connection.on('open', () => {
      this.send({
        method: 'handshake',
        user: this.session.sessionJSON.user.username,
        project_id: this.id.toString(),
      });
    });
    this.connection.on('error', (err) => {
      throw err;
    });
  }

  /**
   * Sends a packet through cloud
   */
  private send(data) {
    this.connection.send(`${JSON.stringify(data)}\n`)
  }
  /**
   * Sets a cloud variable
   * @param variable The variable name to set
   * @param value The value to set the variable to
   */
  setVariable(variable: string, value: string | number) {
    const varname = variable.startsWith("☁ ") ? variable.substring(2) : variable;
    this.variables[`☁ ${varname}`] = value;
    this.send({
      user: this.session.sessionJSON.user.username,
      method: 'set',
      name: `☁ ${varname}`,
      value: value.toString(),
      project_id: this.id,
    });
  }

  /**
   * Gets a cloud variable
   * @param variable The variable name to get
   * @returns {string} The value of the variable in string format.
   */
  getVariable(variable: string): string {
    const varname = variable.startsWith("☁ ") ? variable.substring(2) : variable;
    return this.variables[`☁ ${varname}`];
  }
}

export default CloudConnection;
