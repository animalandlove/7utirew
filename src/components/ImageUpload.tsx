import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Camera, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect }) => {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }

      // Simulate file reading progress
      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      reader.onload = () => {
        setUploadProgress(100);
        onImageSelect(file);
        toast.success('Image uploaded successfully!');
        // Reset progress after a short delay
        setTimeout(() => setUploadProgress(null), 1000);
      };

      reader.onerror = () => {
        setUploadProgress(null);
        toast.error('Error uploading image');
      };

      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1
  });

  return (
    <div
      {...getRootProps()}
      className={`
        w-full p-8 border-2 border-dashed rounded-xl relative
        ${isDragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300'}
        transition-all duration-200 ease-in-out
        hover:border-emerald-400 hover:bg-gray-50
        cursor-pointer
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-emerald-100 rounded-full">
          {isDragActive ? (
            <Upload className="h-8 w-8 text-emerald-600" />
          ) : (
            <Camera className="h-8 w-8 text-emerald-600" />
          )}
        </div>
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">
            {isDragActive ? 'Drop your image here' : 'Drag & drop an image or click to select'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Supports JPEG and PNG (max 10MB)
          </p>
        </div>

        {uploadProgress !== null && (
          <div className="w-full max-w-xs">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                    Uploading
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-emerald-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-emerald-200">
                <div
                  style={{ width: `${uploadProgress}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};