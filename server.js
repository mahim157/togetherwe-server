
import "dotenv/config";

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { auth } from "./config/auth.js";
import { connectDB } from "./config/db.js";
import eventRoutes from "./routes/eventRoutes.js";
import jwtTestRoutes from "./routes/jwtTestRoutes.js";

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://togetherwe-client-omega.vercel.app",
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // and requests from approved frontend URLs
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked this origin: ${origin}`));
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// Better Auth handler
// Express 5 compatible route
app.all("/api/auth/*splat", toNodeHandler(auth));

// JSON body parser
app.use(express.json());

// Backend health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TogetherWe Backend is running!",
  });
});

// Event API routes
app.use("/api/events", eventRoutes);

// JWT test routes
app.use("/api/jwt-test", jwtTestRoutes);

// Server port
const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`TogetherWe server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
