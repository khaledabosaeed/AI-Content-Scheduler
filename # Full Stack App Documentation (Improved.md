# Full Stack App Documentation (Improved Version)

# We will build a Full Stack app

This app will allow the user to create an account on our platform, manage their account, write prompts and interact with the AI model, save posts, link social media accounts, and schedule posts to be shared automatically.

---

# The technology we will use

- **Next.js as a Full Stack Application**
- **TypeScript**
- **shadcn/ui & Tailwind CSS**
- **Supabase**
- **Vercel (for deployment)**

---

# The implementation plan

We have three main phases in our project:

1. **Set up the database and build the authentication system**
2. **Connect the chat model and build it**
3. **Connect the social media accounts and schedule posts**

---

# Phase 1 — starting the project

## We have three main tasks:

- Create the Supabase project
- Create backend routes for login, logout, and registration
- Manage the user state on the frontend

### Task distribution:

- **Noor** → Create the database
- **Khaled** → Create the backend
- **Razan** → Create the frontend and manage user state

---

# Noor — write here what you did

* 
* 
*

---

# Khaled's work

### Task description

I need to build a full authentication system with a backend that creates user sessions and connects to the database.

I started by building the backend routes.

### What we need:

- A route for registration  
  - It receives the username, password, and email  

### What happens when a new user creates an account?

1. We check the username, password, and email to confirm they are valid.
2. Then we check in the database if the email is already registered or not.
3. If both steps are successful, we create a token for the user.
   - This token is sent with each user request.
   - We store the token in cookies so the Next.js server can access it.
4. We hash the user password and store the hashed password in the database.  
   - This ensures that even if someone gets access to our database, they cannot know the real password.

### Libraries used:

- **JWT** → to manage user tokens  
- **bcrypt** → to hash the password  
- Backend built with **Next.js API routes**

### Final results:

- Created a login route that takes email and password, returns a user token, creates a session, and stores the token in cookies
- Created a registration route that returns the same response as login
- Created a logout route that deletes the user token from cookies

---

# Roozé — write here your work

# 🟦 User State Management — React Query + Validation + Hydration

## ⿡ React Query — Why & What

* *What:* إدارة *Server State* (Fetching / Caching / Refetching / Error & Loading states)
* *Why:*

  * تسهيل جلب وتحديث بيانات المستخدم
  * Cache ذكي → تجربة مستخدم سريعة
  * تنظيم الكود عبر *Custom Hooks*

---

## ⿡ User Data — Fetching

* useQuery تجلب currentUser من Supabase
* *queryKey:* "currentUser" → يضمن الكاش الصحيح
* *queryFn:* الفنكشن اللي تنفذ طلب الـ API

*Benefit:*

* بيانات جاهزة لأي Component
* لا حاجة fetch متكرر

ts
export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
  });
}


---

## ⿣ Mutations — Updating User

* العمليات: Register / Login / Logout / Update
* Hook: useMutation
* بعد نجاح العملية → invalidateQueries(['currentUser']) → React Query تحدث الكاش تلقائيًا

*Code Example:*

ts
const { mutate } = useMutation(loginUser, {
  onSuccess: () => queryClient.invalidateQueries(['currentUser'])
});


---

## ⿤ Validation — Yup

* التأكد من صحة البيانات قبل إرسالها للسيرفر
* مع React Hook Form → إظهار Errors مباشرة تحت الحقول
* *Example Schema:*

ts
const loginSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().min(6).required(),
});


---

## ⿥ Hydration — Data Injection

* منع *Flicker* عند refresh
* Steps:

  1. prefetchQuery على Server Side
  2. dehydrate البيانات → Client
  3. HydrationBoundary → React Query rehydrates
* Result: UI يظهر مباشرة باسم المستخدم

---

## ⿦ Full Flow — Summary

mermaid
flowchart TD
A[App Start] --> B[QueryClientProvider mounted]
B --> C[Hydrate dehydrated state]
C --> D{User cached?}
D -->|Yes| E[Render UI instantly]
D -->|No| F[useQuery fetch from Supabase]
F --> G{Success?}
G -->|Yes| H[Cache user + update UI]
G -->|No| I[Set currentUser=null]


mermaid
sequenceDiagram
User->>UI: Open App
UI->>ReactQuery: useQuery(['currentUser'])
ReactQuery->>Supabase: fetch session/profile
Supabase-->>ReactQuery: User data or null
ReactQuery->>UI: Render final state
Note over UI: User clicks Login
UI->>ReactQuery: useMutation(loginUser)
ReactQuery->>Supabase: POST /login
Supabase-->>ReactQuery: Success
ReactQuery->>ReactQuery: invalidateQueries(['currentUser'])
ReactQuery->>UI: Update UI instantly


## ⿧ Conclusion

* *React Query:* إدارة حالة البيانات من السيرفر بسهولة
* *Fetching:* useQuery + caching
* *Mutations:* تحديث البيانات مع invalidate للكاش
* *Validation:* Yup + React Hook Form → بيانات صحيحة قبل الإرسال
* *Hydration:* منع Flicker → تجربة مستخدم ممتازة




---

# Phase 2 — Chat model integration

We will create the chat model and link the social media accounts and schedule posts.

---

# Starting with the AI model

The goal is to build and connect an AI chat model that:

- Takes a prompt
- Returns a streaming response
- Saves the chat to the database
- Saves the post for scheduling

### The role for each member:

- **Razan** → Build the backend and connect it with the AI model
- **Khaled** → Manage the chat interface, build the UI, create routes, and add database tables
- **Noor** → Save the chat session, get the sessions, add them to the state store, and display them

---

# Razan’s work

