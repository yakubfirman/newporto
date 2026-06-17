import { Metadata } from 'next';
import { Briefcase, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import { fetchAPI, getSettings, Experience, Education } from '@/lib/api';

export const metadata: Metadata = {
  title: 'About | Yakub Firman Mustofa',
  description: 'Learn more about Yakub Firman Mustofa, a Web Developer and SEO Specialist.',
};

export const revalidate = 60;

export default async function AboutPage() {
  let experiences: Experience[] = [];
  let educations: Education[] = [];
  let settings: Record<string, string> = {};

  try {
    experiences = await fetchAPI<Experience[]>('/experiences');
    educations = await fetchAPI<Education[]>('/education');
  } catch (error) {
    console.error('Error fetching about data:', error);
  }

  settings = await getSettings();

  return (
    <div className="w-full relative overflow-hidden bg-white comic-body pt-32 pb-16 md:pt-40 md:pb-24">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Header */}
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-10 sm:mb-16">
          <div className="comic-panel-red p-4 sm:p-6 -rotate-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl comic-heading text-white leading-none mb-2 comic-text-white">
              About Me
            </h1>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase">
              Designing Digital Products Since 2022.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12 sm:space-y-16">
            {/* Intro */}
            <section className="flex flex-col sm:flex-row gap-6 sm:gap-8 comic-panel p-5 sm:p-8 bg-white rotate-1">
              <div className="w-full sm:w-1/3 shrink-0">
                <div className="relative aspect-[4/5] w-full overflow-hidden border-[4px] border-black bg-halftone comic-shadow -rotate-2">
                  <Image
                    src={settings.profile_image_url || '/about.jpg'}
                    alt="Yakub Firman"
                    fill
                    className="object-cover"
                    unoptimized={settings.profile_image_url?.includes('localhost')}
                  />
                </div>
              </div>
              <div className="w-full sm:w-2/3">
                <h2 className="text-2xl sm:text-3xl comic-heading mb-4 text-black uppercase">
                  {settings.about_page_heading || 'Who I Am'}
                </h2>
                <div className="text-black font-bold text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-wrap uppercase tracking-wide">
                  {settings.about_page_text ||
                    'I am Yakub Firman Mustofa, a passionate Web Developer and SEO Specialist based in Surakarta, Jawa Tengah. With a strong background in IT, I specialize in building high-performance web applications that not only look great but also rank well on search engines.\n\nMy approach combines technical excellence with strategic thinking. I believe in Headless CMS architectures, clean code, and user-centric design to deliver digital products that stand out.'}
                </div>
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className="text-3xl comic-heading mb-8 flex items-center gap-3 text-black bg-primary text-white p-3 sm:px-5 border-[4px] border-black comic-shadow -rotate-1 w-max">
                <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={3} /> Experience
              </h2>
              <div className="space-y-6">
                {experiences.length > 0 ? (
                  experiences.map((exp, i) => (
                    <div
                      key={exp.id}
                      className={`comic-panel p-5 sm:p-6 relative bg-white ${i % 2 === 0 ? 'rotate-1' : '-rotate-1'}`}
                    >
                      <h3 className="comic-heading text-xl sm:text-2xl text-black">{exp.title}</h3>
                      <p className="text-[10px] sm:text-xs font-bold text-white bg-black px-2 py-1 inline-block border-2 border-black tracking-widest mt-2 mb-4 uppercase">
                        {exp.company} •{' '}
                        {new Date(exp.start_date).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        -{' '}
                        {exp.is_current
                          ? 'Present'
                          : exp.end_date
                            ? new Date(exp.end_date).toLocaleDateString('en-US', {
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Present'}
                      </p>
                      <p className="text-black font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap uppercase tracking-wide">
                        {exp.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-black font-bold text-sm comic-panel p-4 rotate-1 bg-white inline-block">
                    No experiences listed yet.
                  </p>
                )}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className="text-3xl comic-heading mb-8 flex items-center gap-3 text-black bg-white p-3 sm:px-5 border-[4px] border-black comic-shadow rotate-1 w-max">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-primary" strokeWidth={3} />{' '}
                Education
              </h2>
              <div className="space-y-6">
                {educations.length > 0 ? (
                  educations.map((edu, i) => (
                    <div
                      key={edu.id}
                      className={`comic-panel p-5 sm:p-6 relative bg-white ${i % 2 === 0 ? '-rotate-1' : 'rotate-1'}`}
                    >
                      <h3 className="comic-heading text-xl sm:text-2xl text-black">{edu.degree}</h3>
                      <p className="text-[10px] sm:text-xs font-bold text-white bg-primary px-2 py-1 inline-block border-2 border-black tracking-widest mt-2 mb-4 uppercase">
                        {edu.institution} •{' '}
                        {new Date(edu.start_date).toLocaleDateString('en-US', { year: 'numeric' })}{' '}
                        -{' '}
                        {edu.is_current
                          ? 'Present'
                          : edu.end_date
                            ? new Date(edu.end_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                              })
                            : 'Present'}
                      </p>
                      {edu.description && (
                        <p className="text-black font-bold text-xs sm:text-sm leading-relaxed whitespace-pre-wrap uppercase tracking-wide">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-black font-bold text-sm comic-panel p-4 -rotate-1 bg-white inline-block">
                    No education listed yet.
                  </p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-32 comic-panel bg-halftone-red p-5 sm:p-8 rotate-2">
              <h3 className="text-2xl comic-heading mb-6 text-black bg-white px-4 py-2 border-[4px] border-black inline-block -rotate-3 comic-shadow text-center w-full">
                Quick Facts!
              </h3>
              <ul className="space-y-4">
                <li className="bg-white border-[3px] border-black p-3 sm:p-4 comic-shadow rotate-1 hover:-rotate-1 transition-transform">
                  <span className="block text-[10px] sm:text-xs comic-heading uppercase tracking-widest text-black bg-primary text-white border-2 border-black px-2 py-0.5 inline-block mb-2 -rotate-2">
                    Location
                  </span>
                  <span className="block font-bold text-black uppercase text-sm sm:text-base tracking-wide">
                    Surakarta, Jawa Tengah
                  </span>
                </li>
                <li className="bg-white border-[3px] border-black p-3 sm:p-4 comic-shadow -rotate-2 hover:rotate-1 transition-transform">
                  <span className="block text-[10px] sm:text-xs comic-heading uppercase tracking-widest text-black bg-black text-white border-2 border-black px-2 py-0.5 inline-block mb-2 rotate-2">
                    Availability
                  </span>
                  <span className="block font-bold text-primary uppercase text-sm sm:text-base tracking-wide">
                    Open to work
                  </span>
                </li>
                <li className="bg-white border-[3px] border-black p-3 sm:p-4 comic-shadow rotate-1 hover:-rotate-1 transition-transform">
                  <span className="block text-[10px] sm:text-xs comic-heading uppercase tracking-widest text-black bg-white border-2 border-black px-2 py-0.5 inline-block mb-2 -rotate-1">
                    Focus
                  </span>
                  <span className="block font-bold text-black uppercase text-sm sm:text-base tracking-wide">
                    Full-stack & SEO
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
