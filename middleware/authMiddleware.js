
import { fromNodeHeaders } from "better-auth/node";
import {
  createRemoteJWKSet,
  jwtVerify,
} from "jose";

import { auth } from "../config/auth.js";

// JWKS public key cache
let JWKS = null;

// Existing session-based authentication
export async function verifyUser(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized! Please login first.",
      });
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    console.error("Session authentication error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed",
    });
  }
}

// JWT-based authentication
export async function verifyJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access denied. JWT token is required.",
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header.",
      });
    }

    const baseURL = process.env.BETTER_AUTH_URL?.replace(/\/+$/, "");

    if (!baseURL) {
      return res.status(500).json({
        success: false,
        message: "Better Auth URL is not configured.",
      });
    }

    // Construct JWKS URL
    const jwksUrl = new URL("/api/auth/jwks", baseURL);

    // Initialize public key resolver
    if (!JWKS) {
      JWKS = createRemoteJWKSet(jwksUrl);
    }

    // Verify JWT signature, issuer and audience
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: baseURL,
      audience: baseURL,
    });

    if (!payload.email || !payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid JWT user information.",
      });
    }

    req.user = {
      id: payload.id || payload.sub,
      email: payload.email,
      name: payload.name,
      image: payload.image,
    };

    req.jwtPayload = payload;

    next();
  } catch (error) {
    console.error("JWT verification failed:", {
      message: error.message,
      code: error.code,
      claim: error.claim,
    });

    return res.status(401).json({
      success: false,
      message: "Invalid or expired JWT token.",
    });
  }
}
