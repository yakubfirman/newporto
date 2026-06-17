'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, ExternalLink, GitBranch, Briefcase } from 'lucide-react';
import { fetchAdminAPI, Project } from '@/lib/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminTableActions from '@/components/admin/AdminTableActions';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAdminAPI<Project[]>('/admin/projects');
      setProjects(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await fetchAdminAPI(`/admin/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err: any) {
      alert('Failed to delete: ' + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading projects...
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Projects"
        description="Manage your portfolio projects"
        actionLabel="Add Project"
        actionHref="/admin/projects/create"
      />

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Project Title</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Tech Stack</th>
                <th className="px-6 py-4 font-semibold">Links</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-2">
                        <Briefcase size={28} className="text-slate-300" />
                      </div>
                      <p className="text-slate-600 font-medium">No projects found</p>
                      <p className="text-slate-400 text-sm max-w-sm">
                        You haven't added any projects yet. Click the "Add Project" button to create
                        your first portfolio item.
                      </p>
                      <Link
                        href="/admin/projects/create"
                        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors text-sm"
                      >
                        <Plus size={16} /> Add Project
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{project.title}</div>
                      <div className="text-xs text-slate-500 font-mono mt-1">{project.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      {project.is_highlighted ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          Highlighted
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          Standard
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tech_stack?.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.tech_stack?.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                            +{project.tech_stack.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {project.url ? (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-primary transition-colors"
                            title="Live Site"
                          >
                            <ExternalLink size={18} />
                          </a>
                        ) : (
                          <span className="text-slate-300">
                            <ExternalLink size={18} />
                          </span>
                        )}
                        {project.github_url ? (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-slate-400 hover:text-slate-900 transition-colors"
                            title="Source Code"
                          >
                            <GitBranch size={18} />
                          </a>
                        ) : (
                          <span className="text-slate-300">
                            <GitBranch size={18} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <AdminTableActions
                        editUrl={`/admin/projects/${project.id}`}
                        onDelete={() => handleDelete(project.id)}
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
