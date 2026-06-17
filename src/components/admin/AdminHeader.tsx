'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Menu, LogOut, MessageSquare, ChevronDown, Languages } from 'lucide-react';
import { API_URL, fetchAdminAPI, Testimonial, Comment } from '@/lib/api';
import Link from 'next/link';
import Script from 'next/script';

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export default function AdminHeader({ isSidebarOpen, setIsSidebarOpen }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [profileImage, setProfileImage] = useState<string>('');
  const [notifications, setNotifications] = useState<
    Array<{ id: string; type: string; text: string; link: string; isRead: boolean }>
  >([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const [currentLang, setCurrentLang] = useState('en');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check current language from cookie
    const match = document.cookie.match(/(?:^|; )googtrans=([^;]*)/);
    if (match && match[1]) {
      const lang = match[1].split('/')[2];
      if (lang) {
        setCurrentLang(lang === 'en' ? 'id' : 'en'); // Since googtrans format is /source/target. If it translates to ID, current is ID. Wait, if it's /en/id, target is 'id'.
        // Better yet:
        setCurrentLang(lang === 'id' ? 'id' : 'en');
      }
    }

    // Define global initialization function for Google Translate
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'id,en',
            autoDisplay: false,
          },
          'google_translate_element_admin'
        );
      }
    };
  }, []);

  useEffect(() => {
    // Fetch settings for profile image
    fetchAdminAPI<Record<string, string>>('/settings')
      .then((data) => {
        setProfileImage(data.header_image_url || '/profile.jpg');
      })
      .catch((err) => console.error(err));

    // Fetch testimonials and comments for notifications
    Promise.all([
      fetchAdminAPI<Testimonial[]>('/testimonials').catch(() => []),
      fetchAdminAPI<Comment[]>('/comments').catch(() => []),
    ]).then(([testimonials, comments]) => {
      const notifs: Array<{
        id: string;
        type: string;
        text: string;
        link: string;
        isRead: boolean;
      }> = [];

      // We'll treat unpublished testimonials and unapproved comments as "unread/action needed"
      // or just show the latest ones. For now, let's just show latest unapproved ones.
      const pendingTestis = testimonials.filter((t) => !t.is_published).slice(0, 5);
      const pendingComments = comments.filter((c) => !c.is_approved).slice(0, 5);

      pendingTestis.forEach((t) => {
        notifs.push({
          id: `t_${t.id}`,
          type: 'testimonial',
          text: `Testimoni baru dari ${t.name}`,
          link: '/admin/testimonials',
          isRead: false,
        });
      });

      pendingComments.forEach((c) => {
        notifs.push({
          id: `c_${c.id}`,
          type: 'comment',
          text: `Komentar baru dari ${c.name}`,
          link: '/admin/comments',
          isRead: false,
        });
      });

      setNotifications(notifs);
    });

    // Handle clicks outside dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (token) {
        await fetch(`${API_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('admin_token');
      router.push('/admin/login');
    }
  };

  const switchLanguage = (lang: string) => {
    if (lang === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    } else {
      document.cookie = `googtrans=/en/id; path=/;`;
      document.cookie = `googtrans=/en/id; path=/; domain=${window.location.hostname}`;
    }
    window.location.reload();
  };

  const toggleLanguage = () => {
    switchLanguage(currentLang === 'en' ? 'id' : 'en');
  };

  return (
    <>
      <div id="google_translate_element_admin" className="hidden"></div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .skiptranslate iframe { display: none !important; }
        body { top: 0px !important; }
        #goog-gt-tt { display: none !important; }
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      `,
        }}
      />
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
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100 flex items-center gap-2"
            title="Switch Language"
          >
            <Languages size={20} />
            <span className="text-sm font-semibold">{currentLang === 'id' ? 'ID' : 'EN'}</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-semibold text-slate-700">Notifikasi</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                    {notifications.length} Baru
                  </span>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      Belum ada notifikasi baru
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.link}
                        onClick={() => setShowNotifMenu(false)}
                        className="p-4 border-b border-slate-50 hover:bg-slate-50 flex items-start gap-3 transition-colors last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                          <MessageSquare size={16} />
                        </div>
                        <div>
                          <p className="text-sm text-slate-700 font-medium">{notif.text}</p>
                          <p className="text-xs text-slate-400 mt-0.5 capitalize">
                            {notif.type} • Butuh tindakan
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200"></div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
                  Yakub Firman Mustofa
                </span>
                <span className="text-xs text-slate-500">yakubfirman.id</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center font-bold font-heading shrink-0">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  'A'
                )}
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
              />
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50 py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
    </>
  );
}
