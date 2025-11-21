import { NextResponse } from 'next/server';
import { supabaseServer } from '@/shared/libs/supabaseServer';

export async function GET() {
    try {
        // محاولة الاتصال بقاعدة البيانات
        const { data, error } = await supabaseServer
            .from('users')
            .select('count')
            .limit(1);  

        if (error) {
            console.error('خطأ في الاتصال بـ Supabase:', error);
            return NextResponse.json(
                {
                    success: false,
                    message: 'فشل الاتصال بـ Supabase',
                    error: error.message,
                    details: error,
                },
                { status: 500 }
            );
        }
        return NextResponse.json({
            success: true,
            message: 'تم الاتصال بـ Supabase بنجاح! ✅',
            timestamp: new Date().toISOString(),
            connection: {
                url: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ موجود' : '❌ غير موجود',
                anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ موجود' : '❌ غير موجود',
                data,
            },
        });
    } catch (err) {
        console.error('خطأ غير متوقع:', err);
        return NextResponse.json(
            {
                success: false,
                message: 'خطأ في الاتصال',
                error: err instanceof Error ? err.message : 'خطأ غير معروف',
            },
            { status: 500 }
        );
    }
}
