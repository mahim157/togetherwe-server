
import express from "express";

import {
  getAllEvents,
  getRecentEvents,
  getEventById,
  createEvent,
  joinEvent,
  getJoinedEvents,
  getMyEvents,
  updateMyEvent,
  deleteMyEvent,
} from "../controllers/eventController.js";

import {
  verifyJWT,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// Public Routes
// =====================================

// Get all events
router.get("/", getAllEvents);

// Get recent 6 events
router.get("/recent", getRecentEvents);


// =====================================
// JWT Protected Routes
// =====================================

// Get logged-in user's joined events
router.get("/joined", verifyJWT, getJoinedEvents);

// Get logged-in user's created events
router.get("/my-events", verifyJWT, getMyEvents);

// Create a new event
router.post("/", verifyJWT, createEvent);

// Join an event
router.post("/:id/join", verifyJWT, joinEvent);

// Update own event
router.put("/:id", verifyJWT, updateMyEvent);

// Delete own event
router.delete("/:id", verifyJWT, deleteMyEvent);


// =====================================
// Dynamic Route
// Always keep this at the bottom
// =====================================

router.get("/:id", getEventById);

export default router;
