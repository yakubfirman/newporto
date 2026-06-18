'use client';
import { useState, useEffect } from 'react';
import { GripVertical, Save, ArrowLeft, Zap } from 'lucide-react';
import Link from 'next/link';

interface Skill {
  id: number;
  name: string;
  category?: string;
  proficiency: number;
  order?: number;
  icon_svg?: string;
}

export default function ReorderSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetch(`${apiBase}/admin/skills`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      });
  }, []);

  const handleDragStart = (index: number) => setDragIndex(index);

  const handleDragOver = (e: React.DragEvent, overIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === overIndex) return;
    const newSkills = [...skills];
    const [moved] = newSkills.splice(dragIndex, 1);
    newSkills.splice(overIndex, 0, moved);
    setSkills(newSkills);
    setDragIndex(overIndex);
  };

  const handleDragEnd = () => setDragIndex(null);

  const handleSave = async () => {
    setSaving(true);
    const items = skills.map((s, i) => ({ id: s.id, order: i }));
    await fetch(`${apiBase}/admin/skills/reorder`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">Loading skills...</div>
    );

  // Group skills by category for display
  const categories = [...new Set(skills.map((s) => s.category || 'Uncategorized'))];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/skills"
          className="p-2 text-slate-400 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-800 font-heading">Reorder Skills</h2>
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
          <Zap size={16} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            {skills.length} skills across {categories.length} categories
          </span>
        </div>

        <div className="p-4 space-y-2">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
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

              {skill.icon_svg && (
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                  {skill.icon_svg.startsWith('http') ? (
                    <img src={skill.icon_svg} alt={skill.name} className="w-6 h-6 object-contain" />
                  ) : (
                    <div
                      dangerouslySetInnerHTML={{ __html: skill.icon_svg }}
                      className="flex items-center justify-center [&>svg]:w-6 [&>svg]:h-6"
                    />
                  )}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <p className="text-slate-800 font-semibold truncate">{skill.name}</p>
                  {skill.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 shrink-0">
                      {skill.category}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 font-medium">
                    {skill.proficiency}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
