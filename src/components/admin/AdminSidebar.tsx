import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
} from 'react-icons/md';
import { API_URL } from '@/lib/api';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
}

export default function AdminSidebar({ isSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <MdDashboard size={20} /> },
    { name: 'Projects', href: '/admin/projects', icon: <MdWork size={20} /> },
    { name: 'Blog Posts', href: '/admin/posts', icon: <MdArticle size={20} /> },
    { name: 'Comments', href: '/admin/comments', icon: <MdComment size={20} /> },
    { name: 'Experience', href: '/admin/experiences', icon: <MdPerson size={20} /> },
    { name: 'Education', href: '/admin/educations', icon: <MdSchool size={20} /> },
    { name: 'Skills', href: '/admin/skills', icon: <MdBuild size={20} /> },
    { name: 'Messages', href: '/admin/messages', icon: <MdMail size={20} /> },
    { name: 'Testimonials', href: '/admin/testimonials', icon: <MdRateReview size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <MdSettings size={20} /> },
  ];

  return (
    <aside
      className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 flex flex-col hidden md:flex transition-all duration-300`}
    >
      <div
        className={`h-16 flex items-center ${isSidebarOpen ? 'px-6' : 'justify-center px-0'} border-b border-slate-200 overflow-hidden`}
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

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 overflow-x-hidden">
        {isSidebarOpen && (
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Menu
          </div>
        )}
        {navItems.map((item) => {
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
        })}
      </div>

      <div className="p-3 border-t border-slate-200">
        <div className="text-xs text-center text-slate-400">
          {isSidebarOpen ? 'yakubfirman.id v1.0' : 'v1.0'}
        </div>
      </div>
    </aside>
  );
}
