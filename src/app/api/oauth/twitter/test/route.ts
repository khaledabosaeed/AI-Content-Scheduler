import { NextResponse } from "next/server";
import { twitterClient } from "@/shared/libs/twitter/twitter";

export async function GET() {
  try {
    const user = await twitterClient.v2.me();

    return NextResponse.json({
      success: true,
      message: "Twitter connection is working ✅",
      account: {
        id: user.data.id,
        name: user.data.name,
        username: user.data.username,
      },
    });
  } catch (error: any) {
    console.error("Twitter connection test failed:", {
      message: error?.message,
      response: error?.response?.data,
    });

    return NextResponse.json(
      {
        success: false,
        message: "Twitter connection failed ❌",
        error: error?.message,
        details: error?.response?.data,
      },
      { status: 500 }
    );
  }
}
