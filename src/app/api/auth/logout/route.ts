/**
 * Logout API Route
 * مسؤول عن تسجيل خروج المستخدم
 * 
 * الخطوات:
 * 1. استقبال الطلب
 * 2. حذف Cookie الجلسة
 * 3. إرجاع استجابة بنجاح
 * 
 * ملاحظة: الـ JWT نفسه لا يمكن "إلغاؤه" لأنه stateless
 * لكن بحذف الكوكي من المتصفح، لن يستطيع المستخدم استخدامه
 */

import { NextRequest } from "next/server";
import { createResponseWithoutSession } from "@/shared/libs/cookies";

export const POST = async (req: NextRequest) => {
  try {
    // حذف Cookie الجلسة وإرجاع استجابة
    return createResponseWithoutSession(
      { message: "تم تسجيل الخروج بنجاح" },
      200
    );
  } catch (error) {
    console.error('Logout error:', error);
    return createResponseWithoutSession(
      { error: "حدث خطأ أثناء تسجيل الخروج" },
      500
    );
  }
}; 