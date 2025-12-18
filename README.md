# 🚀 AI Content Scheduler

A comprehensive platform for managing and scheduling social media content powered by artificial intelligence, built with the latest **Next.js 16** and **React 19** technologies.

---

## ✨ Key Features

### 🤖 Advanced Artificial Intelligence
- **Smart Content Generation** - Generate professional posts from short prompts using Gemini AI
- **Interactive Chat** - Direct conversation with AI to create and enhance content
- **Save Conversations as Posts** - Convert any conversation into a publishable post

### 📊 Advanced Dashboard
- **Comprehensive Statistics** - Detailed view of all posts and performance
- **Posts Management** - View, edit, delete, and publish posts
- **Smart Scheduling** - Schedule posts for specific future times
- **Queue Management** - Track upcoming scheduled posts
- **Smart Alerts** - Notifications about overdue and failed posts

### 🔐 Fully Custom Authentication System
- **Advanced Encryption** - bcrypt with 12 rounds of hashing
- **jose Tokens** - Secure session management (7-day validity)
- **Secure Cookies** - HTTP-only with XSS and CSRF protection
- **Middleware Protection** - Automatic route protection
- **Session Restoration** - Auto-login on page refresh

### 🌐 Social Media Integration
- **Facebook Integration** - Direct publishing to Facebook
- **OAuth Authentication** - Secure connection with social media accounts
- **Multi-Platform Publishing** - Ready to expand (Instagram, Twitter, LinkedIn)

### 🎨 Modern User Interface
- **Contemporary Design** - Attractive interface using Tailwind CSS 4
- **Dark Mode** - Light and dark modes with smooth transitions
- **Responsive Design** - Fully responsive on all devices
- **Animations** - Framer Motion for smooth user experience
- **Radix UI Components** - Advanced and accessible UI components

### ⚡ High Performance and Advanced Architecture
- **Next.js 16 + Turbopack** - Exceptional speed in development and production
- **Feature-Sliced Design (FSD)** - Scalable architectural structure
- **Zustand State Management** - Easy and efficient state management
- **TanStack Query** - Efficient data and cache management
- **TypeScript** - Complete type safety

---

## 🛠️ Technology Stack

### Frontend Stack
- **Next.js 16** - React framework with App Router and Turbopack
- **React 19.2.0** - UI library
- **TypeScript 5.7.3** - Type safety
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **Framer Motion 11.15.3** - Animations library
- **Lucide React 0.468.0** - Modern icon library
- **Radix UI** - Accessible UI components (Dialog, Dropdown, Toast, etc.)
- **Zustand 5.0.2** - State management
- **TanStack Query 5.62.11** - Server state management
- **React Hook Form 7.54.2** - Form handling
- **Zod 3.24.1** - Schema validation

### Backend Stack
- **Next.js API Routes** - Serverless API endpoints
- **Supabase 2.46.2** - PostgreSQL database
- **bcryptjs 2.4.3** - Password hashing
- **jsonwebtoken 9.0.2** - JWT creation and verification

### AI Integration
- **@google/generative-ai 0.21.0** - Google Gemini AI integration

---

## 📁 Project Structure (Feature-Sliced Design)

