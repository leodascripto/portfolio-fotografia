// src/components/Admin/PhotoManager/UploadZone.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import imageCompression from 'browser-image-compression';
import { uploadToImgBB } from '@/lib/imgbb';

interface UploadZoneProps {
  onUploadComplete: (url: string) => void;
  onUploadStart?: () => void;
  maxSize?: number;
}

const UploadZone: React.FC<UploadZoneProps> = ({
  onUploadComplete,
  onUploadStart,
  maxSize = 5 * 1024 * 1024 // 5MB
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const compressImage = async (file: File): Promise<File> => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (percent: number) => {
        setProgress(Math.round(percent * 0.5)); // 0-50% para compressão
      }
    };

    try {
      return await imageCompression(file, options);
    } catch (error) {
      console.error('Erro na compressão:', error);
      return file;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);
    setProgress(0);

    if (onUploadStart) onUploadStart();

    try {
      // Compressão
      const compressedFile = await compressImage(file);
      setProgress(50);

      // Upload
      const result = await uploadToImgBB(compressedFile);
      setProgress(75);

      if (result.success && result.url) {
        setProgress(100);
        setTimeout(() => {
          onUploadComplete(result.url!);
          setUploading(false);
          setProgress(0);
        }, 500);
      } else {
        throw new Error(result.error || 'Erro no upload');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload');
      setUploading(false);
      setProgress(0);
    }
  }, [onUploadComplete, onUploadStart]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize,
    multiple: false,
    disabled: uploading
  });

  return (
    <div className=\"upload-zone-wrapper\">
      <motion.div
        {...getRootProps()}
        className={\upload-zone \ \\}
        whileHover={{ scale: uploading ? 1 : 1.02 }}
        whileTap={{ scale: uploading ? 1 : 0.98 }}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className=\"upload-progress\">
            <motion.div
              className=\"progress-circle\"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
            >
              <svg viewBox=\"0 0 100 100\">
                <circle cx=\"50\" cy=\"50\" r=\"45\" />
                <motion.circle
                  cx=\"50\"
                  cy=\"50\"
                  r=\"45\"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.3 }}
                />
              </svg>
              <span>{progress}%</span>
            </motion.div>
            <p>Fazendo upload...</p>
          </div>
        ) : (
          <div className=\"upload-content\">
            <i className=\"fa fa-cloud-upload\" />
            <h3>
              {isDragActive ? 'Solte a imagem aqui' : 'Arraste uma imagem ou clique'}
            </h3>
            <p>PNG, JPG, JPEG ou WEBP (máx. 5MB)</p>
          </div>
        )}
      </motion.div>

      {error && (
        <motion.div
          className=\"upload-error\"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <i className=\"fa fa-exclamation-triangle\" />
          {error}
        </motion.div>
      )}
    </div>
  );
};

export default UploadZone;
