
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || 'fjsaofjaso(*&*^fnsdiofn2654a#$2f84we89r425s34243&^';
const JWT_EXPIRATION = '7d';


export interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}


export function createToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });
    return token;
  } catch (error) {
    console.error('Error creating JWT token:', error);
    throw new Error('فشل في إنشاء token');
  }
}


export function verifyToken(token: string): JWTPayload | null {
  try {
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


// export function decodeToken(token: string): JWTPayload | null {
//   try {
//     const decoded = jwt.decode(token) as JWTPayload;
//     return decoded;
//   } catch (error) {
//     console.error('Error decoding JWT token:', error);
//     return null;
//   }
// }


// export function isTokenExpired(token: string): boolean {
//   const decoded = decodeToken(token);
//   if (!decoded || !decoded.exp) {
//     return true;
//   }

//   const currentTime = Math.floor(Date.now() / 1000);
//   return decoded.exp < currentTime;
// }

export function refreshToken(token: string): string | null {
  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  const { iat, exp, ...payload } = decoded;

  return createToken(payload);
}

