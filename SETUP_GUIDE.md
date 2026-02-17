# Smart Bookmark App - Complete Setup Guide

## 📋 Quick Overview

This is a modern bookmark manager application built with:
- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

## 🚀 Project Status

✅ **Project Structure**: Complete and clean
✅ **TypeScript**: Fully typed components
✅ **Build**: Production-ready (no errors)
✅ **Code Quality**: ESLint configured

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page (dashboard)
│   ├── layout.tsx            # Root layout with Navbar
│   └── auth/
│       ├── login/page.tsx    # Google OAuth login page
│       └── callback/page.tsx # OAuth redirect handler
├── components/
│   ├── Navbar.tsx            # Top navigation bar
│   ├── BookmarkForm.tsx      # Add bookmark form
│   ├── BookmarkList.tsx      # Bookmarks list with real-time
│   └── BookmarkCard.tsx      # Individual bookmark card
├── lib/
│   └── supabase.ts           # Supabase client (lazy initialized)
└── styles/
    └── globals.css           # Global styles
```

## 🔧 Local Development Setup

### Step 1: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project (choose a region close to you)
4. Wait for project to initialize

### Step 2: Set Up Database

Copy and paste this SQL into the Supabase SQL Editor:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

### Step 3: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Google+ API
4. Create OAuth 2.0 credentials (Consent screen > Application type: Web > Create OAuth client ID)
5. Add redirect URIs:
   - For local: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.com/auth/callback`
6. Copy **Client ID** and **Client Secret**

In Supabase:
1. Go to **Authentication > Providers > Google**
2. Enable Google provider
3. Paste your Client ID and Secret
4. Save

### Step 4: Configure Environment Variables

Create `.env.local` in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
- Supabase Dashboard > Project Settings > API
- Copy the "Project URL" and "anon/public" key

### Step 5: Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🌐 Deploy to Vercel

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"
git branch -M main
git remote add origin https://github.com/your-username/smart-bookmark-app.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Step 3: Update Supabase OAuth

In Supabase > Authentication > URL Configuration:
- Add your Vercel URL: `https://your-project.vercel.app`
- Redirect URL: `https://your-project.vercel.app/auth/callback`

### Step 4: Update Google OAuth

In Google Cloud Console:
- Add Authorized redirect URI: `https://your-project.vercel.app/auth/callback`

## 📝 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code with ESLint
```

## ✨ Features Implemented

### ✅ Authentication
- Google OAuth login/signup
- Session management
- Automatic redirect to login if not authenticated

### ✅ Bookmarks
- Add bookmark with URL and title
- URL validation
- Real-time display update
- Delete own bookmarks

### ✅ Real-time Sync
- Supabase Realtime subscriptions
- Updates across multiple tabs/devices instantly
- No page refresh needed

### ✅ Privacy & Security
- Row Level Security (RLS) policies
- Users can only see/manage their own bookmarks
- Secure OAuth with Supabase

### ✅ UI/UX
- Clean, modern design with Tailwind CSS
- Responsive layout
- Loading states
- Error handling
- Smooth animations

## 🔐 Security Features

1. **Row Level Security (RLS)**: Database-level access control
2. **OAuth Only**: No password storage, delegated to Google
3. **Session Management**: Secure token handling via Supabase
4. **HTTPS Only**: Required in production
5. **Type Safety**: Full TypeScript coverage

## 📱 Responsive Design

- Mobile-first approach
- Works on all device sizes
- Touch-friendly buttons and inputs
- Optimized images and assets

## 🐛 Troubleshooting

### "Invalid supabaseUrl" Error
- Ensure `.env.local` is in the project root
- Verify URL and key are correct
- Restart dev server after changing env vars

### Real-time Updates Not Working
- Check Realtime is enabled in Supabase
- Verify RLS policies are correct
- Check browser console for errors

### Google OAuth Fails
- Verify Client ID and Secret in Supabase
- Check redirect URLs match exactly
- Clear browser cache and cookies

### Bookmarks Won't Save
- Check user is logged in
- Verify database RLS policies
- Check Supabase authentication status

## 🎯 Next Steps

1. Set up Supabase project
2. Configure Google OAuth
3. Add environment variables
4. Run `npm run dev`
5. Test locally
6. Deploy to Vercel

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

## 📄 License

MIT

---

**Built with ❤️ using Next.js, Supabase, and Tailwind CSS**
