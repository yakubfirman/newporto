'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { fetchAdminAPI, Project } from '@/lib/api';

export default function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    tech_stack: '',
    url: '',
    github_url: '',
    is_highlighted: false,
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
          url: data.url || '',
          github_url: data.github_url || '',
          is_highlighted: data.is_highlighted,
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
              <label className="text-sm font-semibold text-slate-700">Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              />
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
    </div>
  );
}
