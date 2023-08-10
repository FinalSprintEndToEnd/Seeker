const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const { Pool } = require("pg");
const equipmentRoutes = require("./src/routes/equipment");
const userRoutes = require("./src/routes/login");
const authRoutes = require("./src/routes/auth");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Set up local strategy and user serialization for both MongoDB and PostgreSQL
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Check MongoDB for user
      const mongoUser = await MongoClient.db
        .collection("users")
        .findOne({ username: username });
      if (mongoUser) {
        const passwordMatch = await bcrypt.compare(
          password,
          mongoUser.password
        );
        if (passwordMatch) return done(null, mongoUser);
      }

      // Check PostgreSQL for user
      const pgUserResult = await Pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const pgUser = pgUserResult.rows[0];
      if (pgUser) {
        const passwordMatch = await bcrypt.compare(password, pgUser.password);
        if (passwordMatch) return done(null, pgUser);
      }

      return done(null, false, { message: "Incorrect credentials." });
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id || user.id); // Use appropriate user id property
});

passport.deserializeUser(async (id, done) => {
  try {
    // Check MongoDB for user
    const mongoUser = await MongoClient.db
      .collection("users")
      .findOne({ _id: id });
    if (mongoUser) return done(null, mongoUser);

    // Check PostgreSQL for user
    const pgUserResult = await Pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const pgUser = pgUserResult.rows[0];
    if (pgUser) return done(null, pgUser);

    return done(null, null);
  } catch (error) {
    return done(error);
  }
});

// Connect to MongoDB
const mongoClient = new MongoClient("mongodb://localhost", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoClient.connect((err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }
  MongoClient.db = client.db("your-mongodb-database-name");
  console.log("Connected to MongoDB");
});

// Connect to PostgreSQL
const pool = new Pool({
  user: "your-postgres-user",
  host: "localhost",
  database: "your-postgres-database-name",
  password: "your-postgres-password",
  port: 5432,
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL:", err);
  });

// Routes
app.use("/", equipmentRoutes);
app.use("/", userRoutes);
app.use("/", authRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
