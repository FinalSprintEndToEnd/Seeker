////////////////////////////////////////////////
// imports
const fs = require("fs");
const dal = require("./user_pg.DB_ACCESS");
const bcrypt = require("bcrypt");
const logger = require("../src/logger");
const events = require("events");
class Event extends events {}
const emitEvent = new Event();

////////////////////////////////////////////////
// method functions

// updated  for seeker.
const getAllUsers = () => {
  // if (DEBUG) {
  //   console.log(`${__filename}.getAllUsers()`);
  // }
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./services/SQL/users.view_all.sql",
      "utf8",
      (err, sqlQuery) => {
        if (err) {
          console.log(err);
          emitEvent.emit("log", "PG-DAL", "ERROR", err);
          reject(err);
        } else {
          dal.pool.query(sqlQuery, [], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      }
    );
  });
};

// updated  for seeker.
const getUserByEmail = (email) => {
  // if (DEBUG) {
  //   console.log(`${__filename}.getUserByName()`);
  // }
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./services/SQL/users.view_user.sql",
      "utf8",
      (err, sqlQuery) => {
        if (err) {
          console.log(err);
          emitEvent.emit("log", "PG-DAL", "ERROR", err);
          reject(err);
        } else {
          dal.pool.query(sqlQuery, [email], (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      }
    );
  });
};

// updated  for seeker.
const postUser = (name, password, email) => {
  // if (DEBUG) {
  //   console.log(`${__filename}.postUser()`);
  // }
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./services/SQL/users.view_user.sql",
      "utf8",
      (err, sqlQuery) => {
        if (err) {
          console.log(err);
          emitEvent.emit("log", "PG-DAL", "ERROR", err);
          return reject(err);
        }

        dal.pool.query(sqlQuery, [email], (err, result) => {
          if (err) {
            console.log(err);
            emitEvent.emit("log", "PG-DAL", "ERROR", err);
            return reject(err);
          }

          if (result.rows.length === 0) {
            // User does not exist, proceed with user registration
            fs.readFile(
              "./services/SQL/users.create_user.sql",
              "utf8",
              async (err, postUserQuery) => {
                if (err) {
                  console.log(err);
                  emitEvent.emit("log", "PG-DAL", "ERROR", err);
                  return reject(err);
                }

                // if (DEBUG) console.log("Creating user");
                try {
                  await dal.pool.query(postUserQuery, [
                    name,
                    await bcrypt.hash(password, 10),
                    email,
                  ]);
                  // if (DEBUG) console.log("User created successfully");
                  emitEvent.emit(
                    "log",
                    "PG-DAL",
                    "USER_CREATED",
                    `${name},${email}`
                  );
                  resolve(result);
                } catch (err) {
                  console.log(err);
                  emitEvent.emit("log", "PG-DAL", "ERROR", err);
                  reject(err);
                }
              }
            );
          } else {
            // User exists, reject the Promise
            emitEvent.emit(
              "log",
              "PG-DAL",
              "Warning",
              `User '${name}' already exists`
            );
            reject(`User '${name}' already exists`);
          }
        });
      }
    );
  });
};

// updated  for seeker.
const updateUser = (name, password, email) => {
  // if (DEBUG) {
  //   console.log(`${__filename}.updateUser()`);
  // }
  return new Promise((resolve, reject) => {
    fs.readFile(
      "./services/SQL/users.update_user.sql",
      "utf8",
      async (err, sqlQuery) => {
        if (err) {
          // if (DEBUG) console.log("Error reading SQL file:", err);
          reject(err);
        }
        // if (DEBUG) console.log("SQL Query:", sqlQuery);
        dal.pool.query(
          sqlQuery,
          [name, await bcrypt.hash(password, 10), email],
          (err, results) => {
            if (err) {
              // if (DEBUG) console.log("Error executing update query:", err);
              return reject(err);
            }
            // if (DEBUG) console.log("Updated user");
            resolve(results);
          }
        );
      }
    );
  });
};

// not udpated
const deleteUser = (email) => {
  // if (DEBUG) {
  //   console.log(`${__filename}.deleteUser()`);
  // }

  return new Promise((resolve, reject) => {
    fs.readFile(
      "./services/SQL/users.delete_user.sql",
      "utf8",
      (err, sqlQuery) => {
        if (err) {
          // if (DEBUG) console.log("Error reading SQL file:", err);
          reject(err);
        }
        // if (DEBUG) console.log("SQL Query:", sqlQuery);
        dal.pool.query(sqlQuery, [email], (err, results) => {
          if (err) {
            // if (DEBUG) console.log("Error executing delete query:", err);
            return reject(err);
          }
          // if (DEBUG) console.log("Deleted user");
          resolve(results);
        });
      }
    );
  });
};

////////////////////////////////////////////////
// logger
emitEvent.on("log", (event, level, message) => {
  if (global.DEBUG) logger.logEvent(event, level, message);
});

////////////////////////////////////////////////
// Exports
module.exports = {
  getAllUsers,
  getUserByEmail,
  postUser,
  updateUser,
  deleteUser,
};
