const Hyperswarm = require("hyperswarm");
let client;
class Client {
  constructor() {
    client = new Hyperswarm();
  }
}

module.exports = {
  Client,
};
