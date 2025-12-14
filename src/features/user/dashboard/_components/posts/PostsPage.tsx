"use client";

import { useEffect, useMemo, useState } from "react";
import type { Post } from "@/entities/user/type/Post";
import Link from "next/link";

import { Button } from "@/shared/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { PostsTable } from "./PostsTable";
import ScheduleModal from "@/widgets/scheduler/ScheduleModal";
import { PostsTabs } from "../PostsTabs";

type StatusFilter = "all" | "draft" | "scheduled" | "published" | "failed";

const safeJson = async (res: Response) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [hasFacebook, setHasFacebook] = useState(false);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isScheduling, setIsScheduling] = useState(false);

  // ===== Fetch Facebook connection =====
  const fetchUser = async () => {
    try {
      const res = await fetch("/api/facebook/me");
      if (!res.ok) return;
      const data = await safeJson(res);
      setHasFacebook(!!data.hasFacebook);
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Fetch Posts =====
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/posts");
      const data = await safeJson(res);

      if (!res.ok)
        throw new Error(data?.error || data?.raw || "Failed to load posts");

      setPosts(Array.isArray(data.posts) ? data.posts : []);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUser();
  }, []);

  // ===== Publish =====
  const publishToFacebook = async (postId: string) => {
    try {
      setPublishingId(postId);

      const res = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });

      const data = await safeJson(res);

      if (!res.ok || data?.success === false) {
        alert(
          "خطأ أثناء النشر على الفيسبوك: " +
            (data?.error?.message || data?.error || data?.raw || "")
        );
        return;
      }

      // ✅ update locally immediately (status + published_at)
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? ({
                ...p,
                status: "published" as any,
                published_at: new Date().toISOString() as any,
                scheduled_at: null as any,
              } as any)
            : p
        )
      );

      alert("🎉 تم نشر البوست بنجاح على فيسبوك!");
      await fetchPosts(); // تأكيد من السيرفر
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع.");
    } finally {
      setPublishingId(null);
    }
  };

  // ===== Cancel schedule =====
  const cancelSchedule = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/cancel-schedule`, {
        method: "POST",
      });
      const data = await safeJson(res);

      if (!res.ok)
        throw new Error(data?.error || data?.raw || "فشل إلغاء الجدولة");

      // ✅ update locally immediately
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? ({
                ...p,
                status: "draft" as any,
                scheduled_at: null as any,
              } as any)
            : p
        )
      );

      alert("تم إلغاء الجدولة بنجاح");
      await fetchPosts();
    } catch (err: any) {
      alert("❌ " + (err?.message || "فشل إلغاء الجدولة"));
    }
  };

  // ===== Open schedule modal =====
  const openScheduleModal = (post: Post) => {
    setSelectedPost(post);
    setIsScheduleOpen(true);
  };

  // ===== Confirm schedule (رجعناه من الفايل الأول) =====
  const confirmSchedule = async (
    date: Date,
    platform: string,
    content: string
  ) => {
    if (!selectedPost?.id) return;

    try {
      setIsScheduling(true);

      const res = await fetch(`/api/posts/${selectedPost.id}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: date.toISOString(),
          platform,
          content,
          status: "scheduled",
        }),
      });

      const data = await safeJson(res);

      if (!res.ok)
        throw new Error(data?.error || data?.raw || "Failed to schedule post");

      // ✅ update locally immediately
      setPosts((prev) =>
        prev.map((p) =>
          p.id === selectedPost.id
            ? ({
                ...p,
                status: "scheduled" as any,
                platform: platform as any,
                content: content as any,
                scheduled_at: date.toISOString() as any,
              } as any)
            : p
        )
      );

      setIsScheduleOpen(false);
      setSelectedPost(null);

      alert("✅ Scheduled successfully");
      await fetchPosts();
    } catch (err: any) {
      alert("❌ " + (err?.message || "Schedule failed"));
    } finally {
      setIsScheduling(false);
    }
  };

  // ===== Normalize keys + lowercase status/platform =====
  const normalizedPosts = useMemo(() => {
    return (posts as any[]).map((p) => ({
      ...p,
      created_at: p.created_at ?? p.createdAt ?? null,
      scheduled_at: p.scheduled_at ?? p.scheduledAt ?? null,
      status: (p.status ?? "draft").toString().toLowerCase(),
      platform: (p.platform ?? "twitter").toString().toLowerCase(),
    }));
  }, [posts]);

  // ===== Filtering (tabs + search) =====
  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();

    return normalizedPosts.filter((p: any) => {
      const matchStatus = status === "all" ? true : p.status === status;

      const matchQuery =
        !q ||
        (p.content || "").toLowerCase().includes(q) ||
        (p.platform || "").toLowerCase().includes(q);

      return matchStatus && matchQuery;
    });
  }, [normalizedPosts, status, query]);

  return (
    <div className="space-y-6">
      {!hasFacebook && (
        <div className="rounded-md border bg-card p-3 text-sm flex justify-between">
          <span className="text-muted-foreground">
            Your Facebook account is not connected.
          </span>
          <Button asChild variant="outline">
            <a href="/api/oauth/facebook/login">Connect</a>
          </Button>
        </div>
      )}

      {error && (
        <div className="rounded-md border p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <PostsTabs
        posts={posts}
        setPosts={setPosts}
        onSchedule={(post) => {
          // افتحي المودال تبعك
          setSelectedPost(post);
          setIsScheduleOpen(true);
        }}
        onPublish={(postId) => publishToFacebook(postId)}
        onCancelSchedule={(postId) => cancelSchedule(postId)}
      />

      {isScheduleOpen && selectedPost && (
        <ScheduleModal
          open={isScheduleOpen}
          onOpenChange={(v) => {
            setIsScheduleOpen(v);
            if (!v) setSelectedPost(null);
          }}
          initialContent={selectedPost.content || ""}
          onConfirm={(date, platform, content) =>
            confirmSchedule(date, platform, content)
          }
          // لو المودال بيدعم loading:
          isLoading={isScheduling}
        />
      )}
    </div>
  );
}
