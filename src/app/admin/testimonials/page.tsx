'use client';

import { useEffect, useState, useCallback } from 'react';
import { Trash2, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
import { fetchAdminAPI, Testimonial } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import TableSearch from '@/components/admin/TableSearch';
import TablePagination from '@/components/admin/TablePagination';
import { useTablePagination } from '@/hooks/useTablePagination';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminAPI<Testimonial[]>('/admin/testimonials');
      setTestimonials(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await fetchAdminAPI(`/admin/testimonials/${id}`, { method: 'DELETE' });
      fetchTestimonials();
    } catch (err: any) {
      alert(err.message || 'Failed to delete testimonial');
    }
  };

  const handleTogglePublish = async (id: number) => {
    try {
      await fetchAdminAPI(`/admin/testimonials/${id}/toggle`, { method: 'PATCH' });
      fetchTestimonials(); // refresh
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading testimonials...</div>;
  }

  const searchFn = useCallback((testimonial: Testimonial, term: string) => {
    return Boolean(
      testimonial.name.toLowerCase().includes(term) ||
      testimonial.content.toLowerCase().includes(term) ||
      (testimonial.role && testimonial.role.toLowerCase().includes(term))
    );
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedTestimonials,
    filteredItemsCount,
  } = useTablePagination(testimonials, searchFn, 10);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Testimonials"
        description="Manage and approve testimonials from your clients or colleagues"
      />

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg border border-red-200">{error}</div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <TableSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search testimonials by author, role, or content..."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Author</th>
                <th className="px-6 py-4 font-semibold">Content</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
                    <p>
                      {searchTerm ? 'No testimonials match your search.' : 'No testimonials found.'}
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{testimonial.name}</div>
                      {testimonial.role && (
                        <div className="text-xs text-slate-500 mt-1">{testimonial.role}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-600 line-clamp-2 max-w-md">{testimonial.content}</p>
                    </td>
                    <td className="px-6 py-4">
                      {testimonial.is_published ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleTogglePublish(testimonial.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            testimonial.is_published
                              ? 'text-amber-500 hover:bg-amber-50'
                              : 'text-emerald-500 hover:bg-emerald-50'
                          }`}
                          title={testimonial.is_published ? 'Unpublish' : 'Approve & Publish'}
                        >
                          {testimonial.is_published ? (
                            <XCircle size={18} />
                          ) : (
                            <CheckCircle size={18} />
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(testimonial.id)}
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
