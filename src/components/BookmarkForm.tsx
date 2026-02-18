'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BookmarkFormProps {
  onSuccess: () => void;
  userId: string;
}

/**
 * Form component for adding new bookmarks
 * Validates URL format and saves to Supabase
 */
export default function BookmarkForm({ onSuccess, userId }: BookmarkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    try {
      setLoading(true);
      const { error: insertError } = await supabase
        .from('bookmarks')
        .insert([
          {
            user_id: userId,
            title: title.trim(),
            url: url.trim(),
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        setError('Failed to add bookmark: ' + insertError.message);
        return;
      }

      // Reset form
      setTitle('');
      setUrl('');
      onSuccess();
    } catch (err: any) {
      setError('An error occurred: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-8 mb-10 shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center gap-3">
        <span className="text-2xl">📂</span>
        Add Bookmark
      </h2>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-zinc-300 mb-2.5">
            Bookmark Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Google, GitHub, Figma..."
            className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
            disabled={loading}
          />
        </div>

        {/* URL Input */}
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-zinc-300 mb-2.5">
            Website URL
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 placeholder-zinc-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Adding...
            </span>
          ) : (
            '+ Add Bookmark'
          )}
        </button>
      </div>
    </form>
  );
}
