'use client';

import { useEffect, useState } from 'react';
import { supabase, Bookmark } from '@/lib/supabase';
import BookmarkCard from './BookmarkCard';

interface BookmarkListProps {
  userId: string;
  refreshTrigger: number;
}

/**
 * Bookmark list component with real-time updates
 * Fetches and displays all bookmarks for the current user
 */
export default function BookmarkList({ userId, refreshTrigger }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, error: fetchError } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError('Failed to load bookmarks');
        console.error('Fetch error:', fetchError);
        return;
      }

      setBookmarks(data || []);
    } catch (err: any) {
      setError('An error occurred while loading bookmarks');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookmarks();
  }, [userId, refreshTrigger]);

  // Set up real-time subscription
  useEffect(() => {
    const subscription = supabase
      .channel(`bookmarks:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          } else if (payload.eventType === 'UPDATE') {
            setBookmarks((prev) =>
              prev.map((b) => (b.id === payload.new.id ? payload.new : b))
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  // Handle delete
  const handleDelete = async (bookmarkId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)
        .eq('user_id', userId);

      if (deleteError) {
        alert('Failed to delete bookmark');
        return;
      }

      // The real-time subscription will handle the UI update
    } catch (err) {
      alert('An error occurred while deleting the bookmark');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-zinc-900/30 rounded-2xl animate-pulse border border-zinc-800/50"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
        {error}
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-6xl mb-4">🔖</p>
        <p className="text-2xl font-bold text-zinc-200 mb-2">No bookmarks yet</p>
        <p className="text-zinc-500">
          Add your first bookmark using the form above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
          📚 Your Bookmarks
        </h2>
        <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-full text-sm font-semibold border border-indigo-500/20">
          {bookmarks.length}
        </span>
      </div>
      <div className="grid grid-cols-1 gap-5">
        {bookmarks.map((bookmark) => (
          <BookmarkCard
            key={bookmark.id}
            bookmark={bookmark}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
