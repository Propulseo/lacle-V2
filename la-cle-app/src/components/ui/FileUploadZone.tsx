"use client";

import { useState, useRef } from "react";
import { Upload, X, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  label?: string;
}

export function FileUploadZone({
  onFiles,
  accept,
  multiple = false,
  className,
  label = "Glissez vos fichiers ici ou cliquez pour parcourir",
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles(dropped);
    onFiles(dropped);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    onFiles(selected);
  }

  function removeFile(index: number) {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onFiles(updated);
  }

  return (
    <div className={className}>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          isDragging
            ? "border-or/50 bg-or/5"
            : "border-filet hover:border-filet-accent"
        )}
      >
        <Upload className="mb-3 h-8 w-8 text-pierre" />
        <p className="text-sm text-cendre">{label}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-encre px-3 py-2 text-sm">
              <File className="h-4 w-4 text-cendre" />
              <span className="flex-1 truncate text-ivoire">{file.name}</span>
              <button onClick={() => removeFile(i)} className="text-pierre hover:text-erreur transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
