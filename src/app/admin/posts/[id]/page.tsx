'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Image as ImageIcon, Search, Globe, User } from 'lucide-react';
import Image from 'next/image';
import { fetchAdminAPI, Post } from '@/lib/api';
import RichTextEditor from '@/components/RichTextEditor';
import ImageCropper from '@/components/admin/ImageCropper';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    author: '',
    content: '',
    cover_image: '',
    is_published: false,
    published_at: '',
  });

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchAdminAPI<Post>(`/admin/posts/${id}`);
        setFormData({
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt || '',
          author: data.author || 'Yakub Firman Mustofa',
          content: data.content || '',
          cover_image: data.cover_image || '',
          is_published: data.is_published || false,
          published_at: data.published_at ? data.published_at.split('T')[0] : '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: checked,
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

      await fetchAdminAPI(`/admin/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      router.push('/admin/posts');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading blog post data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/posts"
          className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800 font-heading">Edit Blog Post</h2>
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
                className="w-full px-4 py-3 text-lg font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
                  className="w-full pl-10 px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
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
              <label className="text-sm font-semibold text-slate-700">Cover Image</label>
              {formData.cover_image ? (
                <div className="relative w-full aspect-video rounded-lg border-2 border-slate-200 overflow-hidden bg-slate-50 group mt-2">
                  <Image
                    src={formData.cover_image}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                    unoptimized={formData.cover_image.includes('localhost')}
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setShowImageCropper(true)}
                      className="px-4 py-2 bg-white text-slate-800 font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      Change Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, cover_image: '' })}
                      className="ml-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow-sm hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowImageCropper(true)}
                  className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary hover:text-primary transition-colors mt-2"
                >
                  <span className="mb-2">
                    <ImageIcon size={32} />
                  </span>
                  <span className="font-medium text-sm">Upload Cover Image</span>
                  <span className="text-xs mt-1 text-slate-400">
                    16:9 ratio, will be compressed to WebP
                  </span>
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl hover:bg-primary-hover transition-colors font-bold shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSubmitting ? 'Saving Updates...' : 'Update Blog Post'}
          </button>
        </div>
      </form>

      {showImageCropper && (
        <ImageCropper
          aspectRatio={16 / 9}
          onCropComplete={(url) => {
            setFormData({ ...formData, cover_image: url });
            setShowImageCropper(false);
          }}
          onCancel={() => setShowImageCropper(false)}
        />
      )}
    </div>
  );
}
