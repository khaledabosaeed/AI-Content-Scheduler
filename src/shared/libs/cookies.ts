/**
 * Cookie Management Library
 * يوفر وظائف آمنة لإدارة Cookies
 * Cookies = تخزين آمن للـ JWT في المتصفح
 */

import { NextRequest, NextResponse } from 'next/server';

// اسم الكوكي التي تخزن JWT
export const SESSION_COOKIE_NAME = 'session';

// إعدادات الكوكي الآمنة
const COOKIE_OPTIONS = {
  httpOnly: true, // لا يمكن قراءتها من JavaScript (حماية من XSS)
  secure: process.env.NODE_ENV === 'production', // HTTPS فقط في الإنتاج
  sameSite: 'lax' as const, // حماية من CSRF
  maxAge: 60 * 60 * 24 * 7, // 7 أيام بالثواني
  path: '/', // متاحة في كل الصفحات
};

// Utility functions for managing cookies in a client-compatible way
export const setCookie = (name: string, value: string, options = COOKIE_OPTIONS) => {
  const cookieString = `${name}=${value}; Path=${options.path}; Max-Age=${options.maxAge}; SameSite=${options.sameSite};`;
  if (options.secure) {
    document.cookie = `${cookieString} Secure;`;
  } else {
    document.cookie = cookieString;
  }
};

export const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split('; ');
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));
  return cookie ? cookie.split('=')[1] : null;
};

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; Max-Age=0;`;
};

/**
 * تعيين cookie في الاستجابة (Response)
 * يستخدم في API routes
 * 
 * @param response - NextResponse object
 * @param token - JWT token الذي سيتم تخزينه
 * @returns NextResponse - نفس الـ response مع الكوكي المضافة
 */
export function setSessionCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);
  return response;
}

/**
 * حذف cookie الجلسة (لـ Logout)
 * يقوم بتعيين قيمة فارغة ووقت انتهاء فوري
 * 
 * @param response - NextResponse object
 * @returns NextResponse - نفس الـ response مع الكوكي المحذوفة
 */
export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0, // انتهاء فوري
  });
  return response;
}

/**
 * قراءة JWT من الكوكي (من NextRequest)
 * يستخدم في API routes و Middleware
 * 
 * @param request - NextRequest object
 * @returns string | undefined - JWT token أو undefined
 */
export function getSessionToken(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value;
}

/**
 * قراءة JWT من الكوكي (من Server Component)
 * يستخدم في Server Components
 * 
 * @returns string | undefined - JWT token أو undefined
 */
// export async function getServerSessionToken(): Promise<string | undefined> {
//   const cookieStore = await cookies();
//   return cookieStore.get(SESSION_COOKIE_NAME)?.value;
// }

/**
 * قراءة JWT من الكوكي (من Client Side)
 * يستخدم في Client Components - لكن لن يعمل بسبب httpOnly
 * هذه الدالة للرجوع للـ API
 * 
 * @returns string | null - JWT token أو null
 */
export function getClientSessionToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // محاولة قراءة الكوكي (لن تنجح مع httpOnly)
  const cookies = document.cookie.split(';');
  const sessionCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${SESSION_COOKIE_NAME}=`)
  );

  if (sessionCookie) {
    return sessionCookie.split('=')[1];
  }

  return null;
}

/**
 * التحقق من وجود session cookie
 * 
 * @param request - NextRequest object
 * @returns boolean - true إذا كانت الكوكي موجودة
 */
export function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies.has(SESSION_COOKIE_NAME);
}

/**
 * إنشاء Response مع session cookie
 * اختصار لإنشاء Response وإضافة الكوكي في خطوة واحدة
 * 
 * @param data - البيانات التي سيتم إرجاعها
 * @param token - JWT token
 * @param status - HTTP status code
 * @returns NextResponse
 */
export function createResponseWithSession(
  data: any,
  token: string,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status });
  return setSessionCookie(response, token);
}

/**
 * إنشاء Response بدون session (Logout)
 * 
 * @param data - البيانات التي سيتم إرجاعها
 * @param status - HTTP status code
 * @returns NextResponse
 */
export function createResponseWithoutSession(
  data: any,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status });
  return clearSessionCookie(response);
}

/**
 * دالة مساعدة لقراءة الـ token من headers
 * تستخدم كـ fallback إذا لم تكن الكوكي متاحة
 * 
 * @param request - NextRequest
 * @returns string | null - token من Authorization header
 */
export function getAuthToken(request?: NextRequest): string | null {
  if (!request) {
    return null;
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

