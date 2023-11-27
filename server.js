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
      await this.initializeGame();
      this.handleGuesses = this.handleGuesses.bind(this);
      this.connection.on("data", this.handleGuesses);
    }
  }

  async initializeGame() {
    const [word, _] = await this.game.start();
    console.log("This is the word: ", word.join(""));
    await this.getCurrentWordStatus();
  }

  async getCurrentWordStatus() {
    this.broadcast(`Word is: ${this.game.filteredWord.join(" ")}`);
  }

  async handleGuesses(data) {
    const jsonData = JSON.parse(data.toString());
    const guess = jsonData.guess;
    console.log(`${jsonData.guessor} guessed: ${jsonData.guess}`);

    const isValid = await this.game.guess(guess);
    if (isValid) {
      this.broadcast(`${guess} is valid!`);
      if (this.game.isOver) {
        this.broadcast(
          `Congratulations! We have a winner!\nThe word is: ${this.game.word}`
        );
        await this.initializeGame();
      } else {
        await this.getCurrentWordStatus();
      }
    } else {
      this.broadcast(`${guess} is incorrect`);
      await this.getCurrentWordStatus();
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
