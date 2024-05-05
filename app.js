const express = require("express");
const app = express();
require("dotenv").config();
const { connectDB } = require("./services/database");
const shortenRoute = require("./routes/shortenRoute");
const { connectRedis } = require("./services/redisClient");

(async () => {
  await connectDB();
  await connectRedis();
})();

app.use(express.json());
app.use("/", shortenRoute);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server has started");
});
