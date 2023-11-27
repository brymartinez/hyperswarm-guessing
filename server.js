const Hyperswarm = require("hyperswarm");
const EventEmitter = require("events");
const { CHANNEL_NAME } = require("./constants");
const { Game } = require("./game");

class Server extends EventEmitter {
  constructor() {
    super();
    this.server = new Hyperswarm();
    this.players = new Map();
    this.game = new Game();

    this.server.join(Buffer.alloc(32).fill(CHANNEL_NAME), {
      server: true,
      client: false,
    });

    this.handleConnection = this.handleConnection.bind(this);
    this.server.on("connection", this.handleConnection);
  }

  async handleConnection(conn, info) {
    this.connection = conn;
    const publicKey = info.publicKey.toString();
    if (this.players.size) {
      if (this.players.has(publicKey)) {
        // player exists, reconnect and transmit current game status
      } else {
        this.addPlayer(publicKey);
      }
    } else {
      this.addPlayer(publicKey);
      const [word, filteredWord] = await this.game.start();
      console.log("This is the word: ", word.join(""));
      this.broadcast(`\nWord is: ${filteredWord.join(" ")}`);
      this.handleGuesses = this.handleGuesses.bind(this);
      this.connection.on("data", this.handleGuesses);
    }
  }

  async handleGuesses(data) {
    const jsonData = JSON.parse(data.toString());
    const guess = jsonData.guess;
    console.log(`${jsonData.guessor} guessed: ${jsonData.guess}`);

    if (this.wordArray.includes(guess)) {
      this.broadcast(`${guess} is valid!`);
    } else {
      this.broadcast(`${guess} is incorrect`);
    }
  }

  broadcast(data) {
    this.connection.write(JSON.stringify({ type: "update", message: data }));
  }

  addPlayer(publicKey) {
    this.players.set(publicKey, true);
  }
}

module.exports = {
  Server,
};
