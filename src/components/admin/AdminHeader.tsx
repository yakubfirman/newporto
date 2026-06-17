import { usePathname } from 'next/navigation';
import { Bell, Menu } from 'lucide-react';

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function AdminHeader({ isSidebarOpen, setIsSidebarOpen }: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors hidden md:block"
          title="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 capitalize font-heading tracking-tight">
          {pathname.split('/').pop() || 'Dashboard'}
        </h1>
      </div>
      <div className="flex items-center gap-5">
        <button className="relative text-slate-400 hover:text-slate-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="h-6 w-px bg-slate-200"></div>
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
              Admin User
            </span>
            <span className="text-xs text-slate-500">admin@yakubfirman.id</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold font-heading">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
