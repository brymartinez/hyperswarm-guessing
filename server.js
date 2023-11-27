const Hyperswarm = require("hyperswarm");
let server;
class Server {
  constructor() {
    server = new Hyperswarm();
  }
}

module.exports = {
  Server,
};
