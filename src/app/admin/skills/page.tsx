'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star } from 'lucide-react';
import { fetchAdminAPI, Skill } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableActions from '@/components/admin/AdminTableActions';
import { getSkillIcon } from '@/components/sections/SkillsSection';
import TableSearch from '@/components/admin/TableSearch';
import TablePagination from '@/components/admin/TablePagination';
import { useTablePagination } from '@/hooks/useTablePagination';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminAPI<Skill[]>('/admin/skills');
      setSkills(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await fetchAdminAPI(`/admin/skills/${id}`, { method: 'DELETE' });
      setSkills(skills.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  const searchFn = useCallback((skill: Skill, term: string) => {
    return Boolean(
      skill.name.toLowerCase().includes(term) ||
      (skill.category && skill.category.toLowerCase().includes(term))
    );
  }, []);

  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedSkills,
    filteredItemsCount,
  } = useTablePagination(skills, searchFn, 10);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">Loading skills...</div>
    );
  if (error) return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Skills"
        description="Manage your technical and soft skills"
        actionLabel="Add Skill"
        actionHref="/admin/skills/create"
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <TableSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search skills by name or category..."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Skill Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedSkills.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                    {searchTerm ? 'No skills match your search.' : 'No skills found.'}
                  </td>
                </tr>
              ) : (
                paginatedSkills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="text-slate-600 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
                          {skill.icon_svg ? (
                            skill.icon_svg.startsWith('http') ? (
                              <img
                                src={skill.icon_svg}
                                alt={skill.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <div
                                dangerouslySetInnerHTML={{ __html: skill.icon_svg }}
                                className="flex items-center justify-center"
                              />
                            )
                          ) : (
                            getSkillIcon(skill.category, skill.name)
                          )}
                        </div>
                        <span className="font-semibold text-slate-800">{skill.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {skill.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AdminTableActions
                        editUrl={`/admin/skills/${skill.id}`}
                        onDelete={() => handleDelete(skill.id)}
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
