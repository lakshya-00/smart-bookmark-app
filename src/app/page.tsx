'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import BookmarkForm from '@/components/BookmarkForm';
import BookmarkList from '@/components/BookmarkList';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          router.push('/auth/login');
          return;
        }
        setUser(session.user);
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: any, session: any) => {
        if (!session?.user) {
          router.push('/auth/login');
        } else {
          setUser(session.user);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleBookmarkAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Router will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Form on Left */}
          <div className="lg:col-span-1">
            <div className="sticky top-[calc(64px+2rem)]">
              <BookmarkForm
                userId={user.id}
                onSuccess={handleBookmarkAdded}
              />
            </div>
          </div>

          {/* Header and Bookmarks List in Middle */}
          <div className="lg:col-span-4">
            {/* Header */}
            <div className="mb-12 animate-slideDown">
              <h1 className="text-5xl font-bold mb-3 flex items-center gap-3">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Welcome back!
                </span>
                <span className="text-5xl">👋</span>
              </h1>
              <p className="text-xl text-slate-600 font-medium">
                Manage all your bookmarks in one beautiful place
              </p>
            </div>

            {/* Bookmarks List */}
            <BookmarkList userId={user.id} refreshTrigger={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}