```
AI-Content-Scheduler/
├── src/
│   ├── app/                              # Next.js App Router
│   │   ├── (main-layout)/                # Landing page
│   │   ├── (auth-layout)/                # Authentication pages
│   │   │   ├── login/                    # Login page
│   │   │   └── register/                 # Register page
│   │   ├── (chat-layout)/                # AI Chat page
│   │   │   └── chat/
│   │   ├── dashboard/                    # Dashboard
│   │   │   ├── page.tsx                  # Main dashboard page
│   │   │   └── posts/                    # Posts management page
│   │   ├── api/                          # API Routes
│   │   │   ├── auth/                     # Authentication endpoints
│   │   │   │   ├── register/             # User registration
│   │   │   │   ├── login/                # User login
│   │   │   │   ├── logout/               # User logout
│   │   │   │   └── me/                   # Get user session
│   │   │   ├── chat/                     # AI chat endpoints
│   │   │   ├── posts/                    # Posts management (CRUD)
│   │   │   ├── facebook/                 # Facebook integration
│   │   │   │   ├── me/                   # Facebook data
│   │   │   │   └── publish/              # Publish to Facebook
│   │   │   └── oauth/                    # Social media OAuth
│   │   │       ├── facebook/             # Facebook OAuth
│   │   │       └── twitter/              # Twitter OAuth
│   │   └── _providers/                   # React Context Providers
│   │
│   ├── entities/                         # Business entities
│   │   ├── posts/                        # Posts entity
│   │   │   └── model/
│   │   │       ├── posts-store.ts        # Zustand Store for posts
│   │   │       └── types.ts              # TypeScript types
│   │   ├── chat/                         # Chat entity
│   │   │   └── model/
│   │   │       └── chat-store.ts         # Zustand Store for chat
│   │   └── user/                         # User entity
│   │
│   ├── features/                         # Reusable features
│   │   ├── user/                         # User features
│   │   │   ├── login/                    # Login feature
│   │   │   └── register/                 # Register feature
│   │   ├── chat/                         # Chat features
│   │   │   ├── start-chat/               # Start conversation
│   │   │   ├── clear-chat/               # Clear conversation
│   │   │   └── save-as-post/             # Save as post
│   │   └── posts/                        # Posts features
│   │       └── fetch-posts/              # Fetch posts
│   │
│   ├── widgets/                          # Composite components
│   │   ├── HomePage/                     # Landing page components
│   │   │   └── ui/
│   │   │       ├── HeroSection.tsx       # Hero section
│   │   │       ├── FeaturesSection.tsx   # Features section
│   │   │       ├── HowItWorksSection.tsx # How it works
│   │   │       ├── PricingSection.tsx    # Pricing
│   │   │       ├── TestimonialsSection.tsx # Testimonials
│   │   │       ├── AboutSection.tsx      # About section
│   │   │       └── FAQSection.tsx        # FAQ
│   │   ├── chat/                         # Chat components
│   │   │   └── ui/
│   │   │       ├── ChatWidget.tsx        # Complete chat widget
│   │   │       ├── ChatInterface.tsx     # Chat interface
│   │   │       ├── ChatSidebar.tsx       # Chat sidebar
│   │   │       ├── MessageBubble.tsx     # Message bubble
│   │   │       ├── MessageActions.tsx    # Message actions
│   │   │       └── TypingIndicator.tsx   # Typing indicator
│   │   ├── dashboard/                    # Dashboard components
│   │   │   └── _components/
│   │   │       ├── Dashboard.tsx         # Main dashboard
│   │   │       ├── DashboardLayout.tsx   # Dashboard layout
│   │   │       ├── DashboardHeader.tsx   # Dashboard header
│   │   │       ├── DashboardSidebar.tsx  # Dashboard sidebar
│   │   │       ├── StatsCards.tsx        # Statistics cards
│   │   │       ├── PostsTabs.tsx         # Posts tabs
│   │   │       ├── RecentPostsTable.tsx  # Posts table
│   │   │       ├── UpcomingQueue.tsx     # Upcoming queue
│   │   │       ├── AlertsPanel.tsx       # Alerts panel
│   │   │       └── posts/
│   │   │           ├── PostsPage.tsx     # Posts page
│   │   │           ├── PostsTable.tsx    # Posts table
│   │   │           └── PostsFiltersBar.tsx # Filters bar
│   │   ├── scheduler/                    # Scheduling modal
│   │   │   └── ScheduleModal.tsx
│   │   ├── header/                       # Header
│   │   └── footer/                       # Footer
│   │
│   └── shared/                           # Shared resources
│       ├── api/                          # API clients
│       │   ├── api-client.ts             # HTTP Client with JWT
│       │   ├── error.ts                  # Error handling
│       │   ├── cookies.ts                # Cookie management
│       │   └── getUserclient.ts          # Get user data
│       ├── libs/                         # Core libraries
│       │   ├── auth/
│       │   │   ├── passwordHash.ts       # Password encryption
│       │   │   ├── jwt.ts                # JWT management
│       │   │   └── cookies.ts            # Secure cookies
│       │   ├── supabase*.ts              # Supabase clients
│       │   └── gemini/                   # Gemini AI integration
│       ├── components/ui/                # Base UI components
│       │   └── ... (Radix UI Components)
│       └── ui/                           # Custom UI components
│           ├── ThemeToggle.tsx           # Theme toggle
│           └── floating-icons.tsx        # Floating icons
│
├── middleware.ts                         # Global Middleware (route protection)
├── Dockerfile                            # Docker configuration
├── tailwind.config.ts                    # Tailwind CSS configuration
├── tsconfig.json                         # TypeScript configuration
└── next.config.ts                        # Next.js configuration
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18 or newer
- **npm** / **yarn** / **pnpm**
- **Supabase** account
- **Google AI API Key** (for AI features)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/khaledabosaeed/AI-Content-Scheduler.git
cd AI-Content-Scheduler
```

#### 2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

#### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# JWT Secret (secret key for signatures)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Google Generative AI (Gemini)
GOOGLE_API_KEY=your-google-ai-api-key

# Facebook App (for Facebook integration)
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate a secure JWT secret:**
```bash
openssl rand -base64 32
```

#### 4. Run the project

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

#### 5. Open your browser

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📝 Available Commands

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🔒 Security and Protection

### Implemented Security Practices

