

import { NextRequest, NextResponse } from 'next/server';

export const SESSION_COOKIE_NAME = 'session';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7,
  path: '/',
};

export function setSessionCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, token, COOKIE_OPTIONS);
  return response;
}


export function clearSessionCookie(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...COOKIE_OPTIONS,
    maxAge: 0, // انتهاء فوري
  });
  return response;
}


export function getSessionToken(request: NextRequest): string | undefined {
  return request.cookies.get(SESSION_COOKIE_NAME)?.value;
}




export function hasSessionCookie(request: NextRequest): boolean {
  return request.cookies.has(SESSION_COOKIE_NAME);
}

export function createResponseWithSession(
  data: any,
  token: string,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status });
  return setSessionCookie(response, token);
}


export function createResponseWithoutSession(
  data: any,
  status: number = 200
): NextResponse {
  const response = NextResponse.json(data, { status });
  return clearSessionCookie(response);
}


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

