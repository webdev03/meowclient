import type CloudConnection from "./CloudConnection";
import events from "events";
import CloudSerialiser from "./CloudSerialiser";

const serialiser = new CloudSerialiser();

class PacketCloud extends events.EventEmitter {
  connection: CloudConnection;
  onRequest = Symbol("onRequest");
  constructor(connection: CloudConnection) {
    super();
    this.connection = connection;
    this.connection.on("set", (data) => {
      if (String(data.name).includes("FROM_USER")) {
        const decoder = serialiser.decode(data.value);
        const name = decoder.next().value;
        const value = decoder.next().value;
        if (!name || !value) return;
        this.emit(this.onRequest, name, value);
        this.emit(name, value);
      }
    });
  }

  send(name: string, value: string) {
    const val = serialiser.encode(name) + serialiser.encode(value);
    this.connection.setVariable(`FROM_SERVER_SEND`, val);
  }
}

export default PacketCloud;
