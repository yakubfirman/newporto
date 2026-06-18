'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Mail, MapPin, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { API_URL, SocialMedia } from '@/lib/api';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.18c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 9 18v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Footer({
  headerImageUrl = '/profile.jpg',
  contactEmail = 'hello@yakubfirman.id',
  footerText = 'Seorang Pengembang Web Full-stack & Spesialis SEO yang penuh semangat, berdedikasi untuk membangun pengalaman digital berkinerja tinggi.',
}: {
  headerImageUrl?: string;
  contactEmail?: string;
  footerText?: string;
}) {
  const pathname = usePathname();
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);

  useEffect(() => {
    const fetchSocials = async () => {
      try {
        const response = await fetch(`${API_URL}/social-media`);
        if (response.ok) {
          const data = await response.json();
          setSocialMedias(data);
        }
      } catch (error) {
        console.error('Failed to fetch social media links', error);
      }
    };
    fetchSocials();
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-white border-t-4 border-black pt-20 pb-10 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 mb-6 group bg-white border-[3px] border-black p-1.5 comic-shadow-red -rotate-1 hover:rotate-0 hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
            >
              <div className="relative w-8 h-8 bg-black border-[2px] border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0">
                <Image
                  src={headerImageUrl}
                  alt="Yakub Firman"
                  fill
                  className="object-cover"
                  unoptimized={headerImageUrl.includes('localhost')}
                />
              </div>
              <span className="comic-heading text-2xl tracking-tighter text-black uppercase pr-2 pt-1">
                <span className="notranslate text-primary">Yakub Firman</span>
                <span>.</span>
              </span>
            </Link>
            <p className="text-black font-bold leading-relaxed max-w-sm mb-8 bg-white border-2 border-black p-3 rotate-1">
              {footerText}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {socialMedias.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Profil ${social.name} Yakub Firman`}
                  className="w-10 h-10 bg-white flex items-center justify-center text-black border-[3px] border-black comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all group/social"
                >
                  <span className="sr-only">{social.name}</span>
                  {social.icon_url ? (
                    <img
                      src={social.icon_url}
                      alt={social.name}
                      className="w-5 h-5 object-contain transition-all"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-black rounded-full" />
                  )}
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white border-[3px] border-black p-5 comic-shadow rotate-1 hover:-rotate-0 transition-transform duration-300">
            <h3 className="comic-heading text-black mb-5 uppercase tracking-widest text-lg border-b-[3px] border-black pb-1 bg-primary text-white inline-block px-2 -mx-2">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-black font-bold uppercase tracking-widest text-sm hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={16}
                    strokeWidth={3}
                    className="text-primary opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all"
                  />{' '}
                  Tentang Saya
                </Link>
              </li>
              <li>
                <Link
                  href="/project"
                  className="text-black font-bold uppercase tracking-widest text-sm hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={16}
                    strokeWidth={3}
                    className="text-primary opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all"
                  />{' '}
                  Proyek
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-black font-bold uppercase tracking-widest text-sm hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={16}
                    strokeWidth={3}
                    className="text-primary opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all"
                  />{' '}
                  Blog & Wawasan
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-black font-bold uppercase tracking-widest text-sm hover:text-primary transition-colors flex items-center gap-2 group"
                >
                  <ArrowRight
                    size={16}
                    strokeWidth={3}
                    className="text-primary opacity-0 -ml-4 group-hover:ml-0 group-hover:opacity-100 transition-all"
                  />{' '}
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-[3px] border-black flex flex-col md:flex-row justify-between items-center gap-4 bg-white text-black p-4 sm:p-5 comic-shadow-red relative overflow-hidden group">
          {/* Subtle Halftone inside bar */}
          <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"></div>

          <p className="text-black text-xs md:text-sm comic-heading tracking-widest relative z-10 text-center md:text-left">
            &copy; {new Date().getFullYear()}{' '}
            <span className="notranslate text-primary">Yakub Firman</span>. Hak cipta dilindungi.
          </p>
          <p className="text-black text-xs md:text-sm comic-heading tracking-widest flex items-center justify-center md:justify-end gap-1.5 relative z-10">
            Dirancang dengan{' '}
            <span className="text-primary animate-pulse text-xl drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]">
              &hearts;
            </span>{' '}
            di Surakarta
          </p>
        </div>
      </div>
    </footer>
  );
}
