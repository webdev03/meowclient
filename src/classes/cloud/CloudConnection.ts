// a lot of this has been taken from https://github.com/meow-js/meow-js/blob/master/src/classes/CloudConnection.js thank you so much!

import { WebSocket } from "ws";
import { Session } from "../../Consts";
import events from "node:events";

/**
 * Class for cloud connections.
 * @param session The ScratchSession that will be used.
 * @param id The id of the project to connect to.
 * @returns {Profile} The profile of the user.
 */
class CloudConnection extends events.EventEmitter {
  id: number;
  session: Session;
  connection!: WebSocket;
  open: boolean = false;
  queue: Array<{
    user: string;
    method: string;
    name: string;
    value: string;
    project_id: number;
  }> = [];
  variables: Map<string, string> = new Map();
  disconnected: boolean = false;
  constructor(session: Session, id: number) {
    super();
    this.id = id;
    this.session = session;
    this.connect();
  }

  private connect() {
    if (!this.session?.auth) throw Error("You need to be logged in");
    this.open = false;
    this.connection = new WebSocket("wss://clouddata.scratch.mit.edu", {
      headers: {
        Cookie: this.session.auth.cookieSet,
        Origin: "https://scratch.mit.edu"
      }
    });
    this.connection.on("message", (e) => {
      if (!e) return;
      for (const message of e.toString().split("\n")) {
        const obj = JSON.parse(message || '{"method": "err"}');
        if (obj.method == "set") {
          this.emit("set", { name: obj.name, value: obj.value.toString() });
          this.variables.set(obj.name, obj.value.toString());
        }
      }
    });
    this.connection.on("open", () => {
      if (!this.session?.auth) throw Error("You need to be logged in");
      this.open = true;
      this.send({
        method: "handshake",
        user: this.session.auth.sessionJSON.user.username,
        project_id: this.id.toString()
      });
      this.emit("connect", null);
      // handle queue
      for (let item of this.queue) {
        this.send(item);
      }
    });
    this.connection.on("error", (err) => {
      this.emit("error", err);
      throw err;
    });
    this.connection.on("close", () => {
      if (!this.disconnected) {
        this.emit("reconnect", null);
        this.connect();
      }
    });
  }

  /**
   * Sends a packet through cloud.
   */
  private send(data: any) {
    this.emit("internal-send", data);
    this.connection.send(`${JSON.stringify(data)}\n`);
  }

  /**
   * Sets a cloud variable.
   * @param variable The variable name to set.
   * @param value The value to set the variable to.
   */
  setVariable(variable: string, value: number | string) {
    if (!this.session?.auth) throw Error("You need to be logged in");
    const varname = variable.startsWith("☁ ")
      ? variable.substring(2)
      : variable;
    this.variables.set(`☁ ${varname}`, value.toString());
    if (!this.open) {
      this.queue.push({
        user: this.session.auth.sessionJSON.user.username,
        method: "set",
        name: `☁ ${varname}`,
        value: value.toString(),
        project_id: this.id
      });
      return;
    }
    this.send({
      user: this.session.auth.sessionJSON.user.username,
      method: "set",
      name: `☁ ${varname}`,
      value: value.toString(),
      project_id: this.id
    });
  }

  /**
   * Gets a cloud variable.
   * @param variable The variable name to get.
   * @returns The value of the variable in string format if it exists.
   */
  getVariable(variable: string) {
    const varname = variable.startsWith("☁ ")
      ? variable.substring(2)
      : variable;
    return this.variables.get(`☁ ${varname}`);
  }

  /**
   * Closes the cloud connection.
   */
  close() {
    this.emit("close", null);
    this.disconnected = true;
    this.connection.close();
  }
}

export default CloudConnection;
