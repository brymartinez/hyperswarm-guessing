const EventEmitter = require("events");
const Hyperswarm = require("hyperswarm");
const { CHANNEL_NAME } = require("./constants");
const { CLI } = require("./cli");

class Client extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.client = new Hyperswarm();
    this.cli = new CLI();
    this.client.join(Buffer.alloc(32).fill(CHANNEL_NAME), {
      client: true,
      server: false,
    });

    this.handleConnection = this.handleConnection.bind(this);
    this.client.on("connection", this.handleConnection);
  }

  async handleConnection(conn, info) {
    this.connection = conn;
    conn.on("data", async (data) => {
      const jsonData = JSON.parse(data.toString());
      if (jsonData.type === "update") {
        console.log("Server: ", jsonData.message);
        const guess = await this.cli.ask("> ");
        await this.sendToServer(guess);
      }
    });
  }

  async sendToServer(data) {
    this.connection.write(JSON.stringify({ guess: data, guessor: this.name }));
  }
}

module.exports = {
  Client,
};
