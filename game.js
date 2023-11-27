const { WordGenerator } = require("./word-generator");

class Game {
  constructor() {
    this.isStarted = false;
    this.word = null;
    this.wordArray = null;
  }

  /**
   *
   *
   * @return {Promise<[string[], string[]]>}
   * @memberof Game
   */
  async start() {
    if (!this.isStarted) {
      this.isStarted = true;
      const wordGenerator = new WordGenerator();
      this.word = await wordGenerator.generate(8);
      this.filteredWord = this.word.replace(/[A-Za-z]/g, "_");
      this.wordArray = this.word.split("");
      return [this.wordArray, this.filteredWord.split("")];
    }
  }
}

module.exports = {
  Game,
};
