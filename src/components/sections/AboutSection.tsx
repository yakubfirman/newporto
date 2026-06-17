'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  settings?: Record<string, string>;
  projectsCount?: number;
}

export default function AboutSection({ settings, projectsCount = 0 }: AboutSectionProps) {
  const currentYear = new Date().getFullYear();
  let yearsOfExperience = currentYear - 2024;
  if (yearsOfExperience <= 0) yearsOfExperience = 1;
  return (
    <section className="w-full relative overflow-hidden py-16 md:py-24 border-t-[6px] border-black bg-white comic-body">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start stagger-grid relative z-10">
          {/* IMAGE SIDE (Comic style) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="border-[4px] border-slate-900 bg-red-50 p-2 transform -rotate-2 hover:rotate-0 transition-transform duration-300 shadow-[8px_8px_0px_rgba(15,23,42,1)] relative w-full aspect-[4/5] sm:max-w-md mx-auto">
              {settings?.profile_image_url ? (
                <Image
                  src={settings.profile_image_url}
                  alt="Yakub Firman"
                  fill
                  className="object-cover z-0"
                  unoptimized={settings.profile_image_url.includes('localhost')}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center text-slate-400 font-bold text-xl">
                  Image Loading...
                </div>
              )}
              <div className="absolute inset-0 pointer-events-none"></div>
              <div className="absolute bottom-6 right-6 z-10">
                <span className="comic-heading text-2xl text-black bg-white border-4 border-black px-4 py-2 -rotate-3 mt-4 comic-shadow">
                  SIAPA SAYA?
                </span>
              </div>
            </div>
          </div>

          {/* TEXT SIDE */}
          <div className="lg:col-span-7 section-header lg:pt-2 bg-white comic-panel p-4 sm:p-6 lg:p-8 rotate-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl comic-heading text-white leading-none mb-3 sm:mb-5 uppercase comic-text">
              {settings?.home_about_heading || 'Mengubah masalah kompleks menjadi solusi elegan!'}
            </h2>

            <div className="space-y-3 sm:space-y-4 text-black leading-relaxed text-sm md:text-base mb-6 sm:mb-8 font-bold tracking-wide whitespace-pre-wrap">
              {settings?.home_about_text ||
                'Saya adalah lulusan Teknik Informatika (2026) yang berdomisili di Surakarta, Jawa Tengah. Saya spesialis dalam membangun arsitektur Headless CMS yang tangguh menggunakan Laravel dan Next.js, menjembatani logika backend yang kuat dengan pengalaman frontend yang mulus.\n\nSelain menulis kode yang rapi, saya sangat antusias dengan SEO dan performa web. Saya juga aktif berbagi pengetahuan sebagai pembicara di berbagai seminar dan workshop teknologi, berfokus pada pengembangan frontend dan literasi media.'}
            </div>

            {/* Comic Stats */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 sm:gap-6 mb-6 sm:mb-8 border-y-4 border-black py-4 sm:py-6 bg-halftone-red -mx-5 sm:-mx-8 px-5 sm:px-8">
              {[
                { value: `${yearsOfExperience}+`, label: 'Tahun Pengalaman' },
                { value: `${projectsCount}+`, label: 'Proyek' },
                { value: settings?.stats_clients || '15+', label: 'Klien' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="stagger-item flex flex-row justify-center items-center gap-2 sm:gap-3 bg-white border-4 border-black px-2 py-1.5 sm:px-4 sm:py-2 comic-shadow -rotate-2 w-full sm:w-auto"
                >
                  <span
                    className="text-2xl sm:text-3xl comic-heading text-primary"
                    style={{ textShadow: '2px 2px 0px #000' }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs comic-heading tracking-widest text-black text-left leading-tight uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group inline-flex justify-center items-center gap-2 sm:gap-3 comic-heading text-xl sm:text-2xl text-white bg-black px-5 sm:px-6 py-3 sm:py-4 hover:bg-primary transition-colors border-4 border-black comic-shadow-red -rotate-1 w-full sm:w-auto text-center"
            >
              Selengkapnya tentang latar belakang saya
              <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
