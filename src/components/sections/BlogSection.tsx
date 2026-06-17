'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/api';
import PostCard from '@/components/PostCard';

interface BlogSectionProps {
  posts: Post[];
}

export default function BlogSection({ posts }: BlogSectionProps) {
  return (
    <section className="w-full relative overflow-hidden py-16 md:py-24 border-t-[6px] border-black bg-white comic-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-6 sm:mb-8 relative z-10">
          <div className="comic-panel-red p-4 sm:p-5 rotate-1 max-w-xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl comic-heading text-white leading-none mb-2 comic-text-white">
              Latest Notes
            </h2>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide">
              Thoughts, tutorials, and insights on software development and technology.
            </p>
          </div>
          <Link
            href="/blog"
            className="group inline-flex justify-center items-center gap-2 comic-heading text-xl sm:text-2xl text-white bg-black px-5 sm:px-6 py-3 hover:bg-primary transition-colors border-[3px] border-black comic-shadow shrink-0 -rotate-1 w-full md:w-auto"
          >
            Read all articles
            <ArrowRight size={20} className="sm:w-6 sm:h-6" strokeWidth={3} />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="stagger-grid grid md:grid-cols-3 gap-4 lg:gap-6 relative z-10">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} className="stagger-item" />
            ))}
          </div>
        ) : (
          <div className="w-full bg-slate-50 border-4 border-black border-dashed p-8 sm:p-12 text-center -rotate-1 comic-shadow relative z-10">
            <span className="comic-heading text-xl sm:text-3xl text-slate-400">
              NO ARTICLES YET...
            </span>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-halftone opacity-[0.15] pointer-events-none" />
      <div className="absolute top-20 -right-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply opacity-50 blur-3xl" />
      <div className="absolute bottom-20 -left-20 w-80 h-80 bg-red-400 rounded-full mix-blend-multiply opacity-50 blur-3xl" />
    </section>
  );
}
