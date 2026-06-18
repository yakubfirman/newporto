'use client';

import { useEffect, useState, useCallback } from 'react';
import { fetchAdminAPI, SocialMedia } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableActions from '@/components/admin/AdminTableActions';
import TableSearch from '@/components/admin/TableSearch';
import TablePagination from '@/components/admin/TablePagination';
import { useTablePagination } from '@/hooks/useTablePagination';
import { showConfirmDeleteAlert, showSuccessAlert, showErrorAlert } from '@/lib/alert';

export default function AdminSocialMediaPage() {
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSocialMedias = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminAPI<SocialMedia[]>('/admin/social-media');
      setSocialMedias(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSocialMedias();
  }, []);

  const handleDelete = async (id: number) => {
    const result = await showConfirmDeleteAlert('this item');
    if (!result.isConfirmed) return;

    try {
      await fetchAdminAPI(`/admin/social-media/${id}`, { method: 'DELETE' });
      setSocialMedias(socialMedias.filter((p) => p.id !== id));
    } catch (err: any) {
      showErrorAlert('Error', 'Failed to delete: ' + err.message);
    }
  };

  const searchFn = useCallback((social: SocialMedia, term: string) => {
    return Boolean(social.name.toLowerCase().includes(term));
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedSocialMedias,
    filteredItemsCount,
  } = useTablePagination(socialMedias, searchFn, 10);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading social medias...
      </div>
    );
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Social Media"
        description="Manage your social media links"
        actionLabel="Add Social Media"
        actionHref="/admin/social-media/create"
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <TableSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search social media by name..."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Social Media</th>
                <th className="px-6 py-4 font-semibold">URL</th>
                <th className="px-6 py-4 font-semibold">Active</th>
                <th className="px-6 py-4 font-semibold">Order</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSocialMedias.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    {searchTerm ? 'No social medias match your search.' : 'No social medias found.'}
                  </td>
                </tr>
              ) : (
                paginatedSocialMedias.map((social) => (
                  <tr key={social.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-slate-600 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
                          {social.icon_url ? (
                            <img
                              src={social.icon_url}
                              alt={social.name}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <div className="w-6 h-6 bg-slate-200 rounded-full" />
                          )}
                        </div>
                        <span className="font-semibold text-slate-800">{social.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline text-blue-500"
                      >
                        {social.url}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${social.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}
                      >
                        {social.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{social.order}</td>
                    <td className="px-6 py-4">
                      <AdminTableActions
                        editUrl={`/admin/social-media/${social.id}`}
                        onDelete={() => handleDelete(social.id)}
                      />
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
          setCurrentPage={setCurrentPage}
          totalItems={filteredItemsCount}
          itemsPerPage={10}
        />
      </div>
    </div>
  );
}
