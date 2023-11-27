const { CLI } = require("./cli");
const { Word } = require("./word");
async function main() {
  const cli = new CLI();
  const word = new Word();
  await cli.ask(await word.generate(6));
}

main();
