////////////////////////////////////////////////
const { MongoClient } = require("mongodb");

////////////////////////////////////////////////
const connectionString =
  "mongodb+srv://admin:pa$$word@cluster0.u9mzfar.mongodb.net/";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const client = new MongoClient(connectionString, options);

////////////////////////////////////////////////
// Exports
module.exports = { client };
