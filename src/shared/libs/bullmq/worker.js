import "dotenv/config";
import { Worker } from "bullmq";
import axios from "axios";
import { connection, publishQueue } from "./queue.js";

// node src/shared/libs/bullmq/worker.js
new Worker(
  "publishQueue",
  async () => {
    console.log("Checking scheduled posts...");

    // await axios.post(
    //   `http://localhost:3000/api/facebook/publish`,
    //   {},
    //   {
    //     headers: {
    //       "x-publish-secret": "",
    //     },
    //   }
    // );

    await fetch("http://localhost:3000/api/facebook/publish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publish-secret": process.env.PUBLISH_SECRET, // ضع هنا السر
      },
      body: JSON.stringify({}),
    });
  },

  { connection }
);

// Repeat every minute
publishQueue.add(
  "check",
  {},
  {
    repeat: { every: 60_000 },
  }
);

console.log("Worker started...");
