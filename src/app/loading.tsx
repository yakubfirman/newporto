export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md">
      <div className="flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center">
          {/* Pulsing background glow */}
          <div className="absolute w-24 h-24 bg-primary/20 rounded-full animate-ping"></div>

          {/* Bouncing Logo Box */}
          <div
            className="relative w-16 h-16 bg-white border-[3px] border-slate-900 comic-shadow rounded-2xl flex items-center justify-center animate-bounce"
            style={{ animationDuration: '1s' }}
          >
            <span className="font-heading text-3xl font-black text-primary">Y</span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-1 font-heading text-xl tracking-wider text-slate-800 font-bold">
          <span>LOADING</span>
          <span className="animate-[bounce_1s_infinite_100ms]">.</span>
          <span className="animate-[bounce_1s_infinite_200ms]">.</span>
          <span className="animate-[bounce_1s_infinite_300ms]">.</span>
        </div>
      </div>
    </div>
  );
}
