import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Post } from '@/lib/api';

interface PostCardProps {
  post: Post;
  className?: string;
}

export default function PostCard({ post, className = '' }: PostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col bg-white comic-panel comic-shadow transition-all duration-300 hover:translate-y-1 hover:translate-x-1 hover:shadow-none ${className}`}
    >
      {post.cover_image ? (
        <div className="relative aspect-[3/2] w-full border-b-[3px] border-black bg-white overflow-hidden group-hover:bg-slate-100 transition-colors">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={post.cover_image.includes('localhost')}
          />
        </div>
      ) : (
        <div className="relative aspect-[16/9] w-full bg-yellow-400 border-b-[4px] border-black flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-halftone opacity-30"></div>
          <span className="comic-heading text-2xl text-black rotate-[-10deg] tracking-wider relative z-10 uppercase">
            NO IMAGE
          </span>
        </div>
      )}
      <div className="p-5 sm:p-6 flex-1 flex flex-col bg-white relative">
        <time className="comic-heading text-sm text-primary mb-3 block uppercase tracking-wider">
          {post.published_at
            ? new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            : 'Draft'}
        </time>
        <h2 className="text-xl sm:text-2xl comic-heading mb-3 text-black group-hover:text-primary transition-colors leading-snug">
          {post.title}
        </h2>
        <p className="text-slate-700 font-bold text-sm mb-6 flex-1 line-clamp-3 leading-relaxed tracking-wide">
          {post.excerpt}
        </p>
        <span className="inline-flex items-center gap-2 comic-heading text-lg text-black group-hover:text-primary transition-colors uppercase">
          Read Article{' '}
          <ArrowRight
            size={20}
            strokeWidth={3}
            className="transform group-hover:translate-x-1 transition-transform"
          />
        </span>
      </div>
    </Link>
  );
}
