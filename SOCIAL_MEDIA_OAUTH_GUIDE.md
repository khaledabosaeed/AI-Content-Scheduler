# 🔐 دليل OAuth والاتصال بمواقع التواصل الاجتماعي

## 📋 جدول المحتويات
1. [مفهوم OAuth](#مفهوم-oauth)
2. [OAuth Flow خطوة بخطوة](#oauth-flow-خطوة-بخطوة)
3. [ماذا نخزن في Database](#ماذا-نخزن-في-database)
4. [Database Schema التفصيلي](#database-schema-التفصيلي)
5. [أمثلة عملية](#أمثلة-عملية)
6. [الفروقات بين المنصات](#الفروقات-بين-المنصات)

---

## 🤔 مفهوم OAuth

### ما هو OAuth؟
OAuth هو بروتوكول يسمح لتطبيقك بالوصول لحساب المستخدم على منصة أخرى **بدون معرفة كلمة المرور**.

### لماذا OAuth؟
```
❌ الطريقة الخاطئة:
- المستخدم يعطيك username + password لـ Twitter
- أنت تحفظهم في قاعدة بياناتك
- تستخدمهم للنشر
المشكلة: خطر أمني كبير! ❌

✅ الطريقة الصحيحة (OAuth):
- المستخدم يذهب لموقع Twitter
- يعطي الإذن لتطبيقك
- Twitter يعطيك "مفتاح خاص" (Access Token)
- تستخدم المفتاح للنشر
- لا تعرف كلمة المرور أبداً ✅
```

---

## 🔄 OAuth Flow خطوة بخطوة

### الخطوات الأساسية:

```
المستخدم                    تطبيقك                    Twitter
   │                          │                          │
   │  1. يضغط "Connect Twitter"                         │
   ├──────────────────────────>│                          │
   │                          │                          │
   │                          │  2. طلب Authorization    │
   │                          ├─────────────────────────>│
   │                          │                          │
   │  3. إعادة توجيه لـ Twitter                          │
   │<─────────────────────────┤                          │
   │                          │                          │
   │  4. تسجيل دخول + موافقة                             │
   ├──────────────────────────────────────────────────────>│
   │                          │                          │
   │  5. إعادة توجيه مع Code                             │
   │<──────────────────────────────────────────────────────┤
   │                          │                          │
   │  6. إرسال Code                                      │
   ├──────────────────────────>│                          │
   │                          │                          │
   │                          │  7. تبديل Code بـ Tokens │
   │                          ├─────────────────────────>│
   │                          │                          │
   │                          │  8. Access Token + Info  │
   │                          │<─────────────────────────┤
   │                          │                          │
   │                          │  9. حفظ في Database      │
   │                          │  ✅                       │
   │                          │                          │
   │  10. تم الاتصال بنجاح!                              │
   │<─────────────────────────┤                          │
```

### الشرح التفصيلي:

#### 1️⃣ User يضغط "Connect Twitter"
```typescript
// في صفحة Settings
<button onClick={() => window.location.href = '/api/auth/twitter/connect'}>
  Connect Twitter Account
</button>
```

#### 2️⃣ تطبيقك يطلب Authorization من Twitter
```typescript
// /api/auth/twitter/connect/route.ts
import { TwitterApi } from 'twitter-api-v2';

export async function GET() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
  });

  // طلب Authorization URL
  const authLink = await client.generateAuthLink(
    'http://localhost:3000/api/auth/twitter/callback'
  );

  // حفظ oauth_token_secret مؤقتاً (في session أو database)
  // نحتاجه في الخطوة 7

  // إعادة توجيه المستخدم لـ Twitter
  return Response.redirect(authLink.url);
}
```

#### 3️⃣ Twitter يعرض صفحة الموافقة
```
صفحة Twitter تسأل:
"Do you want to allow [Your App] to:
 - Read Tweets
 - Post Tweets
 - Access your profile"

[Authorize App] [Cancel]
```

#### 4️⃣ المستخدم يوافق
```
User يضغط "Authorize App"
```

#### 5️⃣ Twitter يعيد المستخدم لتطبيقك مع Code
```
redirect to: http://localhost:3000/api/auth/twitter/callback?
  oauth_token=xxx&
  oauth_verifier=yyy
```

#### 6️⃣-8️⃣ تبديل Code بـ Access Token
```typescript
// /api/auth/twitter/callback/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const oauth_token = searchParams.get('oauth_token');
  const oauth_verifier = searchParams.get('oauth_verifier');

  // استرجاع oauth_token_secret من session
  const oauth_token_secret = await getFromSession();

  // إنشاء client
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY!,
    appSecret: process.env.TWITTER_API_SECRET!,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret,
  });

  // تبديل OAuth verifier بـ Access Token
  const loginResult = await client.login(oauth_verifier);

  // الآن عندك:
  const accessToken = loginResult.accessToken;
  const accessSecret = loginResult.accessSecret;
  const userId = loginResult.userId;
  const screenName = loginResult.screenName;

  // حفظ في Database (الخطوة 9)
  await saveToDatabase({
    userId: currentUserId, // من session
    platform: 'twitter',
    accessToken,
    accessSecret,
    platformUserId: userId,
    platformUsername: screenName,
  });

  // إعادة توجيه للـ Dashboard
  return Response.redirect('/dashboard/settings?connected=twitter');
}
```

---

## 💾 ماذا نخزن في Database

### البيانات التي نحصل عليها من OAuth:

```javascript
{
  // 1. Access Token (المفتاح الرئيسي) ⭐
  accessToken: "1234567890-abcdefghijklmnopqrstuvwxyz",
  
  // 2. Access Token Secret (لـ OAuth 1.0a فقط - Twitter)
  accessSecret: "abcdefghijklmnopqrstuvwxyz1234567890",
  
  // 3. Refresh Token (لـ OAuth 2.0 - Facebook, LinkedIn)
  refreshToken: "refresh_token_xyz123",
  
  // 4. Token Expiry (متى ينتهي Token)
  expiresAt: "2024-12-31T23:59:59Z",
  
  // 5. معلومات الحساب
  platformUserId: "123456789",      // ID المستخدم على المنصة
  platformUsername: "@username",     // Username
  platformName: "User Display Name", // الاسم الظاهر
  platformAvatar: "https://...",     // صورة الحساب
  
  // 6. Permissions/Scopes
  scopes: ["read", "write", "post"], // الصلاحيات الممنوحة
  
  // 7. معلومات إضافية (اختياري)
  metadata: {
    followers_count: 1000,
    verified: false,
    // أي معلومات أخرى
  }
}
```

### ⚠️ مهم جداً:
```
✅ نخزن: Access Token, Refresh Token
❌ لا نخزن أبداً: Password المستخدم
```

---

## 🗄️ Database Schema التفصيلي

### جدول social_accounts

```sql
CREATE TABLE social_accounts (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- ربط بالمستخدم
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- معلومات المنصة
  platform VARCHAR(50) NOT NULL,  -- 'twitter', 'facebook', 'linkedin', etc.
  
  -- OAuth Tokens (مشفرة!) 🔐
  access_token TEXT NOT NULL,     -- المفتاح الرئيسي
  access_secret TEXT,             -- لـ Twitter (OAuth 1.0a)
  refresh_token TEXT,             -- لـ Facebook/LinkedIn (OAuth 2.0)
  
  -- Token Expiration
  token_expires_at TIMESTAMP,     -- متى ينتهي Token
  
  -- معلومات الحساب على المنصة
  platform_user_id VARCHAR(255),  -- ID المستخدم على المنصة
  platform_username VARCHAR(255), -- @username
  platform_name VARCHAR(255),     -- Display name
  platform_avatar TEXT,           -- Profile picture URL
  
  -- Permissions
  scopes TEXT[],                  -- ['read', 'write', 'post']
  
  -- Status
  is_active BOOLEAN DEFAULT true, -- هل الحساب نشط؟
  last_used_at TIMESTAMP,         -- آخر استخدام
  
  -- Metadata إضافي
  metadata JSONB,                 -- أي معلومات إضافية
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, platform, platform_user_id)  -- حساب واحد لكل منصة
);

-- Indexes
CREATE INDEX idx_user_platform ON social_accounts(user_id, platform);
CREATE INDEX idx_active_accounts ON social_accounts(user_id, is_active);
```

### مثال بيانات حقيقية:

```sql
-- مستخدم ربط حساب Twitter
INSERT INTO social_accounts VALUES (
  'uuid-123',                              -- id
  'user-abc',                              -- user_id
  'twitter',                               -- platform
  'encrypted_access_token_here',           -- access_token (مشفر)
  'encrypted_access_secret_here',          -- access_secret (مشفر)
  NULL,                                    -- refresh_token (Twitter لا يستخدم)
  NULL,                                    -- token_expires_at (Twitter لا ينتهي)
  '1234567890',                            -- platform_user_id
  '@john_doe',                             -- platform_username
  'John Doe',                              -- platform_name
  'https://pbs.twimg.com/profile.jpg',     -- platform_avatar
  ARRAY['read', 'write'],                  -- scopes
  true,                                    -- is_active
  NOW(),                                   -- last_used_at
  '{"followers": 1000, "verified": false}',-- metadata
  NOW(),                                   -- created_at
  NOW()                                    -- updated_at
);
```

---

## 🔒 تشفير Tokens في Database

### ⚠️ خطر أمني:
```
❌ لا تحفظ Access Tokens بصيغة نص عادي (plain text)!
✅ يجب تشفيرها قبل الحفظ
```

### طريقة التشفير:

```typescript
// src/shared/libs/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes
const ALGORITHM = 'aes-256-gcm';

export function encryptToken(token: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // حفظ: iv + authTag + encrypted
  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

export function decryptToken(encryptedToken: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedToken.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### استخدام في Database:

```typescript
// عند الحفظ
const encryptedToken = encryptToken(accessToken);
await supabase.from('social_accounts').insert({
  access_token: encryptedToken,
  // ...
});

// عند القراءة
const { data } = await supabase.from('social_accounts')
  .select('*')
  .eq('user_id', userId)
  .eq('platform', 'twitter')
  .single();

const decryptedToken = decryptToken(data.access_token);
```

---

## 🔄 Token Refresh (لـ OAuth 2.0)

### المشكلة:
```
Access Tokens في OAuth 2.0 تنتهي صلاحيتها (عادة بعد 1-2 ساعة)
```

### الحل: Refresh Token
```typescript
// src/shared/libs/social-media/token-refresh.ts

export async function refreshAccessToken(platform: string, refreshToken: string) {
  if (platform === 'facebook') {
    const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'GET',
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
      }
    });
    
    const data = await response.json();
    
    return {
      accessToken: data.access_token,
      expiresIn: data.expires_in, // seconds
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
    };
  }
  
  // نفس الشيء لـ LinkedIn, Instagram, etc.
}
```

### متى نجدد Token:
```typescript
// قبل استخدام Token، تحقق من الصلاحية
async function getValidAccessToken(userId: string, platform: string) {
  const account = await supabase
    .from('social_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('platform', platform)
    .single();
  
  // تحقق من الصلاحية
  if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
    // Token انتهى، جدده
    const newTokenData = await refreshAccessToken(platform, account.refresh_token);
    
    // حدّث Database
    await supabase
      .from('social_accounts')
      .update({
        access_token: encryptToken(newTokenData.accessToken),
        token_expires_at: newTokenData.expiresAt,
        updated_at: new Date(),
      })
      .eq('id', account.id);
    
    return newTokenData.accessToken;
  }
  
  // Token لسه صالح
  return decryptToken(account.access_token);
}
```

---

## 📱 الفروقات بين المنصات

### Twitter (OAuth 1.0a)
```javascript
{
  access_token: "xxx",
  access_secret: "yyy",  // ⭐ مهم
  expires: false,         // لا ينتهي
  refresh_token: null,    // لا يوجد
}
```

### Facebook/Instagram (OAuth 2.0)
```javascript
{
  access_token: "xxx",
  access_secret: null,
  expires: true,
  expires_at: "2024-12-31",
  refresh_token: "yyy",   // ⭐ للتجديد
}
```

### LinkedIn (OAuth 2.0)
```javascript
{
  access_token: "xxx",
  access_secret: null,
  expires: true,
  expires_at: "2024-12-31",
  refresh_token: "yyy",
}
```

### TikTok (OAuth 2.0)
```javascript
{
  access_token: "xxx",
  access_secret: null,
  expires: true,
  expires_at: "2024-12-31",
  refresh_token: "yyy",
  open_id: "zzz",         // ⭐ TikTok specific
}
```

---

## ✅ Checklist كامل

### Setup
- [ ] إنشاء App على المنصة
- [ ] الحصول على API Keys
- [ ] إضافة Callback URL
- [ ] إضافة Keys لـ `.env.local`

### Database
- [ ] إنشاء جدول `social_accounts`
- [ ] إضافة Indexes
- [ ] إعداد Encryption

### Backend
- [ ] `/api/auth/[platform]/connect` route
- [ ] `/api/auth/[platform]/callback` route
- [ ] Token encryption/decryption
- [ ] Token refresh logic

### Frontend
- [ ] زر "Connect Account"
- [ ] عرض Connected Accounts
- [ ] زر "Disconnect"
- [ ] Status indicators

---

## 🎯 الخلاصة

### المفاهيم الأساسية:
1. **OAuth** = طريقة آمنة للوصول بدون password
2. **Access Token** = المفتاح للنشر على حساب المستخدم
3. **Refresh Token** = لتجديد Access Token عند انتهائه
4. **Encryption** = تشفير Tokens في Database

### ما نخزنه:
- ✅ Access Token (مشفر)
- ✅ Refresh Token (مشفر)
- ✅ Token Expiry
- ✅ Platform User Info
- ❌ Password (أبداً!)

### الخطوات:
1. User يضغط "Connect"
2. OAuth Flow
3. نحصل على Tokens
4. نشفرهم
5. نحفظهم في Database
6. نستخدمهم للنشر
7. نجددهم عند الحاجة
