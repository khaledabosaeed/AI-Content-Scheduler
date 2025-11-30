// app/(app)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/entities/user/type/Post";

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/posts", {
        method: "GET",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load posts");
      }

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
  }, []);

  // const handleTweet = async (post: Post) => {
  //   const confirmPublish = window.confirm(
  //     "هل أنت متأكد إن تنشر على تويتر؟"
  //   );
  //   if (!confirmPublish) return;

  //   try {
  //     setPublishingId(post.id);

  //     const res = await fetch("/api/oauth/twitter/post", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         content: post.content, // أهم حاجة
  //         postId: post.id,
  //         platform: post.platform,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok || data.success === false) {
  //       throw new Error(data.error || "فشل في نشر البوست");
  //     }

  //     alert("تم نشر البوست على تويتر بنجاح ✅");
  //   } catch (err: any) {
  //     console.error(err);
  //     alert(`حصل خطأ أثناء النشر: ${err.message || "خطأ غير متوقع"}`);
  //   } finally {
  //     setPublishingId(null);
  //   }
  // };

  async function publishToFacebook(postId: string) {
    try {
      setPublishingId(postId);

      const res = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("خطأ أثناء النشر على الفيسبوك: " + data.error?.message);
        return;
      }

      alert("🎉 تم نشر البوست بنجاح على فيسبوك!");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع.");
    } finally {
      setPublishingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            الداشبورد – البوستات المحفوظة
          </h1>
          <button
            onClick={fetchPosts}
            className="px-3 py-2 text-sm rounded-md border bg-white"
          >
            تحديث
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm">لا يوجد بوستات لحتى الان</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-sm border p-4 space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.platform.toUpperCase()}</span>
                  <span>
                    {new Date(post.createdAt).toLocaleString("en-GB")}
                  </span>
                </div>

                {post.prompt && (
                  <p className="text-xs text-gray-400">
                    <span className="font-semibold">Prompt: </span>
                    {post.prompt}
                  </p>
                )}

                <p className="text-sm whitespace-pre-wrap">{post.content}</p>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded-full border ${
                      post.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-yellow-50 text-yellow-700 border-yellow-200"
                    }`}
                  >
                    {post.status}
                  </span>

                  <div className="space-x-2">
                    <button
                      onClick={() =>
                        (window.location.href = "/api/oauth/facebook/login")
                      }
                    >
                      ربط حساب فيسبوك
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
