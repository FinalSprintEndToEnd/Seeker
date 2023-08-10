////////////////////////////////////////////////
const { Router } = require("express");
const router = Router();
const dal = require("../../services/constEquip_mg.DAL");

////////////////////////////////////////////////
router.get("/", async (req, res) => {
  try {
    if (DEBUG) console.log(`get request - ${req.url}`);

    await dal.getEquipment(req, res);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (DEBUG) console.log(`Put request - ${req.url}`);

    await dal.addEquipment(req, res);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (DEBUG) console.log(`delete request - ${req.url}`);
    await dal.deleteEquipment(req, res);
  } catch (error) {
    console.error("Error deleting equipment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

////////////////////////////////////////////////

module.exports = { router };
