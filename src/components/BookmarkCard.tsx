'use client';

import { useState } from 'react';
import { Bookmark } from '@/lib/supabase';

interface BookmarkCardProps {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
}

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
    <div className="animate-fadeIn bg-white/70 backdrop-blur-xl border border-slate-200/50 rounded-xl p-5 hover:shadow-lg transition-all duration-300 flex items-start justify-between gap-4 group hover:border-blue-200/50">
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-bold text-slate-900 mb-2 text-base truncate group-hover:text-blue-600 transition-colors duration-300">
          {bookmark.title}
        </h3>

        {/* URL and Domain */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-blue-600 bg-blue-50/80 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-200/50">
            {getDomain(bookmark.url)}
          </span>
        </div>

        {/* Full URL (truncated) */}
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 text-sm truncate block mb-3 hover:underline font-medium transition-colors duration-300"
          title={bookmark.url}
        >
          {bookmark.url}
        </a>

        {/* Date */}
        <p className="text-xs text-slate-500 font-medium">
          {formatDate(bookmark.created_at)}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 text-blue-500 hover:bg-blue-50/80 rounded-lg transition-all duration-300 text-sm font-bold active:scale-95"
          title="Open link"
        >
          🔗
        </a>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-2 text-red-500 hover:bg-red-50/80 rounded-lg transition-all duration-300 text-sm font-bold disabled:opacity-50 active:scale-95"
          title="Delete bookmark"
        >
          {deleting ? '⏳' : '🗑️'}
        </button>
      </div>
    </div>
  );
}
