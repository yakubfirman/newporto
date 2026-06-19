'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { X, Upload, Check, Image as ImageIcon, Search, LayoutGrid, RefreshCw } from 'lucide-react';
import { uploadFile, API_URL } from '@/lib/api';

interface MediaFile {
  filename: string;
  path: string;
  url: string;
  size: number;
  last_modified: number;
}

interface ImagePickerModalProps {
  /** Aspect ratio for cropper (e.g. 16/9, 1, 4/3). Pass undefined to allow free crop. */
  aspectRatio?: number;
  /** Modal title shown in header */
  title?: string;
  onSelect: (url: string) => void;
  onCancel: () => void;
}

type Tab = 'upload' | 'library';

export default function ImagePickerModal({
  aspectRatio,
  title = 'Select Image',
  onSelect,
  onCancel,
}: ImagePickerModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upload');

  // ── Upload & Crop tab state ───────────────────────────────────────────────
  const [src, setSrc] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const cropperRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Media Library tab state ───────────────────────────────────────────────
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [filtered, setFiltered] = useState<MediaFile[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pickedFile, setPickedFile] = useState<MediaFile | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  // ── Fetch media library ───────────────────────────────────────────────────
  const fetchMedia = useCallback(async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch(`${API_URL}/admin/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: MediaFile[] = await res.json();
      setMedia(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMedia(false);
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'library' && media.length === 0) {
      fetchMedia();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(media);
    } else {
      setFiltered(media.filter((f) => f.filename.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    setPickedFile(null);
  }, [searchTerm, media]);

  // ── Upload tab handlers ───────────────────────────────────────────────────
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

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b: Blob | null) => resolve(b), 'image/webp', 0.85)
      );

      if (!blob) throw new Error('Failed to create webp blob');
      const file = new File([blob], 'cropped-image.webp', {
        type: 'image/webp',
      });
      const uploadedUrl = await uploadFile(file);
      onSelect(uploadedUrl);
    } catch (error) {
      console.error('Failed to crop and upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  // ── Tab config ────────────────────────────────────────────────────────────
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'upload', label: 'Upload & Crop', icon: <Upload size={15} /> },
    { id: 'library', label: 'Media Library', icon: <LayoutGrid size={15} /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-0 shrink-0">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button
            onClick={onCancel}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-1 mx-6 mt-4 mb-0 shrink-0 bg-slate-100 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-auto">
          {/* Upload & Crop Tab */}
          {activeTab === 'upload' && (
            <div className="flex flex-col h-full">
              <div className="flex-1 p-6 flex flex-col items-center justify-center min-h-[280px] bg-slate-50 m-4 rounded-xl border border-slate-200">
                {!src ? (
                  <div
                    className="w-full h-64 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-white hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.addEventListener('load', () =>
                        setSrc(reader.result?.toString() || null)
                      );
                      reader.readAsDataURL(file);
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="hidden"
                    />
                    <div className="w-16 h-16 bg-primary/10 group-hover:bg-primary/15 rounded-2xl flex items-center justify-center mb-4 transition-colors">
                      <Upload size={28} className="text-primary" />
                    </div>
                    <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">
                      Click or drag & drop to upload
                    </span>
                    <span className="text-sm text-slate-400 mt-1.5">
                      JPG, PNG, GIF, WebP · All formats converted to .webp
                    </span>
                  </div>
                ) : (
                  <div className="w-full rounded-xl overflow-hidden max-h-[55vh] bg-black">
                    <Cropper
                      ref={cropperRef}
                      src={src}
                      style={{ height: '100%', width: '100%', maxHeight: '55vh' }}
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

              {src && (
                <div className="px-6 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setSrc(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="text-sm text-slate-400 hover:text-red-500 transition-colors"
                  >
                    ← Choose a different image
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Media Library Tab */}
          {activeTab === 'library' && (
            <div className="p-4 flex flex-col gap-4 min-h-[340px]">
              {/* Search + Refresh */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search files..."
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                  />
                </div>
                <button
                  onClick={fetchMedia}
                  disabled={loadingMedia}
                  title="Refresh"
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={loadingMedia ? 'animate-spin' : ''} />
                </button>
              </div>

              {/* Grid */}
              {loadingMedia ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-16 text-slate-400">
                  <ImageIcon size={48} strokeWidth={1} className="mb-3 text-slate-300" />
                  <p className="font-semibold text-slate-500">
                    {searchTerm ? `No results for "${searchTerm}"` : 'No media yet'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
                  {filtered.map((file) => {
                    const isPicked = pickedFile?.path === file.path;
                    return (
                      <button
                        key={file.path}
                        type="button"
                        onClick={() => setPickedFile(isPicked ? null : file)}
                        className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                          isPicked
                            ? 'border-primary shadow-lg shadow-primary/20 scale-[0.97]'
                            : 'border-transparent hover:border-slate-300'
                        }`}
                      >
                        <div className="aspect-square relative bg-slate-100">
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay */}
                          <div
                            className={`absolute inset-0 transition-opacity ${
                              isPicked
                                ? 'opacity-100 bg-primary/25'
                                : 'opacity-0 group-hover:opacity-100 bg-black/20'
                            }`}
                          />
                          {/* Check badge */}
                          {isPicked && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                <Check size={16} className="text-white" strokeWidth={3} />
                              </div>
                            </div>
                          )}
                          {/* Filename tooltip */}
                          <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-[10px] truncate font-medium">
                              {file.filename}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected file info */}
              {pickedFile && (
                <div className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                  <img
                    src={pickedFile.url}
                    alt={pickedFile.filename}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {pickedFile.filename}
                    </p>
                    <p className="text-xs text-slate-500">{formatSize(pickedFile.size)}</p>
                  </div>
                  <div className="shrink-0 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center gap-3 shrink-0 bg-white">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>

          {activeTab === 'upload' && (
            <button
              type="button"
              disabled={isUploading}
              onClick={src ? cropAndUpload : () => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isUploading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading…
                </>
              ) : src ? (
                <>
                  <Check size={17} />
                  Apply & Upload
                </>
              ) : (
                <>
                  <Upload size={17} />
                  Select File
                </>
              )}
            </button>
          )}

          {activeTab === 'library' && (
            <button
              type="button"
              disabled={!pickedFile}
              onClick={() => pickedFile && onSelect(pickedFile.url)}
              className="flex items-center gap-2 px-5 py-2 font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <Check size={17} />
              Use Selected Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
