// app/(app)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { Post } from "@/entities/user/type/Post";
import { SaveButton } from "@/features/chat";
import { toast } from "sonner";
import React from "react";
import { api } from "@/shared/api/api-client";

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  //  أهم شيء: حالة ربط الفيسبوك
  const [hasFacebook, setHasFacebook] = React.useState<boolean | null>(null);

  //  جلب حالة المستخدم (وربط فيسبوك)
  const fetchUser = async () => {
    try {
      const res = await api.get("facebook/me");

      setHasFacebook(!!res.hasFacebook);
    } catch (err) {
      console.error("fetchUser error:", err);
    }
  };
  //  جلب البوستات
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await api.get("posts");



      setPosts(res.posts || []);
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

  // 🔹 زر نشر على فيسبوك
  const publishToFacebook = async (postId: string) => {
    try {
      setPublishingId(postId);

      const res = await api.post("facebook/publish", {
 postId 
      });


      toast.success(
        `🎉 The post has been published successfully on ${res.platform}!`
      );
      fetchPosts();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Something went wrong!");
      }
    } finally {
      setPublishingId(null);
    }
  };

  // دالة إلغاء الجدولة
  const cancelSchedule = async (postId: string) => {
    try {
       await api.post(`posts/${postId}/cancel-schedule`, {});

      toast.success("The scheduled post has been cancelled successfully.");
      fetchPosts(); // تحديث البوستات
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong!");
    }
  };

  // شاشة التحميل
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

          <div className="flex items-baseline justify-center gap-2">
            <button
              onClick={fetchPosts}
              className="px-3 py-2 text-sm rounded-md border bg-white"
            >
              تحديث
            </button>
            <SaveButton
              message={{
                id: "",
                content: "",
                role: "user", // أو "system" حسب السياق
                createdAt: "", // الوقت الحالي أو أي تاريخ مناسب
              }}
              prompt=""
              buttonText="إنشاء بوست جديد"
            />
          </div>
        </div>

        {/* 🔹 بانر ربط فيسبوك لو الحساب مش مربوط */}
        {!hasFacebook && (
          <div className="bg-white border rounded-lg p-3 text-xs flex items-center justify-between">
            <span>لم تقومي بربط حساب فيسبوك حتى الآن</span>
            <button
              onClick={() =>
                (window.location.href = "/api/oauth/facebook/login")
              }
              className="px-3 py-1 rounded-md border bg-blue-50 text-blue-700"
            >
              ربط حساب فيسبوك
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* قائمة البوستات */}
        {posts.length === 0 ? (
          <p className="text-gray-500 text-sm text-center mt-10">
            لا يوجد بوستات محفوظة
          </p>
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
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : post.status === "scheduled"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {post.status === "published" && "✅"}
                      {post.status === "scheduled" && "⏰"}
                      {post.status === "draft" && "📝"}
                      {post.status === "published"
                        ? "Published"
                        : post.status === "scheduled"
                        ? "Scheduled"
                        : "Draft"}
                    </span>

                    {post.status === "draft" && (
                      <SaveButton
                        message={{
                          id: post.id,
                          content: post.content,
                          role: "user", // أو القيمة المناسبة حسب سياق البوست
                          createdAt: "", // أو post.created_at إذا موجودة في الـ post
                        }}
                        prompt={post.prompt}
                        buttonText="جدولة"
                        postId={post.id}
                      />
                    )}

                    {/* عرض تاريخ الجدولة */}
                    {post.status === "scheduled" && post.scheduled_at && (
                      <>
                        <span className="text-xs text-gray-500">
                          {new Date(post.scheduled_at).toLocaleString("en-GB")}
                        </span>
                        <button
                          onClick={() => cancelSchedule(post.id)}
                          className="text-xs text-red-600 hover:underline ml-2"
                        >
                          إلغاء الجدولة
                        </button>
                      </>
                    )}
                  </div>

                  <div className="space-x-2">
                    {hasFacebook && (
                      <button
                        onClick={() => publishToFacebook(post.id)}
                        disabled={publishingId === post.id}
                        className="px-3 py-1 rounded-md bg-blue-600 text-white text-xs disabled:opacity-50"
                      >
                        {publishingId === post.id
                          ? "Publishing post..."
                          : "Publish to Facebook"}
                      </button>
                    )}
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
