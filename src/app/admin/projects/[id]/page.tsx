'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Search, Globe } from 'lucide-react';
import { fetchAdminAPI, Project } from '@/lib/api';
import ImageCropper from '@/components/admin/ImageCropper';
import { showSuccessAlert, showErrorAlert } from '@/lib/alert';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImageCropper, setShowImageCropper] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    tech_stack: '',
    categories: [] as string[],
    url: '',
    github_url: '',
    is_highlighted: false,
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchAdminAPI<Project>(`/admin/projects/${id}`);
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          content: data.content,
          image: data.image || '',
          tech_stack: data.tech_stack?.join(', ') || '',
          categories: data.categories || [],
          url: data.url || '',
          github_url: data.github_url || '',
          is_highlighted: data.is_highlighted,
          meta_title: (data as any).meta_title || '',
          meta_description: (data as any).meta_description || '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => {
      const isSelected = prev.categories.includes(category);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter((c) => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const AVAILABLE_CATEGORIES = ['Full Stack', 'Frontend', 'Backend', 'SEO & AIO', 'System Analist'];

  const handleTitleBlur = () => {
    if (!formData.slug && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: formData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        tech_stack: formData.tech_stack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        image: formData.image || null,
        url: formData.url || null,
        github_url: formData.github_url || null,
      };

      await fetchAdminAPI(`/admin/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      await showSuccessAlert('Success', 'Data saved successfully!');
      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-slate-500">Loading project data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h2 className="text-2xl font-bold text-slate-800 font-heading">Edit Project</h2>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          Error: {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project Title</label>
              <input
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleTitleBlur}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Slug (URL friendly)</label>
              <input
                required
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Short Description</label>
              <textarea
                required
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* SEO Section */}
            <div className="border border-slate-200 rounded-xl p-6 space-y-4 bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Search size={18} className="text-blue-600" />
                <span>SEO &amp; Meta Data</span>
              </h3>

              {/* Search Preview */}
              <div className="p-4 border border-slate-200 rounded-lg bg-white font-sans shadow-sm">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">
                  Search Engine Preview
                </span>
                <div className="text-sm text-[#202124] flex items-center gap-1 mb-1">
                  <Globe size={14} className="text-slate-400" />
                  <span>yakubfirman.id</span>
                  <span className="text-slate-500 mx-1">›</span>
                  <span className="text-slate-500">
                    project › {formData.slug || 'project-slug'}
                  </span>
                </div>
                <div className="text-[20px] text-[#1a0dab] font-medium hover:underline cursor-pointer mb-1 leading-tight">
                  {formData.meta_title || formData.title || 'Project Title'} | Yakub Firman
                </div>
                <div className="text-sm text-[#4d5156] line-clamp-2">
                  {formData.meta_description ||
                    formData.description ||
                    'Project description will appear here for search engines.'}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>
                    Meta Title{' '}
                    <span className="text-slate-400 font-normal">(default: project title)</span>
                  </span>
                  <span
                    className={`text-xs ${formData.meta_title.length > 60 ? 'text-red-500 font-bold' : 'text-slate-400'}`}
                  >
                    {formData.meta_title.length} / 60
                  </span>
                </label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="Custom SEO title..."
                  maxLength={60}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 flex justify-between">
                  <span>
                    Meta Description{' '}
                    <span className="text-slate-400 font-normal">(default: short description)</span>
                  </span>
                  <span
                    className={`text-xs ${formData.meta_description.length > 160 ? 'text-red-500 font-bold' : 'text-slate-400'}`}
                  >
                    {formData.meta_description.length} / 160
                  </span>
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="Custom SEO description for search engines..."
                  rows={3}
                  maxLength={160}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all text-sm resize-none ${
                    formData.meta_description.length > 160
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-300'
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Full Content (Markdown/HTML supported)
              </label>
              <textarea
                required
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={8}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono text-sm"
              />
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
              <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2">
                Settings
              </h3>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_highlighted"
                  checked={formData.is_highlighted}
                  onChange={handleCheckbox}
                  className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                />
                <span className="text-sm text-slate-700">Highlight on Homepage</span>
              </label>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 text-sm">
                Categories
              </h3>
              <div className="space-y-2">
                {AVAILABLE_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(cat)}
                      onChange={() => handleCategoryToggle(cat)}
                      className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
                    />
                    <span className="text-sm text-slate-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                Tech Stack (comma separated)
              </label>
              <input
                type="text"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Project Image</label>
              {formData.image ? (
                <div className="relative w-full aspect-video rounded-lg border-2 border-slate-200 overflow-hidden bg-slate-50 group">
                  <img
                    src={formData.image}
                    alt="Project Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setShowImageCropper(true)}
                      className="px-4 py-2 bg-white text-slate-800 font-medium rounded-lg shadow-sm hover:bg-slate-50 transition-colors"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
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
                  className="w-full aspect-video border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-primary hover:text-primary transition-colors"
                >
                  <span className="mb-2">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </span>
                  <span className="font-medium text-sm">Upload Project Image</span>
                  <span className="text-xs mt-1 text-slate-400">
                    16:9 ratio, will be compressed to WebP
                  </span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Live URL</label>
              <input
                type="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">GitHub URL</label>
              <input
                type="url"
                name="github_url"
                value={formData.github_url}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary-hover transition-colors font-semibold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving Updates...' : 'Update Project'}
          </button>
        </div>
      </form>

      {showImageCropper && (
        <ImageCropper
          aspectRatio={16 / 9}
          onCropComplete={(url) => {
            setFormData({ ...formData, image: url });
            setShowImageCropper(false);
          }}
          onCancel={() => setShowImageCropper(false)}
        />
      )}
    </div>
  );
}
