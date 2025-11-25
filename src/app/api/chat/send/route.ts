import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/shared/libs/auth/auth-middleware';
import { generateContent } from '@/shared/libs/ai/gemini-client';

export async function POST(req: NextRequest) {
  console.log(req)
  return withAuth(req, async (req, user) => {
    try {
      const body = await req.json();
      const { message } = body;

      // التحقق من وجود الرسالة
      if (!message || message.trim() === '') {
        return NextResponse.json(
          { error: 'الرسالة مطلوبة' },
          { status: 400 }
        );
      }
      // إرسال الرسالة للـ AI والحصول على رد
      const aiResponse = await generateContent(message.trim());

      // إرجاع النتيجة مباشرة (بدون حفظ)
      return NextResponse.json({
        success: true,
        message: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Chat API Error:', error);
      return NextResponse.json(
        {
          error: error.message || 'حدث خطأ أثناء المحادثة',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }
  });
}