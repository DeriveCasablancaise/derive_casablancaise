'use client';

import { Dispatch, SetStateAction } from 'react';
import { SingleImageUploader } from '../SingleImageUploader';

type ThumbnailUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  credit?: string;
  onCreditChange?: (credit: string) => void;
  setFile: Dispatch<SetStateAction<File | null>>;
};

export function ThumbnailUploader({
  imageUrl,
  onFieldChange,
  setFile,
  credit,
  onCreditChange,
}: ThumbnailUploaderProps) {
  return (
    <SingleImageUploader
      imageUrl={imageUrl}
      onFieldChange={onFieldChange}
      credit={credit}
      onCreditChange={onCreditChange}
      setFile={setFile}
      title="Placez votre image de miniature ici"
      hint="SVG, PNG, JPG"
      previewAlt="Aperçu de la miniature"
    />
  );
}
