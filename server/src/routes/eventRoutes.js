const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.post("/createEvent", eventController.createEvent);
router.get("/getEvents", eventController.getEvents);
router.delete("/deleteEvent/", eventController.deleteEvent);
router.put("/updateEvent/:id", eventController.updateEvent);

module.exports = router;
