'use client';

import { useState } from 'react';
import { Bookmark } from '@/lib/supabase';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

/**
 * Individual bookmark card component
 * Displays bookmark info with edit/delete actions
 */
export default function BookmarkCard({ bookmark, onDelete }: BookmarkCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      setDeleting(true);
      await onDelete(bookmark.id);
    }
  };

  const getDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  return (
    <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-6 hover:border-zinc-700/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all flex items-start justify-between gap-5 group">
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-bold text-zinc-100 mb-4 text-lg truncate">
          {bookmark.title}
        </h3>

        {/* Domain Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
            {getDomain(bookmark.url)}
          </span>
        </div>

        {/* URL */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-400 hover:text-indigo-400 text-sm truncate block mb-4 hover:underline transition-colors"
          title={bookmark.url}
        >
          {bookmark.url}
        </a>

        {/* Date */}
        <p className="text-xs text-zinc-500">
          {formatDate(bookmark.created_at)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-all text-sm border border-transparent hover:border-indigo-500/20"
          title="Open link"
        >
          🔗
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm disabled:opacity-50 border border-transparent hover:border-red-500/20"
          title="Delete bookmark"
        >
          {deleting ? '⏳' : '🗑️'}
        </button>
      </div>
    </div>
  );
}
