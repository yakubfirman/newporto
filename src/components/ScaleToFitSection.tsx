'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  children: ReactNode;
  className?: string;
  id?: string;
  padding?: number; // Safety padding vertically
  background?: ReactNode; // Elements to render behind the scaled content (e.g., full screen backgrounds)
}

export default function ScaleToFitSection({
  children,
  className,
  id,
  padding = 100,
  background,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !contentRef.current) return;

      const containerHeight = containerRef.current.clientHeight - padding;
      const contentHeight = contentRef.current.scrollHeight;

      if (contentHeight > containerHeight && contentHeight > 0) {
        setScale(containerHeight / contentHeight);
      } else {
        setScale(1);
      }
    };

    handleResize(); // Initial check

    // Listen to window resize
    window.addEventListener('resize', handleResize);

    // Listen to content size changes (e.g. images loading, dynamic text)
    const resizeObserver = new ResizeObserver(handleResize);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [padding]);

  return (
    <section
      id={id}
      ref={containerRef}
      className={clsx(
        'w-full h-[100dvh] flex flex-col items-center justify-center overflow-hidden relative',
        className
      )}
    >
      {background}
      <div
        ref={contentRef}
        className="w-full flex-none origin-center relative z-10"
        style={{ transform: `scale(${scale})` }}
      >
        <div className="w-full flex flex-col items-center">{children}</div>
      </div>
    </section>
  );
}
