# 🆕 إضافة ميزة: Popup للحفظ والتعديل

## الخطوة الإضافية: Modal للحفظ والتعديل

> **الميزة:** بعد كل رد من AI، يظهر popup تلقائياً مع خيارين: "حفظ مباشرة" أو "تعديل ثم حفظ"

---

### 1. تحديث Zustand Store لإض افة حالة الـ Modal

**الملف:** `src/shared/store/chat-store.ts` (إضافة للكود الموجود)

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

  // 🆕 حالة الـ Modal
  saveModal: {
    isOpen: boolean;
    prompt: string;
    content: string;
  } | null;

  // Actions
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  setIsSending: (isSending: boolean) => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  removeMessage: (id: string) => void;
  
  // 🆕 Modal Actions
  openSaveModal: (prompt: string, content: string) => void;
  closeSaveModal: () => void;
  updateModalContent: (content: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isSending: false,
  error: null,
  saveModal: null, // 🆕

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
    })),

  // 🆕 Modal Actions
  openSaveModal: (prompt, content) => 
    set({ saveModal: { isOpen: true, prompt, content } }),
  
  closeSaveModal: () => 
    set({ saveModal: null }),
  
  updateModalContent: (content) => 
    set((state) => 
      state.saveModal 
        ? { saveModal: { ...state.saveModal, content } }
        : state
    )
}));
```

---

### 2. تحديث Hook لإرسال الرسائل لفتح الـ Modal تلقائياً

**الملف:** `src/features/chat/useSendMessage.ts` (تحديث)

```typescript
import { useState } from 'react';
import { useChatStore } from '@/shared/store/chat-store';

export function useSendMessage() {
  const { 
    addUserMessage, 
    addAssistantMessage, 
    setIsSending, 
    setError,
    openSaveModal // 🆕
  } = useChatStore();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setError(null);
    setIsSending(true);

    // إضافة رسالة المستخدم للذاكرة
    const userPrompt = message.trim();
    addUserMessage(userPrompt);

    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: userPrompt })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'فشل في إرسال الرسالة');
      }

      const data = await res.json();
      
      // إضافة رد AI للذاكرة
      addAssistantMessage(data.message);

      // 🆕 فتح الـ Modal تلقائياً بعد الرد
      openSaveModal(userPrompt, data.message);

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

### 3. إنشاء Modal Component

**الملف:** `src/features/chat/SavePostModal.tsx` (جديد)

```typescript
'use client';

import { useChatStore } from '@/shared/store/chat-store';
import { useSaveAsPost } from './useSaveAsPost';
import { useState } from 'react';

export function SavePostModal() {
  const { saveModal, closeSaveModal, updateModalContent } = useChatStore();
  const { saveAsPost, isSaving } = useSaveAsPost();
  const [showEditor, setShowEditor] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  if (!saveModal) return null;

  const handleSaveDirect = async () => {
    try {
      await saveAsPost({
        prompt: saveModal.prompt,
        content: saveModal.content,
        platform: 'twitter',
        status: 'draft'
      });
      
      // إغلاق الـ Modal
      closeSaveModal();
      
      // إشعار النجاح
      alert('✅ تم حفظ المنشور بنجاح!');
    } catch (error: any) {
      alert('❌ ' + error.message);
    }
  };

  const handleEditMode = () => {
    setEditedContent(saveModal.content);
    setShowEditor(true);
  };

  const handleSaveEdited = async () => {
    try {
      await saveAsPost({
        prompt: saveModal.prompt,
        content: editedContent,
        platform: 'twitter',
        status: 'draft'
      });
      
      closeSaveModal();
      setShowEditor(false);
      alert('✅ تم حفظ المنشور بنجاح!');
    } catch (error: any) {
      alert('❌ ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>💾</span> حفظ كمنشور
          </h3>
          <p className="text-sm opacity-90 mt-1">
            اختر كيف تريد حفظ هذا المحتوى
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showEditor ? (
            // عرض المحتوى الأصلي
            <div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📝 المحتوى من AI:
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                    {saveModal.content}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                💡 <strong>نصيحة:</strong> يمكنك حفظ المحتوى كما هو، أو تعديله قبل الحفظ
              </div>
            </div>
          ) : (
            // وضع التعديل
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                ✏️ تعديل المحتوى:
              </label>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="عدّل المحتوى هنا..."
                dir="auto"
              />
              <p className="text-sm text-gray-500 mt-2">
                عدد الأحرف: {editedContent.length}
              </p>
            </div>
          )}
        </div>

        {/* Footer - الأزرار */}
        <div className="border-t bg-gray-50 p-4 flex gap-3 justify-end">
          {!showEditor ? (
            <>
              {/* زر: إلغاء */}
              <button
                onClick={closeSaveModal}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSaving}
              >
                ❌ إلغاء
              </button>

              {/* زر: تعديل ثم حفظ */}
              <button
                onClick={handleEditMode}
                className="px-6 py-2 bg-yellow-500 text-white hover:bg-yellow-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
                disabled={isSaving}
              >
                ✏️ تعديل ثم حفظ
              </button>

              {/* زر: حفظ مباشرة */}
              <button
                onClick={handleSaveDirect}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    💾 حفظ مباشرة
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              {/* في وضع التعديل */}
              <button
                onClick={() => setShowEditor(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={isSaving}
              >
                ← رجوع
              </button>

              <button
                onClick={handleSaveEdited}
                disabled={!editedContent.trim() || isSaving}
                className="px-6 py-2 bg-green-500 text-white hover:bg-green-600 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    ✅ حفظ التعديلات
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

### 4. إضافة الـ Modal إلى ChatInterface

**الملف:** `src/features/chat/ChatInterface.tsx` (تحديث)

```typescript
'use client';

import { useChatStore } from '@/shared/store/chat-store';
import { MessageBubble } from './MessageBubble';
import { ChatInput } from './ChatInput';
import { SavePostModal } from './SavePostModal'; // 🆕
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
    <>
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
                ابدأ المحادثة واسألني عن أي شيء. بعد كل رد سيظهر لك خيار للحفظ مباشرة أو التعديل ثم الحفظ.
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

      {/* 🆕 Modal للحفظ */}
      <SavePostModal />
    </>
  );
}
```

---

## ✅ الميزات الجديدة

### 🎯 ما تم إضافته:

1. **Popup تلقائي** ✨
   - يظهر مباشرة بعد كل رد من AI
   - بدون الحاجة للتمرير على الرسالة

2. **زر "حفظ مباشرة"** 💾
   - يحفظ المحتوى كما هو في جدول `posts`
   - سريع ومباشر

3. **زر "تعديل ثم حفظ"** ✏️
   - يفتح محرر نصوص
   - يمكن تعديل محتوى AI قبل الحفظ
   - عداد للأحرف

4. **واجهة جميلة** 🎨
   - تصميم Modal احترافي
   - ألوان مميزة للأزرار
   - Animations سلسة

---

## 📊 سير العمل الجديد:

```
1. المستخدم يرسل رسالة
   ↓
2. AI يرد
   ↓
3. 🆕 Popup يظهر تلقائياً
   ↓
4. المستخدم يختار:
   ├─ "حفظ مباشرة" → يُحفظ فوراً
   │
   └─ "تعديل ثم حفظ" → محرر → حفظ
```

**الميزة أصبحت أكثر سهولة وسلاسة!** 🚀
