'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application Error:', error);
  }, [error]);

  return (
    <>
      <style>{`
        header, footer { display: none !important; }
        body { margin: 0; overflow: hidden; }
        main { padding: 0 !important; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #fff; }
      `}</style>
      <div className="w-full max-w-2xl mx-auto comic-panel p-10 md:p-14 text-center relative overflow-hidden bg-white">
        {/* Halftone background effect */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)',
            backgroundSize: '16px 16px',
          }}
        ></div>

        {/* Explosion shape for error */}
        <div className="relative inline-block mb-10">
          <div className="absolute inset-0 bg-red-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <div
            className="relative z-10 w-32 h-32 bg-yellow-400 border-[4px] border-slate-900 comic-shadow flex items-center justify-center rotate-6"
            style={{
              clipPath:
                'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
            }}
          >
            <span className="text-4xl font-black font-heading text-slate-900 -rotate-6">BAM!</span>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-900 mb-6 uppercase leading-tight">
          System <br className="hidden md:block" /> Malfunction!
        </h2>

        <p className="text-lg md:text-xl text-slate-700 font-medium mb-10 max-w-lg mx-auto">
          Something went horribly wrong while processing your request. Our superheroes have been
          notified!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-block bg-primary text-white font-bold font-heading tracking-widest text-lg px-8 py-4 rounded-none border-[3px] border-slate-900 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 uppercase"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-block bg-white text-slate-900 font-bold font-heading tracking-widest text-lg px-8 py-4 rounded-none border-[3px] border-slate-900 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 uppercase"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  );
}
