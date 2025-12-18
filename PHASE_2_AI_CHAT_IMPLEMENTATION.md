# 🤖 المرحلة الثانية: ربط الذكاء الاصطناعي (AI Chat Integration)

## 📋 نظرة عامة

هذا الملف يحتوي على جميع الخطوات التفصيلية لتنفيذ **نظام المحادثة مع الذكاء الاصطناعي** في مشروع AI Content Scheduler.

### 🎯 الأهداف:
1. ✅ ربط Google Gemini AI (مجاني)
2. ✅ إنشاء واجهة محادثة تفاعلية (في الذاكرة)
3. ✅ حفظ النتيجة كمنشور مع البرومت في جدول `posts`
4. ✅ إدارة الحالة (State Management)

### 🛠️ التكنولوجيا المستخدمة:
- **AI Model:** Google Gemini (Free tier - gemini-pro)
- **Backend:** Next.js API Routes
- **Frontend:** React 19 + TypeScript
- **State Management:** Zustand (للمحادثة في الذاكرة)
- **Database:** Supabase - جدول `posts` فقط
- **Styling:** Tailwind CSS

### 💡 النهج المبسط:
- ❌ **لا يوجد** جدول `chat_messages`
- ✅ المحادثة تبقى **في الذاكرة فقط** (Zustand store)
- ✅ فقط عند **الحفظ كمنشور** ← تُحفظ في جدول `posts`

---

## 📁 هيكل الملفات المطلوبة

```
AI-Content-Scheduler/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── chat/
│   │       │   └── send/route.ts           ← إرسال رسالة للـ AI (لا يحفظ)
│   │       └── posts/
│   │           └── from-chat/route.ts      ← حفظ نتيجة AI كمنشور
│   │
│   ├── features/
│   │   └── chat/
│   │       ├── ChatInterface.tsx           ← واجهة المحادثة الرئيسية
│   │       ├── MessageBubble.tsx           ← فقاعة الرسالة
│   │       ├── ChatInput.tsx               ← إدخال الرسالة
│   │       └── SaveAsPostButton.tsx        ← زر حفظ كمنشور
│   │
│   ├── shared/
│   │   ├── libs/
│   │   │   └── ai/
│   │   │       └── gemini-client.ts        ← Gemini API client
│   │   └── store/
│   │       └── chat-store.ts               ← Zustand store (المحادثة في الذاكرة)
│   │
│   └── app/
│       └── chat/
│           └── page.tsx                    ← صفحة المحادثة
```

---

# 🔧 الجزء الأول: Backend (الخادم)

## الخطوة 1: ~~إنشاء جدول chat_messages~~ ❌ غير مطلوب

**لا حاجة لجدول chat_messages!** سنستخدم جدول `posts` الموجود فقط.

جدول `posts` يحتوي على:
- `ai_prompt` - البرومت الأصلي
- `content` - النتيجة من AI
- `user_id` - المستخدم
- `status` - حالة المنشور

---

## الخطوة 2: تثبيت Google Gemini SDK

```bash
npm install @google/generative-ai
```

---

## الخطوة 3: إضافة Environment Variables

أضف إلى ملف `.env.local`:

```bash
# Google Gemini API
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here
```

**للحصول على API Key:**
1. اذهب إلى: https://makersuite.google.com/app/apikey
2. انقر "Create API Key"
3. انسخ المفتاح

---

## الخطوة 4: إنشاء Gemini Client

**الملف:** `src/shared/libs/ai/gemini-client.ts`

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

