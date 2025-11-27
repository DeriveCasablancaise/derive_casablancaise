'use client';

import { useCallback, Dispatch, SetStateAction } from 'react';
import { useDropzone } from '@uploadthing/react/hooks';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { Button } from '@/components/ui/button';
import { convertFileToUrl } from '@/lib/utils';

type BgImageUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFile: Dispatch<SetStateAction<File[] | null>>;
};

export function BgImageUploader({
  imageUrl,
  onFieldChange,
  setFile,
}: BgImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const previewUrl = convertFileToUrl(acceptedFiles[0]);
        setFile([acceptedFiles[0]]);
        onFieldChange(previewUrl);
      }
    },
    [setFile, onFieldChange]
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
      <div
        {...getRootProps()}
        className="flex justify-center items-center bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border cursor-pointer flex-col rounded-xl h-72"
      >
        <input {...getInputProps()} className="cursor-pointer" />
        <div className="flex justify-center items-center flex-col py-5 text-gray-500">
          <img
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Placez votre image de fond ici</h3>
          <p className="mb-4">SVG, PNG, JPG (Recommandé: 1920x1080 ou plus)</p>
          <Button
            type="button"
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl border border-gray-700 my-4"
            variant="outline"
          >
            Choisir à partir de l'appareil
          </Button>
        </div>
      </div>

      {imageUrl && (
        <div className="relative h-72 w-full rounded-xl overflow-hidden">
          <img
            src={imageUrl || '/placeholder.svg'}
            alt="background preview"
            className="object-contain w-full h-full"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
