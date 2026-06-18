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
      `}</style>
      <div
        ref={contentRef}
        className="blog-content prose prose-base md:prose-lg max-w-[75ch] mx-auto overflow-hidden
          prose-headings:font-poppins prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-900
          prose-h1:text-3xl prose-h1:sm:text-4xl prose-h1:md:text-5xl prose-h1:leading-tight prose-h1:mb-8
          prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:md:text-4xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:md:text-3xl prose-h3:mt-8 prose-h3:mb-4
          prose-a:text-primary prose-a:font-semibold prose-a:break-words hover:prose-a:underline
          prose-pre:bg-slate-900 prose-pre:border-[3px] prose-pre:border-black prose-pre:p-4 prose-pre:sm:p-6 prose-pre:rounded-none
          prose-img:border-[3px] prose-img:sm:border-[4px] prose-img:border-black prose-img:rounded-none prose-img:my-10
          prose-p:font-sans prose-p:text-lg prose-p:leading-[1.8] prose-p:text-slate-700 prose-p:mb-6
          prose-li:font-sans prose-li:text-lg prose-li:text-slate-700 prose-li:leading-[1.8]
          prose-ul:my-6 prose-ol:my-6
          prose-strong:font-bold prose-strong:text-slate-900
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:italic prose-blockquote:text-slate-700"
      />
    </>
  );
}
