/**
 * Password Hashing Library using bcrypt
 * يوفر وظائف تشفير والتحقق من كلمات المرور
 */

import bcrypt from 'bcrypt';

// عدد الـ rounds للـ salt - كلما زاد الرقم كلما كان أكثر أمانًا (وأبطأ)
const SALT_ROUNDS = 12;

/**
 * تشفير كلمة المرور باستخدام bcrypt
 * bcrypt يقوم تلقائيًا بـ:
 * 1. إنشاء Salt عشوائي
 * 2. دمج Salt مع كلمة المرور
 * 3. تطبيق خوارزمية Hash
 * 4. إرجاع string يحتوي (نوع الخوارزمية + salt + hash)
 * 
 * @param password - كلمة المرور الأصلية (plain text)
 * @returns Promise<string> - الهاش المشفر (يحتوي على salt داخله)
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    // bcrypt.hash تقوم بإنشاء salt تلقائيًا وتشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw new Error('فشل في تشفير كلمة المرور');
  }
}

/**
 * التحقق من كلمة المرور مع الهاش المخزن
 * bcrypt يقوم بـ:
 * 1. استخراج salt من الهاش المخزن
 * 2. تطبيق نفس العملية على كلمة المرور المدخلة
 * 3. مقارنة النتيجتين
 * 
 * @param password - كلمة المرور المدخلة من المستخدم
 * @param hashedPassword - الهاش المخزن في قاعدة البيانات
 * @returns Promise<boolean> - true إذا كانت كلمة المرور صحيحة
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    // bcrypt.compare تقوم بمقارنة كلمة المرور مع الهاش بشكل آمن
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

/**
 * التحقق من قوة كلمة المرور
 * يتحقق من:
 * - الطول (على الأقل 8 أحرف)
 * - وجود حروف كبيرة وصغيرة
 * - وجود أرقام
 * - وجود رموز خاصة
 * 
 * @param password - كلمة المرور المراد فحصها
 * @returns object - نتيجة الفحص مع التفاصيل
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون على الأقل 8 أحرف');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

