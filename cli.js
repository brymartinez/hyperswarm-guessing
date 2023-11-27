const rl = require("readline");
let yargs;

const cli = {
  ask: async (question) => {
    if (!yargs) {
      yargs = rl.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
    }
    return new Promise((resolve) => {
      yargs.question(question, (input) => resolve(input));
    });
  },
};

module.exports = { cli };
