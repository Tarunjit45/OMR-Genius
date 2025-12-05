import React, { useRef } from 'react';
import { Upload, FileImage, X } from 'lucide-react';

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
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors h-48"
        >
          <Upload className="w-8 h-8 text-slate-400 mb-3" />
          <p className="text-sm text-slate-600 font-medium">Click to upload or drag & drop</p>
          <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
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
        <div className="relative border border-slate-200 rounded-lg p-4 bg-white shadow-sm flex items-center space-x-4 h-48">
          <div className="h-20 w-20 flex-shrink-0 bg-slate-100 rounded-md overflow-hidden flex items-center justify-center">
             <img 
                src={URL.createObjectURL(file)} 
                alt="Preview" 
                className="w-full h-full object-cover"
             />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {file.name}
            </p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={onClear}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors absolute top-2 right-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};