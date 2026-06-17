'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import {
  HeroSection,
  AboutSection,
  ProjectsSection,
  HowIWorkSection,
  SkillsSection,
  TestimonySection,
  BlogSection,
} from './sections';
import type { Project, Skill, Post, Testimonial } from '@/lib/api';

gsap.registerPlugin(ScrollTrigger, TextPlugin);

export default function HomeClient({
  projects,
  skills,
  posts,
  testimonials,
  settings,
}: {
  projects: Project[];
  skills: Skill[];
  posts: Post[];
  testimonials: Testimonial[];
  settings?: Record<string, string>;
}) {
  const sectionsRef = useRef(null);

  return (
    <div ref={sectionsRef} className="relative z-10 flex flex-col">
      <HeroSection />
      <AboutSection settings={settings} />
      <ProjectsSection projects={projects} />
      <HowIWorkSection />
      <SkillsSection skills={skills} />
      <TestimonySection testimonials={testimonials} />
      <BlogSection posts={posts} />
    </div>
  );
}
