'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        router.push('/');
      }
    };

    checkAuth();
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error('Login error:', error);
        alert('Failed to login. Make sure Google OAuth is configured in Supabase.\n\nError: ' + error.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Google OAuth not configured yet. Please set it up in Supabase Google Auth settings.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-zinc-400 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 transform hover:scale-105 transition-transform">
            <span className="text-4xl">📌</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 px-12 py-16 shadow-2xl">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent leading-tight">
            Smart Bookmark
          </h1>
          <p className="text-center text-zinc-400 mb-16 text-base leading-relaxed">
            Save, organize, and access your bookmarks everywhere
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-xl px-6 py-4 font-medium text-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group mb-16"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Signing in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Features */}
          <div className="space-y-8 pt-12 border-t border-zinc-800/50">
            <div className="flex items-start gap-5 group">
              <span className="text-2xl group-hover:scale-110 transition-transform flex-shrink-0">✨</span>
              <div>
                <p className="font-semibold text-zinc-200 mb-2 leading-snug">Quick Save</p>
                <p className="text-sm text-zinc-500 leading-relaxed">Save bookmarks with just a URL and title</p>
              </div>
            </div>
            <div className="flex items-start gap-5 group">
              <span className="text-2xl group-hover:scale-110 transition-transform flex-shrink-0">🔒</span>
              <div>
                <p className="font-semibold text-zinc-200 mb-2 leading-snug">Private & Secure</p>
                <p className="text-sm text-zinc-500 leading-relaxed">Your bookmarks are private to your account</p>
              </div>
            </div>
            <div className="flex items-start gap-5 group">
              <span className="text-2xl group-hover:scale-110 transition-transform flex-shrink-0">⚡</span>
              <div>
                <p className="font-semibold text-zinc-200 mb-2 leading-snug">Real-time Sync</p>
                <p className="text-sm text-zinc-500 leading-relaxed">Updates sync instantly across all devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
