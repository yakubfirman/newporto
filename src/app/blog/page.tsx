import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, BookOpen, Calendar, Clock, X } from 'lucide-react';
import { fetchAPI, Post } from '@/lib/api';
import PostCard from '@/components/PostCard';
import ComicSearchForm from '@/components/ComicSearchForm';

export const metadata: Metadata = {
  title: 'Blog | Yakub Firman Mustofa',
  description: 'Read the latest articles about web development, SEO, and technology.',
};

export const revalidate = 0;

export default async function BlogPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const pageParam = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const currentPage = parseInt(pageParam, 10) || 1;
  const ITEMS_PER_PAGE = 6;

  let posts: Post[] = [];
  const searchQuery =
    typeof searchParams.search === 'string' ? searchParams.search.toLowerCase() : '';

  try {
    const fetchedPosts = await fetchAPI<Post[]>('/posts');
    if (searchQuery) {
      posts = fetchedPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery) ||
          (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery)) ||
          (p.content && p.content.toLowerCase().includes(searchQuery))
      );
    } else {
      posts = fetchedPosts;
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
  }

  const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
  const paginatedPosts = posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full relative overflow-hidden bg-white comic-body pt-32 pb-16 md:pt-40 md:pb-24 min-h-screen">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-16">
          <div className="comic-panel-red p-4 sm:p-6 rotate-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl comic-heading text-white leading-none mb-2 comic-text-white">
              Blog & Wawasan
            </h1>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase">
              Pemikiran tentang Lanskap Digital.
            </p>
          </div>
          <div className="flex flex-col gap-4 items-start md:items-end rotate-1 md:rotate-0">
            <div className="comic-panel bg-white p-3 sm:p-4 hidden md:block max-w-xs rotate-2">
              <p className="font-bold text-black text-sm uppercase tracking-wide leading-snug">
                TUTORIAL, OPINI, DAN TIPS PENGEMBANGAN WEB.
              </p>
            </div>
            <div className="-rotate-1 w-full flex justify-start md:justify-end">
              <ComicSearchForm basePath="/blog" placeholder="Cari artikel..." />
            </div>
          </div>
        </div>

        {searchQuery && (
          <div className="mb-8 comic-panel bg-yellow-100 p-4 inline-flex items-center gap-4 -rotate-1 comic-shadow">
            <span className="comic-heading text-lg sm:text-xl text-black uppercase">
              Hasil Pencarian: <span className="text-primary">"{searchQuery}"</span>
            </span>
            <Link
              href="/blog"
              className="bg-white border-2 border-black p-1 hover:bg-primary hover:text-white transition-colors"
              title="Hapus pencarian"
            >
              <X size={20} strokeWidth={3} />
            </Link>
          </div>
        )}

        {posts.length > 0 ? (
          <>
            <div className="stagger-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {paginatedPosts.map((post, index) => {
                const rotationClass =
                  index % 3 === 0 ? '-rotate-1' : index % 3 === 1 ? 'rotate-1' : 'rotate-0';
                const hoverRotationClass = index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1';

                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    className={`${rotationClass} ${hoverRotationClass}`}
                  />
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 w-full">
                {currentPage > 1 ? (
                  <Link
                    href={`/blog?page=${currentPage - 1}`}
                    className="comic-panel px-4 py-2 bg-white text-black font-bold hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase rotate-1"
                  >
                    Sebelumnya
                  </Link>
                ) : (
                  <button
                    disabled
                    className="comic-panel px-4 py-2 bg-slate-200 text-slate-400 font-bold uppercase rotate-1 opacity-50 cursor-not-allowed"
                  >
                    Sebelumnya
                  </button>
                )}
                <span className="comic-heading text-xl text-black bg-white px-4 py-2 border-4 border-black comic-shadow -rotate-1">
                  Halaman {currentPage} dari {totalPages}
                </span>
                {currentPage < totalPages ? (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="comic-panel px-4 py-2 bg-white text-black font-bold hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase rotate-1"
                  >
                    Berikutnya
                  </Link>
                ) : (
                  <button
                    disabled
                    className="comic-panel px-4 py-2 bg-slate-200 text-slate-400 font-bold uppercase rotate-1 opacity-50 cursor-not-allowed"
                  >
                    Berikutnya
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="comic-panel bg-white p-12 text-center rotate-1">
            <span className="comic-heading text-2xl text-slate-500 uppercase">
              Belum ada artikel. Coba periksa lagi nanti!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
