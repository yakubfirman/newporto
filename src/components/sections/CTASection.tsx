'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="w-full relative overflow-hidden py-16 md:py-32 border-t-[6px] border-black bg-primary comic-body">
      <div className="absolute inset-0 bg-halftone opacity-50 mix-blend-multiply pointer-events-none"></div>
      <div className="absolute -top-64 -right-64 w-[800px] h-[800px] bg-white rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="px-4 flex flex-col items-center text-center w-full">
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center comic-panel p-6 sm:p-10 lg:p-16 -rotate-2">
          <div className="absolute -top-4 sm:-top-6 -left-2 sm:-left-6 bg-black text-white px-3 sm:px-5 py-1.5 sm:py-2 border-[3px] border-white comic-shadow rotate-3">
            <span className="text-sm sm:text-base comic-heading tracking-widest flex items-center gap-1.5 sm:gap-2">
              <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 animate-pulse border-2 border-white rounded-full shrink-0"></span>
              Available for collaboration!
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl comic-heading text-white leading-[0.9] sm:leading-[0.85] mb-5 sm:mb-8 comic-text uppercase mt-3 sm:mt-0">
            Let&apos;s Build <br /> Something <br />{' '}
            <span
              className="text-primary block mt-2 sm:mt-0"
              style={{
                textShadow:
                  '3px 3px 0px #000, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 2px 2px 0 #fff',
              }}
            >
              Epic!
            </span>
          </h2>

          <p className="text-black font-bold text-base sm:text-lg md:text-xl max-w-2xl mb-8 sm:mb-10 uppercase tracking-wide leading-relaxed">
            I&apos;m currently open to full-time roles, freelance projects, and exciting
            collaborations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto mt-2 sm:mt-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 comic-heading text-xl sm:text-2xl px-6 sm:px-10 py-3 sm:py-4 bg-black text-white border-4 border-black hover:bg-primary hover:text-white transition-colors w-full sm:w-auto comic-shadow-red rotate-3 hover:translate-y-2 hover:translate-x-2 hover:shadow-none hover:rotate-0"
            >
              Get in touch <ArrowRight size={24} className="sm:w-6 sm:h-6" strokeWidth={4} />
            </Link>
            <Link
              href="mailto:hello@yakubfirman.id"
              className="inline-flex items-center justify-center gap-2 sm:gap-3 comic-heading text-lg sm:text-xl px-5 sm:px-8 py-3 sm:py-4 border-[3px] border-black text-black bg-white hover:bg-black hover:text-white transition-colors w-full sm:w-auto comic-shadow -rotate-2 hover:translate-y-2 hover:translate-x-2 hover:shadow-none hover:rotate-0 truncate max-w-full"
            >
              hello@yakubfirman.id
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
