import { cookies } from "next/headers";
import { verifyToken } from "../libs/auth/jwt";
import { supabaseServer } from "../libs/suapabase/supabaseServer";

/**
 * جلب بيانات المستخدم من Server Component
 * ✅ يستخدم cookies() مباشرة بدون HTTP request
 * ✅ أسرع وأكثر أماناً من fetch
 */
export const getUserServer = async () => {
    try {
        // 1. قراءة الـ cookie مباشرة من next/headers
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("session");
        
        // console.log("🍪 Cookie value:", sessionCookie?.value ? "Found" : "Not found");
        
        if (!sessionCookie?.value) {
            // console.log("⚠️ No session cookie found");
            return null;
        }

        // 2. التحقق من صحة الـ token
        const payload = await verifyToken(sessionCookie.value);
        
        if (!payload) {
            // console.log("⚠️ Invalid or expired token");
            return null;
        }

        // 3. جلب بيانات المستخدم من قاعدة البيانات مباشرة
        const { data: user, error: dbError } = await supabaseServer
            .from("users")
            .select("id, email, name, created_at")
            .eq("id", payload.userId)
            .single();

        if (dbError || !user) {
            console.error("❌ Failed to fetch user from DB:", dbError);
            return null;
        }

        console.log("✅ User fetched successfully:", user.email);
        
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.created_at,
            },
        };
    } catch (error) {
        console.error("❌ Failed to fetch user data on server:", error);
        return null;
    }
}