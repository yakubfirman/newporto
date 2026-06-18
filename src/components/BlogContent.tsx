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
    <div
      ref={contentRef}
      className="prose prose-slate prose-lg md:prose-xl max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-black prose-a:text-primary prose-a:font-bold hover:prose-a:underline prose-pre:bg-black prose-pre:border-[3px] prose-pre:border-black prose-pre:comic-shadow prose-img:border-[4px] prose-img:border-black prose-img:comic-shadow prose-p:leading-relaxed prose-p:text-slate-800 prose-li:text-slate-800 prose-li:leading-relaxed"
    />
  );
}
