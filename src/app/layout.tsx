import type { Metadata } from 'next';
import { Inter, Bangers } from 'next/font/google';
import './globals.css';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getSettings } from '@/lib/api';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'block' });

const bangers = Bangers({
  weight: ['400'],
  variable: '--font-bangers',
  subsets: ['latin'],
  display: 'block',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings().catch(() => ({}) as Record<string, string>);
  const headerImageUrl = settings.header_image_url || '/profile.jpg';

  return {
    title: {
      default: 'Yakub Firman Mustofa - Web Developer & SEO Specialist',
      template: '%s | Yakub Firman Mustofa',
    },
    description:
      'Portfolio of Yakub Firman Mustofa, a Web Developer & SEO Specialist based in Surakarta. Building high-performance web applications with Laravel and Next.js.',
    keywords: [
      'Yakub Firman Mustofa',
      'Yakub Firman',
      'Yakub',
      'Firman',
      'Mustofa',
      'Web Developer',
      'SEO Specialist',
      'Laravel',
      'Next.js',
      'Surakarta',
      'Headless CMS',
      'Full-stack Developer',
    ],
    authors: [{ name: 'Yakub Firman Mustofa', url: 'https://yakubfirman.id' }],
    creator: 'Yakub Firman Mustofa',
    robots: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
    },
    icons: {
      icon: headerImageUrl,
      apple: headerImageUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://yakubfirman.id',
      siteName: 'Yakub Firman Mustofa',
      title: 'Yakub Firman Mustofa - Web Developer & SEO Specialist',
      description:
        'Portfolio of Yakub Firman Mustofa. Building high-performance web applications with Laravel and Next.js.',
      images: [
        {
          url: headerImageUrl,
          width: 1200,
          height: 630,
          alt: 'Yakub Firman Mustofa',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Yakub Firman Mustofa - Web Developer & SEO Specialist',
      description: 'Web Developer & SEO Specialist based in Surakarta.',
      images: [headerImageUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings().catch(() => ({}) as Record<string, string>);
  const profileImageUrl = settings.profile_image_url || '/about.jpg';
  const headerImageUrl = settings.header_image_url || '/profile.jpg';
  const contactEmail = settings.contact_email || settings.email || 'hello@yakubfirman.id';
  const footerText =
    settings.footer_text ||
    'Seorang Pengembang Web Full-stack & Spesialis SEO yang penuh semangat, berdedikasi untuk membangun pengalaman digital berkinerja tinggi.';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Yakub Firman Mustofa',
    alternateName: ['Yakub Firman', 'Yakub', 'Firman', 'Mustofa'],
    url: 'https://yakubfirman.id',
    jobTitle: 'Web Developer & SEO Specialist',
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Universitas Duta Bangsa Surakarta',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Surakarta',
      addressRegion: 'Jawa Tengah',
      addressCountry: 'ID',
    },
    knowsAbout: ['Web Development', 'SEO', 'Laravel', 'Next.js', 'Headless CMS'],
    sameAs: ['https://github.com/yakubfirman', 'https://linkedin.com/in/yakubfirman'],
  };

  return (
    <html lang="en" className={`${inter.variable} ${bangers.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-primary/20">
        <ClientLayoutWrapper
          headerImageUrl={headerImageUrl}
          contactEmail={contactEmail}
          footerText={footerText}
        >
          {children}
        </ClientLayoutWrapper>
        <LanguageSwitcher />
      </body>
    </html>
  );
}
