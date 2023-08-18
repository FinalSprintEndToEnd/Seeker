////////////////////////////////////////////////
// imports
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const logger = require("./src/logger");
const apiRoutes = require("./src/routes/apiRoutes");
const equipmentRoutes = require("./src/routes/equipmentRoutes");
const dal = require("./services/user_pg.DAL");
const events = require("events");
class Event extends events {}
const emitEvent = new Event();
const app = express();
const PORT = 3000;
const { max } = require("date-fns");
const { program } = require("commander");
var cookieParser = require("cookie-parser");
const {
  getEquipment,
  addEquipment,
  deleteEquipment,
} = require("./services/constEquip_mg.DAL");
////////////////////////////////////////////////
// global constants
global.DEBUG = true;

////////////////////////////////////////////////
// app dependencies
app.use(express.static("public"));
app.use("/images", express.static("views/images"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("favicon.ico"));
app.use(cookieParser());
////////////////////////////////////////////////
// app special function routers

//  http://localhost:300/users will trigger this badboy.
//  that means anything that comes after /users can be
//  used as an argument!!!! : ) <3
app.use("/users", apiRoutes.router);

app.use("/equipment", equipmentRoutes.router);

////////////////////////////////////////////////
// app basic routes

app.get("/", async (req, res) => {
  emitEvent.emit("log", "app", `GET`, req.url);
  res.render("index.ejs", { req: req });
});

app.get("/login", async (req, res) => {
  emitEvent.emit("log", "app", `GET`, req.url);
  res.render("login.ejs", { req: req });
});
app.get("/about", async (req, res) => {
  emitEvent.emit("log", "app", `GET`, req.url);
  res.render("about.ejs", { req: req });
});
app.get("/success", async (req, res) => {
  emitEvent.emit("log", "app", `GET`, req.url);
  res.render("success.ejs", { req: req });
});
// // get for search
// app.get("/search", async (req, res) => {
//   emitEvent.emit("log", "app", `GET`, req.url);
//   res.render("search.ejs");
// });
// // post for search
// app.post("/search", async (req, res) => {
//   emitEvent.emit("log", "app", `POST`, req.url);
//   res.render("search.ejs");
// });
app.get("favicon.ico", async (req, res) => {
  emitEvent.emit("log", "app", `GET`, req.url);
  res.render("favicon.ico");
});
app.post("/login", async (req, res) => {
  const email = await req.body.email;
  const password = await req.body.password;
  try {
    if (DEBUG) {
      console.log(`post request - ${req.url}`);
    }
    emitEvent.emit("log", "app", `POST`, req.url);

    const userData = await dal.getUserByEmail(email);
    if (
      email === userData.rows[0].email &&
      (await bcrypt.compare(password, userData.rows[0].password))
    ) {
      console.log("Login succesful");
      res.cookie(
        "email",
        userData.rows[0].email,
        (maxAge = 1000 * 60 * 60 * 24 * 7)
      );
      res.redirect("/success");
    } else {
      res.send(
        '<script>alert("Invalid credentials. Please try again."); window.location.href = "/login";</script>'
      );
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.send(
      '<script>alert("Invalid credentials. Please try again."); window.location.href = "/login";</script>'
    );
  }
});

app.get("/signup", async (req, res) => {
  emitEvent.emit("log", "app", `GET`, req.url);
  res.render("signup.ejs", { req: req });
});
app.get("/logout", async (req, res) => {
  res.clearCookie("email");
  res.redirect("/");
});

app.post("/signup", async (req, res) => {
  const name = await req.body.username;
  const password = await req.body.password;
  const email = await req.body.email;
  try {
    if (DEBUG) {
      console.log(`post request - ${req.url}`);
    }
    emitEvent.emit("log", "app", `POST`, req.url);

    dal.postUser(name, password, email);
    res.redirect("/login");
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
app.get("/search-page", async (req, res) => {
  emitEvent.emit("log", "app", `GET`, req.url);
  res.render("search.ejs", { req: req });
});

app.post("/search", async (req, res) => {
  const { database, query } = req.body;

  // Validate database type and call right function
  if (database === "mongo") {
    // We pass the query into getEquipment function
    try {
      await getEquipment(req, res, query);
    } catch (error) {
      console.error("Error retrieving equipment data:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  } else if (database === "postgres") {
    console.log(
      "We misunderstood this part of the assignment until we got the UI stage... There is a working mock user database that uses postgres with functionality for commands to edit, add or delete. The mongo DB is for the products list... so we're just going to leave this here for now. : ) <3"
    );
  } else {
    res.status(400).json({
      success: false,
      error: "Invalid database selected",
    });
  }
});

// app.get("/useredit", async (req, res) => {
//   emitEvent.emit("log", "app", `GET`, req.url);
//   res.render("userEdit.ejs");
// });

// app.delete("/deleteuser", async (req, res) => {
//   const name = await req.body.username;
//   try {
//     if (DEBUG) {
//       console.log(`post request - ${req.url}`);
//     }
//     emitEvent.emit("log", "app", `POST`, req.url);

//     dal.deleteUser(name);
//     res.redirect("/login");
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

////////////////////////////////////////////////
// listener
app.listen(PORT);

// logger
emitEvent.on("log", (event, level, message) => {
  if (global.DEBUG) logger.logEvent(event, level, message);
});

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(
//   session({ secret: "your-secret-key", resave: true, saveUninitialized: true })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// // Set up local strategy and user serialization for both MongoDB and PostgreSQL
// passport.use(
//   new LocalStrategy(async (username, password, done) => {
//     try {
//       // Check MongoDB for user
//       const mongoUser = await MongoClient.db
//         .collection("users")
//         .findOne({ username: username });
//       if (mongoUser) {
//         const passwordMatch = await bcrypt.compare(
//           password,
//           mongoUser.password
//         );
//         if (passwordMatch) return done(null, mongoUser);
//       }

//       // Check PostgreSQL for user
//       const pgUserResult = await Pool.query(
//         "SELECT * FROM users WHERE username = $1",
//         [username]
//       );
//       const pgUser = pgUserResult.rows[0];
//       if (pgUser) {
//         const passwordMatch = await bcrypt.compare(password, pgUser.password);
//         if (passwordMatch) return done(null, pgUser);
//       }

//       return done(null, false, { message: "Incorrect credentials." });
//     } catch (error) {
//       return done(error);
//     }
//   })
// );

// passport.serializeUser((user, done) => {
//   done(null, user._id || user.id); // Use appropriate user id property
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     // Check MongoDB for user
//     const mongoUser = await MongoClient.db
//       .collection("users")
//       .findOne({ _id: id });
//     if (mongoUser) return done(null, mongoUser);

//     // Check PostgreSQL for user
//     const pgUserResult = await Pool.query("SELECT * FROM users WHERE id = $1", [
//       id,
//     ]);
//     const pgUser = pgUserResult.rows[0];
//     if (pgUser) return done(null, pgUser);

//     return done(null, null);
//   } catch (error) {
//     return done(error);
//   }
// });

// // Connect to MongoDB
// const mongoClient = new MongoClient("mongodb://localhost", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoClient.connect((err, client) => {
//   if (err) {
//     console.error("Error connecting to MongoDB:", err);
//     return;
//   }
//   MongoClient.db = client.db("your-mongodb-database-name");
//   console.log("Connected to MongoDB");
// });

// // Connect to PostgreSQL
// const pool = new Pool({
//   user: "your-postgres-user",
//   host: "localhost",
//   database: "your-postgres-database-name",
//   password: "your-postgres-password",
//   port: 5432,
// });

// pool
//   .connect()
//   .then(() => {
//     console.log("Connected to PostgreSQL");
//   })
//   .catch((err) => {
//     console.error("Error connecting to PostgreSQL:", err);
//   });

// // Routes
// app.use("/", equipmentRoutes);
// app.use("/", userRoutes);
// app.use("/", authRoutes);
