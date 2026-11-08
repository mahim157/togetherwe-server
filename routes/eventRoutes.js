
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
  bookmarkEvent,
  removeBookmark,
  getBookmarkedEvents,

  // Event Discussion / Comments
  getEventComments,
  addEventComment,
  updateEventComment,
  deleteEventComment,
} from "../controllers/eventController.js";

import {
  verifyJWT,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// Public Routes
// =====================================

// Get all upcoming events
router.get("/", getAllEvents);

// Get recent 6 upcoming events
router.get("/recent", getRecentEvents);

// Get all comments for an event
router.get("/:id/comments", getEventComments);


// =====================================
// JWT Protected Routes
// =====================================

// Get logged-in user's joined events
router.get("/joined", verifyJWT, getJoinedEvents);

// Get logged-in user's created events
router.get("/my-events", verifyJWT, getMyEvents);

// Get logged-in user's bookmarked events
router.get("/bookmarked", verifyJWT, getBookmarkedEvents);

// Create a new event
router.post("/", verifyJWT, createEvent);

// Join an event
router.post("/:id/join", verifyJWT, joinEvent);

// Bookmark an event
router.post("/:id/bookmark", verifyJWT, bookmarkEvent);

// Remove an event bookmark
router.delete("/:id/bookmark", verifyJWT, removeBookmark);

// Add a comment to an event
router.post("/:id/comments", verifyJWT, addEventComment);

// Edit own comment
router.put(
  "/:id/comments/:commentId",
  verifyJWT,
  updateEventComment
);

// Delete own comment
router.delete(
  "/:id/comments/:commentId",
  verifyJWT,
  deleteEventComment
);

// Update own event
router.put("/:id", verifyJWT, updateMyEvent);

// Delete own event
router.delete("/:id", verifyJWT, deleteMyEvent);


// =====================================
// Dynamic Route
// Always keep this at the bottom
// =====================================

// Get event details by ID
router.get("/:id", getEventById);

export default router;
