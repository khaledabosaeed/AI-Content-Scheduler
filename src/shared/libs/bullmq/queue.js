import { Queue } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis("rediss://default:AY5nAAIncDE1YjM0ODg2YjYxZTA0MDQ1OGE0YTNmZWZiZjNmMTg1ZHAxMzY0NTU@accurate-grub-36455.upstash.io:6379",{
  maxRetriesPerRequest: null,  
  enableReadyCheck: false 
});

export const publishQueue = new Queue("publishQueue", {
  connection,
});


