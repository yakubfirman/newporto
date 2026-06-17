'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/api';

import { Inter, Poppins } from 'next/font/google';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setIsClient(true);
    // Simple auth check for demo purposes
    if (!localStorage.getItem('admin_token') && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // Don't wrap login page with dashboard sidebar
  if (pathname === '/admin/login') {
    return (
      <div
        className={`${inter.variable} ${poppins.variable} font-sans`}
        style={
          {
            '--font-sans': 'var(--font-inter), sans-serif',
            '--font-heading': 'var(--font-poppins), sans-serif',
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    );
  }

  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div
      className={`${inter.variable} ${poppins.variable} flex h-screen bg-slate-50 font-sans`}
      style={
        {
          '--font-sans': 'var(--font-inter), sans-serif',
          '--font-heading': 'var(--font-poppins), sans-serif',
        } as React.CSSProperties
      }
    >
      <AdminSidebar isSidebarOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
        <AdminHeader isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  );
}
