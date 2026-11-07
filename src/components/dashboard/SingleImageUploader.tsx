'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { convertFileToUrl } from '@/lib/utils';
import { AdminButton } from './admin-ui';
import { ImageDropzone } from './ImageDropzone';

type SingleImageUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFile: (file: File | null) => void;
  title: string;
  hint: string;
  previewAlt: string;
};

export function SingleImageUploader({
  imageUrl,
  onFieldChange,
  setFile,
  title,
  hint,
  previewAlt,
}: SingleImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const previewUrl = convertFileToUrl(acceptedFiles[0]);
        setFile(acceptedFiles[0]);
        // the form swaps this preview for the uploaded url when it is saved
        onFieldChange(previewUrl);
      }
    },
    [setFile, onFieldChange],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(['image/*']),
    multiple: false,
  });

  const removeImage = () => {
    onFieldChange('');
    setFile(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <ImageDropzone
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        title={title}
        hint={hint}
      />

      {imageUrl && (
        <div className="admin-preview">
          <div className="admin-preview-bar justify-end">
            <AdminButton
              type="button"
              variant="danger"
              size="sm"
              onClick={removeImage}
            >
              Supprimer
            </AdminButton>
          </div>
          <img
            src={imageUrl}
            alt={previewAlt}
            className="admin-preview-image"
          />
        </div>
      )}
    </div>
  );
}
