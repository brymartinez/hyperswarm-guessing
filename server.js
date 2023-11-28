const Hyperswarm = require("hyperswarm");
const { CHANNEL_NAME } = require("./constants");
const { Game } = require("./game");

class Server {
  constructor() {
    this.server = new Hyperswarm();
    this.players = new Map();
    this.game = new Game();
    this.connections = [];

    this.server.join(Buffer.alloc(32).fill(CHANNEL_NAME), {
      server: true,
      client: false,
    });

    this.handleConnection = this.handleConnection.bind(this);
    this.server.on("connection", this.handleConnection);
  }

  async handleConnection(conn, info) {
    const publicKey = info.publicKey.toString();
    if (this.players.size) {
      if (!this.players.has(publicKey)) {
        this.addPlayer(publicKey);
        this.connections.push(conn);
      }
      await this.getCurrentWordStatus();
    } else {
      this.addPlayer(publicKey);
      this.connections.push(conn);
      await this.initializeGame();
    }

    this.handleGuesses = this.handleGuesses.bind(this);
    conn.on("data", this.handleGuesses);
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
          `Congratulations! ${jsonData.guessor} is the winner!\nThe word is: ${this.game.word}`
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
    for (const conn of this.connections) {
      conn.write(JSON.stringify({ type: "update", message: data }));
    }
  }

  addPlayer(publicKey) {
    this.players.set(publicKey, true);
  }
}

module.exports = {
  Server,
};
