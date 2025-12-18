# 📁 Chat Feature Structure - FSD Pattern

## ✨ Overview
This document explains the Feature-Sliced Design (FSD) structure for the Chat feature in AI-Content-Scheduler.

## 🏗️ Structure

### 📦 Entities Layer (`entities/chat/`)
Business entities and data models.

```
entities/chat/
├── model/
│   ├── types.ts              # TypeScript types (Message, ChatState)
│   └── chat-store.ts         # Zustand store (state management)
├── api/                      # API calls (currently empty, can add later)
└── index.ts                  # Public API exports
```

**Responsibilities:**
- ✅ Define data types and interfaces
- ✅ Manage chat state (messages, loading, errors)
- ✅ Provide store actions (add/clear messages, set state)

**Exports:**
```typescript
export { useChatStore } from "@/entities/chat";
export type { Message, ChatState } from "@/entities/chat";
```

---

### 🎯 Features Layer (`features/chat/`)
User interactions and feature-specific logic.

```
features/chat/
├── start-chat/
│   ├── ui/
│   │   └── ChatInput.tsx          # Input field + Send button
│   └── model/
│       └── use-send-message.ts    # Hook to send messages
│
├── save-as-post/
│   ├── ui/
│   │   └── SaveButton.tsx         # Button to save AI response
│   └── model/
│       └── use-save-as-post.ts    # Hook to save to posts table
│
├── clear-chat/
│   └── ui/
│       └── ClearButton.tsx        # Button to clear messages
│
├── ChatInterface.tsx              # Main chat container
├── MessageBubble.tsx              # Individual message display
└── index.ts                       # Public API exports
```

**Responsibilities:**
- ✅ User interactions (sending, saving, clearing)
- ✅ Feature-specific UI components
- ✅ Business logic hooks

**Key Components:**

#### 1. **start-chat** - Send Message Feature
- `ChatInput.tsx` - Text input and send button
- `use-send-message.ts` - Sends message to AI API, updates store

#### 2. **save-as-post** - Save AI Response Feature
- `SaveButton.tsx` - Save button UI
- `use-save-as-post.ts` - Saves AI response to posts table

#### 3. **clear-chat** - Clear Messages Feature
- `ClearButton.tsx` - Clear button with confirmation dialog

---

### 🧩 Widgets Layer (`widgets/chat/`)
Complete, ready-to-use UI compositions.

```
widgets/chat/
├── ui/
│   └── ChatWidget.tsx        # Complete chat widget with header
└── index.ts                  # Public API exports
```

**Responsibilities:**
- ✅ Compose features into complete UI
- ✅ Add page-level layout and headers
- ✅ Ready-to-use widget for pages

---

## 🔄 Data Flow

```
User Action → Feature Component → Hook → API/Store → Entity Store → UI Update
```

Example: Sending a message
1. User types in `ChatInput` (feature)
2. Clicks "Send" → calls `useSendMessage()` hook
3. Hook calls:
   - `useChatStore().addUserMessage()` (entity)
   - API `/api/chat/send`
   - `useChatStore().addAssistantMessage()` (entity)
4. Store updates → UI re-renders

---

## 📝 Import Guidelines

### ✅ Correct Imports

```typescript
// From entities (data layer)
import { useChatStore } from "@/entities/chat";
import type { Message } from "@/entities/chat";

// From features (actions layer)
import { ChatInterface } from "@/features/chat";
import { SaveButton } from "@/features/chat";

// From widgets (composition layer)
import { ChatWidget } from "@/widgets/chat";
```

### ❌ Wrong Imports

```typescript
// ❌ Don't import from shared/store
import { useChatStore } from "@/shared/store/chat-store";

// ❌ Don't skip layers
import ChatInput from "@/features/chat/start-chat/ui/ChatInput";
```

---

## 🎯 FSD Rules Applied

### 1. **Layers Hierarchy**
```
widgets → features → entities → shared
```
- Upper layers CAN import from lower layers
- Lower layers CANNOT import from upper layers

### 2. **Isolation**
- Each feature is independent
- Features don't import from other features
- Use entities for shared state

### 3. **Public API**
- Every layer has `index.ts` (barrel export)
- Import from index, not deep paths

---

## 🚀 Usage Examples

### Using in a Page
```typescript
// app/chat/page.tsx
import { ChatWidget } from "@/widgets/chat";

export default function ChatPage() {
  return <ChatWidget />;
}
```

### Using Individual Features
```typescript
import { ChatInterface } from "@/features/chat";
import { useChatStore } from "@/entities/chat";

function CustomChatPage() {
  const { messages } = useChatStore();
  
  return (
    <div>
      <h1>Messages: {messages.length}</h1>
      <ChatInterface />
    </div>
  );
}
```

---

## 📊 Benefits of This Structure

✅ **Scalability** - Easy to add new chat features (e.g., `edit-message/`)  
✅ **Maintainability** - Clear separation of concerns  
✅ **Reusability** - Features can be used independently  
✅ **Testability** - Each layer can be tested in isolation  
✅ **Type Safety** - Strong TypeScript types from entities  
✅ **Clear Dependencies** - Import graph is predictable  

---

## 🔧 Files Modified/Created

### Created
- ✅ `entities/chat/index.ts`
- ✅ `entities/chat/model/chat-store.ts` (renamed from chat-stroe.ts)
- ✅ `features/chat/start-chat/model/use-send-message.ts`
- ✅ `features/chat/save-as-post/model/use-save-as-post.ts`
- ✅ `features/chat/save-as-post/ui/SaveButton.tsx`
- ✅ `features/chat/clear-chat/ui/ClearButton.tsx`
- ✅ `features/chat/index.ts`
- ✅ `widgets/chat/ui/ChatWidget.tsx`
- ✅ `widgets/chat/index.ts`

### Updated
- ✅ `entities/chat/model/types.ts` (already existed)
- ✅ `features/chat/ChatInterface.tsx` (fixed imports)
- ✅ `features/chat/MessageBubble.tsx` (refactored to use SaveButton)
- ✅ `features/chat/start-chat/ui/ChatInput.tsx` (fixed imports)
- ✅ `app/chat/page.tsx` (use ChatWidget)

### Removed
- ❌ `shared/store/chat-store.ts` (moved to entities)
- ❌ `features/chat/useSendMessage.ts` (moved to feature folder)
- ❌ `features/chat/useSaveAsPost.ts` (moved to feature folder)

---

## 🎉 Summary

The chat feature now follows **Feature-Sliced Design** pattern perfectly:
- **Entities** manage data and state
- **Features** handle user interactions
- **Widgets** compose complete UIs
- **Clear imports** from public APIs
- **No duplicate code** or circular dependencies
