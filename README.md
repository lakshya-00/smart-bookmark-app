# Smart Bookmark App

A modern, fast, and secure bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

✨ **Easy to Use**
- Sign in with Google (OAuth only)
- Add bookmarks with URL and title
- View and delete your bookmarks

🔒 **Private & Secure**
- Bookmarks are private to each user
- User A cannot see User B's bookmarks
- Secure authentication with Supabase

⚡ **Real-time Sync**
- Bookmarks update in real-time across all devices
- Open two tabs and see updates instantly without page refresh

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Real-time**: Supabase Realtime Subscriptions

## How It Works

### Authentication Flow
- Google OAuth 2.0 integration using Supabase
- Secure session management with automatic redirects
- Protected routes for authenticated users only

### Real-time Updates
- Uses Supabase Realtime subscriptions for instant data synchronization
- When a bookmark is added/deleted, all browser tabs update instantly
- Works seamlessly across multiple devices with the same account

### Data Privacy & Security
- Row Level Security (RLS) policies ensure each user only sees their own bookmarks
- All data is encrypted in transit (HTTPS)
- User data is completely isolated in the database
- Secure token-based authentication

## Key Development Challenges & Solutions

### Google OAuth Configuration Issue

**Challenge:**
During development, I encountered a `redirect_uri_mismatch` error when authenticating with Google. The authentication flow was failing because the redirect URL wasn't properly registered.

**Solution:**
After researching Supabase and Google Cloud documentation, I discovered:
- The Supabase callback URL must be explicitly registered in Google Cloud Console's "Authorized redirect URIs"
- Format must match exactly: `https://supabase-url/auth/v1/callback`
- Both Supabase and Google Cloud settings must be synchronized

This taught me the importance of understanding OAuth 2.0 flows and careful configuration management.

### Modern UI/UX Design

Rather than using basic CSS, I implemented a **modern, soothing design** with:

**Design Features:**
- **Glassmorphism** - Frosted glass effects with backdrop blur for a premium feel
- **Gradient Backgrounds** - Blue-indigo-purple color palette creating a calming atmosphere
- **Smooth Animations** - Professional fade-in, slide-down, and scale transitions
- **Interactive Elements** - Hover effects and focus states for better user feedback
- **Responsive Layout** - Clean, centered design that adapts to all screen sizes

**Why?**
A polished, modern interface not only looks professional but also improves user experience and engagement. It demonstrates attention to detail and product design thinking.

## Architecture Highlights

- **Component-Based**: Modular components (BookmarkForm, BookmarkList, BookmarkCard, Navbar)
- **Type-Safe**: Full TypeScript coverage across the application
- **Real-time Subscriptions**: Supabase Realtime integration for live bookmark updates
- **Client-Side Auth**: Optimized authentication flow with useEffect hooks
- **CSS-in-JS**: Tailwind CSS for scalable styling without build complexity

## Project Outcome

A fully functional, production-ready bookmark application that demonstrates:
- Modern web development practices with Next.js and TypeScript
- Real-time database synchronization
- OAuth 2.0 authentication integration
- Professional UI/UX design thinking
- Problem-solving and debugging skills
- Documentation and code organization

### "Could not create a project called 'Bookmark'"
- The project name must be lowercase. Use `bookmark` instead.

### Real-time updates not working
- Ensure Realtime is enabled in your Supabase project
- Check that the `bookmarks` table has both Select and Delete RLS policies enabled

### Google OAuth fails
- Verify your Google OAuth credentials in Supabase
- Check that the redirect URL is correctly configured in both Supabase and Google Cloud Console

## Contributing

Feel free to open issues and pull requests!

## License

MIT
