////////////////////////////////////////////////
const Pool = require("pg").Pool;
const pool = new Pool({
  user: "admin",
  password: "pa$$word",
  host: "localhost",
  database: "users",
  port: 5432,
});

////////////////////////////////////////////////
// Exports
module.exports = { pool };
