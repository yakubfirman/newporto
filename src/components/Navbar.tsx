'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar({ headerImageUrl = '/profile.jpg' }: { headerImageUrl?: string }) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (pathname.startsWith('/admin')) return null;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/about', label: 'Tentang' },
    { href: '/project', label: 'Proyek' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <>
      <header
        className={`fixed top-2 sm:top-4 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 transition-all duration-300`}
      >
        <nav
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-[3px] md:border-4 border-black transition-all duration-300 ${isScrolled ? 'bg-white comic-shadow py-2 sm:py-3 md:-rotate-1' : 'bg-white comic-shadow-red py-3 sm:py-4'}`}
        >
          <div className="flex items-center justify-between">
            <Link href="/" className="shrink-0 flex items-center gap-2 group min-w-0">
              <div className="relative w-9 h-9 md:w-10 md:h-10 bg-primary border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all shrink-0">
                <Image
                  src={headerImageUrl}
                  alt="Yakub Firman"
                  fill
                  className="object-cover"
                  unoptimized={headerImageUrl.includes('localhost')}
                />
              </div>
              <span className="comic-heading text-2xl md:text-3xl text-black uppercase pt-1 truncate">
                <span className="notranslate">Yakub Firman</span>
                <span className="text-primary">.</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-10 flex-1 justify-center">
              <div className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`comic-heading text-xl uppercase tracking-widest transition-colors duration-200 relative group px-3 py-1 ${pathname.startsWith(link.href) ? 'text-white bg-black rotate-2' : 'text-black hover:text-primary'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center shrink-0">
              <Link href="/contact" className="btn-primary">
                Hubungi Saya
              </Link>
            </div>

            <button
              aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
              className="md:hidden shrink-0 w-10 h-10 flex items-center justify-center text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-none transition-all z-50 relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={24} strokeWidth={3} />
              ) : (
                <Menu size={24} strokeWidth={3} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-halftone opacity-40"></div>
        <div className="relative h-full flex flex-col pt-32 px-6 bg-white/90">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`group flex items-center justify-between py-3 px-5 text-lg font-black uppercase tracking-widest border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all ${
                  pathname.startsWith(link.href)
                    ? 'bg-primary text-white'
                    : 'bg-white text-black hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <span className="text-black group-hover:text-primary transition-colors">
                  &rarr;
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center py-3 px-5 text-lg font-black uppercase tracking-widest text-white border-[3px] border-black bg-black shadow-[4px_4px_0px_0px_rgba(239,68,68,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all"
            >
              Hubungi Saya
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
