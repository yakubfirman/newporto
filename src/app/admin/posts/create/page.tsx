'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Search, Globe, User } from 'lucide-react';
import { fetchAdminAPI } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';

export default function CreatePostPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    author: 'Yakub Firman Mustofa',
    content: '',
    cover_image: '',
    is_published: false,
    published_at: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      // Auto-set published_at to today if checked and empty
      published_at:
        checked && !prev.published_at ? new Date().toISOString().split('T')[0] : prev.published_at,
    }));
  };

  const generateSlug = () => {
    if (!formData.title) return;
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setFormData((prev) => ({ ...prev, slug }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        published_at: formData.is_published
          ? formData.published_at || new Date().toISOString().split('T')[0]
          : null,
      };

      await fetchAdminAPI('/admin/posts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      router.push('/admin/posts');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800 font-heading">Write Blog Post</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Column */}
        <div className="flex-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Post Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={generateSlug}
                className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Enter an engaging title..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">URL Slug</label>
              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                  /blog/
                </span>
                <input
                  required
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="post-url-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Author</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-slate-400" />
                </div>
                <input
                  required
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="Author Name"
                />
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 md:p-8 space-y-6">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                <Search size={18} className="text-primary" /> SEO & Meta Data
              </h3>

              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 font-sans shadow-sm">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                    Search Engine Preview
                  </span>
                  <div className="text-sm text-[#202124] flex items-center gap-1 mb-1">
                    <Globe size={14} className="text-slate-400" />
                    <span>yakubfirman.id</span>
                    <span className="text-slate-500 mx-1">›</span>
                    <span className="text-slate-500">
                      blog › {formData.slug || 'post-url-slug'}
                    </span>
                  </div>
                  <div className="text-[20px] text-[#1a0dab] font-medium hover:underline cursor-pointer mb-1 leading-tight">
                    {formData.title || 'Enter an engaging title...'} | Yakub Firman Mustofa
                  </div>
                  <div className="text-sm text-[#4d5156] line-clamp-2">
                    {formData.excerpt ||
                      'A brief summary for the blog list and SEO meta description will appear here. This helps search engines understand your content.'}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex justify-between">
                    <span>Meta Description (Excerpt)</span>
                    <span
                      className={`text-xs ${formData.excerpt.length > 160 ? 'text-red-500 font-bold' : 'text-slate-400'}`}
                    >
                      {formData.excerpt.length} / 160
                    </span>
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all ${formData.excerpt.length > 160 ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                    placeholder="A brief summary for SEO (max 160 characters)..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Content</label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => setFormData((prev) => ({ ...prev, content: value }))}
              />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-6">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Publishing</h3>

            <label className="flex items-center gap-3 cursor-pointer p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleCheckbox}
                className="w-5 h-5 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <span className="font-semibold text-slate-800">Publish Post</span>
            </label>

            {formData.is_published && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Publish Date</label>
                <input
                  type="date"
                  name="published_at"
                  value={formData.published_at}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6 space-y-4">
            <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2">Media</h3>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Cover Image URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon size={16} className="text-slate-400" />
                </div>
                <input
                  type="url"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="https://..."
                />
              </div>
            </div>

            {formData.cover_image && (
              <div className="mt-4 rounded-lg overflow-hidden border border-slate-200">
                <img
                  src={formData.cover_image}
                  alt="Cover preview"
                  className="w-full h-auto object-cover aspect-video"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/600x400?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl hover:bg-primary-hover transition-colors font-bold shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSubmitting ? 'Saving...' : 'Save Blog Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
