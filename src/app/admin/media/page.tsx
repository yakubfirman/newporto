'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  X,
  ZoomIn,
  Download,
  Search,
  CheckSquare,
  Square,
  CheckCheck,
} from 'lucide-react';
import { API_URL } from '@/lib/api';

interface MediaFile {
  filename: string;
  path: string;
  url: string;
  size: number;
  last_modified: number;
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [filtered, setFiltered] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // ── Multi-select state ────────────────────────────────────────────────────
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const isSelecting = selectedPaths.size > 0;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/media`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMedia(data);
      setFiltered(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFiltered(media);
    } else {
      setFiltered(media.filter((f) => f.filename.toLowerCase().includes(searchTerm.toLowerCase())));
    }
    // Clear selection when filter changes to avoid orphan selections
    setSelectedPaths(new Set());
  }, [searchTerm, media]);

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(`${API_URL}/admin/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    return res.ok;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(0);

    let done = 0;
    for (const file of files) {
      await uploadFile(file);
      done++;
      setUploadProgress(Math.round((done / files.length) * 100));
    }

    await fetchMedia();
    setUploading(false);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDraggingOver(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (!files.length) return;
      setUploading(true);
      setUploadProgress(0);
      let done = 0;
      for (const file of files) {
        await uploadFile(file);
        done++;
        setUploadProgress(Math.round((done / files.length) * 100));
      }
      await fetchMedia();
      setUploading(false);
      setUploadProgress(0);
    },
    [token, API_URL]
  );

  // ── Single delete ─────────────────────────────────────────────────────────
  const handleDelete = async (file: MediaFile) => {
    if (!confirm(`Delete "${file.filename}"? This cannot be undone.`)) return;
    try {
      await fetch(`${API_URL}/admin/media`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file.path }),
      });
      setMedia((prev) => prev.filter((m) => m.path !== file.path));
      if (selectedFile?.path === file.path) setSelectedFile(null);
    } catch (e) {
      console.error(e);
    }
  };

  // ── Multi-select helpers ──────────────────────────────────────────────────
  const toggleSelect = (path: string) => {
    // When in multi-select mode, clicking opens detail panel is disabled
    setSelectedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
    // Close single-select detail panel when multi-selecting
    setSelectedFile(null);
  };

  const handleThumbnailClick = (file: MediaFile) => {
    if (isSelecting) {
      // Already in selection mode — toggle this item
      toggleSelect(file.path);
    } else {
      // Normal mode — open detail panel
      setSelectedFile(selectedFile?.path === file.path ? null : file);
    }
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((f) => selectedPaths.has(f.path));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      // Deselect all visible
      setSelectedPaths((prev) => {
        const next = new Set(prev);
        filtered.forEach((f) => next.delete(f.path));
        return next;
      });
    } else {
      // Select all visible
      setSelectedPaths((prev) => {
        const next = new Set(prev);
        filtered.forEach((f) => next.add(f.path));
        return next;
      });
    }
  };

  const clearSelection = () => setSelectedPaths(new Set());

  // ── Bulk delete ───────────────────────────────────────────────────────────
  const handleBulkDelete = async () => {
    const count = selectedPaths.size;
    if (!confirm(`Delete ${count} selected file${count > 1 ? 's' : ''}? This cannot be undone.`))
      return;

    setBulkDeleting(true);
    try {
      await fetch(`${API_URL}/admin/media/bulk-delete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ paths: Array.from(selectedPaths) }),
      });
      setMedia((prev) => prev.filter((m) => !selectedPaths.has(m.path)));
      if (selectedFile && selectedPaths.has(selectedFile.path)) setSelectedFile(null);
      setSelectedPaths(new Set());
    } catch (e) {
      console.error(e);
    } finally {
      setBulkDeleting(false);
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const formatSize = (bytes: number) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const formatDate = (ts: number) =>
    new Date(ts * 1000).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 font-heading">Media Library</h2>
          <p className="text-sm text-slate-500 mt-1">
            {media.length} file{media.length !== 1 ? 's' : ''} stored
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <Upload size={18} />
            {uploading ? `Uploading ${uploadProgress}%` : 'Upload Images'}
          </button>
        </div>
      </div>

      {/* Search + selection toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
          />
        </div>

        {/* Select All / Clear */}
        {!loading && filtered.length > 0 && (
          <button
            onClick={toggleSelectAll}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {allFilteredSelected ? (
              <>
                <CheckCheck size={16} className="text-primary" />
                Deselect All
              </>
            ) : (
              <>
                <CheckSquare size={16} />
                Select All
              </>
            )}
          </button>
        )}

        {/* Bulk action bar — visible when items are selected */}
        {isSelecting && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 animate-in fade-in duration-150">
            <span className="text-sm font-semibold text-red-700">
              {selectedPaths.size} selected
            </span>
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-bold px-3 py-1.5 rounded-md transition-colors"
            >
              <Trash2 size={14} />
              {bulkDeleting ? 'Deleting…' : 'Delete Selected'}
            </button>
            <button
              onClick={clearSelection}
              className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-colors"
              title="Cancel selection"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Uploading...</span>
            <span className="text-sm text-slate-500">{uploadProgress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-6">
        {/* Grid */}
        <div
          className={`flex-1 bg-white border-2 rounded-xl transition-colors ${
            isDraggingOver ? 'border-primary border-dashed bg-primary/5' : 'border-slate-200'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={handleDrop}
        >
          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 p-4">
              {[...Array(18)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <ImageIcon size={56} strokeWidth={1} className="mb-4 text-slate-300" />
              {searchTerm ? (
                <>
                  <p className="text-lg font-semibold text-slate-600">
                    No results for &quot;{searchTerm}&quot;
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-sm text-primary hover:underline"
                  >
                    Clear search
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold text-slate-600">No media yet</p>
                  <p className="text-sm mt-1">Drop images here or click Upload</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 p-4">
              {filtered.map((file) => {
                const isChecked = selectedPaths.has(file.path);
                const isActive = !isSelecting && selectedFile?.path === file.path;

                return (
                  <button
                    key={file.path}
                    onClick={() => handleThumbnailClick(file)}
                    className={`group relative rounded-xl overflow-hidden border-2 transition-all ${
                      isChecked
                        ? 'border-primary shadow-md shadow-primary/20'
                        : isActive
                          ? 'border-primary shadow-md shadow-primary/20'
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
                        className={`absolute inset-0 transition-opacity flex items-end justify-center pb-2 ${
                          isChecked
                            ? 'opacity-100 bg-primary/25'
                            : isActive
                              ? 'opacity-100 bg-black/20'
                              : 'opacity-0 group-hover:opacity-100 bg-black/30'
                        }`}
                      >
                        {!isChecked && <ZoomIn size={20} className="text-white drop-shadow" />}
                      </div>

                      {/* Checkbox badge — top-left corner */}
                      <div
                        className={`absolute top-1.5 left-1.5 transition-all duration-150 ${
                          isChecked || isSelecting
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelect(file.path);
                        }}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shadow transition-colors ${
                            isChecked
                              ? 'bg-primary border-primary'
                              : 'bg-white/80 border-white backdrop-blur-sm'
                          }`}
                        >
                          {isChecked && <Check size={11} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {isDraggingOver && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-primary font-bold text-xl">Drop to upload</div>
            </div>
          )}
        </div>

        {/* File Detail Panel — hidden while multi-selecting */}
        {selectedFile && !isSelecting && (
          <div className="w-72 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-shrink-0 h-fit sticky top-6">
            <div className="relative w-full aspect-video bg-slate-100">
              <img
                src={selectedFile.url}
                alt={selectedFile.filename}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedFile(null)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            <div className="p-4 space-y-3">
              <h3
                className="font-semibold text-slate-800 text-sm truncate"
                title={selectedFile.filename}
              >
                {selectedFile.filename}
              </h3>
              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  Size:{' '}
                  <span className="text-slate-700 font-medium">
                    {formatSize(selectedFile.size)}
                  </span>
                </p>
                <p>
                  Uploaded:{' '}
                  <span className="text-slate-700 font-medium">
                    {formatDate(selectedFile.last_modified)}
                  </span>
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-semibold text-slate-600">File URL</label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <p className="text-xs text-slate-500 truncate flex-1 font-mono">
                    {selectedFile.url}
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(selectedFile.url)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm transition-colors ${
                    copiedUrl === selectedFile.url
                      ? 'bg-emerald-500 text-white'
                      : 'bg-primary text-white hover:bg-primary/90'
                  }`}
                >
                  {copiedUrl === selectedFile.url ? <Check size={16} /> : <Copy size={16} />}
                  {copiedUrl === selectedFile.url ? 'Copied!' : 'Copy URL'}
                </button>
                <a
                  href={selectedFile.url}
                  download={selectedFile.filename}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Download size={16} />
                  Download
                </a>
                <button
                  onClick={() => handleDelete(selectedFile)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
