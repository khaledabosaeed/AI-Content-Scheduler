import bcrypt from 'bcrypt';


const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  try {
    // hash
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('Password encryption failed');
  }
}


export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    // compare
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}


export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('The password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('The password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('The password must contain at least one capital letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('The password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('The password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

