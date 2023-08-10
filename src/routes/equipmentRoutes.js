////////////////////////////////////////////////
const { Router } = require("express");
const router = Router();
const dal = require("../../services/constEquip_mg.DB_ACCESS");

////////////////////////////////////////////////
router.get("/", async (req, res) => {
  try {
    if (DEBUG) console.log(`post request - ${req.url}`);

    await dal.getEquipment(req, res);
    res.status(200).send();
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

////////////////////////////////////////////////

module.exports = { router };
