import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Search } from 'lucide-react';
import { fetchAPI, Post } from '@/lib/api';
import 'highlight.js/styles/github-dark.css';
import DOMPurify from 'isomorphic-dompurify';
import PostComments from '@/components/PostComments';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const post = await fetchAPI<Post>(`/posts/${params.slug}`);
    return {
      title: `${post.title} | Yakub Firman Mustofa`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.published_at || undefined,
        url: `https://yakubfirman.id/blog/${post.slug}`,
        images: post.cover_image ? [{ url: post.cover_image }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.cover_image ? [post.cover_image] : [],
      },
      alternates: {
        canonical: `https://yakubfirman.id/blog/${post.slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  let post: Post | null = null;
  let allPosts: Post[] = [];

  try {
    const [postData, postsData] = await Promise.all([
      fetchAPI<Post>(`/posts/${params.slug}`),
      fetchAPI<Post[]>('/posts'),
    ]);
    post = postData;
    allPosts = postsData;
  } catch (error) {
    notFound();
  }

  if (!post) return notFound();

  const recentPosts = allPosts.filter((p) => p.slug !== post?.slug).slice(0, 4);

  return (
    <article className="min-h-screen bg-white comic-body">
      {/* Article JSON-LD for AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.excerpt,
            datePublished: post.published_at,
            author: {
              '@type': 'Person',
              name: post.author || 'Yakub Firman Mustofa',
              url: 'https://yakubfirman.id',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://yakubfirman.id/blog/${post.slug}`,
            },
          }),
        }}
      />

      {/* Hero / Banner Comic Style */}
      <div className="w-full relative overflow-hidden bg-white pt-32 pb-16 md:pt-40 md:pb-24 border-b-[6px] border-black">
        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-black hover:text-primary transition-colors mb-8 font-bold uppercase tracking-wide bg-white border-[3px] border-black px-4 py-2 comic-shadow rotate-1 w-max"
          >
            <ArrowLeft size={18} strokeWidth={3} /> Back to Blog
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Title side */}
            <div className="comic-panel-red p-6 sm:p-8 -rotate-1 relative z-10">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-[10px] sm:text-xs font-bold text-white bg-black uppercase tracking-widest border-2 border-black inline-flex items-center gap-1">
                  <Calendar size={12} strokeWidth={3} />
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })
                    : 'Draft'}
                </span>
                <span className="px-2 py-1 text-[10px] sm:text-xs font-bold text-black bg-white uppercase tracking-widest border-2 border-black inline-flex items-center gap-1">
                  By {post.author || 'Yakub Firman Mustofa'}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl comic-heading text-white leading-none mb-4 comic-text-white uppercase">
                {post.title}
              </h1>
              <p className="text-white font-bold text-sm md:text-base max-w-2xl uppercase tracking-wide leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Image side */}
            <div className="relative aspect-[16/10] w-full border-[6px] border-black bg-yellow-400 comic-shadow rotate-2 overflow-hidden flex items-center justify-center">
              {post.cover_image ? (
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={post.cover_image.includes('localhost')}
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-halftone opacity-30"></div>
                  <span className="comic-heading text-4xl text-black rotate-[-10deg] tracking-wider relative z-10 uppercase">
                    NO IMAGE
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full relative bg-yellow-50">
        <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-[1fr_350px] gap-12 lg:gap-16 items-start">
            {/* Markdown Content & Comments */}
            <div>
              <div className="comic-panel bg-white p-6 sm:p-10 md:p-14 rotate-0 comic-shadow-sm">
                <div
                  className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-black prose-a:text-primary prose-a:font-bold hover:prose-a:underline prose-pre:bg-black prose-pre:border-[3px] prose-pre:border-black prose-pre:comic-shadow prose-img:border-[4px] prose-img:border-black prose-img:comic-shadow prose-p:leading-relaxed prose-p:text-slate-800 prose-li:text-slate-800 prose-li:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                />
              </div>

              {/* Comments Section */}
              <PostComments
                postId={post.id}
                initialLikes={post.likes}
                comments={post.comments || []}
              />
            </div>

            {/* Sidebar */}
            <aside className="sticky top-32 space-y-8">
              {/* Search Widget */}
              <div className="comic-panel bg-white p-6 -rotate-1">
                <h3 className="comic-heading text-xl text-black mb-4 uppercase tracking-wide">
                  Search Articles
                </h3>
                <form action="/blog" method="GET" className="flex flex-col gap-3">
                  <input
                    type="text"
                    name="search"
                    placeholder="Keyword..."
                    required
                    className="w-full border-[3px] border-black px-4 py-2 font-bold text-black focus:outline-none focus:bg-yellow-100 uppercase"
                  />
                  <button
                    type="submit"
                    className="border-[4px] border-black comic-shadow px-4 py-2 !bg-primary text-white hover:!bg-black transition-colors font-bold uppercase tracking-wide text-center"
                  >
                    Search <Search size={16} className="inline ml-1 mb-1" strokeWidth={3} />
                  </button>
                </form>
              </div>

              {/* Recent Posts */}
              <div className="comic-panel bg-white p-6 rotate-1">
                <h3 className="comic-heading text-xl text-black mb-6 uppercase tracking-wide border-b-4 border-black pb-2">
                  Recent Articles
                </h3>
                <div className="space-y-6">
                  {recentPosts.map((rp) => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                      <h4 className="font-black text-black group-hover:text-primary transition-colors leading-snug line-clamp-2 uppercase">
                        {rp.title}
                      </h4>
                      <time className="text-xs font-bold text-slate-500 uppercase mt-1 block tracking-wide">
                        {rp.published_at
                          ? new Date(rp.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Draft'}
                      </time>
                    </Link>
                  ))}
                  {recentPosts.length === 0 && (
                    <p className="text-sm font-bold text-slate-500 uppercase">
                      No other articles found.
                    </p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </article>
  );
}
