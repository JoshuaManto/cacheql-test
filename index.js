const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const cacheQL = require("./cacheql.js");
const controller = require("./controller.js");

const PORT = 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan("dev"));

// const redisHost = "redis-10212.c52.us-east-1-4.ec2.cloud.redislabs.com";
// const redisPort = process.argv[3] || 10212;
// const redisAuth = "eRQFVq70CXuDEoISTvKNVFtdevWabNbe";

// const timeToLive = 30;

const cacheQLData = {
  redisHost: "redis-10212.c52.us-east-1-4.ec2.cloud.redislabs.com",
  redisPort: 10212,
  redisAuth: "eRQFVq70CXuDEoISTvKNVFtdevWabNbe",
  timeToLive: 30
};

cacheQL.set(cacheQLData);
cacheQL.auth();

app.post("/add", controller.addTest, (req, res) => {
  // console.log("add end of the line");
  res.send();
});

app.post("/getdb", controller.getTestDB, (req, res) => {
  // console.log("get end database only");
  res.send(res.locals.queryResponse);
});

app.post(
  "/get",
  cacheQL.checkify,
  controller.getTest,
  cacheQL.cachify,
  (req, res) => {
    // console.log("get end of the line");
    res.send(res.locals.cache);
    // if (res.locals.cache) res.send(res.locals.cache);
    // else res.send(res.locals.queryResponse);
  }
);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

module.exports = app;
