
const { betterAuth } = require("better-auth");
const { mongodbAdapter } = require("@better-auth/mongo-adapter");
const { client } = require("./db");

const auth = betterAuth({
  database: mongodbAdapter(client.db("togetherwe"), {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,
});

module.exports = { auth };
