
import express from "express";
import { verifyJWT } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected JWT test endpoint
router.get("/protected", verifyJWT, (req, res) => {
  res.json({
    success: true,
    message: "JWT verified successfully!",
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
    },
  });
});

export default router;
