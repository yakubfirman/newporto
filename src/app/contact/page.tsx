'use client';

import { useState, useEffect } from 'react';
import { Send, Mail, MapPin } from 'lucide-react';
import { API_URL } from '@/lib/api';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [contactEmail, setContactEmail] = useState('contact@yakubfirman.id');

  useEffect(() => {
    // Fetch settings to update email dynamically
    fetch(`${API_URL}/settings`)
      .then((res) => res.json())
      .then((settings) => {
        if (settings.contact_email) {
          setContactEmail(settings.contact_email);
        } else if (settings.email) {
          setContactEmail(settings.email);
        }
      })
      .catch((err) => console.error('Error fetching settings:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      content: formData.get('message'),
    };

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full relative overflow-hidden bg-white comic-body pt-32 pb-16 md:pt-40 md:pb-24 min-h-screen">
      <div className="absolute inset-0 bg-halftone opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Header */}
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5 mb-10 sm:mb-16">
          <div className="comic-panel-red p-4 sm:p-6 -rotate-1 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl comic-heading text-white leading-none mb-2 comic-text-white">
              Hubungi Saya
            </h1>
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide uppercase">
              Mari Mulai Percakapan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start mt-4">
          {/* Form */}
          <div className="comic-panel bg-white p-5 sm:p-8 rotate-1">
            <h3 className="comic-heading text-xl sm:text-2xl mb-6 text-black uppercase tracking-wide border-b-4 border-black pb-4">
              Kirim Saya Pesan
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 mt-6">
              {success && (
                <div className="p-4 bg-white border-[3px] border-black comic-shadow-red text-black font-bold mb-6 text-xs sm:text-sm uppercase -rotate-1">
                  Pesan Anda berhasil dikirim! Saya akan segera menghubungi Anda kembali.
                </div>
              )}
              {error && (
                <div className="p-4 bg-white border-[3px] border-black comic-shadow text-red-600 font-bold mb-6 text-sm uppercase rotate-1">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="name"
                  className="block comic-heading text-lg text-black mb-2 uppercase"
                >
                  Nama
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  className="w-full px-4 py-3 border-[3px] border-black bg-slate-50 focus:bg-white focus:outline-none transition-colors text-black font-bold uppercase tracking-wide placeholder-slate-400 comic-shadow"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block comic-heading text-lg text-black mb-2 uppercase"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full px-4 py-3 border-[3px] border-black bg-slate-50 focus:bg-white focus:outline-none transition-colors text-black font-bold uppercase tracking-wide placeholder-slate-400 comic-shadow"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block comic-heading text-lg text-black mb-2 uppercase"
                >
                  Subjek
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  className="w-full px-4 py-3 border-[3px] border-black bg-slate-50 focus:bg-white focus:outline-none transition-colors text-black font-bold uppercase tracking-wide placeholder-slate-400 comic-shadow"
                  placeholder="Project Inquiry"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block comic-heading text-lg text-black mb-2 uppercase"
                >
                  Pesan
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 border-[3px] border-black bg-slate-50 focus:bg-white focus:outline-none transition-colors text-black font-bold uppercase tracking-wide placeholder-slate-400 comic-shadow resize-none"
                  placeholder="Ceritakan tentang proyek Anda..."
                ></textarea>
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                className="btn-primary w-full disabled:opacity-70"
              >
                {isSubmitting ? (
                  'Mengirim...'
                ) : (
                  <>
                    Kirim Pesan <Send size={24} strokeWidth={3} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8 lg:mt-0 mt-4">
            <div className="comic-panel bg-halftone-red p-5 sm:p-8 -rotate-1">
              <h3 className="text-xl sm:text-2xl comic-heading mb-6 text-black bg-white px-4 py-2 border-[4px] border-black inline-block rotate-2 comic-shadow text-center w-full">
                Info Kontak
              </h3>

              <div className="space-y-4">
                <div className="bg-white border-[3px] border-black p-4 comic-shadow rotate-1 flex items-start gap-4">
                  <div className="bg-black text-white p-2 border-2 border-black shrink-0">
                    <Mail size={24} strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="comic-heading text-lg text-black mb-1 uppercase">Email</h4>
                    <a
                      href={`mailto:${contactEmail}`}
                      title={contactEmail}
                      className="font-bold text-slate-700 hover:text-primary transition-colors text-sm sm:text-base uppercase tracking-wide truncate block w-full"
                    >
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <div className="bg-white border-[3px] border-black p-4 comic-shadow -rotate-1 flex items-start gap-4">
                  <div className="bg-primary text-white p-2 border-2 border-black shrink-0">
                    <MapPin size={24} strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="comic-heading text-lg text-black mb-1 uppercase">Lokasi</h4>
                    <p className="font-bold text-slate-700 text-sm sm:text-base uppercase tracking-wide">
                      Surakarta, Jawa Tengah
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="comic-panel-red p-6 sm:p-8 rotate-1">
              <h4 className="comic-heading text-2xl text-white mb-3 uppercase tracking-wide">
                Ketersediaan
              </h4>
              <p className="text-white font-bold text-sm sm:text-base leading-relaxed uppercase tracking-wide">
                Saat ini saya terbuka untuk peluang lepas dan peran penuh waktu. Mari diskusikan
                bagaimana saya dapat membantu mewujudkan ide Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
