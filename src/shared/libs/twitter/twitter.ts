import { TwitterApi } from "twitter-api-v2";

export const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_KEY_SECRET as string,
  accessToken: process.env.TWITTER_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET as string,
});

export async function publishTweet(content: string) {
  const rwClient = twitterClient.readWrite;
  const tweet = await rwClient.v2.tweet(content);
  return tweet;
}
  