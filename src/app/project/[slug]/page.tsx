import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, GitBranch } from 'lucide-react';
import { fetchAPI, Project } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  try {
    const project = await fetchAPI<Project>(`/projects/${params.slug}`);
    return {
      title: `${project.title} | Yakub Firman Mustofa`,
      description: project.description,
    };
  } catch (error) {
    return {
      title: 'Project Not Found',
    };
  }
}

export default async function ProjectDetailPage(props: Props) {
  const params = await props.params;
  let project: Project | null = null;

  try {
    project = await fetchAPI<Project>(`/projects/${params.slug}`);
  } catch (error) {
    notFound();
  }

  if (!project) return notFound();

  return (
    <article className="min-h-screen bg-white comic-body">
      {/* Portfolio/Project JSON-LD for AEO/GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: project.title,
            description: project.description,
            image: project.image ? [project.image] : [],
            datePublished: project.created_at,
            author: {
              '@type': 'Person',
              name: 'Yakub Firman Mustofa',
              url: 'https://yakubfirman.id',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://yakubfirman.id/project/${project.slug}`,
            },
            keywords: project.categories?.join(', '),
          }),
        }}
      />

      {/* Hero / Banner Comic Style */}
      <div className="w-full relative overflow-hidden bg-white pt-32 pb-16 md:pt-40 md:pb-24 border-b-[6px] border-black">
        <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <Link
            href="/project"
            className="inline-flex items-center gap-2 text-black hover:text-primary transition-colors mb-8 font-bold uppercase tracking-wide bg-white border-[3px] border-black px-4 py-2 comic-shadow rotate-1 w-max"
          >
            <ArrowLeft size={18} strokeWidth={3} /> Back to Projects
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Title side */}
            <div className="comic-panel-red p-6 sm:p-8 -rotate-1 relative z-10">
              <div className="flex flex-wrap gap-2 mb-4">
                {project.categories?.map((cat) => (
                  <span
                    key={cat}
                    className="px-2 py-1 text-[10px] sm:text-xs font-bold text-white bg-black uppercase tracking-widest border-2 border-black"
                  >
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl comic-heading text-white leading-none mb-4 comic-text-white uppercase">
                {project.title}
              </h1>
              <p className="text-white font-bold text-sm md:text-base max-w-2xl tracking-wide leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Image side */}
            <div className="relative aspect-[16/10] w-full border-[6px] border-black bg-halftone-red comic-shadow rotate-2 overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={project.image.includes('localhost')}
                />
              ) : (
                <div className="w-full h-full bg-slate-200" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-full relative bg-primary/10">
        <div className="absolute inset-0 bg-halftone opacity-40 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start">
            {/* Markdown Content */}
            <div className="comic-panel bg-white p-6 sm:p-10 rotate-1">
              <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wide prose-a:text-primary prose-a:font-bold hover:prose-a:underline prose-pre:bg-black prose-pre:border-[3px] prose-pre:border-black prose-pre:comic-shadow prose-img:border-[4px] prose-img:border-black prose-img:comic-shadow prose-p:font-medium">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{project.content}</ReactMarkdown>
              </div>
            </div>

            {/* Sidebar Details */}
            <div className="sticky top-32 space-y-8">
              <div className="comic-panel bg-halftone-red p-6 sm:p-8 -rotate-1">
                <h3 className="text-2xl comic-heading mb-6 text-black bg-white px-4 py-2 border-[4px] border-black inline-block rotate-2 comic-shadow text-center w-full">
                  Project Details
                </h3>
                <div className="space-y-4">
                  <div className="bg-white border-[3px] border-black p-3 sm:p-4 comic-shadow rotate-1">
                    <span className="block text-[10px] sm:text-xs comic-heading uppercase tracking-widest text-black bg-primary text-white border-2 border-black px-2 py-0.5 inline-block mb-2 -rotate-1">
                      Date
                    </span>
                    <span className="block font-bold text-black uppercase text-sm tracking-wide">
                      {new Date(project.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  {project.url && (
                    <div className="bg-white border-[3px] border-black p-3 sm:p-4 comic-shadow -rotate-1 hover:-translate-y-1 transition-transform">
                      <span className="block text-[10px] sm:text-xs comic-heading uppercase tracking-widest text-black bg-black text-white border-2 border-black px-2 py-0.5 inline-block mb-2 rotate-1">
                        Live Site
                      </span>
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-bold text-primary hover:text-black uppercase tracking-wide text-sm mt-1"
                      >
                        Visit Website <ExternalLink size={16} strokeWidth={3} />
                      </a>
                    </div>
                  )}
                  {project.github_url && (
                    <div className="bg-white border-[3px] border-black p-3 sm:p-4 comic-shadow rotate-1 hover:-translate-y-1 transition-transform">
                      <span className="block text-[10px] sm:text-xs comic-heading uppercase tracking-widest text-black bg-white border-2 border-black px-2 py-0.5 inline-block mb-2 -rotate-2">
                        Source Code
                      </span>
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-bold text-black hover:text-primary transition-colors uppercase tracking-wide text-sm mt-1"
                      >
                        View Source <GitBranch size={16} strokeWidth={3} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
