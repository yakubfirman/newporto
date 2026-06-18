import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { fetchAPI, Project } from '@/lib/api';
import ProjectCard from '@/components/ProjectCard';
import ComicSearchForm from '@/components/ComicSearchForm';

export const metadata: Metadata = {
  title: 'Projects | Yakub Firman Mustofa',
  description: 'Explore the latest web development and design projects by Yakub Firman Mustofa.',
};

export const revalidate = 0;

export default async function ProjectPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const categoryParam = typeof searchParams.category === 'string' ? searchParams.category : 'All';
  const searchQuery =
    typeof searchParams.search === 'string' ? searchParams.search.toLowerCase() : '';
  const currentPage = parseInt(pageParam, 10) || 1;
  const ITEMS_PER_PAGE = 8;

  let projects: Project[] = [];

  try {
    projects = await fetchAPI<Project[]>('/projects');
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  // Categories definition
  const AVAILABLE_CATEGORIES = ['Full Stack', 'Frontend', 'Backend', 'SEO & AIO', 'System Analist'];

  const categories = ['All', ...AVAILABLE_CATEGORIES];

  // Filtering
  const filteredProjects = projects.filter((p) => {
    const matchCategory = categoryParam === 'All' || p.categories?.includes(categoryParam);
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery) ||
      (p.tech_stack && p.tech_stack.some((t) => t.toLowerCase().includes(searchQuery))) ||
      (p.categories && p.categories.some((c) => c.toLowerCase().includes(searchQuery))) ||
      (p.description && p.description.toLowerCase().includes(searchQuery));

    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full relative overflow-hidden bg-white comic-body pt-32 pb-16 md:pt-40 md:pb-24 min-h-screen">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Header */}
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-5 mb-8 sm:mb-12">
          <div className="comic-panel-red p-4 sm:p-6 -rotate-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl comic-heading text-white leading-none mb-2 comic-text-white">
              Karya Terpilih
            </h1>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide ">
              Proyek & Studi Kasus.
            </p>
          </div>
          <div className="flex flex-col gap-4 items-start md:items-end">
            <div className="rotate-1 w-full flex justify-start md:justify-end">
              <ComicSearchForm basePath="/project" placeholder="Cari proyek (React, SEO...)" />
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="mb-8 comic-panel bg-yellow-100 p-4 inline-flex items-center gap-4 rotate-1 comic-shadow">
            <span className="comic-heading text-lg sm:text-xl text-black uppercase">
              Hasil Pencarian: <span className="text-primary">"{searchQuery}"</span>
            </span>
            <Link
              href={`/project${categoryParam !== 'All' ? `?category=${categoryParam}` : ''}`}
              className="bg-white border-2 border-black p-1 hover:bg-primary hover:text-white transition-colors"
              title="Hapus pencarian"
            >
              <X size={20} strokeWidth={3} />
            </Link>
          </div>
        )}

        {/* Filter Categories */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/project?category=${cat}`}
                className={`comic-heading uppercase tracking-widest text-xs sm:text-sm px-4 py-2 border-2 border-black transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] ${
                  categoryParam === cat
                    ? 'bg-primary text-white shadow-[4px_4px_0px_rgba(0,0,0,1)] -translate-y-1'
                    : 'bg-white text-black'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        )}

        {filteredProjects.length > 0 ? (
          <>
            <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {paginatedProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  className={idx % 2 === 0 ? 'rotate-1' : '-rotate-1'}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 w-full">
                {currentPage > 1 ? (
                  <Link
                    href={`/project?page=${currentPage - 1}`}
                    className="comic-panel px-4 py-2 bg-white text-black font-bold hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase rotate-1"
                  >
                    Sebelumnya
                  </Link>
                ) : (
                  <div className="px-4 py-2 opacity-0 pointer-events-none">Sebelumnya</div>
                )}

                <span className="comic-heading text-xl text-black bg-white px-4 py-2 border-[3px] border-black comic-shadow -rotate-1">
                  {currentPage} / {totalPages}
                </span>

                {currentPage < totalPages ? (
                  <Link
                    href={`/project?page=${currentPage + 1}`}
                    className="comic-panel px-4 py-2 bg-black text-white font-bold hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase rotate-1 comic-shadow-red"
                  >
                    Berikutnya
                  </Link>
                ) : (
                  <div className="px-4 py-2 opacity-0 pointer-events-none">Berikutnya</div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="comic-panel p-8 sm:p-12 text-center bg-white rotate-1 max-w-xl mx-auto">
            <span className="comic-heading text-xl text-black">Belum ada proyek saat ini.</span>
          </div>
        )}
      </div>
    </div>
  );
}
