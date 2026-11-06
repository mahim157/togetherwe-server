
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { client } from "./db.js";

export const auth = betterAuth({
  database: mongodbAdapter(client.db("togetherwe"), {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,
});
