import { SignJWT, errors, jwtVerify } from "jose";


const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const JWT_EXPIRATION = '7d';


export interface JWTPayload {
  userId: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}
export async function createToken(payload: any) {
  try{
      return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(SECRET);
  }catch (error) {
    console.error('Error creating JWT token:', error);
    throw new Error('Failed token creation');
  }

}


export async function verifyToken(token: string):Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch (error: any) {
    if (error instanceof errors.JWTExpired) {
    } else if (error instanceof errors.JWTInvalid) {
    } else {
      console.error("❌ Error verifying JWT token:", error);
    }
    return null;
  }
}



export async function refreshToken(token: string): Promise<string | null> {
  const decoded = await verifyToken(token);
  if (!decoded) {
    return null;
  }

  const { iat, exp, ...payload } = decoded;

  return createToken(payload);
}

