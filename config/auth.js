
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { client } from "./db.js";

export const auth = betterAuth({
  database: mongodbAdapter(client.db("togetherwe"), {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    "http://localhost:3000",
    "https://togetherwe-client-omega.vercel.app",
    "https://togetherwe-client-chjjo4ocz-mahim12.vercel.app",
    "https://togetherwe-client-nnthaq4xz-mahim12.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      prompt: "select_account",
      overrideUserInfoOnSignIn: true,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: ["read:user", "user:email"],
      overrideUserInfoOnSignIn: true,

      getUserInfo: async (token) => {
        const headers = {
          Authorization: `Bearer ${token.accessToken}`,
          "User-Agent": "TogetherWe",
          Accept: "application/vnd.github+json",
        };

        const profileResponse = await fetch(
          "https://api.github.com/user",
          { headers }
        );

        if (!profileResponse.ok) {
          console.error(
            "GitHub profile request failed:",
            profileResponse.status
          );
          return null;
        }

        const profile = await profileResponse.json();

        const emailsResponse = await fetch(
          "https://api.github.com/user/emails",
          { headers }
        );

        if (!emailsResponse.ok) {
          console.error(
            "GitHub email request failed:",
            emailsResponse.status
          );
          return null;
        }

        const emails = await emailsResponse.json();

        const primaryVerifiedEmail = emails.find(
          (item) => item.primary && item.verified
        );

        const verifiedEmail = emails.find(
          (item) => item.verified
        );

        const selectedEmail =
          primaryVerifiedEmail || verifiedEmail;

        if (!selectedEmail) {
          console.error("No verified GitHub email found.");
          return null;
        }

        console.log("GitHub Login:", profile.login);

        return {
          user: {
            id: profile.id,
            name: profile.name || profile.login,
            email: selectedEmail.email,
            emailVerified: selectedEmail.verified,
            image: profile.avatar_url,
          },
          data: profile,
        };
      },
    },
  },

  account: {
    accountLinking: {
      enabled: false,
    },
  },

  plugins: [jwt()],
});
