/**
 * Next.js Middleware للتحقق من المصادقة وحماية الصفحات
 * يعمل على كل طلب قبل الوصول للصفحة
 * 
 * Protected Routes = الصفحات التي تحتاج تسجيل دخول
 * Public Routes = الصفحات المتاحة للجميع
 * Auth Routes = صفحات تسجيل الدخول/التسجيل (لا يجب الوصول لها إذا كنت مسجل دخول)
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkAuth } from "./src/shared/libs/auth-middleware";

// الصفحات المحمية (تحتاج تسجيل دخول)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/posts',
  // أضف المزيد من الصفحات المحمية هنا
];

// صفحات المصادقة (login/register)
const AUTH_ROUTES = [
  '/login',
  '/register',
  '/auth/login',
  '/auth/register',
];

// الصفحات العامة (متاحة للجميع)
const PUBLIC_ROUTES = [
  '/',
  '/landingPage',
  '/about',
  '/contact',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/logout',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // السماح بالوصول لملفات static و API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // ملفات مثل favicon.ico
  ) {
    return NextResponse.next();
  }

  // التحقق من حالة المصادقة
  const { isAuthenticated } = checkAuth(request);

  // إذا كانت الصفحة محمية ولم يكن المستخدم مسجل دخول
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    // إعادة التوجيه لصفحة تسجيل الدخول
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // حفظ الصفحة المطلوبة
    return NextResponse.redirect(loginUrl);
  }

  // إذا كان المستخدم مسجل دخول ويحاول الوصول لصفحات المصادقة
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isAuthRoute && isAuthenticated) {
    // إعادة التوجيه للصفحة الرئيسية
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // السماح بالمرور
  return NextResponse.next();
}

// تحديد المسارات التي سيعمل عليها الـ Middleware
export const config = {
  matcher: [
    /*
     * تطبيق على كل المسارات ما عدا:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};