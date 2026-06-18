'use client';

import { useState, useEffect } from 'react';
import { Send, Mail, MapPin } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { showComicSuccessAlert, showComicErrorAlert } from '@/lib/alert';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    const formData = new FormData(e.currentTarget);

    // Honeypot check for bots
    if (formData.get('_gotcha')) {
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
      return;
    }

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

      await showComicSuccessAlert(
        'Berhasil!',
        'Pesan Anda berhasil dikirim! Saya akan segera menghubungi Anda kembali.'
      );
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      showComicErrorAlert('Oops!', err.message || 'Something went wrong. Please try again.');
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
            <p className="text-white font-bold text-sm sm:text-base md:text-lg tracking-wide ">
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
              {/* Honeypot field for anti-spam */}
              <input
                type="text"
                name="_gotcha"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

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
                  aria-required="true"
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
                  aria-required="true"
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
                  aria-required="true"
                  rows={5}
                  className="w-full px-4 py-3 border-[3px] border-black bg-slate-50 focus:bg-white focus:outline-none transition-colors text-black font-bold uppercase tracking-wide placeholder-slate-400 comic-shadow resize-none"
                  placeholder="Ceritakan tentang proyek Anda..."
                ></textarea>
              </div>
              <button
                disabled={isSubmitting}
                type="submit"
                aria-label="Kirim Pesan"
                className="btn-primary w-full disabled:opacity-70 relative flex items-center justify-center h-[52px]"
              >
                {/* Loading State */}
                <span
                  className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-200 ${isSubmitting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Mengirim...</span>
                </span>

                {/* Default State */}
                <span
                  className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-200 ${!isSubmitting ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                  <span>Kirim Pesan</span>
                  <Send size={24} strokeWidth={3} aria-hidden="true" />
                </span>
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
                      className="font-bold text-slate-700 hover:text-primary transition-colors text-sm sm:text-base tracking-wide truncate block w-full"
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
                    <p className="font-bold text-slate-700 text-sm sm:text-base tracking-wide">
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
              <p className="text-white font-bold text-sm sm:text-base leading-relaxed tracking-wide">
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
