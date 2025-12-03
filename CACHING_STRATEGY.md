# استراتيجية الكاش والـ Hydration

## 🎯 الهدف
منع **Flicker** عند تحميل الصفحة بحقن بيانات اليوزر من السيرفر مباشرة.

---

## 🔄 كيفية العمل

### 1️⃣ في السيرفر (layout.tsx)
```
app/layout.tsx (Server Component)
    ↓
prefetchQuery("/auth/me") - جلب بيانات اليوزر
    ↓
dehydrate() - تحويل الكاش إلى JSON
    ↓
إرسال dehydratedState للكلاينت
```

### 2️⃣ في الكلاينت (query-provider.tsx)
```
HydrationBoundary مع dehydratedState
    ↓
hydrate البيانات في QueryClient
    ↓
Header وباقي الصفحة يستخدمون البيانات من الكاش مباشرة
    ↓
✅ بدون Flicker!
```

---

## 🔧 المكونات المهمة

### 📄 [app/layout.tsx](src/app/layout.tsx)
- ✅ يحتوي على `PrefetchUserData()` - دالة السيرفر التي جلب البيانات
- ✅ تحتوي على error handling - إذا فشل الـ fetch يستمر بدون بيانات
- ✅ تستدعي `dehydrate()` لتحويل الكاش

### 🎨 [app/_providers/query-provider.tsx](src/app/_providers/query-provider.tsx)
- ✅ `HydrationBoundary` مع `dehydratedState`
- ✅ `QueryClient` مع `defaultOptions` محسّنة
- ✅ `staleTime: 5min` + `gcTime: 10min`

### 🔗 [entities/user/state/queries.ts](src/entities/user/state/queries.ts)
- ✅ `fetchUserData()` - دالة تجلب البيانات
- ✅ `useUser()` - hook يستخدمها مع خيارات محسّنة
- ✅ `refetchOnMount: false` - مهم جداً لتجنب refetch إذا كانت البيانات في الكاش

### 🧩 [widgets/header/Header.tsx](src/widgets/header/Header.tsx)
- ✅ يستخدم `useUser()` للحصول على بيانات اليوزر
- ✅ البيانات تأتي من الكاش المحقون من السيرفر

---

## ⚙️ إعدادات QueryClient

| الإعداد | القيمة | السبب |
|-------|--------|------|
| `staleTime` | 5 دقايق | البيانات تبقى fresh لفترة طويلة |
| `gcTime` | 10 دقايق | احفظ البيانات في الـ memory لـ 10 دقايق |
| `refetchOnMount` | `false` | 🔴 **الأهم**: لا تفetch إذا كانت البيانات من السيرفر |
| `refetchOnWindowFocus` | `false` | لا تفetch عند العودة للـ tab |
| `refetchOnReconnect` | `false` | لا تفetch عند العودة للإنترنت |

---

## 🚨 أخطاء شائعة وحلولها

### ❌ المشكلة: يظهر Flicker عند تحميل الصفحة

**السبب**: البيانات تُجلب بعد الـ hydration

**الحل**:
```typescript
// ✅ صحيح
export async function fetchUserData(): Promise<UserData> {
  const response = await api.get<UserData>("/auth/me");
  return response; // إرجع البيانات مباشرة
}

// ❌ خطأ
export async function fetchUserData() {
  const response = await api.get("/auth/me");
  return response; // إرجع Response object
}
```

### ❌ المشكلة: عدم ظهور بيانات اليوزر

**السبب**: `dehydratedState` لم يُمرر صحيح للـ QueryProvider

**التحقق**:
```bash
# شغّل devtools وشوف إذا البيانات موجودة في الكاش
1. افتح React Query DevTools
2. شوف تحت "Queries" إذا موجودة `["user", "me"]`
```

### ❌ المشكلة: refetch يحدث بدون داعي

**السبب**: `refetchOnMount` مفعل

**الحل**:
```typescript
// ✅ صحيح
refetchOnMount: false, // لا تفetch عند mount

// ❌ خطأ
refetchOnMount: true, // سيفetch مرة ثانية!
```

---

## 📊 مثال: تدفق البيانات

```
المستخدم يفتح الصفحة
    ↓
Request يصل للسيرفر
    ↓
layout.tsx يشتغل (Server Component)
    ↓
PrefetchUserData() يجلب من /auth/me
    ↓
dehydrate(queryClient) يحول الكاش إلى JSON
    ↓
HTML + dehydratedState يُرسل للمتصفح
    ↓
QueryProvider hydrates البيانات
    ↓
Header يستخدم useUser() يجد البيانات في الكاش
    ↓
✅ يظهر اسم اليوزر بدون Flicker!
```

---

## 🧪 اختبار الحل

### 1. فتح DevTools في المتصفح
```bash
F12 → React Query Devtools (في زاوية الصفحة)
```

### 2. تحقق من:
- ✅ هل البيانات موجودة تحت "Queries"?
- ✅ هل Status = "success"?
- ✅ هل Data تحتوي على معلومات اليوزر?

### 3. اختبر الـ Flicker
- ✅ لا ترى النص "Login" ثم يتحول إلى اسم اليوزر
- ✅ الصفحة تظهر صحيحة من أول مرة

---

## 📝 ملاحظات مهمة

- **جلب البيانات يحدث على السيرفر**: معناه أسرع وأكثر أماناً
- **البيانات تُمرر عبر HTML**: لا حاجة لـ request إضافي
- **Hydration يجعل البيانات متاحة مباشرة**: بدون تأخير أو Flicker
- **QueryClient يُنشأ في Client Component**: لتجنب مشاركة الكاش بين requests

---

## 🔗 روابط مرجعية

- [React Query Hydration](https://tanstack.com/query/latest/docs/react/ssr)
- [Next.js SSR مع React Query](https://nextjs.org/docs/app/building-your-application/data-fetching)
