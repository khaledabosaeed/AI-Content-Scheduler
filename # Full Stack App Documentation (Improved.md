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
*
*
*
*



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

-  
-  
-  

### Errors we had:

The issue was with the AI model version.  
We changed it from **Flash 1.5 → Flash 2.5**.

Razan created one route that does:  
**req → body → stream(response) → status 200**

---

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

---
