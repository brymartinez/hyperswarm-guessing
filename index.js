const { CLI } = require("./cli");
const { Client } = require("./client");
const { CHANNEL_NAME } = require("./constants");
const { Server } = require("./server");

async function main() {
  const cli = new CLI();
  const name = await cli.ask("What is your name? > ");
  console.log(`\nWelcome to ${CHANNEL_NAME}, ${name}!`);

  if (name === "admin") {
    const server = new Server();
  } else {
    const client = new Client();
  }
}

main();
