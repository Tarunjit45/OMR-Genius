import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  file: File | null;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  id: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  file,
  onFileSelect,
  onClear,
  id
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs md:text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 md:mb-3">
        {label}
      </label>
      
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="group border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 p-4 md:p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all h-40 md:h-52 active:scale-[0.99]"
        >
          <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
             <Upload className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
          </div>
          <p className="text-sm text-slate-700 font-semibold">Tap to upload</p>
          <p className="hidden md:block text-xs text-slate-400 mt-1">or drag and drop</p>
          <p className="text-[10px] md:text-xs text-slate-400 mt-1">PNG, JPG</p>
          <input
            id={id}
            type="file"
            accept="image/*"
            ref={inputRef}
            className="hidden"
            onChange={handleChange}
          />
        </div>
      ) : (
        <div className="relative border border-slate-200 rounded-xl p-3 md:p-4 bg-white shadow-sm flex items-center space-x-3 md:space-x-4 h-40 md:h-52">
          <div className="h-full aspect-square md:w-32 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
             <img 
                src={URL.createObjectURL(file)} 
                alt="Preview" 
                className="w-full h-full object-cover"
             />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <p className="text-sm font-semibold text-slate-900 truncate mb-1">
              {file.name}
            </p>
            <p className="text-xs text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={(e) => {
                e.stopPropagation();
                onClear();
            }}
            className="p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors absolute top-2 right-2 md:top-3 md:right-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};