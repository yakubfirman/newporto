'use client';

import { useState } from 'react';
import { Send, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '@/lib/api';
import ImageCropper from '@/components/admin/ImageCropper';

export default function TestimonialForm() {
  const [formData, setFormData] = useState({ name: '', role: '', content: '', image: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showImageCropper, setShowImageCropper] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/testimonials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Failed to submit testimonial.');

      setSuccess(true);
      setFormData({ name: '', role: '', content: '', image: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border-[3px] border-black p-8 text-center comic-shadow rotate-1 h-full flex flex-col items-center justify-center">
        <CheckCircle size={48} className="text-primary mb-4" />
        <h3 className="comic-heading text-2xl mb-2 text-black">Terima Kasih!</h3>
        <p className="text-slate-700 font-medium">
          Testimoni Anda telah dikirim dan menunggu tinjauan.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 comic-heading text-sm text-white border-2 border-black px-4 py-2 hover:bg-black transition-colors bg-primary"
        >
          KIRIM LAGI
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border-[3px] border-black p-6 sm:p-8 comic-shadow h-full flex flex-col justify-between relative">
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary border-l-[3px] border-b-[3px] border-black flex items-center justify-center">
        <span className="comic-heading text-xl text-white">?</span>
      </div>
      <div>
        <h3 className="comic-heading text-2xl sm:text-3xl mb-2 text-black leading-tight pr-12">
          TINGGALKAN ULASAN
        </h3>
        <p className="text-slate-600 font-medium mb-6">
          Pernah bekerja dengan saya? Saya ingin mendengar pendapat Anda!
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-6 border-[2px] border-black comic-heading text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="comic-heading text-sm text-black block mb-1">Nama Anda *</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-[3px] border-black focus:outline-none focus:ring-4 focus:ring-primary/20 bg-slate-50 transition-all font-medium"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="comic-heading text-sm text-black block mb-1">
              Peran / Perusahaan
            </label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 border-[3px] border-black focus:outline-none focus:ring-4 focus:ring-primary/20 bg-slate-50 transition-all font-medium"
              placeholder="CEO at TechCorp"
            />
          </div>
          <div>
            <label className="comic-heading text-sm text-black block mb-1">
              Foto Profil (Opsional)
            </label>
            {formData.image ? (
              <div className="relative w-24 h-24 rounded-full border-[3px] border-black overflow-hidden group mb-2">
                <img
                  src={formData.image}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setShowImageCropper(true)}
                    className="text-white text-xs font-bold hover:underline"
                  >
                    Ubah
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="text-red-300 text-xs font-bold hover:underline mt-1"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowImageCropper(true)}
                className="w-full py-3 border-[3px] border-dashed border-black bg-slate-50 hover:bg-primary/10 transition-colors flex items-center justify-center gap-2 font-medium text-slate-600 mb-2"
              >
                <ImageIcon size={18} />
                Upload Foto (1:1)
              </button>
            )}
          </div>

          <div>
            <label className="comic-heading text-sm text-black block mb-1">Testimoni Anda *</label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border-[3px] border-black focus:outline-none focus:ring-4 focus:ring-primary/20 bg-slate-50 transition-all font-medium resize-none"
              placeholder="Yakub is an amazing developer..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Mengirim...' : 'Kirim Testimoni'}
            <Send size={18} />
          </button>
        </form>
      </div>

      {showImageCropper && (
        <ImageCropper
          aspectRatio={1 / 1}
          onCropComplete={(url) => {
            setFormData({ ...formData, image: url });
            setShowImageCropper(false);
          }}
          onCancel={() => setShowImageCropper(false)}
        />
      )}
    </div>
  );
}
