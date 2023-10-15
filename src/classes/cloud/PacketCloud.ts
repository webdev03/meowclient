import type CloudConnection from "./CloudConnection";
import events from "events";
import { encode, decode } from "./utils";

type OnRequestFn = (name: string, value: string) => void;

class PacketCloud extends events.EventEmitter {
  connection: CloudConnection;
  onRequestListeners: OnRequestFn[] = [];
  constructor(connection: CloudConnection) {
    super();
    this.connection = connection;
    this.connection.on("set", (data) => {
      if (String(data.name).includes("FROM_USER")) {
        const decoder = decode(data.value);
        const name = decoder.next().value;
        const value = decoder.next().value;
        if(!name || !value) return;
        for(const fn of this.onRequestListeners) try { fn(name, value) } catch(e) { console.error(e) };
        this.emit(name, value);
      }
    });
  }

  onRequest(fn: OnRequestFn) {
    this.onRequestListeners.push(fn);
    return this;
  }

  send(name: string, value: string) {
    const val = encode(name) + encode(value);
    if (val.length > 250) console.warn("Packet length is greater than 250!");
    this.connection.setVariable(`FROM_SERVER_SEND`, val);
  }
}

export default PacketCloud;
