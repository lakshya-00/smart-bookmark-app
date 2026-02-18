'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL
        const code = new URLSearchParams(window.location.search).get('code');
        const error = new URLSearchParams(window.location.search).get('error');

        if (error) {
          console.error('Auth error:', error);
          router.push('/auth/login?error=' + error);
          return;
        }

        if (code) {
          // Exchange code for session
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Exchange error:', exchangeError);
            router.push('/auth/login?error=exchange_failed');
            return;
          }
        }

        // Verify session was created
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Clean URL before redirecting
          window.history.replaceState({}, document.title, '/');
          router.push('/');
        } else {
          router.push('/auth/login?error=no_session');
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/auth/login?error=callback_failed');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin text-5xl mb-4">⏳</div>
        <p className="text-zinc-400 font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
