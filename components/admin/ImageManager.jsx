'use client';

import { useRef, useState } from 'react';
import { Upload, X, ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageManager({ images, onChange, token, max = 6 }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef(null);
  const dragCounter = useRef(0);

  const uploadOne = async (file) => {
    if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image`); return null; }
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      const data = await res.json();
      if (data.success) return data.url;
      toast.error(data.error || `Upload failed: ${file.name}`);
      return null;
    } catch {
      toast.error(`Upload failed: ${file.name}`);
      return null;
    }
  };

  const uploadFiles = async (fileList) => {
    const remaining = max - images.length;
    if (remaining <= 0) { toast.error(`Maximum ${max} photos reached`); return; }
    const list = Array.from(fileList).slice(0, remaining);
    setUploading(true);
    setProgress(0);
    const urls = [];
    for (let i = 0; i < list.length; i++) {
      const url = await uploadOne(list[i]);
      if (url) urls.push(url);
      setProgress(Math.round(((i + 1) / list.length) * 100));
    }
    if (urls.length > 0) {
      onChange([...images, ...urls]);
      toast.success(`Uploaded ${urls.length} photo${urls.length !== 1 ? 's' : ''}`);
    }
    setUploading(false);
    setProgress(0);
  };

  const moveImage = (idx, dir) => {
    const arr = [...images];
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    onChange(arr);
  };

  const setPrimary = (idx) => {
    if (idx === 0) return;
    const arr = [...images];
    const [item] = arr.splice(idx, 1);
    arr.unshift(item);
    onChange(arr);
    toast.success('Set as primary photo');
  };

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false); dragCounter.current = 0;
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  };
  const handleDragEnter = (e) => { e.preventDefault(); dragCounter.current++; setIsDragging(true); };
  const handleDragLeave = () => { dragCounter.current--; if (dragCounter.current === 0) setIsDragging(false); };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <div key={img + i} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gold/30 bg-cream">
            <img src={img} alt="" className="w-full h-full object-cover" />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-saffron text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shadow">
                <Star className="h-2.5 w-2.5 fill-current" /> PRIMARY
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1">
              {i > 0 && <button type="button" onClick={() => setPrimary(i)} className="w-7 h-7 rounded-full bg-white text-saffron flex items-center justify-center hover:bg-saffron hover:text-white" title="Set as primary"><Star className="h-3.5 w-3.5" /></button>}
              {i > 0 && <button type="button" onClick={() => moveImage(i, -1)} className="w-7 h-7 rounded-full bg-white text-maroon flex items-center justify-center hover:bg-maroon hover:text-cream" title="Move left"><ArrowLeft className="h-3.5 w-3.5" /></button>}
              {i < images.length - 1 && <button type="button" onClick={() => moveImage(i, 1)} className="w-7 h-7 rounded-full bg-white text-maroon flex items-center justify-center hover:bg-maroon hover:text-cream" title="Move right"><ArrowRight className="h-3.5 w-3.5" /></button>}
              <button type="button" onClick={() => removeImage(i)} className="w-7 h-7 rounded-full bg-white text-destructive flex items-center justify-center hover:bg-destructive hover:text-white" title="Remove"><X className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
        {images.length < max && (
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onClick={() => !uploading && fileRef.current?.click()}
            className={`aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition ${isDragging ? 'border-saffron bg-saffron/10' : uploading ? 'border-saffron/60 bg-saffron/5' : 'border-gold/40 hover:border-maroon text-maroon/60 hover:text-maroon'}`}
          >
            {uploading ? (
              <>
                <div className="text-sm font-bold text-saffron">{progress}%</div>
                <div className="w-3/4 mt-2 h-1.5 bg-gold/20 rounded-full overflow-hidden">
                  <div className="h-full bg-saffron rounded-full transition-all" style={{ width: `${progress}%` }} />
                </div>
                <span className="text-[10px] text-maroon/60 mt-1">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6" />
                <span className="text-[11px] mt-1 font-medium">Add photos</span>
                <span className="text-[9px] text-maroon/50">click or drop</span>
              </>
            )}
          </div>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => { if (e.target.files?.length) uploadFiles(e.target.files); e.target.value = ''; }}
      />
      <div className="flex items-center justify-between text-[11px] text-maroon/70 flex-wrap gap-2">
        <span>{images.length} of {max} photos • JPG / PNG / WEBP • max 6MB each</span>
        <span className="text-saffron flex items-center gap-1"><Star className="h-3 w-3 fill-current" /> First photo shows on product cards</span>
      </div>
    </div>
  );
}
