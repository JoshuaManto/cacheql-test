const redis = require("redis");

const redisHost = "redis-10212.c52.us-east-1-4.ec2.cloud.redislabs.com";
const redisPort = process.argv[3] || 10212;
const redisAuth = "eRQFVq70CXuDEoISTvKNVFtdevWabNbe";

const timeToLive = 30;

client = redis.createClient({
  port: redisPort,
  host: redisHost
});

client.auth(redisAuth, function(err, response) {
  if (err) {
    throw err;
  }
  console.log("Redis Client Authenticated");
});

client.del("foo");

client.keys("*", (err, res) => {
  if (err) {
    throw err;
  } else {
    console.log(res);
  }
});

client.get("testing", function(err, response) {
  if (err) {
    throw err;
  } else {
    console.log(response);
  }
});
