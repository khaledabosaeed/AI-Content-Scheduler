# 🔄 دليل الانتقال من Context API إلى Zustand Store

## 📋 جدول المحتويات
- [المقارنة السريعة](#-المقارنة-السريعة)
- [أمثلة التحويل](#-أمثلة-التحويل)
- [الفوائد](#-الفوائد)
- [خطة الانتقال التدريجي](#-خطة-الانتقال-التدريجي)

---

## 🆚 المقارنة السريعة

### Context API (القديم) ❌

```tsx
// في الـ component
import { usePostsContext } from "@/app/_providers/PostContext";
import { usePostsUI } from "@/app/_providers/PostsUIContext";

function MyComponent() {
  const { posts, setPosts } = usePostsContext();
  const {
    hasFacebook,
    publishingId,
    deletingId,
    onPublish,
    onCancelSchedule,
    onDelete,
    refreshPosts,
    onSchedule,
  } = usePostsUI();

  // ...
}
```

**المشاكل:**
- ❌ **2 hooks منفصلة** - تعقيد غير ضروري
- ❌ **Re-renders كثيرة** - كل component بيعمل re-render لأي تغيير في الـ context
- ❌ **مافيش persistence** - hasFacebook في localStorage يدوياً
- ❌ **3 ملفات منفصلة** - PostContext, PostsUIContext, PostsProviders
- ❌ **Testing صعب** - لازم wrapper للـ providers

### Zustand Store (الجديد) ✅

```tsx
// في الـ component
import { usePostsStore, postsSelectors } from "@/entities/posts";

function MyComponent() {
  // ✅ Subscribe فقط للـ state المطلوب
  const posts = usePostsStore(postsSelectors.posts);
  const hasFacebook = usePostsStore(postsSelectors.hasFacebook);
  const actions = usePostsStore(postsSelectors.actions);

  // ...
}
```

**المميزات:**
- ✅ **Hook واحد** - simple & clean
- ✅ **No unnecessary re-renders** - selective subscriptions
- ✅ **Persistence built-in** - مع zustand/middleware
- ✅ **ملف واحد** - posts-store.ts
- ✅ **Testing سهل** - no wrapper needed
- ✅ **TypeScript type-safe** - كامل
- ✅ **DevTools support** - للـ debugging

---

## 🔄 أمثلة التحويل

### مثال 1: عرض قائمة Posts

#### Before (Context API)
```tsx
import { usePostsContext } from "@/app/_providers/PostContext";
import { usePostsUI } from "@/app/_providers/PostsUIContext";

function PostsList() {
  const { posts } = usePostsContext(); // ❌ re-renders لأي تغيير في context
  const { refreshPosts } = usePostsUI(); // ❌ re-renders لأي تغيير في UI context

  return (
    <div>
      <button onClick={refreshPosts}>Refresh</button>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

#### After (Zustand Store)
```tsx
import { usePostsStore, postsSelectors } from "@/entities/posts";

function PostsList() {
  const posts = usePostsStore(postsSelectors.posts); // ✅ re-renders فقط لما posts تتغير
  const fetchPosts = usePostsStore((state) => state.fetchPosts); // ✅ stable reference

  return (
    <div>
      <button onClick={fetchPosts}>Refresh</button>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

---

### مثال 2: حذف Post

#### Before (Context API)
```tsx
import { usePostsUI } from "@/app/_providers/PostsUIContext";

function DeleteButton({ postId }: { postId: string }) {
  const { onDelete, deletingId } = usePostsUI(); // ❌ re-renders لأي UI change

  return (
    <button
      onClick={() => onDelete?.(postId)}
      disabled={deletingId === postId}
    >
      {deletingId === postId ? "Deleting..." : "Delete"}
    </button>
  );
}
```

#### After (Zustand Store)
```tsx
import { usePostsStore, postsSelectors } from "@/entities/posts";

function DeleteButton({ postId }: { postId: string }) {
  const deletePost = usePostsStore((state) => state.deletePost);
  const isDeleting = usePostsStore(postsSelectors.isDeleting(postId)); // ✅ selector محدد

  return (
    <button
      onClick={() => deletePost(postId)}
      disabled={isDeleting}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
```

---

### مثال 3: النشر على Facebook

#### Before (Context API)
```tsx
import { usePostsUI } from "@/app/_providers/PostsUIContext";

function PublishButton({ postId }: { postId: string }) {
  const {
    hasFacebook,
    publishingId,
    onPublish,
  } = usePostsUI(); // ❌ re-renders لكل تغيير

  if (!hasFacebook) return null;

  return (
    <button
      onClick={() => onPublish?.(postId)}
      disabled={publishingId === postId}
    >
      {publishingId === postId ? "Publishing..." : "Publish"}
    </button>
  );
}
```

#### After (Zustand Store)
```tsx
import { usePostsStore, postsSelectors } from "@/entities/posts";

function PublishButton({ postId }: { postId: string }) {
  const hasFacebook = usePostsStore(postsSelectors.hasFacebook); // ✅ selective
  const isPublishing = usePostsStore(postsSelectors.isPublishing(postId)); // ✅ specific
  const publishToFacebook = usePostsStore((state) => state.publishToFacebook);

  if (!hasFacebook) return null;

  return (
    <button
      onClick={() => publishToFacebook(postId)}
      disabled={isPublishing}
    >
      {isPublishing ? "Publishing..." : "Publish"}
    </button>
  );
}
```

---

### مثال 4: فتح Schedule Modal

#### Before (Context API)
```tsx
import { usePostsUI } from "@/app/_providers/PostsUIContext";

function ScheduleButton({ post }: { post: Post }) {
  const { onSchedule } = usePostsUI();

  return (
    <button onClick={() => onSchedule?.(post)}>
      Schedule
    </button>
  );
}
```

#### After (Zustand Store)
```tsx
import { usePostsStore } from "@/entities/posts";

function ScheduleButton({ post }: { post: Post }) {
  const openScheduleModal = usePostsStore((state) => state.openScheduleModal);

  return (
    <button onClick={() => openScheduleModal(post)}>
      Schedule
    </button>
  );
}
```

---

### مثال 5: Provider Setup

#### Before (Context API)
```tsx
// في الـ layout أو root
import PostsProviders from "@/app/_providers/PostsProviders";

export default function Layout({ children }) {
  return (
    <PostsProviders>
      {children}
    </PostsProviders>
  );
}
```

#### After (Zustand Store)
```tsx
// في الـ layout أو root
import { PostsLoader } from "@/features/posts";

export default function Layout({ children }) {
  return (
    <PostsLoader>
      {children}
    </PostsLoader>
  );
}

// أو ببساطة:
// لا تحتاج provider! استخدم الـ store مباشرة في أي component
export default function Layout({ children }) {
  return <>{children}</>;
}
```

---

## 💡 الفوائد

### 1. Performance أفضل

| Aspect | Context API | Zustand Store |
|--------|-------------|---------------|
| Re-renders | ❌ كل component بيعمل re-render | ✅ فقط المكونات المشتركة |
| Subscriptions | ❌ يدوية ومعقدة | ✅ تلقائية ومحسّنة |
| Memoization | ❌ تحتاج useMemo/useCallback | ✅ مدمج |

### 2. Developer Experience أفضل

| Aspect | Context API | Zustand Store |
|--------|-------------|---------------|
| Boilerplate | ❌ 3 ملفات + provider | ✅ ملف واحد |
| TypeScript | ⚠️ يدوي | ✅ كامل |
| DevTools | ❌ محدود | ✅ zustand devtools |
| Testing | ❌ يحتاج wrapper | ✅ مباشر |

### 3. Features أكثر

| Feature | Context API | Zustand Store |
|---------|-------------|---------------|
| Persistence | ❌ يدوي (localStorage) | ✅ middleware |
| Middleware | ❌ غير موجود | ✅ devtools, persist, etc |
| Optimistic updates | ⚠️ يدوي | ✅ built-in مع rollback |
| Actions outside React | ❌ صعب | ✅ `usePostsStore.getState()` |

---

## 🗺️ خطة الانتقال التدريجي

يمكنك الانتقال تدريجياً بدون كسر الكود الحالي:

### المرحلة 1: Components الجديدة (أسبوع 1)
- ✅ استخدم Zustand Store في أي components جديدة
- ✅ اترك الكود القديم كما هو

```tsx
// Component جديد
import { usePostsStore } from "@/entities/posts";

function NewFeature() {
  const posts = usePostsStore((state) => state.posts);
  // ...
}
```

### المرحلة 2: Components صغيرة (أسبوع 2)
- ✅ حوّل الـ components الصغيرة أولاً
- ✅ ابدأ بالـ buttons/actions

```tsx
// قبل
import { usePostsUI } from "@/app/_providers/PostsUIContext";

// بعد
import { usePostsStore } from "@/entities/posts";
```

### المرحلة 3: Components كبيرة (أسبوع 3)
- ✅ حوّل صفحات كاملة
- ✅ استبدل PostsProviders بـ PostsLoader

### المرحلة 4: Cleanup (أسبوع 4)
- ✅ احذف الـ Context API القديم
- ✅ احذف PostsProviders.tsx
- ✅ نظّف الـ imports

---

## 🧪 Testing

### Before (Context API)
```tsx
import { render } from "@testing-library/react";
import { PostsProvider } from "@/app/_providers/PostContext";
import { PostsUIProvider } from "@/app/_providers/PostsUIContext";

test("renders posts", () => {
  const mockValue = { posts: [], setPosts: jest.fn() };
  const mockUIValue = { hasFacebook: true, /* ... */ };

  render(
    <PostsProvider value={mockValue}>
      <PostsUIProvider value={mockUIValue}>
        <MyComponent />
      </PostsUIProvider>
    </PostsProvider>
  );
});
```

### After (Zustand Store)
```tsx
import { render } from "@testing-library/react";
import { usePostsStore } from "@/entities/posts";

test("renders posts", () => {
  // ✅ Set state directly
  usePostsStore.setState({ posts: [], hasFacebook: true });

  render(<MyComponent />);
});
```

---

## 🎯 خلاصة

### لماذا Zustand أفضل؟

1. **⚡ Performance**: أقل re-renders = تطبيق أسرع
2. **🧹 Clean Code**: كود أقل وأنظف = صيانة أسهل
3. **🔒 Type Safety**: TypeScript كامل = أقل bugs
4. **🛠️ DX**: تجربة تطوير أفضل = إنتاجية أعلى
5. **📦 Features**: middleware, devtools, persistence = مميزات أكثر

### متى تبدأ الانتقال؟

**الآن!** ابدأ تدريجياً:
1. Components جديدة → Zustand
2. Components موجودة → حوّل واحد واحد
3. لا تستعجل - الكود القديم يشتغل

### هل يجب حذف Context API فوراً؟

**لا!** خذ وقتك:
- ✅ الكود القديم يشتغل
- ✅ يمكن استخدام الاثنين معاً
- ✅ حوّل تدريجياً
- ✅ احذف بعد التأكد

---

## 📞 Need Help?

راجع:
- [Posts Store README](src/entities/posts/README.md)
- [Examples](src/entities/posts/EXAMPLES.md)
- [Chat Store](src/entities/chat/model/chat-store.ts) - مثال مشابه

---

**Good luck! 🚀**
