const Hyperswarm = require("hyperswarm");
const { CHANNEL_NAME } = require("./constants");

async function track() {
  const swarm = new Hyperswarm();

  swarm.join(Buffer.alloc(32).fill(CHANNEL_NAME), {
    client: true,
    server: false,
  });

  swarm.on("connection", (conn, info) => {
    conn.on("data", (data) => {
      console.log(data.toString());
    });
  });
}

track();
