'use client';

import { useEffect, useState } from 'react';
import { Briefcase, FileText, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { fetchAdminAPI } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState([
    {
      name: 'Total Projects',
      value: '...',
      icon: <Briefcase className="text-blue-500" size={24} />,
      href: '/admin/projects',
    },
    {
      name: 'Published Posts',
      value: '...',
      icon: <FileText className="text-emerald-500" size={24} />,
      href: '/admin/posts',
    },
    {
      name: 'Experiences',
      value: '...',
      icon: <User className="text-amber-500" size={24} />,
      href: '/admin/experiences',
    },
    {
      name: 'New Messages',
      value: '...',
      icon: <MessageSquare className="text-purple-500" size={24} />,
      href: '/admin/messages',
    },
  ]);

  useEffect(() => {
    async function loadStats() {
      try {
        const [projectsRes, postsRes, experiencesRes, messagesRes] = await Promise.all([
          fetchAdminAPI<{ data: any[] } | any[]>('/admin/projects').catch(() => []),
          fetchAdminAPI<{ data: any[] } | any[]>('/admin/posts').catch(() => []),
          fetchAdminAPI<{ data: any[] } | any[]>('/admin/experiences').catch(() => []),
          fetchAdminAPI<{ data: any[] } | any[]>('/admin/messages').catch(() => []),
        ]);

        const projects = Array.isArray(projectsRes) ? projectsRes : projectsRes?.data || [];
        const posts = Array.isArray(postsRes) ? postsRes : postsRes?.data || [];
        const experiences = Array.isArray(experiencesRes)
          ? experiencesRes
          : experiencesRes?.data || [];
        const messages = Array.isArray(messagesRes) ? messagesRes : messagesRes?.data || [];

        setStats([
          {
            name: 'Total Projects',
            value: projects.length.toString(),
            icon: <Briefcase className="text-blue-500" size={24} />,
            href: '/admin/projects',
          },
          {
            name: 'Published Posts',
            value: posts.length.toString(),
            icon: <FileText className="text-emerald-500" size={24} />,
            href: '/admin/posts',
          },
          {
            name: 'Experiences',
            value: experiences.length.toString(),
            icon: <User className="text-amber-500" size={24} />,
            href: '/admin/experiences',
          },
          {
            name: 'New Messages',
            value: messages.length.toString(),
            icon: <MessageSquare className="text-purple-500" size={24} />,
            href: '/admin/messages',
          },
        ]);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    }

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link
            href={stat.href}
            key={index}
            className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-primary/20 transition-all duration-300 group relative overflow-hidden"
          >
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-slate-50 group-hover:bg-primary/5 group-hover:scale-150 transition-transform duration-500 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {stat.icon}
                </div>
                <span className="text-3xl font-bold text-slate-800 tabular-nums font-heading tracking-tight">
                  {stat.value}
                </span>
              </div>
              <h3 className="text-slate-500 font-medium text-sm">{stat.name}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold text-slate-800 mb-2 font-heading tracking-tight">
              Welcome back, Admin! 👋
            </h2>
            <p className="text-slate-500 mb-6">
              Here is an overview of your portfolio metrics today. Keep up the great work!
            </p>
            <div className="p-8 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4">
                <Briefcase className="text-slate-400" size={28} />
              </div>
              <p className="text-slate-500 font-medium text-center max-w-sm">
                Dashboard charts and detailed activity logs will appear here once the analytics
                integration is fully connected.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 font-heading tracking-tight">
            Recent Activity
          </h2>
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
              <MessageSquare className="text-slate-400" size={20} />
            </div>
            <p className="text-sm text-slate-500 text-center">No recent activity detected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
