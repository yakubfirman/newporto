'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, User, Briefcase } from 'lucide-react';
import { fetchAdminAPI, Experience } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableActions from '@/components/admin/AdminTableActions';
import TableSearch from '@/components/admin/TableSearch';
import TablePagination from '@/components/admin/TablePagination';
import { useTablePagination } from '@/hooks/useTablePagination';

export default function AdminExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExperiences = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminAPI<Experience[]>('/admin/experiences');
      setExperiences(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this experience record?')) return;

    try {
      await fetchAdminAPI(`/admin/experiences/${id}`, { method: 'DELETE' });
      setExperiences(experiences.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const searchFn = useCallback((experience: Experience, term: string) => {
    return Boolean(
      experience.title.toLowerCase().includes(term) ||
      experience.company.toLowerCase().includes(term) ||
      (experience.description && experience.description.toLowerCase().includes(term))
    );
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedExperiences,
    filteredItemsCount,
  } = useTablePagination(experiences, searchFn, 10);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading experiences...
      </div>
    );
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Experience"
        description="Manage your work experience history"
        actionLabel="Add Experience"
        actionHref="/admin/experiences/create"
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <TableSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search experiences by title, company, or description..."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Role / Company</th>
                <th className="px-6 py-4 font-semibold">Timeline</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedExperiences.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <User size={28} className="text-slate-300" />
                      </div>
                      <p className="text-slate-600 font-medium">
                        {searchTerm ? 'No experiences match your search.' : 'No experiences found'}
                      </p>
                      {!searchTerm && (
                        <>
                          <p className="text-slate-400 text-sm max-w-sm">
                            You haven't added any work history yet. Click the "Add Experience"
                            button to showcase your career journey.
                          </p>
                          <Link
                            href="/admin/experiences/create"
                            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors text-sm"
                          >
                            <Plus size={16} /> Add Experience
                          </Link>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedExperiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{exp.title}</div>
                      <div className="text-sm text-slate-500 mt-1">{exp.company}</div>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                        {exp.type === 'work'
                          ? 'Kerja'
                          : exp.type === 'organization'
                            ? 'Organisasi'
                            : 'Pembicara'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {new Date(exp.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                        {' - '}
                        {exp.is_current
                          ? 'Present'
                          : exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {exp.is_current ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Current Job
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          Past
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <AdminTableActions
                        editUrl={`/admin/experiences/${exp.id}`}
                        onDelete={() => handleDelete(exp.id)}
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
