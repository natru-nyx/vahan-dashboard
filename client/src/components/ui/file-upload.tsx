import * as React from "react";
import { cn } from "@/lib/utils";
import { CloudUpload, File, X } from "lucide-react";

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileSelect?: (files: FileList | null) => void;
  accept?: string;
  maxSize?: number; // in bytes
  multiple?: boolean;
  className?: string;
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ className, onFileSelect, accept, maxSize, multiple = false, ...props }, ref) => {
    const [isDragOver, setIsDragOver] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleDrop = React.useCallback(
      (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (!multiple && files.length > 1) {
          return;
        }
        
        const validFiles = files.filter(file => {
          if (maxSize && file.size > maxSize) return false;
          if (accept) {
            const acceptedTypes = accept.split(',').map(t => t.trim());
            return acceptedTypes.some(type => {
              if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
              }
              return file.type.match(type.replace('*', '.*'));
            });
          }
          return true;
        });
        
        setSelectedFiles(validFiles);
        if (onFileSelect) {
          const fileList = new DataTransfer();
          validFiles.forEach(file => fileList.items.add(file));
          onFileSelect(fileList.files);
        }
      },
      [accept, maxSize, multiple, onFileSelect]
    );

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setSelectedFiles(files);
      if (onFileSelect) {
        onFileSelect(e.target.files);
      }
    };

    const removeFile = (index: number) => {
      const newFiles = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(newFiles);
      
      if (onFileSelect) {
        const fileList = new DataTransfer();
        newFiles.forEach(file => fileList.items.add(file));
        onFileSelect(fileList.files);
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
      <div className={cn("w-full", className)}>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
            isDragOver
              ? "border-orange-400 bg-orange-50"
              : "border-orange-300 bg-orange-50/50 hover:border-orange-400"
          )}
          onClick={() => inputRef.current?.click()}
        >
          <CloudUpload 
            className={cn(
              "mx-auto mb-4",
              isDragOver ? "text-orange-600" : "text-orange-500"
            )} 
            size={32} 
          />
          <p className="text-gray-700 font-medium mb-2">
            {isDragOver ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-gray-500 text-sm mb-4">or click to browse</p>
          
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
            {...props}
          />
          
          {accept && (
            <p className="text-xs text-gray-400">
              Accepted formats: {accept.replace(/\./g, '').toUpperCase()}
            </p>
          )}
        </div>
        
        {selectedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-gray-700">Selected files:</p>
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-white/50"
              >
                <div className="flex items-center">
                  <File className="text-gray-500 mr-3" size={16} />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
