const redis = require("redis");

let redisHost;
let redisPort;
let redisAuth;

let timeToLive;

let client;

const cacheQL = {};

cacheQL.set = data => {
  if (data.redisHost) redisHost = data.redisHost;
  if (data.redisPort) redisPort = data.redisPort;
  if (data.redisAuth) redisAuth = data.redisAuth;
  if (data.timeToLive) timeToLive = data.timeToLive;
};

cacheQL.auth = () => {
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
};

cacheQL.checkify = (req, res, next) => {
  // Checks the query if it is inside the cache
  client.GET(req.body.query, function(err, response) {
    // req.body.query is the graphql query from the frontend request
    if (err) {
      throw err;
    } else {
      // The query is not inside the cache
      // redis returns null if the key is not inside the redis database/cache
      if (response === null) {
        res.locals.cache = null;
        return next();
      } else {
        // the query is in the cache
        // saves the result in cache variable in res.locals
        // to be accessible in the next middleware
        // Use JSON.parse because the response (value from redis) is saved using JSON stringify
        res.locals.cache = JSON.parse(response);
        return next();
      }
    }
  });
};

// Need to figure out how to go to db then go back here to save the query and result to cache
// Create another function (cachify)
// Which will be called after the endpoint middleware (like database)
// Then call said function to check if cache is null
// If null then saves query and result in cache

cacheQL.cachify = (req, res, next) => {
  //This is a case where the query doesn't exist in the database
  //In the previous step the user must save the query and the querry response from the initial query to the db
  //The query - req.body.query
  //The response of the query (queryResponse) - res.locals.queryResponse
  if (res.locals.cache === null) {
    const query = req.body.query;
    const queryResponse = res.locals.queryResponse;

    // Stringifies the queryResponse to be able to save deeply nested objects in redis
    client.SETEX(query, timeToLive, JSON.stringify(queryResponse), function(
      err,
      response
    ) {
      if (err) {
        throw err;
      } else {
        res.locals.cache = queryResponse;
        return next();
      }
    });
  }
  // The query is in the cache and skips over cachify
  else {
    return next();
  }
};

// const cachify = query => {
//   client.get(query, function(err, response) {
//     if (err) {
//       throw err;
//     } else {
//       // The query is not inside the cache
//       if(response === null) {
//         // Need to figure out how to go to db then go back here to save the query and result to cache
//       }
//       else {
//         // query is in the cache
//         console.log(response);

//       }
//     }
//   });
// };

// client.set("foo", "bar");
// client.set("foo2", "bar2");
// client.set("foo3", "bar3");
// client.set("foo4", "bar4");

// client.del("foo3");
// client.del("foo4");

// client.get("foo", function(err, response) {
//   if (err) {
//     throw err;
//   } else {
//     console.log(response);
//   }
// });

// client.keys("*", (err, res) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log(res);
//   }
// });

// client.get("", (err, response) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log(response);
//   }
// });

module.exports = cacheQL;
