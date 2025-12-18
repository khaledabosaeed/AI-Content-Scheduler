import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("MY_SUPABASE_URL")!,
  Deno.env.get("MY_SUPABASE_KEY")!
);


const NEXT_PUBLIC_URL = Deno.env.get("NEXT_PUBLIC_URL") || "http://localhost:3000";
const PUBLISH_SECRET = Deno.env.get("PUBLISH_SECRET")!;

Deno.serve(async (req) => {
  try {
       const secret = req.headers.get("x-publish-secret");
    if (secret !== PUBLISH_SECRET) {
      return new Response("Unauthorized", { status: 401 });
    }

    const res = await fetch(`${NEXT_PUBLIC_URL}/api/facebook/publish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publish-secret": PUBLISH_SECRET,
      },
      body: JSON.stringify({}), // لا body مهم، فقط لتفعيل endpoint
    });

    const data = await res.json();
        return new Response(JSON.stringify({ success: true, data }), {
      status: res.ok ? 200 : 500,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err: any) {
    console.error("Error calling publish API:", err);
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }  
}
);

