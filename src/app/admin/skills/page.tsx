'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { fetchAdminAPI, Skill } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableActions from '@/components/admin/AdminTableActions';

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
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Skill Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Proficiency</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {skills.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No skills found.
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {skill.icon_svg && (
                          <div
                            className="w-8 h-8 flex items-center justify-center text-slate-700 bg-slate-100 rounded-lg"
                            dangerouslySetInnerHTML={{ __html: skill.icon_svg }}
                          />
                        )}
                        <span className="font-semibold text-slate-800">{skill.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {skill.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 max-w-[200px]">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${skill.proficiency}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-slate-600">
                          {skill.proficiency}%
                        </span>
                      </div>
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
      </div>
    </div>
  );
}
