'use client';
import { useState, useEffect } from 'react';
import { GripVertical, Save, ArrowLeft, Layers } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAdminAPI } from '@/lib/api';

interface Project {
  id: number;
  title: string;
  image?: string;
  slug: string;
  order?: number;
}

export default function ReorderProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  useEffect(() => {
    fetchAdminAPI<Project[]>('/admin/projects')
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === idx) return;
    setOverIndex(idx);
    const newProjects = [...projects];
    const [moved] = newProjects.splice(dragIndex, 1);
    newProjects.splice(idx, 0, moved);
    setProjects(newProjects);
    setDragIndex(idx);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const items = projects.map((p, i) => ({ id: p.id, order: i }));
    try {
      await fetchAdminAPI('/admin/projects/reorder', {
        method: 'POST',
        body: JSON.stringify({ items }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading projects...
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/projects"
          className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 font-heading">Reorder Projects</h2>
          <p className="text-sm text-slate-500 mt-0.5">Drag and drop to change display order</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm ${
            saved
              ? 'bg-emerald-500 text-white'
              : 'bg-primary hover:bg-primary/90 text-white disabled:opacity-50'
          }`}
        >
          <Save size={16} />
          {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Order'}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <Layers size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">{projects.length} projects</span>
        </div>

        <div className="p-4 space-y-2">
          {projects.map((project, index) => (
            <div
              key={project.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-4 border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all select-none ${
                dragIndex === index
                  ? 'border-primary/40 bg-primary/5 scale-[1.01] shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <GripVertical size={20} className="text-slate-400 flex-shrink-0" />
              <span className="w-7 h-7 bg-slate-100 rounded-lg text-xs text-slate-500 flex items-center justify-center font-bold flex-shrink-0 border border-slate-200">
                {index + 1}
              </span>
              {project.image && (
                <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-semibold truncate">{project.title}</p>
                <p className="text-slate-400 text-xs font-mono">/project/{project.slug}</p>
              </div>
              <GripVertical size={16} className="text-slate-300 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
