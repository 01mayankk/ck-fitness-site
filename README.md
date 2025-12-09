# CK Fitness - Premium Gym Website

A modern, full-stack fitness gym website built with Next.js 16, featuring membership management, payment integration, user authentication, and a blog platform.

## 🚀 Project Overview

CK Fitness is a comprehensive gym management platform that provides:
- **Public-facing website** with gym information, membership plans, and blog
- **User authentication** via Supabase Auth
- **Membership management** with Razorpay payment integration
- **Member dashboard** for profile management and membership tracking
- **FitTalks blog** for fitness content and community engagement

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0.7** (App Router)
- **React 19.2.0**
- **TypeScript 5**
- **Tailwind CSS 4** (with PostCSS)
- **Framer Motion** (animations)
- **React Icons**

### Backend & Services
- **Supabase** (Authentication & Database)
  - User authentication
  - Database for memberships, posts, user profiles
  - Storage for avatar images
- **Razorpay** (Payment Gateway)
  - Order creation API
  - Payment processing

### Development Tools
- **ESLint** (code linting)
- **TypeScript** (type safety)
- **Next Themes** (dark/light mode support)

## 📁 Project Structure

```
ckfitness/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   ├── create-order/  # Razorpay order creation
│   │   │   └── activate-membership/ # Membership activation
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── fit-talks/         # Blog section
│   │   │   ├── new/          # Create new post (admin)
│   │   │   └── slug/         # Individual post pages
│   │   ├── member-panel/      # User dashboard
│   │   ├── membership/        # Membership plans page
│   │   ├── pulse-connect/     # Community (placeholder)
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── AvatarCropper.tsx
│   │   ├── Countdown.tsx
│   │   ├── CropModal.tsx
│   │   ├── Hero.tsx
│   │   └── Navbar.tsx
│   ├── lib/                   # Utility libraries
│   │   └── supabaseClient.ts  # Supabase client configuration
│   ├── types/                 # TypeScript type definitions
│   │   └── razorpay.d.ts
│   └── utils/                 # Helper functions
│       └── cropImage.ts
├── public/                    # Static assets
├── next.config.ts             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies

```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Razorpay account (for payments)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ckfitness
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚢 Deployment on Vercel

### Fixed Issues
- ✅ **useSearchParams Suspense Boundary**: Fixed the deployment error by wrapping `useSearchParams()` in a Suspense boundary in `/auth/login/page.tsx`

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix deployment issues"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard, add all environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`

4. **Deploy**
   - Vercel will automatically build and deploy
   - Build should now succeed with the Suspense boundary fix

### Build Commands
- **Build**: `npm run build`
- **Start**: `npm start`
- **Dev**: `npm run dev`

## 📋 Features

### Public Pages
- **Homepage**: Hero section, countdown timer, gym features, gallery, testimonials
- **Membership Plans**: 4 tiered membership options with pricing
- **FitTalks Blog**: Blog listing and individual post pages
- **PulseConnect**: Community section (placeholder)

### Authentication
- User signup with email/password
- User login with email/password
- Session management via Supabase Auth
- Protected routes (member panel)

### Member Dashboard
- Profile management (name, phone, avatar)
- Avatar upload with image cropping
- Membership status and expiry tracking
- Membership plan details

### Payment Integration
- Razorpay payment gateway
- Order creation API
- Membership activation after successful payment
- 30-day membership period

### Blog System
- Create new blog posts (admin)
- View published posts
- Individual post pages with slug routing
- Category and date display

## 🔐 Environment Variables Required

| Variable | Description | Required For |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Authentication, Database |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Authentication, Database |
| `RAZORPAY_KEY_ID` | Razorpay API key ID | Payment processing (server) |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | Payment processing (server) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key | Payment checkout (client) |

## 🐛 Known Issues & Fixes

### ✅ Fixed: Vercel Deployment Error
**Issue**: `useSearchParams() should be wrapped in a suspense boundary`
- **Location**: `src/app/auth/login/page.tsx`
- **Solution**: Wrapped the component using `useSearchParams()` in a `Suspense` boundary
- **Status**: ✅ Fixed

## 📝 Database Schema (Supabase)

### Tables Required:
1. **memberships**
   - `id` (uuid)
   - `user_id` (uuid, foreign key to auth.users)
   - `plan` (text)
   - `start_date` (timestamp)
   - `expiry_date` (timestamp)
   - `is_active` (boolean)
   - `created_at` (timestamp)

2. **posts**
   - `id` (uuid)
   - `slug` (text, unique)
   - `title` (text)
   - `excerpt` (text, nullable)
   - `content` (text)
   - `cover_image_url` (text, nullable)
   - `category` (text, nullable)
   - `published` (boolean)
   - `created_at` (timestamp)

3. **Storage Bucket**: `avatars`
   - Public bucket for user profile images

## 🎨 Design & Styling

- **Color Scheme**: Dark theme with cyan accent (`#00E6C8`, `#00C2A8`)
- **Typography**: Geist Sans, Geist Mono, Bebas Neue (for logo)
- **Animations**: Framer Motion for page transitions and interactions
- **Responsive**: Mobile-first design with Tailwind CSS

## 📚 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 👤 Author

CK Fitness Development Team

---

**Note**: This project requires a Supabase project with the appropriate database tables and storage buckets configured. Ensure all environment variables are set before deployment.
