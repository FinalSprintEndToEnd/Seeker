const { Router } = require("express");
const router = Router();
const dal = require("../../services/user_pg.DAL");

router.get("/", async (req, res) => {
  try {
    if (DEBUG) console.log(`get request - ${req.url}`);

    const users = await dal.getAllUsers();
    res.status(200).json(users.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (DEBUG) console.log(`post request - ${req.url}`);

    await dal.postUser(req.body.username, req.body.password, req.body.email);
    res.status(200).send();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:email", async (req, res) => {
  try {
    if (DEBUG) console.log(`patch request - ${req.url}`);

    const user = await dal.getUserByEmail(req.params.email);
    if (user && user.rows.length > 0) {
      await dal.updateUser(
        req.body.username,
        req.body.password,
        req.params.email
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:email", async (req, res) => {
  try {
    if (DEBUG) console.log(`delete request - ${req.url}`);

    const user = await dal.getUserByEmail(req.params.email);
    if (user && user.rows.length > 0) {
      await dal.deleteUser(req.params.email); // Assuming you have a deleteUser function
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { router };
