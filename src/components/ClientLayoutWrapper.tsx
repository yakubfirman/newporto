'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GSAPGlobal from '@/components/GSAPGlobal';
import CTASection from '@/components/sections/CTASection';

export default function ClientLayoutWrapper({
  children,
  headerImageUrl = '/profile.jpg',
  contactEmail = 'hello@yakubfirman.id',
  footerText = 'Seorang Pengembang Web Full-stack & Spesialis SEO yang penuh semangat, berdedikasi untuk membangun pengalaman digital berkinerja tinggi.',
}: {
  children: React.ReactNode;
  headerImageUrl?: string;
  contactEmail?: string;
  footerText?: string;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <>
      <GSAPGlobal />
      {!isAdmin && <Navbar headerImageUrl={headerImageUrl} />}
      <main className="flex-1">{children}</main>
      {!isAdmin && (
        <>
          {pathname !== '/contact' && <CTASection />}
          <Footer
            headerImageUrl={headerImageUrl}
            contactEmail={contactEmail}
            footerText={footerText}
          />
        </>
      )}
    </>
  );
}
