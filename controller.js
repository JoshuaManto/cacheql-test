const { test } = require("./model.js");

const controller = {};

controller.addTest = (req, res, next) => {
  console.log("add message controller");
  console.log(req.body);

  const { first_name, last_name } = req.body;

  test.create({ first_name, last_name }).then(result => {
    console.log(result);
    console.log("added");
    // res.locals.id = result._id;
    return next();
  });
};

controller.getTest = (req, res, next) => {
  // console.log("get messages controller");

  if (res.locals.cache === null) {
    test.find().then(result => {
      console.log("db");
      console.log(result);

      res.locals.queryResponse = result;

      return next();
    });
  } else {
    return next();
  }
};

controller.getTestDB = (req, res, next) => {
  // console.log("get messages DB controller");

  test.find().then(result => {
    // console.log(result);

    res.locals.queryResponse = result;

    return next();
  });
};

module.exports = controller;
