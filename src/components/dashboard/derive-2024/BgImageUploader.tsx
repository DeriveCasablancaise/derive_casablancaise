'use client';

import { Dispatch, SetStateAction } from 'react';
import { SingleImageUploader } from '../SingleImageUploader';

type BgImageUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  credit?: string;
  onCreditChange?: (credit: string) => void;
  setFile: Dispatch<SetStateAction<File[] | null>>;
};

export function BgImageUploader({
  imageUrl,
  onFieldChange,
  setFile,
  credit,
  onCreditChange,
}: BgImageUploaderProps) {
  return (
    <SingleImageUploader
      imageUrl={imageUrl}
      onFieldChange={onFieldChange}
      credit={credit}
      onCreditChange={onCreditChange}
      setFile={(file) => setFile(file && [file])}
      title="Placez votre image de fond ici"
      hint="SVG, PNG, JPG (Recommandé: 1920x1080 ou plus)"
      previewAlt="Aperçu de l'image de fond"
    />
  );
}
