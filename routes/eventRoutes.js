
const express = require("express");

const {
  getAllEvents,
  createEvent,
} = require("../controllers/eventController");

const router = express.Router();

// GET: Get all upcoming events
router.get("/", getAllEvents);

// POST: Create a new event
router.post("/", createEvent);

module.exports = router;
