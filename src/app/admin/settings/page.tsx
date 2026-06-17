'use client';

import { useEffect, useState, useRef } from 'react';
import { Save, AlertCircle, X } from 'lucide-react';
import { fetchAdminAPI, uploadFile } from '@/lib/api';
import Image from 'next/image';
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
  group: string;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cropper State
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('');
  const [currentKeyToUpload, setCurrentKeyToUpload] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const cropperRef = useRef<ReactCropperElement>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchAdminAPI<Setting[]>('/admin/settings');
        setSettings(data);

        // Convert array to key-value object for form state
        const initialFormState: Record<string, string> = {};
        data.forEach((setting) => {
          initialFormState[setting.key] = setting.value || '';
        });
        setFormData(initialFormState);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(false); // Hide success message on change
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again
    e.target.value = '';

    const reader = new FileReader();
    reader.onload = () => {
      setCropperImageSrc(reader.result as string);
      setCurrentKeyToUpload(key);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyCrop = async () => {
    if (!cropperRef.current) return;
    const cropper = cropperRef.current.cropper;

    setIsUploading(true);
    setError(null);

    cropper
      .getCroppedCanvas({
        maxWidth: 1080,
        maxHeight: 1080,
      })
      .toBlob(
        async (blob) => {
          if (!blob) {
            setError('Failed to crop image');
            setIsUploading(false);
            return;
          }

          const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });

          try {
            const url = await uploadFile(file);
            setFormData((prev) => ({ ...prev, [currentKeyToUpload]: url }));
            setShowCropper(false);
          } catch (err: any) {
            setError('Failed to upload image: ' + err.message);
          } finally {
            setIsUploading(false);
          }
        },
        'image/jpeg',
        0.9
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Loop through all settings and send PUT request for those that changed
      const updatePromises = settings.map(async (setting) => {
        const newValue = formData[setting.key];
        if (newValue !== setting.value) {
          await fetchAdminAPI(`/admin/settings/${setting.id}`, {
            method: 'PUT',
            body: JSON.stringify({ value: newValue }),
          });
        }
      });

      await Promise.all(updatePromises);

      // Update original settings state to reflect saved changes
      setSettings((prev) => prev.map((s) => ({ ...s, value: formData[s.key] })));
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Failed to save some settings: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Loading settings...
      </div>
    );

  // Group settings by their 'group' column
  const groupedSettings = settings.reduce(
    (acc, setting) => {
      const groupName = setting.group || 'General';
      if (!acc[groupName]) acc[groupName] = [];
      acc[groupName].push(setting);
      return acc;
    },
    {} as Record<string, Setting[]>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 font-heading">Global Settings</h2>
      </div>

      {/* Cropper Modal */}
      {showCropper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh] md:h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <h3 className="font-bold text-slate-800">Crop Image</h3>
              <button
                onClick={() => setShowCropper(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 bg-slate-100 flex-1 min-h-0">
              <Cropper
                src={cropperImageSrc}
                style={{ height: '100%', width: '100%' }}
                aspectRatio={currentKeyToUpload === 'header_image_url' ? 1 : 4 / 5}
                guides={true}
                ref={cropperRef}
                viewMode={1}
                background={false}
                autoCropArea={1}
                checkOrientation={false}
              />
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowCropper(false)}
                className="px-5 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={isUploading}
                className="px-5 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? 'Uploading...' : 'Apply & Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 border border-red-100">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-3 border border-emerald-100">
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shrink-0">
            ✓
          </div>
          <p className="font-medium">Settings saved successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {Object.entries(groupedSettings).map(([groupName, groupSettings]) => (
          <div
            key={groupName}
            className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 capitalize">{groupName} Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              {groupSettings.map((setting) => (
                <div
                  key={setting.id}
                  className="grid sm:grid-cols-[200px_1fr] gap-2 sm:gap-6 items-start"
                >
                  <label
                    htmlFor={setting.key}
                    className="text-sm font-semibold text-slate-700 capitalize mt-2"
                  >
                    {setting.key.replace(/_/g, ' ')}
                  </label>

                  {setting.key.includes('description') ||
                  setting.key.includes('content') ||
                  setting.key.includes('text') ? (
                    <textarea
                      id={setting.key}
                      name={setting.key}
                      value={formData[setting.key] || ''}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-y whitespace-pre-wrap"
                    />
                  ) : setting.key.includes('image_url') ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-4">
                        {formData[setting.key] && (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                            <Image
                              src={formData[setting.key]}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized={formData[setting.key].includes('localhost')}
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            id={setting.key}
                            type="text"
                            name={setting.key}
                            value={formData[setting.key] || ''}
                            onChange={handleChange}
                            placeholder="/about.jpg or https://..."
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                          Choose File to Upload
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileSelect(e, setting.key)}
                          />
                        </label>
                        <span className="text-xs text-slate-500">
                          Max size 5MB (
                          {setting.key === 'header_image_url'
                            ? '1:1 square ratio'
                            : '4:5 portrait ratio'}
                          )
                        </span>
                      </div>
                    </div>
                  ) : (
                    <input
                      id={setting.key}
                      type="text"
                      name={setting.key}
                      value={formData[setting.key] || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {isSubmitting ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
