
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export async function verifyUser(req, res, next) {
  try {
    // Verify the Better Auth session
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    // Reject requests without a valid session
    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Please login first.",
      });
    }

    // Attach authenticated user information
    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed",
    });
  }
}
