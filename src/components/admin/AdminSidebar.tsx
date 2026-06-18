'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdDashboard,
  MdWork,
  MdArticle,
  MdComment,
  MdPerson,
  MdSchool,
  MdBuild,
  MdMail,
  MdRateReview,
  MdSettings,
  MdAnalytics,
  MdExpandMore,
  MdChevronRight,
} from 'react-icons/md';
import { Image as ImageIcon } from 'lucide-react';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
}

export default function AdminSidebar({ isSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  // Changed from Record<string, boolean> to a single active string state
  // to ensure only one group can be open at a time.
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const topItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <MdDashboard size={20} /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <MdAnalytics size={20} /> },
    { name: 'Messages', href: '/admin/messages', icon: <MdMail size={20} /> },
  ];

  const navGroups = [
    {
      title: 'Content',
      items: [
        { name: 'Projects', href: '/admin/projects', icon: <MdWork size={20} /> },
        { name: 'Blog Posts', href: '/admin/posts', icon: <MdArticle size={20} /> },
        { name: 'Media Library', href: '/admin/media', icon: <ImageIcon size={20} /> },
        { name: 'Comments', href: '/admin/comments', icon: <MdComment size={20} /> },
      ],
    },
    {
      title: 'Resume',
      items: [
        { name: 'Experience', href: '/admin/experiences', icon: <MdPerson size={20} /> },
        { name: 'Education', href: '/admin/educations', icon: <MdSchool size={20} /> },
        { name: 'Skills', href: '/admin/skills', icon: <MdBuild size={20} /> },
      ],
    },
    {
      title: 'Settings',
      items: [
        { name: 'Testimonials', href: '/admin/testimonials', icon: <MdRateReview size={20} /> },
        { name: 'Social Media', href: '/admin/social-media', icon: <MdPerson size={20} /> },
        { name: 'Settings', href: '/admin/settings', icon: <MdSettings size={20} /> },
      ],
    },
  ];

  // Auto-open group if active path is inside it (only on mount or path change)
  useEffect(() => {
    navGroups.forEach((group) => {
      const hasActiveChild = group.items.some((item) => pathname.startsWith(item.href));
      if (hasActiveChild) {
        setActiveGroup(group.title);
      }
    });
  }, [pathname]);

  const toggleGroup = (title: string) => {
    if (!isSidebarOpen) return; // Prevent toggle when sidebar is closed
    setActiveGroup((prev) => (prev === title ? null : title));
  };

  const renderItem = (item: any) => {
    const isActive = pathname.startsWith(item.href);
    return (
      <Link
        key={item.name}
        href={item.href}
        title={!isSidebarOpen ? item.name : undefined}
        className={`group relative flex items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-lg transition-all font-medium text-sm ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
        )}
        <span
          className={`shrink-0 transition-transform duration-200 ${isActive ? 'text-primary scale-110' : 'text-slate-400 group-hover:scale-110 group-hover:text-slate-600'}`}
        >
          {item.icon}
        </span>
        {isSidebarOpen && <span className="whitespace-nowrap">{item.name}</span>}
      </Link>
    );
  };

  return (
    <aside
      className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col hidden md:flex transition-all duration-300`}
    >
      <div
        className={`h-16 flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center px-0'} border-b border-slate-200 overflow-hidden shrink-0`}
      >
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2"
          title={!isSidebarOpen ? 'Dashboard' : undefined}
        >
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold font-heading shrink-0">
            Y
          </div>
          {isSidebarOpen && (
            <span className="font-bold text-lg tracking-tight font-heading whitespace-nowrap">
              Content Setting
            </span>
          )}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 overflow-x-hidden custom-scrollbar">
        {/* Independent Top Items */}
        <div className={`flex flex-col space-y-1 ${isSidebarOpen ? 'px-3' : 'px-2'} mb-4`}>
          {topItems.map(renderItem)}
        </div>

        {isSidebarOpen && <div className="h-px bg-slate-100 mx-4 my-4" />}

        {/* Grouped Items */}
        {navGroups.map((group, groupIndex) => {
          const isOpen = !isSidebarOpen || activeGroup === group.title;
          const groupId = `group-${group.title.toLowerCase().replace(/\\s+/g, '-')}`;

          return (
            <div key={group.title} className="mb-2">
              {isSidebarOpen ? (
                <button
                  onClick={() => toggleGroup(group.title)}
                  aria-expanded={isOpen}
                  aria-controls={groupId}
                  className="w-full flex items-center justify-between px-6 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
                >
                  <span>{group.title}</span>
                  {isOpen ? (
                    <MdExpandMore size={16} aria-hidden="true" />
                  ) : (
                    <MdChevronRight size={16} aria-hidden="true" />
                  )}
                </button>
              ) : (
                <div className="h-px bg-slate-100 mx-4 my-2" />
              )}

              <div
                id={groupId}
                className={`flex flex-col space-y-1 ${isSidebarOpen ? 'px-3' : 'px-2'} overflow-hidden transition-all duration-300 ease-in-out`}
                style={{
                  maxHeight: isOpen ? '500px' : '0',
                  opacity: isOpen ? 1 : 0,
                }}
              >
                {group.items.map(renderItem)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border-t border-slate-200 shrink-0">
        <div className="text-xs text-center text-slate-400">
          {isSidebarOpen ? 'yakubfirman.id v1.0' : 'v1.0'}
        </div>
      </div>
    </aside>
  );
}
