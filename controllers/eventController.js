
const { getDB } = require("../config/db");
const {
  createEventDocument,
  isValidEvent,
} = require("../models/Event");

// Get all upcoming events
async function getAllEvents(req, res) {
  try {
    const db = getDB();

    const events = await db
      .collection("events")
      .find({
        date: { $gte: new Date().toISOString().split("T")[0] },
      })
      .sort({ date: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
    });
  }
}

// Create a new event
async function createEvent(req, res) {
  try {
    const eventData = req.body;

    if (!isValidEvent(eventData)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event information",
      });
    }

    // Authentication will be connected before enabling event creation.
    return res.status(401).json({
      success: false,
      message: "Authentication is required to create an event",
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
}

module.exports = {
  getAllEvents,
  createEvent,
};
