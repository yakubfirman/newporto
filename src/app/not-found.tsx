import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <style>{`
        header, footer { display: none !important; }
        body { margin: 0; overflow: hidden; }
        main { padding: 0 !important; width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #fff; }
      `}</style>
      <div className="w-full max-w-2xl mx-auto comic-panel p-12 text-center relative overflow-hidden bg-white">
        {/* Halftone background effect */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2.5px)',
            backgroundSize: '16px 16px',
          }}
        ></div>

        {/* Comic speech bubble for 404 */}
        <div className="relative inline-block mb-8">
          <div
            className="text-8xl md:text-[150px] font-black font-heading text-primary tracking-tighter leading-none"
            style={{ WebkitTextStroke: '4px #0f172a' }}
          >
            404
          </div>
          <div className="absolute -bottom-4 right-0 w-16 h-16 bg-white border-4 border-slate-900 rounded-full flex items-center justify-center rotate-12 comic-shadow">
            <span className="text-3xl">?!</span>
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-900 mb-6 uppercase">
          Oops! Page MIA!
        </h2>

        <p className="text-lg md:text-xl text-slate-700 font-medium mb-10 max-w-lg mx-auto">
          The page you are looking for seems to have vanished into another dimension. Let's get you
          back to safety!
        </p>

        <Link
          href="/"
          className="inline-block bg-primary text-white font-bold font-heading tracking-widest text-xl px-10 py-5 rounded-none border-[3px] border-slate-900 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transition-all duration-300 uppercase"
        >
          Return to Base
        </Link>
      </div>
    </>
  );
}
