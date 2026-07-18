# EduPro — AI-Driven Personal Learning Platform

A full stack intelligent learning platform that combines curated study materials with AI-powered features like chat assistance and document analysis. Built for learners who want smarter, data-driven education tools backed by modern engineering practices.

The platform includes secure authentication, Google OAuth, user-specific content management, real-time AI streaming, interactive analytics dashboards, and a clean responsive interface built with Next.js, Tailwind CSS, and Gemini AI.

---

## Live Project

🔗 **Live Site:** [View Live Site](https://edupro-4icx.onrender.com)

### Source Code

- **GitHub Frontend Repo:** [View Frontend Project Repo](https://github.com/HSBHasib/EduPro)
- **GitHub Backend Repo:** [View Backend Project Repo](https://github.com/HSBHasib/EduPro-Server)

---

# Project Demo

*Live screenshots available at the deployed link above.*

<img width="1376" height="768" alt="promptHive1" src="https://github.com/user-attachments/assets/401d8f24-64c0-436c-807a-aee7fb02ec17" />

---

# Technologies Used

## Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion (Animations & Transitions)
- Recharts (Interactive Data Visualizations)
- React Hook Form + Zod (Form Handling & Validation)
- pdfjs-dist (Client-Side PDF Text Extraction)
- jsPDF (PDF Report Generation)

## Backend
- Node.js
- Express.js
- TypeScript (Strict Type Checking)
- MongoDB Aggregation Pipeline

## AI Integration
- Google Gemini API (Chat Streaming + Document Analysis)

## Authentication & Security
- BetterAuth (Session-Based Auth)
- MongoDB Atlas (Secure Session Storage)
- Google OAuth 2.0
- HTTP-Only Cookie Sessions
- Role-Free User Scoping (Per-User Data Isolation)

## Database
- MongoDB Atlas

---

# Core Features

## Authentication & Authorization
- Email/password registration and login with form validation
- Google OAuth social sign-in integration
- Session-based authentication with HTTP-only cookies
- Protected routes with AuthGuard components
- Auto-redirect to login with callback URL preservation

## AI Chat Assistant
- Real-time streaming responses powered by Gemini AI
- Conversation history persistence per session
- Context-aware follow-up reasoning
- Session management with create, view, and delete operations
- Typing indicators and suggested prompts

## AI Document Intelligence
- PDF upload with client-side text extraction via pdfjs-dist
- AI-powered document summarization and key topic extraction
- Action item generation from document content
- Downloadable PDF reports with styled summaries
- Support for plain text file uploads

## Learning Material Management
- User-specific content creation and management
- Image upload integration via ImgBB API
- Category and priority-based organization
- Tag-based content labeling
- View count tracking per material

## Analytics Dashboard
- User-specific bar charts for monthly content creation trends
- Priority distribution pie charts
- Category breakdown with progress bars
- Stats cards (total items, total views, average views per item)
- Recent items quick view

## Explore & Discovery
- Full-text search across materials
- Multi-field filtering (category, priority)
- Sort options (newest, oldest, most viewed, title A-Z, title Z-A)
- URL-based pagination with filter persistence
- Active filter chips with individual remove buttons

## Landing Page
- Animated banner slider with three contextual slides
- Features section highlighting AI capabilities
- How It Works step-by-step guide
- Live statistics section
- Category browsing grid
- Testimonials carousel
- FAQ accordion section
- Responsive navbar with mobile sidebar drawer

---

# Major Dependencies

### Frontend
- next
- react
- react-dom
- typescript
- tailwindcss
- framer-motion
- recharts
- react-hook-form
- zod
- better-auth
- pdfjs-dist
- jspdf
- lucide-react
- react-hot-toast

### Backend
- express
- mongodb
- mongoose
- better-auth
- cors
- helmet
- express-rate-limit
- dotenv
- typescript
- zod

---

# Run Locally

## 1. Clone the repositories

### Frontend
```bash
git clone https://github.com/HSBHasib/EduPro
cd EduPro
```

### Backend
```bash
git clone https://github.com/HSBHasib/EduPro-Server
cd EduPro-Server
```

## 2. Set up environment variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
```

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

## 3. Install dependencies and run

### Backend
```bash
npm install
npm run dev
```

### Frontend
```bash
npm install
npm run dev
```

## 4. Open the application
```
http://localhost:3000
```

---

# Learning Outcomes

Building EduPro pushed me across the full stack and taught me several real-world engineering lessons:

- **PDF.js Integration in Next.js:** Discovered that pdfjs-dist v4 ESM modules fail with dynamic imports in production. Solved it by copying the worker file to the public directory, disabling the web worker, and adding the package to transpilePackages in next.config.ts.
- **Session-Based Auth with BetterAuth:** Learned how to configure cookie attributes (secure, httpOnly, sameSite) for production HTTPS environments. Had to resolve redirect_uri_mismatch errors by properly registering callback URIs in Google Cloud Console and setting the baseURL on the auth server.
- **User-Scoped Data Architecture:** Designed a userId-based data isolation pattern where each learning item is tied to its creator. Built a dedicated /api/items/mine endpoint and aggregation pipeline for per-user analytics without exposing other users' data.
- **Streaming AI Integration:** Implemented Server-Sent Events (SSE) streaming from Gemini AI through an Express backend, proxied via Next.js rewrites. Learned to handle chunked responses, parse SSE data lines, and manage streaming state on the client.
- **Environment Variable Management:** Learned the critical difference between NEXT_PUBLIC_ variables (client-side, build-time) and server-only variables. Consolidated all hardcoded URLs and secrets into environment variables for secure production deployment across Vercel and Render.
- **Monorepo Deployment:** Mastered deploying two separate services (Next.js frontend on Render, Express backend on Render) with proper CORS configuration, environment variable syncing, and cross-origin cookie handling.

---

## Developed By

**Hasibur Rahman**
- MERN Stack Developer & Aspiring Software Engineer
- Tongi, Gazipur, Bangladesh
- GitHub: [@HSBHasib](https://github.com/HSBHasib)
- LinkedIn: [Hasibur Rahman](https://www.linkedin.com/in/hasibur-rahman19)
