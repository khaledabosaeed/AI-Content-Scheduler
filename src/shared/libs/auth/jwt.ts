/**
 * JWT (JSON Web Token) Library
 * يوفر وظائف إنشاء والتحقق من JWT tokens
 * JWT = الهوية التي تثبت أن المستخدم مسجل دخول
 */

import jwt from 'jsonwebtoken';

// المفتاح السري لتوقيع JWT - يجب أن يكون قوي ومخزن في .env
const JWT_SECRET = process.env.JWT_SECRET || 'fjsaofjaso(*&*^fnsdiofn2654a#$2f84we89r425s34243&^';

// مدة صلاحية التوكن (7 أيام)
const JWT_EXPIRATION = '7d';

/**
 * Payload الذي يتم تضمينه في JWT
 */
export interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  iat?: number; // issued at - وقت الإنشاء (تضاف تلقائيًا)
  exp?: number; // expiration - وقت الانتهاء (تضاف تلقائيًا)
}

/**
 * إنشاء JWT token جديد
 * يقوم بـ:
 * 1. إنشاء Payload يحتوي على بيانات المستخدم
 * 2. توقيع JWT باستخدام secret key
 * 3. إضافة وقت الانتهاء
 * 
 * @param payload - البيانات التي تريد تضمينها في التوكن
 * @returns string - JWT token موقّع
 */
export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  try {
    // jwt.sign تقوم بإنشاء وتوقيع التوكن
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    return token;
  } catch (error) {
    console.error('Error creating JWT token:', error);
    throw new Error('فشل في إنشاء token');
  }
}

/**
 * التحقق من صحة JWT token وفك تشفيره
 * يقوم بـ:
 * 1. التحقق من التوقيع (signature verification)
 * 2. التحقق من عدم انتهاء صلاحيته
 * 3. إرجاع البيانات المخزنة بداخله
 * 
 * @param token - JWT token المراد التحقق منه
 * @returns JWTPayload | null - البيانات المخزنة أو null إذا كان غير صالح
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    // jwt.verify تقوم بالتحقق من التوكن وإرجاع البيانات
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log('JWT token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log('Invalid JWT token');
    } else {
      console.error('Error verifying JWT token:', error);
    }
    return null;
  }
}

/**
 * فك تشفير JWT بدون التحقق (غير آمن - للاستخدام الداخلي فقط)
 * مفيد لقراءة البيانات بدون التحقق من الصلاحية
 * 
 * @param token - JWT token
 * @returns JWTPayload | null
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

/**
 * التحقق من انتهاء صلاحية التوكن
 * 
 * @param token - JWT token
 * @returns boolean - true إذا كان منتهي الصلاحية
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp يكون بالثواني، Date.now() بالميلي ثانية
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * تجديد التوكن إذا كان قريبًا من الانتهاء
 * يقوم بإنشاء token جديد بنفس البيانات
 * 
 * @param token - JWT token الحالي
 * @returns string | null - token جديد أو null إذا كان التوكن غير صالح
 */
export function refreshToken(token: string): string | null {
  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  // إزالة الحقول التي تضاف تلقائيًا
  const { iat, exp, ...payload } = decoded;

  // إنشاء token جديد بنفس البيانات
  return createToken(payload);
}

