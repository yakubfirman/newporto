import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/api';

interface ProjectCardProps {
  project: Project;
  className?: string;
  idx?: number;
}

export default function ProjectCard({ project, className = '', idx = 0 }: ProjectCardProps) {
  const categories: string[] = project.categories || [];
  const description = project.description || (project as any).content || '';

  return (
    <Link
      href={project.slug ? `/project/${project.slug}` : '#'}
      className={`group flex flex-col comic-panel overflow-hidden hover:translate-y-2 hover:translate-x-1 hover:shadow-none transition-all duration-300 h-full cursor-pointer ${className}`}
    >
      {/* Image Container */}
      {project.image ? (
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-halftone border-b-4 border-black">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized={project.image?.includes('localhost')}
          />
          <div className="absolute inset-0 bg-primary mix-blend-multiply opacity-0 group-hover:opacity-40 transition-opacity duration-300" />
        </div>
      ) : (
        <div className="relative aspect-[3/2] w-full bg-halftone flex items-center justify-center border-b-4 border-black">
          <span className="comic-heading text-2xl text-black bg-white border-4 border-black px-4 py-2 rotate-3 comic-shadow">
            NO IMAGE
          </span>
        </div>
      )}

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col bg-white">
        <div className="flex-1">
          <h3 className="text-lg sm:text-xl comic-heading mb-2 sm:mb-3 text-black leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>

          {categories && categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 sm:mb-4">
              {categories.slice(0, 3).map((cat, index) => (
                <span
                  key={index}
                  className="text-[8px] sm:text-[9px] comic-heading text-white bg-black px-2 py-1 border border-black tracking-widest uppercase leading-none"
                >
                  {cat}
                </span>
              ))}
              {categories.length > 3 && (
                <span className="text-[8px] sm:text-[9px] comic-heading text-black bg-white px-2 py-1 border border-black tracking-widest uppercase leading-none">
                  +{categories.length - 3}
                </span>
              )}
            </div>
          )}

          {description && (
            <p className="text-slate-600 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium mb-4">
              {description}
            </p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 text-sm comic-heading text-black mt-auto group-hover:text-primary transition-colors">
          <span>READ MORE</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
