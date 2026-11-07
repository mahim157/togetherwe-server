
import { ObjectId } from "mongodb";
import { getDB } from "../config/db.js";

import {
  isValidEvent,
  createEventDocument,
} from "../models/Event.js";

// Get all upcoming events
export async function getAllEvents(req, res) {
  try {
    const db = getDB();

    const today = new Date().toISOString().split("T")[0];

    const events = await db
      .collection("events")
      .find({
        date: { $gte: today },
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
export async function createEvent(req, res) {
  try {
    const eventData = req.body;

    if (!isValidEvent(eventData)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event information",
      });
    }

    const newEvent = createEventDocument(eventData, req.user);

    const db = getDB();

    const result = await db.collection("events").insertOne(newEvent);

    res.status(201).json({
      success: true,
      message: "Event created successfully!",
      eventId: result.insertedId,
    });
  } catch (error) {
    console.error("Create event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create event",
    });
  }
}

// Get event details by ID
export async function getEventById(req, res) {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const db = getDB();

    const event = await db.collection("events").findOne({
      _id: new ObjectId(id),
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    console.error("Get event details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch event details",
    });
  }
}

// Get 6 recent upcoming events
export async function getRecentEvents(req, res) {
  try {
    const db = getDB();

    const today = new Date().toISOString().split("T")[0];

    const events = await db
      .collection("events")
      .find({
        date: { $gte: today },
      })
      .sort({ date: 1 })
      .limit(6)
      .toArray();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get recent events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recent events",
    });
  }
}

// Join an event
export async function joinEvent(req, res) {
  try {
    const db = getDB();

    const { id } = req.params;
    const user = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    if (!user || !user.email) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const eventId = new ObjectId(id);

    const event = await db.collection("events").findOne({
      _id: eventId,
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    if (event.date < today) {
      return res.status(400).json({
        success: false,
        message: "You cannot join a past event",
      });
    }

    const joinsCollection = db.collection("eventJoins");

    const alreadyJoined = await joinsCollection.findOne({
      eventId,
      userEmail: user.email,
    });

    if (alreadyJoined) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this event",
      });
    }

    await joinsCollection.insertOne({
      eventId,
      eventTitle: event.title,
      userEmail: user.email,
      userName: user.name || "Community Member",
      joinedAt: new Date(),
    });

    await db.collection("events").updateOne(
      { _id: eventId },
      {
        $inc: { volunteers: 1 },
      }
    );

    res.status(201).json({
      success: true,
      message: "You have successfully joined this event!",
    });
  } catch (error) {
    console.error("Join event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to join event",
    });
  }
}

// Get events joined by the logged-in user
export async function getJoinedEvents(req, res) {
  try {
    const db = getDB();
    const user = req.user;

    if (!user || !user.email) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const joinedRecords = await db
      .collection("eventJoins")
      .find({
        userEmail: user.email,
      })
      .toArray();

    if (joinedRecords.length === 0) {
      return res.status(200).json({
        success: true,
        events: [],
      });
    }

    const eventIds = joinedRecords.map(
      (record) => record.eventId
    );

    const events = await db
      .collection("events")
      .find({
        _id: { $in: eventIds },
      })
      .sort({ date: 1 })
      .toArray();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get joined events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch joined events",
    });
  }
}

// Get events created by the logged-in user
export async function getMyEvents(req, res) {
  try {
    const db = getDB();
    const user = req.user;

    if (!user || !user.email) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const events = await db
      .collection("events")
      .find({
        creatorEmail: user.email,
      })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    console.error("Get my events error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch your events",
    });
  }
}

// Update an event created by the logged-in user
export async function updateMyEvent(req, res) {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const user = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    if (!user || !user.email) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    if (!isValidEvent(eventData)) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid event information",
      });
    }

    const db = getDB();

    const result = await db.collection("events").updateOne(
      {
        _id: new ObjectId(id),
        creatorEmail: user.email,
      },
      {
        $set: {
          title: eventData.title.trim(),
          description: eventData.description.trim(),
          category: eventData.category,
          image: eventData.image.trim(),
          location: eventData.location.trim(),
          date: eventData.date,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      const event = await db.collection("events").findOne({
        _id: new ObjectId(id),
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You can only update your own events",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully!",
    });
  } catch (error) {
    console.error("Update event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update event",
    });
  }
}

// Delete an event created by the logged-in user
export async function deleteMyEvent(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    if (!user || !user.email) {
      return res.status(401).json({
        success: false,
        message: "Please login first",
      });
    }

    const db = getDB();
    const eventId = new ObjectId(id);

    const result = await db.collection("events").deleteOne({
      _id: eventId,
      creatorEmail: user.email,
    });

    if (result.deletedCount === 0) {
      const event = await db.collection("events").findOne({
        _id: eventId,
      });

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      return res.status(403).json({
        success: false,
        message: "You can only delete your own events",
      });
    }

    // Remove join records related to this event
    await db.collection("eventJoins").deleteMany({
      eventId,
    });

    res.status(200).json({
      success: true,
      message: "Event deleted successfully!",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
}
