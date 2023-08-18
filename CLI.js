const { program } = require("commander");
const {
  getAllUsers,
  getUserByEmail,
  postUser,
  updateUser,
  deleteUser,
} = require("./services/user_pg.DAL");

program
  .command("get-all-users")
  .description("Get all users")
  .action(() => {
    getAllUsers()
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  });

program
  .command("get-user-by-email <email>")
  .description("Get user by email")
  .action((email) => {
    getUserByEmail(email)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  });

program
  .command("post-user <name> <password> <email>")
  .description("Create a new user")
  .action((name, password, email) => {
    postUser(name, password, email)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  });

program
  .command("update-user <name> <password> <email>")
  .description("Update an existing user")
  .action((name, password, email) => {
    updateUser(name, password, email)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  });

program
  .command("delete-user <email>")
  .description("Delete a user")
  .action((email) => {
    deleteUser(email)
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  });
program
  .command("help")
  .description("Display help for commands")
  .action(() => {
    program.outputHelp();
  });

program.parse(process.argv);
