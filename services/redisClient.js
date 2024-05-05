const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL,
});

const connectRedis = async () => {
  client.on("error", (err) => console.log("Redis Client Error", err));
  await client.connect();
};

module.exports = {
  connectRedis,
  client,
};
