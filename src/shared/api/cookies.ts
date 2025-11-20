/**
 * Client-side cookie utilities
 * للاستخدام في Client Components فقط
 */

import { SESSION_COOKIE_NAME } from '../libs/cookies';

/**
 * قراءة token من الكوكي (Client Side)
 * ملاحظة: لن تعمل مع httpOnly cookies
 * هذه للاستخدام مع cookies غير httpOnly فقط
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

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
 * حذف كل الكوكيز (للتنظيف)
 */
export function clearAllCookies(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  }
}

