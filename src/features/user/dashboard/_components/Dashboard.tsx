"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/entities/user/type/Post";

import { StatsCards } from "./StatsCards";
import { PostsTabs } from "./PostsTabs";
import { UpcomingQueue } from "./UpcomingQueue";
import { AlertsPanel } from "./AlertsPanel";

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [hasFacebook, setHasFacebook] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/facebook/me");
      if (!res.ok) return;
      const data = await res.json();
      setHasFacebook(!!data.hasFacebook);
    } catch (err) {
      console.error("fetchUser error:", err);
    }
  };

  // ✅ نفس fetchPosts تبعك
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/posts");
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load posts");
      setPosts(data.posts || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);
  const publishToFacebook = async (postId: string) => {
    try {
      setPublishingId(postId);

      console.log("➡️ calling /api/facebook/publish", postId);

      const res = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      console.log("⬅️ publish response status:", res.status);

      const data = await res.json();
      console.log("⬅️ publish response json:", data);

      if (!res.ok || data.success === false) {
        throw new Error(
          data?.error?.message || data?.error || "Publish failed"
        );
      }

      await fetchPosts();
    } finally {
      setPublishingId(null);
    }
  };

  const cancelSchedule = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/cancel-schedule`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to cancel schedule");

      alert("Schedule cancelled");
      fetchPosts();
    } catch (err: any) {
      alert("❌ " + err.message);
    }
  };

  const normalizedPosts = useMemo(() => {
    return (posts as any[]).map((p) => ({
      ...p,
      created_at: p.created_at ?? p.createdAt ?? null,
      scheduled_at: p.scheduled_at ?? p.scheduledAt ?? null,
    }));
  }, [posts]);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md border p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Row 1 */}
      <StatsCards posts={normalizedPosts as any} />

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <PostsTabs
            posts={normalizedPosts as any}
            hasFacebook={hasFacebook}
            publishingId={publishingId}
            onPublish={(postId) => publishToFacebook(postId)}
            onCancelSchedule={cancelSchedule}
            onRefresh={fetchPosts}
            onDelete={() => {}}
          />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <UpcomingQueue posts={normalizedPosts as any} />
          <AlertsPanel posts={normalizedPosts as any} />
        </div>
      </div>
    </div>
  );
}

// const [posts, setPosts] = useState<Post[]>([]);
// const [isLoading, setIsLoading] = useState(true);
// const [error, setError] = useState<string | null>(null);
// const [publishingId, setPublishingId] = useState<string | null>(null);

// //  أهم شيء: حالة ربط الفيسبوك
// const [hasFacebook, setHasFacebook] = useState(false);

// //  جلب حالة المستخدم (وربط فيسبوك)
// const fetchUser = async () => {
//   try {
//     const res = await fetch("/api/facebook/me");
//     if (!res.ok) return;
//     const data = await res.json();
//     setHasFacebook(!!data.hasFacebook);
//   } catch (err) {
//     console.error("fetchUser error:", err);
//   }
// };
// //  جلب البوستات
// const fetchPosts = async () => {
//   try {
//     setIsLoading(true);
//     setError(null);

//     const res = await fetch("/api/posts");
//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error || "Failed to load posts");
//     }

//     setPosts(data.posts || []);
//   } catch (err: any) {
//     console.error(err);
//     setError(err.message || "Unexpected error");
//   } finally {
//     setIsLoading(false);
//   }
// };

// useEffect(() => {
//   fetchPosts();
//   fetchUser();
// }, []);

// // 🔹 زر نشر على فيسبوك
// const publishToFacebook = async (postId: string) => {
//   try {
//     setPublishingId(postId);

//     const res = await fetch("/api/facebook/publish", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ postId }),
//     });

//     const data = await res.json();

//     if (!res.ok || data.success === false) {
//       alert("خطأ أثناء النشر على الفيسبوك: " + (data.error?.message || ""));
//       return;
//     }

//     alert("🎉 تم نشر البوست بنجاح على فيسبوك!");
//     fetchPosts();
//   } catch (err) {
//     console.error(err);
//     alert("حدث خطأ غير متوقع.");
//   } finally {
//     setPublishingId(null);
//   }
// };

// // دالة إلغاء الجدولة
// const cancelSchedule = async (postId: string) => {
//   console.log("Cancelling schedule for postId:", postId);
//   try {
//     const res = await fetch(`/api/posts/${postId}/cancel-schedule`, {
//       method: "POST",
//     });
//     const data = await res.json();

//     if (!res.ok) throw new Error(data.error || "فشل إلغاء الجدولة");

//     alert("تم إلغاء الجدولة بنجاح");
//     fetchPosts(); // تحديث البوستات
//   } catch (err: any) {
//     alert("❌ " + err.message);
//   }
// };

// // شاشة التحميل
// if (isLoading) {
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
//     </div>
//   );
// }

// return (
//   <div className="min-h-screen bg-gray-50 p-6 text-black">
//     <div className="max-w-4xl mx-auto space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl font-semibold">
//           الداشبورد – البوستات المحفوظة
//         </h1>

//         <button
//           onClick={fetchPosts}
//           className="px-3 py-2 text-sm rounded-md border bg-white"
//         >
//           تحديث
//         </button>
//       </div>

//       {/* 🔹 بانر ربط فيسبوك لو الحساب مش مربوط */}
//       {!hasFacebook && (
//         <div className="bg-white border rounded-lg p-3 text-xs flex items-center justify-between">
//           <span>لم تقومي بربط حساب فيسبوك حتى الآن</span>
//           <button
//             onClick={() =>
//               (window.location.href = "/api/oauth/facebook/login")
//             }
//             className="px-3 py-1 rounded-md border bg-blue-50 text-blue-700"
//           >
//             ربط حساب فيسبوك
//           </button>
//         </div>
//       )}

//       {error && <p className="text-sm text-red-500">{error}</p>}

//       {/* قائمة البوستات */}
//       {posts.length === 0 ? (
//         <p className="text-gray-500 text-sm text-center mt-10">
//           لا يوجد بوستات محفوظة
//         </p>
//       ) : (
//         <div className="space-y-4">
//           {posts.map((post) => (
//             <div
//               key={post.id}
//               className="bg-white rounded-xl shadow-sm border p-4 space-y-2"
//             >
//               <div className="flex items-center justify-between text-xs text-gray-500">
//                 <span>{post.platform.toUpperCase()}</span>
//                 <span>
//                   {new Date(post.createdAt).toLocaleString("en-GB")}
//                 </span>
//               </div>

//               {post.prompt && (
//                 <p className="text-xs text-gray-400">
//                   <span className="font-semibold">Prompt: </span>
//                   {post.prompt}
//                 </p>
//               )}

//               <p className="text-sm whitespace-pre-wrap">{post.content}</p>

//               <div className="flex items-center justify-between pt-2 text-xs">
//                 <div className="flex items-center gap-2">
//                   <span
//                     className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
//                       post.status === "published"
//                         ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                         : post.status === "scheduled"
//                         ? "bg-indigo-50 text-indigo-700 border-indigo-200"
//                         : "bg-yellow-50 text-yellow-700 border-yellow-200"
//                     }`}
//                   >
//                     {post.status === "published" && "✅"}
//                     {post.status === "scheduled" && "⏰"}
//                     {post.status === "draft" && "📝"}
//                     {post.status === "published"
//                       ? "Published"
//                       : post.status === "scheduled"
//                       ? "Scheduled"
//                       : "Draft"}
//                   </span>

//                   {post.status === "draft" && (
//                     <SaveButton
//                       message={{ id: post.id, content: post.content }}
//                       prompt={post.prompt}
//                       buttonText="جدولة" // يظهر نص "جدولة"
//                     />
//                   )}

//                   {/* عرض تاريخ الجدولة */}
//                   {post.status === "scheduled" && post.scheduled_at && (
//                     <>
//                       <span className="text-xs text-gray-500">
//                         {new Date(post.scheduled_at).toLocaleString("en-GB")}
//                       </span>
//                       <button
//                         onClick={() => cancelSchedule(post.id)}
//                         className="text-xs text-red-600 hover:underline ml-2"
//                       >
//                         إلغاء الجدولة
//                       </button>
//                     </>
//                   )}
//                 </div>

//                 <div className="space-x-2">
//                   {/* 🔹 زر نشر على فيسبوك يظهر فقط لو الحساب مربوط */}
//                   {hasFacebook && (
//                     <button
//                       onClick={() => publishToFacebook(post.id)}
//                       disabled={publishingId === post.id}
//                       className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs disabled:opacity-50"
//                     >
//                       {publishingId === post.id
//                         ? "جاري النشر..."
//                         : "نشر على فيسبوك"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   </div>
// );
