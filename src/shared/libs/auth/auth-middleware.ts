/**
 * Authentication Middleware Utilities
 * يوفر دوال للتحقق من المصادقة في Middleware و API Routes
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "./cookies";
import { verifyToken, JWTPayload } from "./jwt";
/**
 * التحقق من وجود جلسة صالحة
 * يستخدم في Middleware لحماية الصفحات
 * 
 * @param request - NextRequest
 * @returns object - { isAuthenticated, user, error }
 */
export async function checkAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  user: JWTPayload | null;
  error?: string;
}> {
  const token = getSessionToken(request);


  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
      error: "لا توجد جلسة نشطة",
    };
  }

  const payload = await verifyToken(token);


  if (!payload) {
    return {
      isAuthenticated: false,
      user: null,
      error: "جلسة غير صالحة أو منتهية",
    };
  }

  return {
    isAuthenticated: true,
    user: payload as JWTPayload,
  };
}
export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse | Response>
): Promise<NextResponse | Response> {
  const { isAuthenticated, user, error } = await checkAuth(request);
  if (!isAuthenticated || !user) {
    return NextResponse.json(
      { error: error || "غير مصرح" },
      { status: 401 }
    );
  }

  return handler(request, user);
}


// get the current user from the token

export async function getCurrentUser(request: NextRequest): Promise<JWTPayload | null> {
  const token = getSessionToken(request);
  if (!token) {
    return null;
  }
  return await verifyToken(token);
}


