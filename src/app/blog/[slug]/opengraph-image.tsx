import { ImageResponse } from 'next/og';
import { fetchAPI, Post } from '@/lib/api';

export const runtime = 'edge';
export const alt = 'Blog Post OG Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: Post | null = null;
  try {
    post = await fetchAPI<Post>(`/posts/${slug}`);
  } catch {
    // fallback to default
  }

  const title = post?.title || 'Yakub Firman Mustofa';
  const excerpt = post?.excerpt || 'Web Developer & SEO Specialist';

  return new ImageResponse(
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        fontFamily: 'Arial Black, Impact, sans-serif',
        background: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Halftone dots background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, #00000020 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Red accent top-left block */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '400px',
          height: '12px',
          background: '#e11d48',
        }}
      />

      {/* Yellow block right side */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '380px',
          height: '630px',
          background: '#fef08a',
          borderLeft: '8px solid #000',
        }}
      />

      {/* Black border box for content */}
      <div
        style={{
          position: 'absolute',
          left: '48px',
          top: '48px',
          width: '700px',
          background: '#e11d48',
          border: '6px solid #000',
          boxShadow: '8px 8px 0 #000',
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {/* BLOG badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              background: '#000',
              color: '#fff',
              fontFamily: 'Arial Black, sans-serif',
              fontWeight: 900,
              fontSize: '14px',
              padding: '4px 14px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}
          >
            BLOG
          </div>
          <div
            style={{
              background: '#fff',
              color: '#000',
              fontFamily: 'Arial Black, sans-serif',
              fontWeight: 900,
              fontSize: '14px',
              padding: '4px 14px',
              border: '3px solid #000',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            yakubfirman.id
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontWeight: 900,
            fontSize: title.length > 50 ? '32px' : '42px',
            color: '#fff',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            textShadow: '3px 3px 0 #000',
            letterSpacing: '-1px',
            maxWidth: '620px',
          }}
        >
          {title}
        </div>

        {/* Excerpt */}
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#fff',
            lineHeight: 1.5,
            maxWidth: '620px',
            opacity: 0.9,
          }}
        >
          {excerpt.length > 120 ? excerpt.slice(0, 120) + '…' : excerpt}
        </div>
      </div>

      {/* Author card - bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '48px',
          left: '48px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: '#fff',
          border: '4px solid #000',
          boxShadow: '5px 5px 0 #000',
          padding: '12px 20px',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            background: '#000',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: '18px',
          }}
        >
          YF
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: 'Arial Black, sans-serif',
              fontWeight: 900,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Yakub Firman Mustofa
          </span>
          <span
            style={{
              fontFamily: 'Arial, sans-serif',
              fontSize: '12px',
              color: '#666',
              fontWeight: 700,
            }}
          >
            Web Developer & SEO Specialist
          </span>
        </div>
      </div>

      {/* Right side label */}
      <div
        style={{
          position: 'absolute',
          right: '380px',
          top: '50%',
          transform: 'rotate(-90deg) translateX(50%)',
          fontFamily: 'Arial Black, sans-serif',
          fontWeight: 900,
          fontSize: '12px',
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: '#e11d48',
        }}
      >
        READ NOW →
      </div>

      {/* Star decoration */}
      <div
        style={{
          position: 'absolute',
          right: '60px',
          top: '80px',
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial Black, sans-serif',
          fontWeight: 900,
          fontSize: '11px',
          textTransform: 'uppercase',
          textAlign: 'center',
          color: '#000',
          letterSpacing: '1px',
          lineHeight: 1.2,
          background: '#facc15',
          borderRadius: '50%',
          border: '4px solid #000',
          boxShadow: '3px 3px 0 #000',
        }}
      >
        HOT POST!
      </div>
    </div>,
    {
      ...size,
    }
  );
}
