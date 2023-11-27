const { CLI } = require("./cli");

async function main() {
  const cli = new CLI();

  await cli.ask("Hello!");
}

main();
