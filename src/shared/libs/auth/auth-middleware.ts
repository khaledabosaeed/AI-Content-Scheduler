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
export function checkAuth(request: NextRequest): {
  isAuthenticated: boolean;
  user: JWTPayload | null;
  error?: string;
} {
  // قراءة Token من Cookie
  const token = getSessionToken(request);

  if (!token) {
    return {
      isAuthenticated: false,
      user: null,
      error: "لا توجد جلسة نشطة",
    };
  }

  // التحقق من صحة Token
  const payload = verifyToken(token);

  if (!payload) {
    return {
      isAuthenticated: false,
      user: null,
      error: "جلسة غير صالحة أو منتهية",
    };
  }

  return {
    isAuthenticated: true,
    user: payload,
  };
}

/**
 * Middleware لحماية API Routes
 * يستخدم في API Routes التي تحتاج مصادقة
 * 
 * @param request - NextRequest
 * @param handler - الدالة التي ستنفذ إذا كان المستخدم مصادق
 * @returns NextResponse
 */
export async function withAuth(
  request: NextRequest,
  handler: (req: NextRequest, user: JWTPayload) => Promise<NextResponse>
): Promise<NextResponse> {
  const { isAuthenticated, user, error } = checkAuth(request);

  if (!isAuthenticated || !user) {
    return NextResponse.json(
      { error: error || "غير مصرح" },
      { status: 401 }
    );
  }

  return handler(request, user);
}

/**
 * التحقق من صلاحيات المستخدم (اختياري - للاستخدام المستقبلي)
 * يمكن توسيعه لإضافة نظام أدوار (roles/permissions)
 */
export function checkPermission(
  user: JWTPayload,
  requiredRole?: string
): boolean {
  // يمكن إضافة منطق للتحقق من الصلاحيات هنا
  // مثال: user.role === requiredRole
  return true;
}

/**
 * استخراج معلومات المستخدم من Request
 * يستخدم في API Routes لاستخراج المستخدم الحالي
 */
export function getCurrentUser(request: NextRequest): JWTPayload | null {
  const token = getSessionToken(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

