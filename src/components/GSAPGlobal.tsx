'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function GSAPGlobal() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!mounted) return;

      const runAnimations = () => {
        // Exclude HeroSection and Footer elements to prevent animation conflicts and invisible text
        const headings = gsap.utils.toArray(
          '.comic-heading:not(.hero-section .comic-heading):not(footer .comic-heading):not(.role-text)'
        ) as HTMLElement[];
        headings.forEach((heading) => {
          gsap.from(heading, {
            scrollTrigger: {
              trigger: heading,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            y: 40,
            opacity: 0,
            rotation: (Math.random() - 0.5) * 10,
            duration: 0.6,
            ease: 'back.out(1.7)',
            clearProps: 'all',
          });
        });

        const panels = gsap.utils.toArray(
          '.comic-panel, .comic-panel-red, .section-header'
        ) as HTMLElement[];
        panels.forEach((panel) => {
          gsap.from(panel, {
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            scale: 0.9,
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'back.out(1.2)',
            clearProps: 'all',
          });
        });

        const grids = gsap.utils.toArray('.stagger-grid') as HTMLElement[];
        grids.forEach((grid) => {
          gsap.from(grid.children, {
            scrollTrigger: {
              trigger: grid,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: 'power3.out',
            clearProps: 'all',
          });
        });

        ScrollTrigger.refresh();
      };

      if (document.readyState === 'complete') {
        const timer = setTimeout(runAnimations, 100);
        return () => clearTimeout(timer);
      } else {
        const handleLoad = () => setTimeout(runAnimations, 100);
        window.addEventListener('load', handleLoad);
        return () => window.removeEventListener('load', handleLoad);
      }
    },
    { dependencies: [mounted, pathname] }
  );

  return null;
}
