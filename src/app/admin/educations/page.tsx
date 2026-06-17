'use client';

import { useEffect, useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { fetchAdminAPI, Education } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableActions from '@/components/admin/AdminTableActions';

export default function AdminEducationsPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEducations = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminAPI<Education[]>('/admin/educations');
      setEducations(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEducations();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;

    try {
      await fetchAdminAPI(`/admin/educations/${id}`, { method: 'DELETE' });
      setEducations(educations.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading educations...
      </div>
    );
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Education"
        description="Manage your educational background"
        actionLabel="Add Education"
        actionHref="/admin/educations/create"
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Degree / Institution</th>
                <th className="px-6 py-4 font-semibold">Timeline</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {educations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No education records found.
                  </td>
                </tr>
              ) : (
                educations.map((edu) => (
                  <tr key={edu.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{edu.degree}</div>
                      <div className="text-sm text-slate-500 mt-1">{edu.institution}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">
                        {new Date(edu.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                        {' - '}
                        {edu.is_current
                          ? 'Present'
                          : edu.end_date
                            ? new Date(edu.end_date).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {edu.is_current ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Currently Studying
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          Graduated
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <AdminTableActions
                        editUrl={`/admin/educations/${edu.id}`}
                        onDelete={() => handleDelete(edu.id)}
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
