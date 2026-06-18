'use client';

import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark.css';

interface BlogContentProps {
  content: string;
}

export default function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Sanitize on the client side where DOMPurify works natively
      contentRef.current.innerHTML = DOMPurify.sanitize(content);

      // Apply syntax highlighting to code blocks
      contentRef.current.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content]);

  return (
    <>
      <style>{`
        .blog-content pre {
          overflow-x: auto;
          max-width: 100%;
          white-space: pre;
          word-wrap: normal;
          border-radius: 0;
        }
        .blog-content pre code {
          display: block;
          overflow-x: auto;
          font-size: 0.85em;
        }
        @media (max-width: 640px) {
          .blog-content pre code {
            font-size: 0.75em;
          }
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
        }
        .blog-content iframe {
          max-width: 100%;
        }
        .blog-content table {
          display: block;
          overflow-x: auto;
          max-width: 100%;
        }
        .blog-content blockquote {
          border-left-width: 4px;
          border-color: #cc0000;
        }
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6 {
          font-family: var(--font-poppins) !important;
          line-height: 1.3;
        }
        .blog-content p, .blog-content li {
          word-wrap: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
      <div
        ref={contentRef}
        className="blog-content prose prose-sm sm:prose-base md:prose-lg max-w-none w-full mx-auto font-poppins break-words
          prose-headings:font-poppins prose-headings:font-bold prose-headings:text-slate-900
          prose-h1:mt-6 prose-h1:mb-4 prose-h2:mt-6 prose-h2:mb-3 prose-h3:mt-5 prose-h3:mb-2
          prose-a:text-primary prose-a:font-semibold hover:prose-a:underline
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-md
          prose-img:rounded-md prose-img:my-6 md:prose-img:my-8
          prose-p:text-slate-700 prose-p:leading-relaxed prose-p:my-3 md:prose-p:my-4 prose-p:text-justify
          prose-li:text-slate-700 prose-li:my-1
          prose-strong:font-bold prose-strong:text-slate-900
          prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:bg-slate-50 prose-blockquote:text-slate-700 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-4"
      />
    </>
  );
}
