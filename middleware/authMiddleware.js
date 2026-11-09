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

    // Normalize Better Auth URL
    const baseURL = process.env.BETTER_AUTH_URL
      ?.trim()
      .replace(/\/+$/, "");

    if (!baseURL) {
      return res.status(500).json({
        success: false,
        message: "Better Auth URL is not configured.",
      });
    }

    const jwksUrl = new URL("/api/auth/jwks", baseURL);

    if (!JWKS) {
      JWKS = createRemoteJWKSet(jwksUrl);
    }

    // Debug expected issuer
    console.log("Expected JWT issuer:", JSON.stringify(baseURL));

    // Verify JWT
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