# 🎯 AI Content Scheduler

A modern, full-stack web application built with **Next.js 16** that provides an intelligent content scheduling and management platform with enterprise-level **custom authentication** system.

## ✨ Key Features

- 🔐 **Custom Authentication System** - Built from scratch with industry-standard security practices
- 🔒 **Enterprise Security** - bcrypt password hashing, JWT tokens, secure HTTP-only cookies
- 🎨 **Modern UI** - Built with Tailwind CSS 4 and React 19
- 📱 **Responsive Design** - Mobile-first approach
- 🚀 **High Performance** - Next.js 16 with Turbopack
- 🗄️ **Database Integration** - Supabase (PostgreSQL)
- 🤖 **AI Integration** - Ready for AI-powered content features
- 📊 **State Management** - TanStack Query + Zustand
- 🛡️ **Type Safe** - Full TypeScript implementation

## 🔐 Custom Authentication System

This project features a **fully custom authentication system** that provides complete control over the authentication flow:

### Security Features
- ✅ **bcrypt Password Hashing** - 12-round hashing with automatic salt generation
- ✅ **JWT Token Management** - Signed tokens for stateless sessions (7-day expiry)
- ✅ **Secure HTTP-only Cookies** - XSS and CSRF protection
- ✅ **Middleware Protection** - Automatic route guards
- ✅ **Session Persistence** - Automatic session restore on page refresh

### Authentication Flow
```
Signup → Password Hash → Database → JWT Creation → Secure Cookie → Auto Login
Login  → Password Verify → JWT Creation → Secure Cookie → Dashboard
Access → Cookie Check → JWT Verify → Allow/Deny
Logout → Clear Cookie → Redirect to Login
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router and Turbopack
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **React Hook Form + Zod** - Form validation
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Supabase** - PostgreSQL database
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT creation and verification

### DevOps
- **Docker** - Containerization
- **ESLint** - Code linting
- **TypeScript** - Static type checking

## 📁 Project Structure

```
AI-Content-Scheduler/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── register/  # User signup
│   │   │   │   ├── login/     # User login
│   │   │   │   ├── logout/    # User logout
│   │   │   │   └── me/        # Session restore
│   │   │   └── chat/          # AI chat feature
│   │   ├── landingPage/       # Landing page
│   │   └── login/             # Login page
│   ├── entities/              # Business entities
│   │   ├── post/
│   │   └── user/
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   └── user/
│   ├── shared/                # Shared code
│   │   ├── api/               # API clients
│   │   ├── libs/              # Core libraries
│   │   │   ├── passwordHash.ts      # bcrypt utilities
│   │   │   ├── jwt.ts               # JWT utilities
│   │   │   ├── cookies.ts           # Cookie management
│   │   │   ├── auth-middleware.ts   # Auth helpers
│   │   │   └── supabase*.ts         # Supabase clients
│   │   └── ui/                # UI components
│   └── widgets/               # Composite components
├── middleware.ts              # Global middleware
├── Dockerfile                 # Docker configuration
└── Documentation/
    ├── AUTH_SYSTEM_DOCUMENTATION.md  # Full auth docs
    └── WHAT_WAS_DONE_AR.md          # Implementation guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/khaledabosaeed/AI-Content-Scheduler.git
cd AI-Content-Scheduler
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
# JWT Secret (generate a strong random key)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Generate a secure JWT secret:**
```bash
openssl rand -base64 32
```

4. **Set up the database**

Run this SQL in your Supabase SQL editor:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

```bash
npm run dev      # Start development server (with Turbopack)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🔒 Security Best Practices

This project implements:

- ✅ **Password Hashing** - bcrypt with automatic salt (never store plain passwords)
- ✅ **JWT Signing** - Cryptographically signed tokens
- ✅ **HTTP-only Cookies** - JavaScript cannot access auth tokens
- ✅ **CSRF Protection** - SameSite cookie attribute
- ✅ **HTTPS Enforcement** - Secure cookies in production
- ✅ **Token Expiration** - 7-day expiry with automatic cleanup
- ✅ **Input Validation** - Zod schemas for all inputs
- ✅ **Password Strength** - Enforced strong password requirements

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user
```typescript
{
  email: string,
  password: string,
  name: string
}
```

#### POST `/api/auth/login`
Login with credentials
```typescript
{
  email: string,
  password: string
}
```

#### POST `/api/auth/logout`
Logout current user

#### GET `/api/auth/me`
Get current user session

## 🏗️ Architecture

This project follows **Feature-Sliced Design (FSD)** architecture:

- **`app/`** - Next.js pages and routes
- **`entities/`** - Business entities
- **`features/`** - Feature modules
- **`shared/`** - Shared utilities
- **`widgets/`** - Composite components

## 📖 Documentation

- **[AUTH_SYSTEM_DOCUMENTATION.md](./AUTH_SYSTEM_DOCUMENTATION.md)** - Comprehensive auth system documentation (1000+ lines)
- **[WHAT_WAS_DONE_AR.md](./WHAT_WAS_DONE_AR.md)** - Implementation guide and migration notes
- **[CHECK_DATABASE.md](./CHECK_DATABASE.md)** - Database schema and setup

## 🐳 Docker Support

Build and run with Docker:

```bash
docker build -t ai-content-scheduler .
docker run -p 3000:3000 ai-content-scheduler
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Khaled Abo Saeed**
- GitHub: [@khaledabosaeed , @noorafifi889 , @Razanbalata](https://github.com/khaledabosaeed)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)

---

⭐ **Star this repository** if you find it helpful!