- Connected the Gemini model
- Created the route that receives the user message
- Connected the Gemini API
- Sent the message to the model
- Returned the response in a streaming way

### Write here how you did it, Y ROOZ:

🤖 AI Chat Integration — Summary (Razan’s Role)
📋 Overview

This section summarizes Razan’s work in the AI Content Scheduler project.

🎯 Main Responsibilities

Connect the frontend with Google Gemini AI

Ensure user messages (prompts) reach the API route /chat/send

Handle the request to Gemini API and stream back the response to the client

💡 Workflow

User sends a chat message

Message stored temporarily in Zustand (in-memory state)

Request hits /chat/send route → forwarded to Google Gemini AI

AI generates a response → returned to the original request point

Zustand updates in-memory chat state with AI response

✅ Outcome

Smooth integration between frontend and AI

Streaming responses handled efficiently

Simple, reliable in-memory chat workflow

# Khaled’s work

I built the chat module that:

- Creates a chat session
- Takes the user’s message
- Calls the AI route
- Gets the response
- Displays the response
- Adds the chat to the database
- Gets chat history from the database
- Displays the chat when clicked
- Checks the message type

### What must happen?

When the chat starts:

1. The request is sent to the AI model
2. There are three possible states: **failed**, **loading**, **success (data)**
3. Display the response in a streaming way
4. Stop the loading state and set error to false
5. The user can cancel the request → we need a cancel request mechanism
6. The AI response streams back to the user
7. The user can start a new chat
8. The user can clear the chat → this clears the screen only
9. When the user clears the chat, send a request to the database to save the chat

---

# Noor’s work

Get the chat sessions via the route Khaled created, store them in the state, and render them in the sidebar.

### OM ANOOR — Write here what you do:

-  
-  
-  
-  

---

# Phase 3 — Connect social media accounts

What we want to do in this phase:

- Link social media accounts for the user
- Post on the pages from our app
- Schedule posts

### Tasks:

- **Backend routes** → *Noor*
- **Meta Developer account setup** → *Khaled*
- **Scheduling process** → *Razan*

---

# Noor — write here what you did:

-  
-  
-  

---

# Khaled’s work

I created the app on Meta Developer Dashboard so our app is recognized by Meta.

This allows us to:

- Make users log in with Facebook
- Get access tokens
- Use the token to post on user pages

### Main issue:

The main problem was choosing the correct app type.  
We needed to create a **Consumer App**, not a **Business App**.

# Razan’s Work 

# ⏱ Post Scheduling Flow — Summary

## 📋 Overview

This document summarizes the *post scheduling workflow* in the AI Content Scheduler project.

### 🎯 Objectives

* Allow users to *schedule posts* for future publishing
* Store scheduled posts in Supabase
* Use *BullMQ + Redis* to process scheduled jobs
* Trigger the publish logic automatically at the right time

### 🛠 Technologies Used

* *Queue System:* BullMQ
* *Job Storage:* Redis
* *Backend:* Next.js API Routes
* *Database:* Supabase (scheduled_posts, posts)


## 💡 Approach

* User creates a scheduled post → saved in Supabase
* Backend adds a BullMQ job with a delay based on the scheduled time
* Redis holds the job until its execution time
* Worker reads the job when the delay ends and triggers the publish logic


## 📁 Relevant File Structure

* src/shared/libs/bull/queue.ts → BullMQ queue configuration
* src/shared/libs/bull/worker.ts → Worker that processes scheduled jobs
* src/app/api/chat/from-chat/route.ts → Creates a scheduled post + queue job
* src/app/api/facebook/publish/route.ts → Actual publish logic


## 🔧 Scheduling Flow

### *1. User Schedules a Post*

* User sends (content + scheduled time)
* Request reaches /chat/from-chat
* Save the post in posts with the schedualed_at and status schedualed
* Add a BullMQ job with a delay = (scheduledTime - now)

### *2. Queue + Redis*

* BullMQ stores the job inside Redis
* Redis counts down the delay
* When delay ends → job becomes ready

### *3. Worker Executes Job*

* Worker receives the job from Redis
* Calls the publish route
* Publishes the post
* (Optional) Saves final published data into posts table


## 🔁 Flow Summary

1. User schedules post
2. Backend saves schedule + creates delayed job
3. Redis waits until time comes
4. Worker triggers publish logic
5. Post is published automatically


## ✅ Features

* Reliable queued scheduling
* Accurate delayed execution using Redis
* Clear separation between *scheduling* and *publishing*
* Scalable and clean architecture


## 🐳 Production (Vercel Cron Job)

**💡 Why:**

* Workers مثل **BullMQ** لا تعمل في بيئات Serverless (مثل Vercel).
* الحل: استخدام **Vercel Cron Jobs** لتنفيذ المهام المجدولة.

---

### ⚙️ Steps | الخطوات

1. **🔗 Create Endpoint | إنشاء Endpoint**

   * مثال: `api/facebook/publish`

2. **🔑 Add Secret | إضافة رمز سري**

   * مثال: `secret-publish`

3. **⏰ Schedule Cron Job | جدولة Cron Job**

   * ضبط الجدول للتنفيذ كل عدة دقائق حسب الحاجة

4. **🚀 Execution | التنفيذ**

   * الـ Cron Job يستدعي الـ Endpoint وينفذ المهام كما يفعل Worker

---

### ⚠️ Notes | ملاحظات

* تحقق من الرمز السري على السيرفر لمنع الوصول غير المصرح به
* عدل تكرار التنفيذ حسب عبء العمل والحاجة


## 📌 Summary

*Kept:* BullMQ, Redis, Supabase tables, Next.js routes, Worker logic.
*Approach:* Focused purely on the *core scheduling pipeline* without UI or unrelated details.

