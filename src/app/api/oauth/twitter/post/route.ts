import { NextRequest, NextResponse } from "next/server";
import { publishTweet } from "@/shared/libs/twitter/twitter";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "content is required" },
        { status: 400 }
      );
    }

    const tweet = await publishTweet(content.trim());

    return NextResponse.json(
      {
        success: true,
        tweet,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Twitter post error:", {
      message: error?.message,
      responseData: error?.response?.data,
    });

    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to post tweet",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST with { content } to publish a tweet.",
  });
}
