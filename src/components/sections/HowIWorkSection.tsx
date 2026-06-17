'use client';

import { Lightbulb, Palette, Code, Rocket } from 'lucide-react';

const workSteps = [
  {
    icon: <Lightbulb size={28} />,
    title: 'Eksplorasi',
    desc: 'Memahami visi, tujuan, dan target audiens Anda melalui diskusi mendalam.',
  },
  {
    icon: <Palette size={28} />,
    title: 'Desain',
    desc: 'Merancang wireframe dan prototipe UI yang sejalan dengan identitas merek Anda.',
  },
  {
    icon: <Code size={28} />,
    title: 'Pengembangan',
    desc: 'Membangun produk Anda dengan kode yang bersih, terukur, dan berkinerja tinggi.',
  },
  {
    icon: <Rocket size={28} />,
    title: 'Peluncuran',
    desc: 'Menerapkan, menguji, dan terus mengoptimalkan SEO serta pengalaman pengguna.',
  },
];

export default function HowIWorkSection() {
  return (
    <section className="w-full relative overflow-hidden py-16 md:py-24 border-t-[6px] border-black bg-primary/10 comic-body">
      <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="section-header mb-6 sm:mb-8 relative z-10 flex flex-col items-center text-center">
          <div className="comic-panel p-4 sm:p-5 rotate-1 inline-block max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl comic-heading text-white leading-none mb-2 sm:mb-3 comic-text">
              Proses & Alur Kerja
            </h2>
            <p className="text-black font-bold text-sm sm:text-base md:text-lg tracking-wide">
              Pendekatan terstruktur dan terukur untuk mengubah kebutuhan menjadi produk jadi!
            </p>
          </div>
        </div>

        <div className="work-grid stagger-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10 pb-8">
          {workSteps.map((step, i) => (
            <div
              key={i}
              className={`stagger-item group flex flex-col p-5 sm:p-6 comic-panel hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all duration-300 ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
            >
              <div className="flex justify-between items-center mb-4 border-b-[3px] border-black pb-2 sm:pb-3 bg-halftone-red -mx-4 sm:-mx-5 px-4 sm:px-5 pt-2 -mt-4 sm:-mt-5">
                <span className="comic-heading text-3xl sm:text-4xl text-white comic-text">
                  0{i + 1}
                </span>
                <span className="comic-heading text-xs sm:text-sm text-white bg-black px-2 sm:px-2.5 py-1 tracking-widest border-2 border-black rotate-2">
                  Fase
                </span>
              </div>
              <div className="text-black mb-3 sm:mb-4 group-hover:text-primary transition-colors group-hover:scale-110 origin-left w-8 sm:w-10 h-8 sm:h-10 flex items-center justify-center bg-white border-2 border-black rotate-2 comic-shadow">
                {step.icon}
              </div>
              <h3 className="text-xl sm:text-2xl comic-heading text-black mb-1.5 sm:mb-2 tracking-tight leading-none bg-primary text-white px-2 sm:px-2.5 py-1 self-start transform -rotate-2 border-2 border-black">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-black font-bold tracking-wide leading-snug">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
