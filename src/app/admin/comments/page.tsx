'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { fetchAdminAPI } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TableSearch from '@/components/admin/TableSearch';
import TablePagination from '@/components/admin/TablePagination';
import { useTablePagination } from '@/hooks/useTablePagination';

export interface AdminComment {
  id: number;
  post_id: number;
  name: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  post: {
    id: number;
    title: string;
  };
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminAPI<AdminComment[]>('/admin/comments');
      setComments(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await fetchAdminAPI(`/admin/comments/${id}`, { method: 'DELETE' });
      fetchComments();
    } catch (err: any) {
      alert(err.message || 'Failed to delete comment');
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await fetchAdminAPI(`/admin/comments/${id}/toggle`, { method: 'PATCH' });
      fetchComments(); // refresh
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading comments...</div>;
  }

  const searchFn = useCallback((comment: AdminComment, term: string) => {
    return Boolean(
      comment.name.toLowerCase().includes(term) ||
      comment.content.toLowerCase().includes(term) ||
      (comment.post && comment.post.title.toLowerCase().includes(term))
    );
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedComments,
    filteredItemsCount,
  } = useTablePagination(comments, searchFn, 10);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Blog Comments"
        description="Manage and approve comments on your blog posts"
      />

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">{error}</div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <TableSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search comments by author, content, or post title..."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold">Comment</th>
                <th className="px-6 py-4 font-semibold">Post</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedComments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                    <p>{searchTerm ? 'No comments match your search.' : 'No comments found.'}</p>
                  </td>
                </tr>
              ) : (
                paginatedComments.map((comment) => (
                  <tr key={comment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{comment.name}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 line-clamp-2 max-w-xs">{comment.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 line-clamp-2 max-w-[150px]">
                        {comment.post?.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      {comment.is_approved ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(comment.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            comment.is_approved
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-emerald-500 hover:bg-emerald-50'
                          }`}
                          title={comment.is_approved ? 'Hide Comment' : 'Approve Comment'}
                        >
                          {comment.is_approved ? <XCircle size={18} /> : <CheckCircle size={18} />}
                        </button>

                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredItemsCount}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
