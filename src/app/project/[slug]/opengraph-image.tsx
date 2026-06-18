import { ImageResponse } from 'next/og';
import { fetchAPI, Project } from '@/lib/api';

export const runtime = 'edge';
export const alt = 'Project OG Image';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let project: Project | null = null;
  try {
    project = await fetchAPI<Project>(`/projects/${slug}`);
  } catch {
    // fallback to default
  }

  const title = project?.title || 'Portfolio Project';
  const description = project?.description || 'A creative web development project';
  const techStack = project?.tech_stack?.slice(0, 4) || [];

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

      {/* Black accent top stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12px',
          background: '#000',
        }}
      />

      {/* Left yellow column */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '60px',
          height: '630px',
          background: '#fef08a',
          borderRight: '6px solid #000',
        }}
      />

      {/* Main content card */}
      <div
        style={{
          position: 'absolute',
          left: '100px',
          top: '60px',
          width: '680px',
          background: '#000',
          border: '6px solid #000',
          boxShadow: '10px 10px 0 #e11d48',
          padding: '40px 44px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        {/* Portfolio badge */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div
            style={{
              background: '#e11d48',
              color: '#fff',
              fontWeight: 900,
              fontSize: '13px',
              padding: '4px 14px',
              textTransform: 'uppercase',
              letterSpacing: '3px',
            }}
          >
            PROJECT
          </div>
          <div
            style={{
              background: '#fef08a',
              color: '#000',
              fontWeight: 900,
              fontSize: '13px',
              padding: '4px 14px',
              border: '3px solid #fef08a',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            PORTFOLIO
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontWeight: 900,
            fontSize: title.length > 40 ? '36px' : '48px',
            color: '#fff',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            letterSpacing: '-1px',
            maxWidth: '600px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            fontSize: '16px',
            color: '#ccc',
            lineHeight: 1.6,
            maxWidth: '600px',
          }}
        >
          {description.length > 110 ? description.slice(0, 110) + '…' : description}
        </div>

        {/* Tech stack pills */}
        {techStack.length > 0 && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {techStack.map((tech: string) => (
              <div
                key={tech}
                style={{
                  background: '#e11d48',
                  color: '#fff',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: 900,
                  fontSize: '12px',
                  padding: '4px 12px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  border: '2px solid #fff',
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Author badge - bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px',
        }}
      >
        <div
          style={{
            background: '#e11d48',
            color: '#fff',
            fontWeight: 900,
            fontSize: '28px',
            padding: '10px 20px',
            border: '5px solid #000',
            boxShadow: '5px 5px 0 #000',
            textTransform: 'uppercase',
            letterSpacing: '-1px',
          }}
        >
          YAKUB FIRMAN
        </div>
        <div
          style={{
            background: '#fff',
            color: '#000',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            fontSize: '13px',
            padding: '6px 14px',
            border: '3px solid #000',
            textTransform: 'uppercase',
            letterSpacing: '2px',
          }}
        >
          yakubfirman.id
        </div>
      </div>

      {/* Bottom stripe */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '8px',
          background: '#e11d48',
        }}
      />
    </div>,
    {
      ...size,
    }
  );
}