- ✅ **Password Hashing** - bcrypt with 12 rounds of automatic hashing
- ✅ **JWT Signing** - Secure digital signature for tokens
- ✅ **HTTP-only Cookies** - JavaScript cannot access tokens
- ✅ **CSRF Protection** - SameSite attribute for cookies
- ✅ **HTTPS Enforcement** - Secure cookies in production
- ✅ **Token Expiration** - Expires after 7 days
- ✅ **Input Validation** - Zod schemas for all inputs
- ✅ **SQL Injection Prevention** - Using Supabase ORM
- ✅ **XSS Protection** - Input and output sanitization
- ✅ **API Rate Limiting** - Protection from excessive requests

### Authentication Flow

```
Registration:
User Input → Validation → Password Hash → Database → JWT Creation →
Secure Cookie → Auto Login → Dashboard

Login:
Credentials → Validation → Password Verify → JWT Creation →
Secure Cookie → Dashboard

Access:
Request → Cookie Check → JWT Verify → Allow/Deny

Logout:
Request → Clear Cookie → Clear Store → Redirect to Login
```

---

## 📚 API Documentation

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user

**Request Body:**
```typescript
{
  email: string;    // Email address
  password: string; // Password (minimum 8 characters)
  name: string;     // Full name
}
```

#### `POST /api/auth/login`
User login

#### `POST /api/auth/logout`
User logout

#### `GET /api/auth/me`
Get current user data

---

### Posts Endpoints

#### `GET /api/posts`
Fetch all user posts

#### `POST /api/posts`
Create a new post

#### `PUT /api/posts/[id]`
Update a post

#### `DELETE /api/posts/[id]`
Delete a post

#### `POST /api/posts/from-chat`
Create a post from AI conversation

---

### Chat Endpoints

#### `POST /api/chat`
Send a message to AI

---

### Facebook Endpoints

#### `GET /api/facebook/me`
Get connected Facebook account data

#### `POST /api/facebook/publish`
Publish a post to Facebook

---

## 🎨 Advanced Features

### 1. State Management

The project uses **Zustand** for simple and efficient state management:

- **Posts Store**: Posts management, scheduling, publishing, Facebook integration
- **Chat Store**: Conversation management, history saving, converting conversations to posts

### 2. Scheduling System

- Schedule posts for specific times
- Interactive queue
- Alerts for overdue posts
- Cancel scheduling

### 3. AI Chat Interface

- Natural conversation with Gemini AI
- Save conversations
- Convert conversations to posts
- Clear history

### 4. Interactive Dashboard

- **Real-time Statistics**: Total posts, scheduled posts, published posts
- **Advanced Tables**: Filtering, search, sorting
- **Quick Actions**: Edit, delete, publish, schedule
- **Responsive Design**: Works on all devices

---

## 🏗️ Architecture

### Feature-Sliced Design (FSD)

The project follows **FSD** architecture to achieve:
- **Scalability**: Easy to add new features
- **Maintainability**: Organized and easy-to-understand code
- **Reusability**: Reusable components
- **Separation of Concerns**: Each layer has a clear responsibility

#### Layers:

1. **`app/`** - Application layer (Routes, Pages, Providers)
2. **`entities/`** - Business entities (Business Logic)
3. **`features/`** - Reusable features
4. **`widgets/`** - Composite components
5. **`shared/`** - Shared resources (UI, API, Utils)

---

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy the project
vercel
```

**Note**: Don't forget to add قد يرفض Git التحويل.

environment variables in the Vercel dashboard.

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Team

**Developers:**
- [@khaledabosaeed](https://github.com/khaledabosaeed)
- [@noorafifi889](https://github.com/noorafifi889)
- [@Razanbalata](https://github.com/Razanbalata)

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
- AI by [Google Gemini](https://ai.google.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- UI Components by [Radix UI](https://www.radix-ui.com/)

---

## 📊 Statistics

- **140+** TypeScript/TSX files
- **Feature-Sliced Design** architecture
- **Custom Authentication** without external libraries
- **Full TypeScript** for safety and quality
- **Modern Stack** with latest versions

---

## 🎯 Roadmap

### ✅ Completed
- [x] Complete authentication system
- [x] AI chat interface
- [x] Advanced dashboard
- [x] Posts management (CRUD)
- [x] Smart scheduling
- [x] Facebook integration
- [x] Dark Mode
- [x] Responsive Design

### 🔄 In Progress
- [ ] Advanced statistics and analytics
- [ ] Instagram integration
- [ ] Twitter/X integration
- [ ] LinkedIn integration

### 🎯 Future
- [ ] Mobile app (React Native)
- [ ] Teams and permissions system
- [ ] Platform-optimized AI
- [ ] Automatic smart scheduling
- [ ] Advanced reports and analytics

---

<div align="center">

### ⭐ If you like this project, don't forget to star it!

**Made with ❤️ in Gaza 🇵🇸**

</div>
