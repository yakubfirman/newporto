'use client';

import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection() {
  const heroRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    (context) => {
      if (!mounted) return;

      const runAnimations = () => {
        // Use context.add so animations created asynchronously are properly cleaned up!
        context.add(() => {
          const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

          tl.fromTo(
            '.hero-badge',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, delay: 0.2 }
          )
            .fromTo(
              '.hero-word',
              { y: 50, opacity: 0, rotateX: -30 },
              { y: 0, opacity: 1, rotateX: 0, duration: 0.8, ease: 'back.out(1.2)', stagger: 0.05 },
              '-=0.4'
            )
            .fromTo(
              '.hero-desc-word',
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.5, stagger: 0.02 },
              '-=0.2'
            )
            .fromTo(
              '.hero-btn',
              { y: 30, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
              '-=0.4'
            );

          const roleTextEl = document.querySelector('.role-text');
          if (roleTextEl) {
            const rolesList = ['Web Developer', 'SEO Specialist', 'System Analyst'];
            const roleTl = gsap.timeline({ repeat: -1 });

            rolesList.forEach((role) => {
              roleTl
                .to('.role-text', {
                  text: { value: role, delimiter: '' },
                  duration: 1,
                  ease: 'none',
                  delay: 0.5,
                })
                .to('.role-text', { duration: 2 })
                .to('.role-text', {
                  text: { value: '', delimiter: '' },
                  duration: 0.5,
                  ease: 'none',
                });
            });

            gsap.to('.role-cursor', {
              opacity: 0,
              ease: 'steps(1)',
              repeat: -1,
              duration: 0.5,
            });
          }
        });
      };

      if (document.readyState === 'complete') {
        setTimeout(runAnimations, 100);
      } else {
        window.addEventListener('load', () => setTimeout(runAnimations, 100));
        return () => window.removeEventListener('load', runAnimations);
      }
    },
    { scope: heroRef, dependencies: [mounted] }
  );

  return (
    <section className="hero-section w-full relative overflow-hidden h-[100dvh] flex flex-col justify-center bg-white comic-body border-b-4 border-black pb-16 pt-10">
      <div className="absolute inset-0 bg-halftone opacity-60 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
      <div className="absolute top-24 left-6 hidden lg:flex flex-col gap-1 text-xs font-black text-white bg-black border-[3px] border-black px-3 py-1.5 comic-shadow -rotate-3 z-20 uppercase tracking-widest comic-heading text-xl">
        <span>EDISI #1</span>
        <span className="text-primary">VOL. 2026</span>
      </div>
      <div
        ref={heroRef}
        className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-center px-4 pt-20 lg:pt-28"
      >
        <div className="overflow-hidden mb-4 sm:mb-6">
          <div className="hero-badge inline-flex items-center gap-2 px-3 sm:px-6 py-1 sm:py-2 border-[3px] sm:border-4 border-black bg-primary text-white comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all cursor-default -rotate-2">
            <span className="text-xs sm:text-xl comic-heading tracking-widest">
              Berbasis di Surakarta
            </span>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7rem] comic-heading text-white leading-[0.9] mb-4 md:mb-6 w-full flex flex-col items-center uppercase comic-text">
          <div className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 gap-y-1 notranslate">
            {'Yakub Firman Mustofa'.split(' ').map((word, i) => (
              <div key={i} className="overflow-hidden px-2 pt-2 pb-4 -mx-2 -mt-2 -mb-4">
                <span className="hero-word inline-block">{word}</span>
              </div>
            ))}
          </div>

          <div
            className="flex flex-wrap justify-center items-center gap-x-2 sm:gap-x-3 gap-y-2 sm:gap-y-3 mt-3 sm:mt-4 text-base sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl text-black comic-heading tracking-tight"
            style={{ textShadow: 'none' }}
          >
            <div className="overflow-hidden px-2 pt-2 pb-4 -mx-2 -mt-2 -mb-4">
              <span className="hero-word inline-block bg-primary text-white px-2 sm:px-4 py-0.5 sm:py-1 -rotate-3 border-[2px] sm:border-[3px] border-black comic-shadow">
                SAYA SEORANG
              </span>
            </div>
            <div className="hero-word inline-flex items-center justify-center w-[150px] sm:w-[220px] lg:w-[350px] xl:w-[420px] gap-2 px-6 sm:px-8 py-2.5 sm:py-3 border-[3px] border-black bg-white text-black comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all -rotate-2 tracking-wide ml-1 sm:ml-2 h-full">
              <span
                className="role-text comic-heading text-primary uppercase whitespace-nowrap text-center"
                style={{
                  textShadow:
                    '3px 3px 0px white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white',
                }}
              ></span>
              <span className="role-cursor text-primary font-bold ml-1">|</span>
            </div>
          </div>
        </h1>

        {/* <div className="max-w-2xl mb-8 sm:mb-10 flex flex-wrap justify-center gap-x-1 sm:gap-x-2 bg-white comic-panel p-3 sm:p-6 rotate-1 mt-6 sm:mt-8">
          {'Informatics Engineering graduate bridging the gap between elegant design, robust backend logic, and technical SEO architecture.'
            .split(' ')
            .map((word, i) => (
              <div key={i} className="overflow-hidden">
                <span className="hero-desc-word inline-block text-black text-xs sm:text-lg md:text-xl font-bold uppercase leading-relaxed">
                  {word}&nbsp;
                </span>
              </div>
            ))}
        </div> */}

        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-6 sm:gap-8 w-full mt-4 sm:mt-6 px-4">
          <div className="hero-btn w-full sm:w-auto">
            <Link
              href="#proyek"
              className="inline-flex justify-center items-center gap-2 comic-heading text-xl sm:text-2xl px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white border-[3px] border-black comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all rotate-2 tracking-wide w-full sm:w-auto"
            >
              Lihat Proyek <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
            </Link>
          </div>
          <div className="hero-btn w-full sm:w-auto">
            <Link
              href="/about"
              className="inline-flex justify-center items-center gap-2 comic-heading text-xl sm:text-2xl px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-black border-[3px] border-black comic-shadow hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all -rotate-2 tracking-wide w-full sm:w-auto"
            >
              Baca Profil
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
