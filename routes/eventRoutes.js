
import express from "express";

import {
  getAllEvents,
  getRecentEvents,
  getEventById,
  createEvent,
  joinEvent,
  getJoinedEvents,
} from "../controllers/eventController.js";

import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all upcoming events
router.get("/", getAllEvents);

// Get recent 6 events
router.get("/recent", getRecentEvents);

// Get joined events of the logged-in user
router.get("/joined", verifyUser, getJoinedEvents);

// Join an event
router.post("/:id/join", verifyUser, joinEvent);

// Get event details by ID
router.get("/:id", getEventById);

// Create a new event
router.post("/", verifyUser, createEvent);

export default router;
