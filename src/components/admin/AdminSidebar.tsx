import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  GraduationCap,
  Settings,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

interface AdminSidebarProps {
  isSidebarOpen: boolean;
}

export default function AdminSidebar({ isSidebarOpen }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      await fetch(`${API_URL}/admin/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Projects', href: '/admin/projects', icon: <Briefcase size={20} /> },
    { name: 'Blog Posts', href: '/admin/posts', icon: <FileText size={20} /> },
    { name: 'Comments', href: '/admin/comments', icon: <MessageSquare size={20} /> },
    { name: 'Experience', href: '/admin/experiences', icon: <User size={20} /> },
    { name: 'Education', href: '/admin/educations', icon: <GraduationCap size={20} /> },
    { name: 'Skills', href: '/admin/skills', icon: <Settings size={20} /> },
    { name: 'Messages', href: '/admin/messages', icon: <MessageSquare size={20} /> },
    { name: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquare size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
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
              Admin Panel
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
        <button
          onClick={handleLogout}
          title={!isSidebarOpen ? 'Sign Out' : undefined}
          className={`flex w-full items-center ${isSidebarOpen ? 'gap-3 px-3' : 'justify-center px-0'} py-2.5 rounded-lg transition-colors font-medium text-sm text-red-600 hover:bg-red-50`}
        >
          <LogOut size={20} className="text-red-500 shrink-0" />
          {isSidebarOpen && <span className="whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
