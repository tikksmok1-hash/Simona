'use client';

import { useState, useRef } from 'react';
import { useAdmin } from '../AdminAuthContext';

export default function ImageUploader({ value, onChange, label = 'Imagine' }) {
  const { apiFetch } = useAdmin();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await apiFetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
      } else {
        alert(data.error || 'Eroare la upload');
      }
    } catch (err) {
      alert('Eroare la upload');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative w-20 h-20 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
            <img src={value} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center hover:bg-black cursor-pointer"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 bg-gray-100 rounded border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-xs">No img</span>
          </div>
        )}
        <div className="flex flex-col gap-2 flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="text-xs text-gray-600 file:mr-2 file:py-1.5 file:px-3 file:border file:border-gray-300 file:rounded file:text-xs file:bg-white file:cursor-pointer hover:file:bg-gray-50"
            disabled={uploading}
          />
          {uploading && <span className="text-xs text-gray-400">Se încarcă...</span>}
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="sau URL imagine..."
            className="w-full border border-gray-200 rounded px-3 py-1.5 text-xs focus:outline-none focus:border-black"
          />
        </div>
      </div>
    </div>
  );
}
