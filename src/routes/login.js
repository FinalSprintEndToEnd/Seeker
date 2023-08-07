const mongoose = require('mongoose'); // For MongoDB
const { Pool } = require('pg'); // For PostgreSQL

const mongooseUserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const pgUserTable = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT,
    password TEXT
  )
`;

// MongoDB model
const MongoDBUser = mongoose.model('User', mongooseUserSchema);

// PostgreSQL table creation
const createPgUserTable = async (db) => {
  await db.query(pgUserTable);
};

module.exports = {
  MongoDBUser,
  createPgUserTable,
};
