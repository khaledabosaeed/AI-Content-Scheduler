import { NextRequest } from "next/server";
import { createResponseWithoutSession } from "@/shared/libs/auth/cookies";

export const POST = async (req: NextRequest) => {
  try {
    return createResponseWithoutSession(
      { message: "logout successful" },
      200
    );
  } catch (error) {
    console.error('Logout error:', error);
    return createResponseWithoutSession(
      { error: "internal server error" },
      500
    );
  }
}; 