const { WordGenerator } = require("./word-generator");

class Game {
  constructor() {
    this.isStarted = false;
    this.isOver = true;
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
      this.isOver = false;
      const wordGenerator = new WordGenerator();
      this.word = await wordGenerator.generate(8);
      this.filteredWord = this.word.replace(/[A-Za-z]/g, "_").split("");
      // @type {[string]}
      this.wordArray = this.word.split("");
      return [this.wordArray, this.filteredWord];
    }
  }

  /**
   *
   * @return {Promise<[boolean]>}
   * @param {string} guess
   * @memberof Game
   */
  async guess(guess) {
    if (this.isStarted) {
      if (this.wordArray.includes(guess)) {
        let wordArrayTemp = [...this.wordArray];

        while (wordArrayTemp.indexOf(guess) >= 0) {
          const index = wordArrayTemp.indexOf(guess);
          this.filteredWord[wordArrayTemp.indexOf(guess)] = guess;
          wordArrayTemp[index] = "_";
        }

        if (!this.filteredWord.includes("_")) {
          // Game is over
          this.isOver = true;
          this.isStarted = false;
        }
        return true;
      } else {
        return false;
      }
    }
  }
}

module.exports = {
  Game,
};
