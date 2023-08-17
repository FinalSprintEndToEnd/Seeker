const Router = require("express").Router;
const router = Router();
const dal = require("../../services/constEquip_mg.DAL");
const events = require("events");
class Event extends events {}
const emitEvent = new Event();
const logger = require("../logger");
router.get("/", async (req, res) => {
  res.render("search.ejs");
});
router.get("/:passedarguments", async (req, res) => {
  try {
    emitEvent.emit("log", "searchRoutes", `GET`, req.url);
    if (DEBUG) {
      console.log(`get request - ${req.url}`);
      console.log(`get request - ${req.params.passedarguments}`);
    }
    res.redirect("https://www.youtube.com");
    await dal.getEquipment(req, res);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// logger
emitEvent.on("log", (event, level, message) => {
  if (global.DEBUG) logger.logEvent(event, level, message);
});

module.exports = { router };
