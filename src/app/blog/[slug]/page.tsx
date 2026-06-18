import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Search } from 'lucide-react';
import { fetchAPI, Post, getSettings } from '@/lib/api';
import BlogContent from '@/components/BlogContent';
import PostComments from '@/components/PostComments';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const isPreview = searchParams?.preview === 'true';
  const query = isPreview ? '?preview=true' : '';
  try {
    const post = await fetchAPI<Post>(`/posts/${params.slug}${query}`);
    if (!post) throw new Error('Post not found');

    return {
      title: `${post.title} | Yakub Firman Mustofa`,
      description: post.excerpt || '',
      openGraph: {
        title: post.title,
        description: post.excerpt || '',
        type: 'article',
        publishedTime: post.published_at || undefined,
        url: `https://yakubfirman.id/blog/${post.slug}`,
        images: post.cover_image ? [{ url: post.cover_image }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || '',
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
  const searchParams = await props.searchParams;
  const isPreview = searchParams?.preview === 'true';
  const query = isPreview ? '?preview=true' : '';

  let post: Post | null = null;
  let allPosts: Post[] = [];
  let settings: Record<string, string> = {};

  try {
    const [postData, postsData, settingsData] = await Promise.all([
      fetchAPI<Post>(`/posts/${params.slug}${query}`).catch((e) => {
        console.error('Error fetching post data:', e);
        return null;
      }),
      fetchAPI<Post[]>('/posts').catch((e) => {
        console.error('Error fetching all posts:', e);
        return [] as Post[];
      }),
      getSettings().catch(() => ({}) as Record<string, string>),
    ]);
    post = postData;
    allPosts = Array.isArray(postsData) ? postsData : [];
    settings = settingsData || {};
  } catch (error) {
    console.error('Critical error in BlogPostPage:', error);
  }

  if (!post) {
    notFound();
  }

  const recentPosts = allPosts.filter((p) => p && p.slug !== post?.slug).slice(0, 4);

  const authorName = post.author || 'Yakub Firman Mustofa';
  const isMe =
    !post.author ||
    authorName.toLowerCase().includes('yakub') ||
    authorName.toLowerCase().includes('firman');
  const authorImage = isMe ? settings.header_image_url || '/profile.jpg' : null;

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
      <div className="w-full relative overflow-hidden bg-white pt-24 pb-10 sm:pt-28 sm:pb-14 md:pt-40 md:pb-24 border-b-4 sm:border-b-[6px] border-black">
        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-black hover:text-primary transition-colors mb-6 sm:mb-8 font-bold uppercase tracking-wide bg-white border-2 sm:border-[3px] border-black px-3 py-1.5 sm:px-4 sm:py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:comic-shadow sm:rotate-1 w-max text-sm sm:text-base"
          >
            <ArrowLeft size={16} strokeWidth={3} className="sm:w-[18px] sm:h-[18px]" /> Back to Blog
          </Link>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">
            {/* Title side */}
            <div className="comic-panel-red p-4 sm:p-6 md:p-8 sm:-rotate-1 relative z-10 !shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:!shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] !border-[3px] sm:!border-4">
              <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
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
                <span className="px-2 py-1 text-[10px] sm:text-xs font-bold text-black bg-white uppercase tracking-widest border-2 border-black inline-flex items-center gap-2">
                  {authorImage && (
                    <Image
                      src={authorImage}
                      alt={authorName}
                      width={20}
                      height={20}
                      className="rounded-full border border-black w-5 h-5 object-cover"
                      unoptimized={authorImage.includes('localhost')}
                    />
                  )}
                  <span>By {authorName}</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl comic-heading text-white leading-tight sm:leading-none mb-3 sm:mb-4 comic-text-white uppercase">
                {post.title}
              </h1>
              <p className="text-white font-bold text-xs sm:text-sm md:text-base max-w-2xl tracking-wide leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            {/* Image side */}
            <div className="relative aspect-[16/10] w-full border-4 sm:border-[6px] border-black bg-yellow-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:comic-shadow sm:rotate-2 overflow-hidden flex items-center justify-center">
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
                  <span className="comic-heading text-2xl sm:text-4xl text-black rotate-[-10deg] tracking-wider relative z-10 uppercase">
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-24 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] xl:grid-cols-[1fr_300px] gap-8 sm:gap-10 lg:gap-12 items-start">
            {/* Markdown Content & Comments */}
            <div className="w-full min-w-0">
              <div className="bg-white border-[3px] sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-8 md:p-10 lg:p-14">
                <BlogContent content={post.content || ''} />
              </div>

              {/* Comments Section */}
              <PostComments
                postId={post.id}
                initialLikes={post.likes}
                comments={post.comments || []}
              />
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:sticky lg:top-32 space-y-6 sm:space-y-8">
              {/* Search Widget */}
              <div className="bg-white border-[3px] sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 sm:-rotate-1">
                <h3 className="comic-heading text-lg sm:text-xl text-black mb-3 sm:mb-4 uppercase tracking-wide">
                  Search Articles
                </h3>
                <form action="/blog" method="GET" className="flex flex-col gap-3">
                  <input
                    type="text"
                    name="search"
                    placeholder="Keyword..."
                    required
                    className="w-full border-2 sm:border-[3px] border-black px-3 sm:px-4 py-2 font-bold text-black focus:outline-none focus:bg-yellow-100 uppercase text-sm sm:text-base"
                  />
                  <button
                    type="submit"
                    className="border-[3px] sm:border-[4px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:comic-shadow px-4 py-2 !bg-primary text-white hover:!bg-black transition-colors font-bold uppercase tracking-wide text-center text-sm sm:text-base"
                  >
                    Search <Search size={16} className="inline ml-1 mb-1" strokeWidth={3} />
                  </button>
                </form>
              </div>

              {/* Recent Posts */}
              <div className="bg-white border-[3px] sm:border-4 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 sm:rotate-1">
                <h3 className="comic-heading text-lg sm:text-xl text-black mb-4 sm:mb-6 uppercase tracking-wide border-b-[3px] sm:border-b-4 border-black pb-2">
                  Recent Articles
                </h3>
                <div className="space-y-4 sm:space-y-6">
                  {recentPosts.map((rp) => (
                    <Link key={rp.id} href={`/blog/${rp.slug}`} className="group block">
                      <h4 className="font-black text-black group-hover:text-primary transition-colors leading-snug line-clamp-2 uppercase text-sm sm:text-base">
                        {rp.title}
                      </h4>
                      <time className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase mt-1 block tracking-wide">
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
                    <p className="text-sm font-bold text-slate-500">No other articles found.</p>
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
