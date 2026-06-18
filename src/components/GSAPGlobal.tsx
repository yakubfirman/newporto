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
        const headings = gsap.utils.toArray(
          '.comic-heading:not(.hero-section .comic-heading):not(footer .comic-heading):not(.role-text)'
        ) as HTMLElement[];
        const panels = gsap.utils.toArray(
          '.comic-panel, .comic-panel-red, .section-header'
        ) as HTMLElement[];
        const grids = gsap.utils.toArray('.stagger-grid') as HTMLElement[];

        const mm = gsap.matchMedia();

        mm.add(
          {
            isMobile: '(max-width: 767px)',
            isDesktop: '(min-width: 768px)',
          },
          (context) => {
            const { isMobile } = context.conditions as { isMobile: boolean };

            headings.forEach((heading) => {
              gsap.from(heading, {
                scrollTrigger: {
                  trigger: heading,
                  start: 'top 90%',
                  toggleActions: 'play none none none',
                },
                y: isMobile ? 20 : 40,
                opacity: 0,
                rotation: isMobile ? 0 : (Math.random() - 0.5) * 10,
                duration: isMobile ? 0.4 : 0.6,
                ease: isMobile ? 'power2.out' : 'back.out(1.7)',
                clearProps: 'all',
              });
            });

            panels.forEach((panel) => {
              gsap.from(panel, {
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
                scale: isMobile ? 0.95 : 0.9,
                y: isMobile ? 15 : 30,
                opacity: 0,
                duration: isMobile ? 0.4 : 0.6,
                ease: isMobile ? 'power2.out' : 'back.out(1.2)',
                clearProps: 'all',
              });
            });

            grids.forEach((grid) => {
              gsap.from(grid.children, {
                scrollTrigger: {
                  trigger: grid,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
                y: isMobile ? 20 : 50,
                opacity: 0,
                stagger: isMobile ? 0.05 : 0.15,
                duration: isMobile ? 0.4 : 0.6,
                ease: 'power3.out',
                clearProps: 'all',
              });
            });

            ScrollTrigger.refresh();
          }
        );

        // Save mm to clear it up if needed
        return mm;
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
