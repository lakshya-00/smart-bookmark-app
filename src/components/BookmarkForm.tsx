'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BookmarkFormProps {
  onSuccess: () => void;
  userId: string;
}

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
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 p-8 mb-6 hover:shadow-2xl transition-all duration-300 animate-fadeIn">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-2xl">✨</span>
        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Add Bookmark
        </span>
      </h2>

      

      {error && (
        <div className="mb-4 p-4 bg-red-50/80 border border-red-200/50 text-red-700 rounded-xl text-sm backdrop-blur-sm animate-slideDown">
          ⚠️ {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2">
            📝 Bookmark Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Google Search, GitHub, Figma..."
            className="w-full px-4 py-3 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white placeholder-slate-400 font-medium"
            disabled={loading}
          />
        </div>

        {/* URL Input */}
        <div>
          <label htmlFor="url" className="block text-sm font-semibold text-slate-700 mb-2">
            🔗 Website URL
          </label>
          <input
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-4 py-3 border border-slate-200/50 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/50 hover:bg-white/80 focus:bg-white placeholder-slate-400 font-medium"
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
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
