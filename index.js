const { CLI } = require("./cli");
const { CHANNEL_NAME } = require("./constants");
async function main() {
  const cli = new CLI();
  const name = await cli.ask("What is your name? > ");
  console.log(`\nWelcome to ${CHANNEL_NAME}, ${name}!`);
}

main();
