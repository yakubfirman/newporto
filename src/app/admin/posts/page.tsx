'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Eye, EyeOff, FileText } from 'lucide-react';
import { fetchAdminAPI, Post } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableActions from '@/components/admin/AdminTableActions';

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminAPI<Post[]>('/admin/posts');
      setPosts(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) return;

    try {
      await fetchAdminAPI(`/admin/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const togglePublish = async (post: Post) => {
    try {
      const updatedPost = await fetchAdminAPI<Post>(`/admin/posts/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...post, is_published: !post.is_published }),
      });
      setPosts(posts.map((p) => (p.id === post.id ? updatedPost : p)));
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading blog posts...
      </div>
    );
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Posts"
        description="Manage your blog articles"
        actionLabel="New Post"
        actionHref="/admin/posts/create"
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Post Details</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <FileText size={28} className="text-slate-300" />
                      </div>
                      <p className="text-slate-600 font-medium">No blog posts found</p>
                      <p className="text-slate-400 text-sm max-w-sm">
                        You haven't written any blog posts yet. Click the "Write Post" button to
                        start writing your first article.
                      </p>
                      <Link
                        href="/admin/posts/create"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors text-sm"
                      >
                        <Plus size={16} /> Write Post
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {post.cover_image && (
                          <div className="relative w-16 h-12 rounded overflow-hidden border border-slate-200">
                            <Image
                              src={post.cover_image}
                              alt={post.title}
                              fill
                              className="object-cover"
                              unoptimized={post.cover_image.includes('localhost')}
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-800 line-clamp-1">
                            {post.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          post.is_published
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {post.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                        {post.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString()
                          : 'Not Set'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminTableActions
                        editUrl={`/admin/posts/${post.id}`}
                        onDelete={() => handleDelete(post.id)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
