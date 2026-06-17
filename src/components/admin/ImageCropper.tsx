'use client';

import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { X, Upload, Check } from 'lucide-react';
import { uploadFile } from '@/lib/api';

interface ImageCropperProps {
  aspectRatio: number;
  onCropComplete: (url: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ aspectRatio, onCropComplete, onCancel }: ImageCropperProps) {
  const cropperRef = useRef<any>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => setSrc(reader.result?.toString() || null));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const cropAndUpload = async () => {
    if (!cropperRef.current) return;

    setIsUploading(true);
    try {
      const cropper = cropperRef.current?.cropper;
      if (!cropper) throw new Error('Cropper not ready');

      const canvas = cropper.getCroppedCanvas({
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high',
      });

      // Convert to webp blob
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b: Blob | null) => resolve(b), 'image/webp', 0.85);
      });

      if (!blob) throw new Error('Failed to create webp blob');

      const file = new File([blob], 'cropped-image.webp', { type: 'image/webp' });

      const uploadedUrl = await uploadFile(file);
      onCropComplete(uploadedUrl);
    } catch (error) {
      console.error('Failed to crop and upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h3 className="font-semibold text-lg text-slate-800">Upload & Crop Image</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-md transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center min-h-[300px] bg-slate-50">
          {!src ? (
            <div className="w-full h-64 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-slate-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="hidden"
                id="image-upload-input"
              />
              <label
                htmlFor="image-upload-input"
                className="flex flex-col items-center cursor-pointer p-8"
              >
                <Upload size={48} className="text-primary mb-4" />
                <span className="font-medium text-slate-700">Click to select an image</span>
                <span className="text-sm text-slate-500 mt-2">
                  All formats will be converted to .webp
                </span>
              </label>
            </div>
          ) : (
            <div className="w-full max-h-[60vh] bg-black">
              <Cropper
                ref={cropperRef}
                src={src}
                style={{ height: '100%', width: '100%' }}
                aspectRatio={aspectRatio}
                guides={true}
                viewMode={1}
                dragMode="move"
                background={false}
                responsive={true}
                checkOrientation={false}
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-3 bg-white rounded-b-xl">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            disabled={isUploading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={
              src ? cropAndUpload : () => document.getElementById('image-upload-input')?.click()
            }
            className="px-4 py-2 font-medium text-white bg-primary hover:bg-primary/90 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            {isUploading ? (
              <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : src ? (
              <>
                <Check size={18} /> Apply & Upload
              </>
            ) : (
              <>
                <Upload size={18} /> Select Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
