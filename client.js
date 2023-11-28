const Hyperswarm = require("hyperswarm");
const { CHANNEL_NAME } = require("./constants");
const { CLI } = require("./cli");

class Client {
  constructor(name) {
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
    console.log("Connected to server!\n");
    this.connection = conn;
    conn.on("data", async (data) => {
      const jsonData = JSON.parse(data.toString());
      if (jsonData.type === "update") {
        console.log("Server: ", jsonData.message);
        process.stdout.write("> ");
      }
    });

    await this.guess();
  }

  async guess() {
    const guess = await this.cli.ask("> ");
    this.connection.write(JSON.stringify({ guess, guessor: this.name }));
    await this.guess();
  }
}

module.exports = {
  Client,
};
