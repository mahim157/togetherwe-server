
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
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,

      // Always sync GitHub profile information on login
      overrideUserInfoOnSignIn: true,

      // Use GitHub name and avatar
      mapProfileToUser: (profile) => ({
        name: profile.name || profile.login,
        image: profile.avatar_url,
      }),
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  plugins: [jwt()],
});
