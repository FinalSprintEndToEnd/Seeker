const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
// const { MongoDBUser } = require("./user"); // For MongoDB
const { Pool } = require("pg"); // For PostgreSQL

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const db = req.db;

      if (db === req.mongoose) {
        const user = await MongoDBUser.findOne({ username: username });
        if (!user) return done(null, false, { message: "Incorrect username." });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
          return done(null, false, { message: "Incorrect password." });
        return done(null, user);
      } else if (db === req.pool) {
        const result = await db.query(
          "SELECT * FROM users WHERE username = $1",
          [username]
        );
        const user = result.rows[0];
        if (!user) return done(null, false, { message: "Incorrect username." });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch)
          return done(null, false, { message: "Incorrect password." });
        return done(null, user);
      }
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = req.db;

    if (db === req.mongoose) {
      const user = await MongoDBUser.findById(id);
      done(null, user);
    } else if (db === req.pool) {
      const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
      const user = result.rows[0];
      done(null, user);
    }
  } catch (error) {
    done(error);
  }
});
