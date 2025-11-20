"use client";

import { supabase } from "@/lib/subabase";

export default function Page() {
  const testConnection = async () => {
    const { data, error } = await supabase.from("users").select("*").limit(1);

    if (error) {
      console.error(" Supabase error:", error);
    } else {
      console.log(" Supabase connected! Data:", data);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Test Supabase Connection</h1>
      <button onClick={testConnection} style={{ padding: 10, marginTop: 10 }}>
        Test Supabase
      </button>
    </div>
  );
}