const EventEmitter = require("events");
const Hyperswarm = require("hyperswarm");
const { CHANNEL_NAME } = require("./constants");
const { CLI } = require("./cli");

class Client extends EventEmitter {
  constructor() {
    super();
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
    conn.on("data", async (data) => {
      console.log("Guess the word: ", data.toString());
      const guess = await this.cli.ask("> ");
      conn.write(guess);
    });
  }
}

module.exports = {
  Client,
};
