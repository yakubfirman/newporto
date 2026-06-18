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
        className="blog-content prose prose-sm sm:prose-base md:prose-lg lg:prose-xl max-w-none overflow-hidden
          prose-headings:font-black prose-headings:tracking-tight prose-headings:text-black
          prose-h1:text-2xl prose-h1:sm:text-3xl prose-h1:md:text-4xl
          prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:md:text-3xl
          prose-a:text-primary prose-a:font-bold prose-a:break-words hover:prose-a:underline
          prose-pre:bg-black prose-pre:border-[3px] prose-pre:border-black prose-pre:p-3 prose-pre:sm:p-4
          prose-img:border-[3px] prose-img:sm:border-[4px] prose-img:border-black
          prose-p:leading-relaxed prose-p:text-slate-800
          prose-li:text-slate-800 prose-li:leading-relaxed"
      />
    </>
  );
}
