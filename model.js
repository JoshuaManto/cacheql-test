const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://admin:admin@cluster0-zvnqd.mongodb.net/test?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: "cacheql"
  })
  .then(() => console.log(`Connected to Mongo DB`))
  .catch(err => console.log(err));

const Schema = mongoose.Schema;

const testSchema = new Schema({
  first_name: String,
  last_name: String
});

const test = mongoose.model("tests", testSchema);

module.exports = {
  test
};
