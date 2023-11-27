const Hyperswarm = require("hyperswarm");
const EventEmitter = require("events");
const { WordGenerator } = require("./word-generator");
const { CHANNEL_NAME } = require("./constants");

class Server extends EventEmitter {
  constructor() {
    super();
    this.server = new Hyperswarm();
    this.server.join(Buffer.alloc(32).fill(CHANNEL_NAME), {
      server: true,
      client: false,
    });

    this.handleConnection = this.handleConnection.bind(this);
    this.server.on("connection", this.handleConnection);
  }

  async handleConnection(conn, info) {
    this.connection = conn;
    const wordGenerator = new WordGenerator();
    // if (this.word)
    this.word = await wordGenerator.generate(8);
    const filteredWord = this.word.replace(/[A-Za-z]/g, "_ ");
    this.wordArray = this.word.split("");
    console.log("This is the word: ", this.word);
    this.broadcast(`\nWord is: ${filteredWord}`);
    this.handleGuesses = this.handleGuesses.bind(this);
    this.connection.on("data", this.handleGuesses);
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
}

module.exports = {
  Server,
};
