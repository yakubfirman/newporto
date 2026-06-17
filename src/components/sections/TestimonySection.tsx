'use client';

import type { Testimonial } from '@/lib/api';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRef, useState } from 'react';

interface TestimonySectionProps {
  testimonials: Testimonial[];
}

export default function TestimonySection({ testimonials }: TestimonySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full relative py-16 md:py-24 border-t-[6px] border-black bg-primary/10 comic-body">
      <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="section-header mb-8 sm:mb-12 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl comic-heading text-white leading-none mb-2 comic-text bg-white border-[3px] border-black p-2 sm:p-4 inline-block comic-shadow rotate-1">
              Client Quotes!
            </h2>
          </div>
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 bg-primary text-white border-[3px] border-black px-6 py-3 comic-heading text-lg hover:bg-black hover:text-white transition-colors comic-shadow-sm whitespace-nowrap"
          >
            LEAVE A REVIEW
            <ArrowRight size={20} strokeWidth={3} />
          </Link>
        </div>

        <div className="relative z-10 pb-8 group">
          {testimonials.length > 0 ? (
            <>
              {/* Slider Controls */}
              {testimonials.length > 3 && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 z-20 flex justify-between pointer-events-none -mx-4 sm:-mx-6 lg:-mx-8 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                  <button
                    onClick={() => scroll('left')}
                    className="pointer-events-auto bg-white border-[3px] border-black w-12 h-12 flex items-center justify-center comic-shadow-sm hover:bg-primary hover:text-white transition-colors text-black"
                    aria-label="Previous testimonials"
                  >
                    <ChevronLeft size={24} strokeWidth={3} />
                  </button>
                  <button
                    onClick={() => scroll('right')}
                    className="pointer-events-auto bg-white border-[3px] border-black w-12 h-12 flex items-center justify-center comic-shadow-sm hover:bg-primary hover:text-white transition-colors text-black"
                    aria-label="Next testimonials"
                  >
                    <ChevronRight size={24} strokeWidth={3} />
                  </button>
                </div>
              )}

              {/* Slider Container */}
              <div
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 lg:gap-8 pb-12 pt-4 px-2 -mx-2 hide-scrollbar scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {testimonials.map((t, i) => (
                  <div
                    key={t.id}
                    className={`stagger-item flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.33rem)] snap-center sm:snap-start flex flex-col p-6 comic-panel relative bg-white ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                  >
                    <div className="comic-tail"></div>
                    <div className="text-black font-bold tracking-wide leading-relaxed mb-6 text-base flex-1 relative z-10">
                      <p>
                        &quot;
                        {t.content.length > 100 ? t.content.substring(0, 100) + '...' : t.content}
                        &quot;
                      </p>
                      {t.content.length > 100 && (
                        <button
                          onClick={() => setSelectedTestimonial(t)}
                          className="block mt-3 text-sm text-primary hover:underline font-bold comic-heading"
                        >
                          Baca selengkapnya
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t-[3px] border-black mt-3 border-dashed">
                      <div className="w-12 h-12 bg-primary border-[3px] border-black text-white flex items-center justify-center comic-heading text-2xl comic-shadow shrink-0">
                        {t.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="comic-heading text-black text-xl leading-none mb-1 truncate notranslate">
                          {t.name}
                        </p>
                        {t.role && (
                          <p className="text-xs comic-heading text-white bg-black px-2 py-0.5 inline-block tracking-widest truncate max-w-full notranslate">
                            {t.role}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white border-[3px] border-black border-dashed p-8 text-center comic-shadow relative z-10 max-w-2xl mx-auto">
              <span className="comic-heading text-xl text-slate-400">
                NO TESTIMONIALS YET... BE THE FIRST!
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal / Popup for Full Testimonial */}
      {selectedTestimonial && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-[4px] border-black p-6 sm:p-8 max-w-lg w-full relative comic-shadow">
            <button
              onClick={() => setSelectedTestimonial(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-10 h-10 flex items-center justify-center bg-white border-[3px] border-black hover:bg-primary hover:text-white transition-colors"
            >
              <span className="sr-only">Close</span>
              <X size={24} strokeWidth={3} />
            </button>
            <div className="comic-heading text-2xl text-black mb-4 border-b-[3px] border-dashed border-black pb-4">
              Testimonial Detail
            </div>
            <p className="text-black font-bold tracking-wide leading-relaxed mb-6 text-lg">
              &quot;{selectedTestimonial.content}&quot;
            </p>
            <div className="flex items-center gap-4 pt-4 border-t-[3px] border-black mt-3">
              <div className="w-12 h-12 bg-primary border-[3px] border-black text-white flex items-center justify-center comic-heading text-2xl comic-shadow shrink-0">
                {selectedTestimonial.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="comic-heading text-black text-xl leading-none mb-1 truncate notranslate">
                  {selectedTestimonial.name}
                </p>
                {selectedTestimonial.role && (
                  <p className="text-xs comic-heading text-white bg-black px-2 py-0.5 inline-block tracking-widest truncate max-w-full notranslate">
                    {selectedTestimonial.role}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `,
        }}
      />
    </section>
  );
}
