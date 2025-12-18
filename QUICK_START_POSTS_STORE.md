# ⚡ Quick Start - Posts Store

## 🚀 البدء السريع في 3 دقائق

### 1️⃣ Import الـ Store

```tsx
import { usePostsStore, postsSelectors } from "@/entities/posts";
```

### 2️⃣ استخدام في Component

```tsx
function MyComponent() {
  // Get posts
  const posts = usePostsStore(postsSelectors.posts);

  // Get actions
  const deletePost = usePostsStore((state) => state.deletePost);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          {post.content}
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

### 3️⃣ استخدام الـ Loader (اختياري)

```tsx
import { PostsLoader } from "@/features/posts";

function PostsPage() {
  return (
    <PostsLoader>
      <MyComponent />
    </PostsLoader>
  );
}
```

---

## 📖 الأمثلة الشائعة

### ✅ جلب Posts

```tsx
import { useFetchPosts } from "@/features/posts";

function MyPage() {
  const { isFetching, error, refetch } = useFetchPosts();

  if (isFetching) return <Spinner />;
  if (error) return <Error error={error} onRetry={refetch} />;

  return <PostsList />;
}
```

### ✅ حذف Post

```tsx
import { usePostsStore } from "@/entities/posts";

function DeleteButton({ postId }) {
  const deletePost = usePostsStore((state) => state.deletePost);
  const isDeleting = usePostsStore((state) => state.deletingId === postId);

  return (
    <button onClick={() => deletePost(postId)} disabled={isDeleting}>
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
```

### ✅ النشر على Facebook

```tsx
import { usePostsStore } from "@/entities/posts";

function PublishButton({ postId }) {
  const publishToFacebook = usePostsStore((state) => state.publishToFacebook);
  const isPublishing = usePostsStore((state) => state.publishingId === postId);
  const hasFacebook = usePostsStore((state) => state.hasFacebook);

  if (!hasFacebook) return <ConnectFacebookButton />;

  return (
    <button onClick={() => publishToFacebook(postId)} disabled={isPublishing}>
      {isPublishing ? "Publishing..." : "Publish"}
    </button>
  );
}
```

### ✅ جدولة Post

```tsx
import { usePostsStore } from "@/entities/posts";

function ScheduleButton({ post }) {
  const openScheduleModal = usePostsStore((state) => state.openScheduleModal);

  return (
    <button onClick={() => openScheduleModal(post)}>
      Schedule
    </button>
  );
}
```

---

## 🎯 All Available Actions

```tsx
const actions = usePostsStore((state) => ({
  // Data
  fetchPosts: state.fetchPosts,
  addPost: state.addPost,
  updatePost: state.updatePost,
  deletePost: state.deletePost,

  // Facebook
  publishToFacebook: state.publishToFacebook,
  fetchFacebookStatus: state.fetchFacebookStatus,

  // Schedule
  openScheduleModal: state.openScheduleModal,
  closeScheduleModal: state.closeScheduleModal,
  cancelSchedule: state.cancelSchedule,

  // Utility
  setError: state.setError,
  clearError: state.clearError,
  reset: state.reset,
}));
```

---

## 🎨 All Available Selectors

```tsx
import { usePostsStore, postsSelectors } from "@/entities/posts";

// Data
const posts = usePostsStore(postsSelectors.posts);
const postsCount = usePostsStore(postsSelectors.postsCount);

// Loading
const isFetching = usePostsStore(postsSelectors.isFetching);
const isPublishing = usePostsStore(postsSelectors.isPublishing(postId));
const isDeleting = usePostsStore(postsSelectors.isDeleting(postId));

// Facebook
const hasFacebook = usePostsStore(postsSelectors.hasFacebook);

// Schedule Modal
const { isOpen, initialContent } = usePostsStore(postsSelectors.scheduleModal);

// Error
const error = usePostsStore(postsSelectors.error);

// All actions
const actions = usePostsStore(postsSelectors.actions);
```

---

## 💡 Pro Tips

### ✅ استخدم Selectors دائماً
```tsx
// ❌ Bad - subscribes to everything
const { posts } = usePostsStore();

// ✅ Good - subscribes only to posts
const posts = usePostsStore((state) => state.posts);

// ⭐ Best - use predefined selector
const posts = usePostsStore(postsSelectors.posts);
```

### ✅ Custom Selectors
```tsx
// Create your own selector
const usePost = (postId: string) => {
  return usePostsStore((state) =>
    state.posts.find((p) => p.id === postId)
  );
};

// Use it
const post = usePost("post-123");
```

### ✅ استخدام خارج React
```tsx
// في utility function أو event handler
import { usePostsStore } from "@/entities/posts";

async function handleBulkDelete(postIds: string[]) {
  const deletePost = usePostsStore.getState().deletePost;

  for (const id of postIds) {
    await deletePost(id);
  }
}
```

---

## 📚 المزيد من الأمثلة

راجع:
- [README.md](src/entities/posts/README.md) - توثيق كامل
- [EXAMPLES.md](src/entities/posts/EXAMPLES.md) - أمثلة متقدمة
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - دليل الانتقال من Context API

---

## 🎓 الفرق الرئيسي عن Context API

```tsx
// ❌ Before (Context API - 2 hooks)
import { usePostsContext } from "@/app/_providers/PostContext";
import { usePostsUI } from "@/app/_providers/PostsUIContext";

const { posts } = usePostsContext();
const { onDelete } = usePostsUI();

// ✅ After (Zustand - 1 hook)
import { usePostsStore } from "@/entities/posts";

const posts = usePostsStore((state) => state.posts);
const deletePost = usePostsStore((state) => state.deletePost);
```

**الميزة:** أقل boilerplate، أفضل performance! 🚀

---

## ✨ Features

- ✅ **TypeScript**: Type-safe بالكامل
- ✅ **Optimistic Updates**: للـ delete مع automatic rollback
- ✅ **Persistence**: hasFacebook status في localStorage
- ✅ **No Provider needed**: استخدم في أي مكان
- ✅ **Performance**: No unnecessary re-renders
- ✅ **DevTools**: Zustand DevTools support

---

**Happy Coding! 🎉**
