'use client';

import { Dispatch, SetStateAction } from 'react';
import { SingleImageUploader } from '../SingleImageUploader';

type PartnerLogoUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setFile: Dispatch<SetStateAction<File[] | null>>;
};

export function PartnerLogoUploader({
  imageUrl,
  onFieldChange,
  setFile,
}: PartnerLogoUploaderProps) {
  return (
    <SingleImageUploader
      imageUrl={imageUrl}
      onFieldChange={onFieldChange}
      setFile={(file) => setFile(file && [file])}
      title="Placez votre logo ici"
      hint="SVG, PNG, JPG"
      previewAlt="Aperçu du logo"
    />
  );
}