// التحقق من وجود API Key
if (!process.env.GOOGLE_GEMINI_API_KEY) {
  throw new Error('GOOGLE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

/**
 * إرسال prompt للـ AI والحصول على رد
 */
export async function generateContent(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    throw new Error(`فشل في الاتصال بالذكاء الاصطناعي: ${error.message}`);
  }
}

/**
 * Prompts معدة مسبقاً لجودة أفضل
 */
export const AIPrompts = {
  socialMediaPost: (topic: string, platform: 'twitter' | 'facebook') => {
    const charLimit = platform === 'twitter' ? '280 حرف' : '500 حرف';
    return `اكتب منشور احترافي على ${platform} عن "${topic}". 
    المتطلبات:
    - الطول: ${charLimit}
    - أسلوب جذاب ومشوق
    - إضافة إيموجيات مناسبة
    - إضافة 3-5 هاشتاجات ذات صلة
    - باللغة العربية`;
  },
  
  improveContent: (content: string) => {
    return `حسّن هذا المحتوى ليكون أكثر احترافية وجاذبية:
    "${content}"
    
    المتطلبات:
    - الحفاظ على المعنى الأصلي
    - تحسين الصياغة
    - إضافة إيموجيات مناسبة`;
  },
  
  generateHashtags: (content: string) => {
    return `اقترح 5-7 هاشتاجات مناسبة لهذا المحتوى:
    "${content}"
    
    يجب أن تكون الهاشتاجات:
    - ذات صلة بالمحتوى
    - شائعة ومستخدمة
    - باللغة العربية والإنجليزية`;
  }
};
```

---

## الخطوة 5: إنشاء Chat API - إرسال رسالة

**الملف:** `src/app/api/chat/send/route.ts`

> **ملاحظة:** هذا API **لا يحفظ** الرسائل في قاعدة البيانات، فقط يرسل للـ AI ويرجع النتيجة

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/shared/libs/auth-middleware';
import { generateContent } from '@/shared/libs/ai/gemini-client';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body = await req.json();
      const { message } = body;

      // التحقق من وجود الرسالة
      if (!message || message.trim() === '') {
        return NextResponse.json(
          { error: 'الرسالة مطلوبة' },
          { status: 400 }
        );
      }

      // إرسال الرسالة للـ AI والحصول على رد
      const aiResponse = await generateContent(message.trim());

      // إرجاع النتيجة مباشرة (بدون حفظ)
      return NextResponse.json({
        success: true,
        message: aiResponse,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error('Chat API Error:', error);
      return NextResponse.json(
        { 
          error: error.message || 'حدث خطأ أثناء المحادثة',
          details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        },
        { status: 500 }
      );
    }
  });
}
```

---

## ~~الخطوة 6: إنشاء Chat API - جلب المحادثات~~ ❌ غير مطلوب

**لا حاجة لهذا API!** المحادثات في الذاكرة فقط.

---

## الخطوة 6: حفظ نتيجة AI كمنشور

**الملف:** `src/app/api/posts/from-chat/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/shared/libs/auth-middleware';
import { supabaseServer } from '@/shared/libs/supabaseServer';

export async function POST(req: NextRequest) {
  return withAuth(req, async (req, user) => {
    try {
      const body = await req.json();
      const { prompt, content, platform = 'twitter', status = 'draft' } = body;

      // التحقق من البيانات
      if (!content || !platform) {
        return NextResponse.json(
          { error: 'المحتوى والمنصة مطلوبان' },
          { status: 400 }
        );
      }

      // حفظ المنشور مع البرومت والنتيجة
      const { data: post, error } = await supabaseServer
        .from('posts')
        .insert({
          user_id: user.userId,
          content: content.trim(),
          ai_prompt: prompt?.trim() || null,  // البرومت الأصلي
          platform,
          status
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving post:', error);
        throw new Error('فشل في حفظ المنشور');
      }

      return NextResponse.json({
        success: true,
        post,
        message: `تم حفظ المنشور كـ ${status === 'draft' ? 'مسودة' : status}`
      });

    } catch (error: any) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  });
}
```

---

# 🎨 الجزء الثاني: Frontend (الواجهة)

## الخطوة 1: إنشاء Zustand Store للمحادثة

**الملف:** `src/shared/store/chat-store.ts`

> **ملاحظة:** هنا نحفظ المحادثة **في الذاكرة فقط** بدون قاعدة بيانات

```typescript
import { create } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatState {
  // المحادثات في الذاكرة
  messages: ChatMessage[];
  
  // حالة الإرسال
  isSending: boolean;
  error: string | null;

  // Actions
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  setIsSending: (isSending: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  removeMessage: (id: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isSending: false,
  error: null,

  addUserMessage: (content) => 
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `user-${Date.now()}`,
          role: 'user',
          content,
          timestamp: new Date()
        }
      ]
    })),

  addAssistantMessage: (content) => 
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content,
          timestamp: new Date()
        }
      ]
    })),

  setIsSending: (isSending) => set({ isSending }),
  
  setError: (error) => set({ error }),
  
  clearMessages: () => set({ messages: [], error: null }),
  
  removeMessage: (id) => 
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id)
    }))
}));
```

---

## الخطوة 2: Hook لإرسال الرسائل

**الملف:** `src/features/chat/useSendMessage.ts`

```typescript
import { useState } from 'react';
import { useChatStore } from '@/shared/store/chat-store';

export function useSendMessage() {
  const { addUserMessage, addAssistantMessage, setIsSending, setError } = useChatStore();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setError(null);
    setIsSending(true);

    // إضافة رسالة المستخدم للذاكرة
    addUserMessage(message);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'فشل في إرسال الرسالة');
      }

      const data = await res.json();
      
      // إضافة رد AI للذاكرة
      addAssistantMessage(data.message);

    } catch (error: any) {
      setError(error.message);
      console.error('Send message error:', error);
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage };
}
```

---

## الخطوة 3: Hook لحفظ كمنشور

**الملف:** `src/features/chat/useSaveAsPost.ts`

```typescript
import { useState } from 'react';

export function useSaveAsPost() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAsPost = async (data: {
    prompt: string;
    content: string;
    platform?: string;
    status?: string;
  }) => {
    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/posts/from-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'فشل في حفظ المنشور');
      }

      const result = await res.json();
      return result;

    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveAsPost, isSaving, error };
}
```

---

## الخطوة 4: مكون فقاعة الرسالة

**الملف:** `src/features/chat/MessageBubble.tsx`

```typescript
'use client';

import { ChatMessage } from '@/shared/store/chat-store';
import { useState } from 'react';
import { useSaveAsPost } from './useSaveAsPost';

interface MessageBubbleProps {
  message: ChatMessage;
  previousMessage?: ChatMessage; // للحصول على البرومت
}

export function MessageBubble({ message, previousMessage }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [showSaveButton, setShowSaveButton] = useState(false);
  const { saveAsPost, isSaving } = useSaveAsPost();

  const handleSaveAsPost = async () => {
    if (message.role !== 'assistant') return;

    const prompt = previousMessage?.role === 'user' ? previousMessage.content : '';

    try {
      await saveAsPost({
        prompt,
        content: message.content,
        platform: 'twitter',
        status: 'draft'
      });
      alert('✅ تم حفظ المنشور بنجاح!');
    } catch (error: any) {
      alert('❌ ' + error.message);
    }
  };

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      onMouseEnter={() => !isUser && setShowSaveButton(true)}
      onMouseLeave={() => setShowSaveButton(false)}
    >
      <div className="max-w-[75%]">
        {/* الرسالة */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>

        {/* زر حفظ كمنشور (يظهر فقط لرسائل AI) */}
        {!isUser && showSaveButton && (
          <button
            onClick={handleSaveAsPost}
            disabled={isSaving}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span> جاري الحفظ...
              </>
            ) : (
              <>💾 حفظ كمنشور</>
            )}
          </button>
        )}

        {/* الوقت */}
        <p className="text-xs text-gray-500 mt-1 px-2">
          {message.timestamp.toLocaleTimeString('ar-EG', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </div>
    </div>
  );
}
```

---

## الخطوة 5: مكون إدخال الرسالة

**الملف:** `src/features/chat/ChatInput.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import { useSendMessage } from './useSendMessage';
import { useChatStore } from '@/shared/store/chat-store';

export function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage } = useSendMessage();
  const { isSending, error } = useChatStore();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (input.trim() && !isSending) {
      sendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          disabled={isSending}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
          dir="auto"
          autoFocus
        />
        
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors flex items-center gap-2"
        >
          {isSending ? (
            <>
              <span className="animate-spin">⏳</span>
              جاري الإرسال...
            </>
          ) : (
            <>📤 إرسال</>
          )}
        </button>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          ❌ {error}
        </p>
      )}
    </form>
  );
}
```

---

## الخطوة 6: واجهة المحادثة الرئيسية

**الملف:** `src/features/chat/ChatInterface.tsx`

```typescript
'use client';

import { useChatStore } from '@/shared/store/chat-store';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { useEffect, useRef } from 'react';

export function ChatInterface() {
  const { messages, clearMessages, isSending } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom عند إضافة رسالة جديدة
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClearChat = () => {
    if (confirm('هل أنت متأكد من حذف المحادثة؟ (لن يتم حذف المنشورات المحفوظة)')) {
      clearMessages();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🤖</span> الذكاء الاصطناعي
          </h2>
          <p className="text-sm opacity-90">اسأل أي شيء وسأساعدك!</p>
        </div>
        
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            disabled={isSending}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-sm transition-colors disabled:opacity-50"
          >
            🗑️ مسح المحادثة
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4 animate-bounce">🤖</div>
            <h3 className="text-xl font-semibold mb-2">مرحباً! كيف يمكنني مساعدتك؟</h3>
            <p className="text-sm text-center max-w-md">
              ابدأ المحادثة واسألني عن أي شيء. يمكنك حفظ أي رد كمنشور لمواقع التواصل الاجتماعي.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            previousMessage={messages[index - 1]}
          />
        ))}

        {/* Loading indicator */}
        {isSending && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput />
    </div>
  );
}
```

---

## الخطوة 7: صفحة المحادثة

**الملف:** `src/app/chat/page.tsx`

```typescript
import { ChatInterface } from '@/features/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          💬 محادثة مع الذكاء الاصطناعي
        </h1>
        <p className="text-gray-600">
          استخدم الذكاء الاصطناعي لإنشاء محتوى احترافي لمواقع التواصل الاجتماعي
        </p>
      </div>
      
      <ChatInterface />
    </div>
  );
}
```

---

# ✅ الخطوات النهائية

## 1. التأكد من التثبيتات

```bash
# تأكد من وجود جميع المكتبات
npm install @google/generative-ai zustand
```

## 2. تشغيل المشروع

```bash
npm run dev
```

## 3. الاختبار

1. اذهب إلى: `http://localhost:3000/chat`
2. جرب إرسال رسالة
3. شاهد رد AI
4. مرّر الماوس على رد AI
5. جرب "حفظ كمنشور"
6. تحقق من جدول `posts` في Supabase

---

# 🎯 الميزات المتوفرة

✅ **محادثة فورية** - الرد يأتي مباشرة من Google Gemini  
✅ **المحادثة في الذاكرة** - لا يتم حفظها في قاعدة البيانات  
✅ **حفظ كمنشور** - يمكن حفظ أي رد من AI في جدول `posts` مع البرومت  
✅ **مسح المحادثة** - حذف من الذاكرة فقط (لا يؤثر على المنشورات المحفوظة)  
✅ **واجهة جميلة** - تصميم احترافي responsive  
✅ **State Management** - Zustand فقط (بدون React Query)  
✅ **Error Handling** - معالجة الأخطاء بشكل احترافي  

---

# 📊 الخلاصة

## ما تم إلغاؤه ✂️
- ❌ جدول `chat_messages`
- ❌ API لجلب المحادثات
- ❌ API لحذف المحادثات من قاعدة البيانات
- ❌ React Query للمحادثات

## ما تم الإبقاء عليه ✅
- ✅ Google Gemini API
- ✅ جدول `posts` مع `ai_prompt` و `content`
- ✅ Zustand للمحادثات في الذاكرة
- ✅ API حفظ كمنشور
- ✅ واجهة المحادثة الكاملة

**النهج أبسط وأكثر مباشرة!** 🎉
