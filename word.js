class Word {
  constructor() {}

  async generate(numOfChars = 5) {
    const response = await fetch(
      `https://random-word-api.herokuapp.com/word?length=${numOfChars}`
    );
    const word = await response.json(); // returns array
    return word[0];
  }
}
