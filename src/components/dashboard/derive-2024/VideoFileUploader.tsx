'use client';

import { Dispatch, SetStateAction } from 'react';
import { SingleImageUploader } from '../SingleImageUploader';

type VideoFileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFile: Dispatch<SetStateAction<File[] | null>>;
};

export function VideoFileUploader({
  imageUrl,
  onFieldChange,
  setFile,
}: VideoFileUploaderProps) {
  return (
    <SingleImageUploader
      imageUrl={imageUrl}
      onFieldChange={onFieldChange}
      setFile={(file) => setFile(file && [file])}
      title="Placez votre image ici"
      hint="SVG, PNG, JPG"
      previewAlt="Aperçu de la miniature"
    />
  );
}
