import TestimonialForm from '@/components/TestimonialForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Leave a Testimonial',
  description: 'Share your experience working with me.',
};

export default function TestimonialPage() {
  return (
    <main className="w-full relative overflow-hidden bg-white comic-body pt-32 pb-16 md:pt-40 md:pb-24 min-h-screen">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-black font-bold mb-8 hover:underline comic-heading tracking-wide border-[3px] border-black px-4 py-2 bg-white comic-shadow hover:-translate-y-1 hover:bg-primary hover:text-white transition-all -rotate-1"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          BACK TO HOME
        </Link>

        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-10 sm:mb-16">
          <div className="comic-panel-red p-4 sm:p-6 rotate-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl comic-heading text-white leading-none mb-2 comic-text-white">
              Client Reviews
            </h1>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase">
              Thoughts on our Journey.
            </p>
          </div>
          <div className="comic-panel bg-white p-3 sm:p-4 -rotate-1 hidden md:block max-w-xs">
            <p className="font-bold text-black text-sm uppercase tracking-wide leading-snug">
              YOUR FEEDBACK IS INCREDIBLY VALUABLE TO IMPROVE MY SERVICES.
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <TestimonialForm />
        </div>
      </div>
    </main>
  );
}
