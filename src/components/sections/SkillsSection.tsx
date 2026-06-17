'use client';

import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiPhp,
  SiPython,
  SiLaravel,
  SiCodeigniter,
  SiFlask,
  SiMysql,
  SiPostgresql,
} from 'react-icons/si';
import {
  BarChart,
  PenTool,
  Database,
  Server,
  Monitor,
  Smartphone,
  Settings,
  Globe,
} from 'lucide-react';
import type { Skill } from '@/lib/api';

const getSkillIcon = (category: string | undefined, name: string) => {
  const nm = name.toLowerCase();

  // Brand Icons
  if (nm.includes('javascript')) return <SiJavascript size={24} className="text-current" />;
  if (nm.includes('typescript')) return <SiTypescript size={24} className="text-current" />;
  if (nm.includes('react')) return <SiReact size={24} className="text-current" />;
  if (nm.includes('nextjs') || nm.includes('next.js'))
    return <SiNextdotjs size={24} className="text-current" />;
  if (nm.includes('php')) return <SiPhp size={24} className="text-current" />;
  if (nm.includes('python')) return <SiPython size={24} className="text-current" />;
  if (nm.includes('laravel')) return <SiLaravel size={24} className="text-current" />;
  if (nm.includes('codeigniter')) return <SiCodeigniter size={24} className="text-current" />;
  if (nm.includes('flask')) return <SiFlask size={24} className="text-current" />;
  if (nm.includes('mysql')) return <SiMysql size={24} className="text-current" />;
  if (nm.includes('postgres')) return <SiPostgresql size={24} className="text-current" />;

  // Fallback Category Icons
  const cat = (category || '').toLowerCase();
  if (nm.includes('seo') || nm.includes('marketing'))
    return <BarChart size={24} className="text-current" />;
  if (nm.includes('design') || cat.includes('design'))
    return <PenTool size={24} className="text-current" />;
  if (nm.includes('database') || cat.includes('database'))
    return <Database size={24} className="text-current" />;
  if (cat.includes('backend')) return <Server size={24} className="text-current" />;
  if (cat.includes('frontend')) return <Monitor size={24} className="text-current" />;
  if (cat.includes('mobile')) return <Smartphone size={24} className="text-current" />;
  if (cat.includes('tools') || cat.includes('devops'))
    return <Settings size={24} className="text-current" />;

  return <Globe size={24} className="text-current" />;
};

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section className="w-full relative overflow-hidden py-16 md:py-24 border-t-[6px] border-black bg-white comic-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="section-header mb-6 sm:mb-8 flex flex-col">
          <div className="comic-panel-red p-3 sm:p-5 inline-block self-start -rotate-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl comic-heading text-white leading-none mb-1.5 sm:mb-2 comic-text-white">
              Technical Arsenal
            </h2>
            <p className="text-black comic-heading tracking-widest text-lg sm:text-xl md:text-2xl bg-white px-3 sm:px-4 py-1.5 inline-block border-[3px] border-black rotate-2 comic-shadow">
              The tools & frameworks I use!
            </p>
          </div>
        </div>

        <div className="stagger-grid flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 lg:gap-5 relative z-10 pb-8">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <div
                key={skill.id}
                className="stagger-item group flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 comic-panel hover:-translate-y-1 hover:translate-x-1 hover:shadow-none transition-all duration-200 cursor-default text-center sm:text-left min-w-[100px] sm:min-w-0"
              >
                <div className="text-black group-hover:text-primary transition-colors scale-110 sm:scale-125">
                  {getSkillIcon(skill.category, skill.name)}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl comic-heading text-black leading-none mt-1 sm:mt-0">
                    {skill.name}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] comic-heading tracking-widest text-white bg-black px-1.5 py-0.5 mt-1 sm:mt-1 inline-block border border-black">
                    {skill.category || 'Tech'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full py-16 text-center comic-panel-red">
              <span className="comic-heading text-4xl tracking-widest">
                No skills data available.
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
