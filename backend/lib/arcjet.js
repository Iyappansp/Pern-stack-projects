import arcjet, { tokenBucket, shield, bot } from "@arcjet/node";
import "dotenv/config";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    //ehtuthta shield sql injection xss csrf la erunthu protect panum
    shield({ mode: "LIVE" }),
    bot({
      mode: "LIVE",
      //ethu tha ellam bot um stop panum search engine thavira
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});
