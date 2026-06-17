import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { fetchAPI, Post } from '@/lib/api';
import PostCard from '@/components/PostCard';

export const metadata: Metadata = {
  title: 'Blog | Yakub Firman Mustofa',
  description: 'Read the latest articles about web development, SEO, and technology.',
};

export const revalidate = 60;

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
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-10 sm:mb-16">
          <div className="comic-panel-red p-4 sm:p-6 rotate-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl comic-heading text-white leading-none mb-2 comic-text-white">
              Blog & Insights
            </h1>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase">
              Thoughts on the Digital Landscape.
            </p>
          </div>
          <div className="comic-panel bg-white p-3 sm:p-4 -rotate-1 hidden md:block max-w-xs">
            <p className="font-bold text-black text-sm uppercase tracking-wide leading-snug">
              TUTORIALS, OPINIONS, AND WEB DEVELOPMENT TIPS.
            </p>
          </div>
        </div>

        {searchQuery && (
          <div className="mb-8 comic-panel bg-yellow-100 p-4 inline-block -rotate-1">
            <span className="comic-heading text-xl text-black uppercase">
              Search Results for: <span className="text-primary">"{searchQuery}"</span>
            </span>
            <Link
              href="/blog"
              className="ml-4 font-bold text-slate-500 hover:text-black underline text-sm uppercase"
            >
              Clear Search
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
                    Previous
                  </Link>
                ) : (
                  <button
                    disabled
                    className="comic-panel px-4 py-2 bg-slate-200 text-slate-400 font-bold uppercase rotate-1 opacity-50 cursor-not-allowed"
                  >
                    Previous
                  </button>
                )}
                <span className="comic-heading text-xl text-black bg-white px-4 py-2 border-4 border-black comic-shadow -rotate-1">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages ? (
                  <Link
                    href={`/blog?page=${currentPage + 1}`}
                    className="comic-panel px-4 py-2 bg-white text-black font-bold hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] transition-all uppercase rotate-1"
                  >
                    Next
                  </Link>
                ) : (
                  <button
                    disabled
                    className="comic-panel px-4 py-2 bg-slate-200 text-slate-400 font-bold uppercase rotate-1 opacity-50 cursor-not-allowed"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="comic-panel bg-white p-12 text-center rotate-1">
            <span className="comic-heading text-2xl text-slate-500 uppercase">
              No posts available yet. Check back soon!
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
