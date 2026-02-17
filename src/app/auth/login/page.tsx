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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin">⏳</div>
          <p className="text-gray-600 mt-4">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="flex justify-center mb-8 animate-slideDown">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-2xl opacity-40"></div>
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-5xl">📌</span>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 animate-fadeIn">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent text-center mb-3">
            Smart Bookmark
          </h1>
          <p className="text-center text-slate-600 mb-8 text-lg">
            Save, organize, and access your bookmarks everywhere
          </p>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-white to-slate-50 border-2 border-slate-200/50 rounded-xl px-4 py-4 font-bold text-slate-700 hover:border-blue-300/50 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Signing in...
              </>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" className="group-hover:scale-110 transition-transform duration-300">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Features */}
          <div className="mt-10 space-y-4 pt-8 border-t border-slate-200/50">
            <div className="flex items-start gap-4 group">
              <span className="text-2xl mt-1 group-hover:scale-125 transition-transform duration-300">✨</span>
              <div>
                <p className="font-bold text-slate-900">Quick Save</p>
                <p className="text-sm text-slate-600">Save bookmarks with just a URL and title</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <span className="text-2xl mt-1 group-hover:scale-125 transition-transform duration-300">🔒</span>
              <div>
                <p className="font-bold text-slate-900">Private & Secure</p>
                <p className="text-sm text-slate-600">Your bookmarks are private to your account</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <span className="text-2xl mt-1 group-hover:scale-125 transition-transform duration-300">⚡</span>
              <div>
                <p className="font-bold text-slate-900">Real-time Sync</p>
                <p className="text-sm text-slate-600">Updates sync instantly across all devices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
