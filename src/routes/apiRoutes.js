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

    await dal.postUser(req.body.name, req.body.password, req.body.email);
    res.status(200).send();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:username", async (req, res) => {
  try {
    if (DEBUG) console.log(`get request - ${req.url}`);

    const user = await dal.getUserByName(req.params.username);
    if (user) {
      res.status(200).json(user.rows);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:username", async (req, res) => {
  try {
    if (DEBUG) console.log(`put request - ${req.url}`);

    const user = await dal.getUserByName(req.params.username);
    if (user && user.rows.length > 0) {
      const userId = user.rows[0].id; // Access the 'id' property of the first user in the array
      await dal.updateUser(
        userId, // Use the userId here
        req.body.name,
        req.body.password,
        req.body.email
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.patch("/:username", async (req, res) => {
  try {
    if (DEBUG) console.log(`patch request - ${req.url}`);

    const user = await dal.getUserByName(req.params.username);
    if (user && user.rows.length > 0) {
      await dal.updateUserInfo(
        req.params.username,
        req.body.password,
        req.body.email
      );
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { router };
