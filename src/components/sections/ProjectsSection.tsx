'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/lib/api';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Use the same ordering as the main projects page — show the first 4 projects
  const displayedProjects = projects.slice(0, 4);

  return (
    <section className="w-full relative py-16 md:py-24 border-t-[6px] border-black bg-white comic-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-8 relative z-10">
          <div className="comic-panel-red p-4 sm:p-5 -rotate-1 max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl comic-heading text-white leading-none mb-2 comic-text-white">
              Karya Pilihan
            </h2>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide">
              Lihat beberapa proyek dan kreasi terbaru saya.
            </p>
          </div>
          <Link href="/project" className="btn-primary w-full md:w-auto">
            Lihat semua proyek
            <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
          </Link>
        </div>

        {displayedProjects.length > 0 ? (
          <div className="max-w-7xl mx-auto w-full relative z-10">
            <div className="stagger-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {displayedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        ) : (
          <div className="w-full bg-slate-50 border-[3px] border-black border-dashed p-8 sm:p-12 text-center rotate-1 relative z-10 comic-shadow">
            <span className="comic-heading text-xl sm:text-2xl text-slate-600">
              SEGERA HADIR...
            </span>
          </div>
        )}
      </div>

      {/* Decorative dots pattern */}
      <div className="absolute inset-0 bg-halftone opacity-[0.15] pointer-events-none" />
    </section>
  );
}
