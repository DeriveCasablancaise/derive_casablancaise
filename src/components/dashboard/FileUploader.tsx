'use client';

import { useCallback, useRef, useState, Dispatch, SetStateAction } from 'react';
import { useDropzone } from 'react-dropzone';
import { generateClientDropzoneAccept } from 'uploadthing/client';
import { convertFileToUrl } from '@/lib/utils';
import { ImageDropzone } from './ImageDropzone';
import { ImageSlider } from './ImageSlider';
import {
  creditFor,
  setCredit,
  type ImageCredit,
} from '@/lib/photo-credits';

type FileUploaderProps = {
  onFieldChange: (urls: string[]) => void;
  imageUrls: string[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  // shows move buttons; only for forms that keep the order of new uploads
  reorderable?: boolean;
  // runs before files are added, e.g. to crop them; left out files are dropped
  prepareFiles?: (files: File[]) => Promise<File[]>;
  onFilesRejected?: () => void;
  onRecrop?: (url: string) => void;
  formatsHint?: string;
  // keyed by URL, so reordering or removing an image keeps credits in place
  credits?: ImageCredit[];
  onCreditsChange?: (credits: ImageCredit[]) => void;
};

export function FileUploader({
  imageUrls,
  onFieldChange,
  setFiles,
  reorderable = false,
  prepareFiles,
  onFilesRejected,
  onRecrop,
  formatsHint = 'SVG, PNG, JPG',
  credits,
  onCreditsChange,
}: FileUploaderProps) {
  // files always follow the order of their blob previews in imageUrls
  const fileByPreview = useRef(new Map<string, File>());
  const [isPreparing, setIsPreparing] = useState(false);

  // preparing is async, the list may have changed once it ends
  const latestUrls = useRef(imageUrls);
  latestUrls.current = imageUrls;

  const applyUrls = useCallback(
    (urls: string[]) => {
      onFieldChange(urls);
      setFiles(
        urls
          .map((url) => fileByPreview.current.get(url))
          .filter((file): file is File => Boolean(file)),
      );
    },
    [onFieldChange, setFiles],
  );

  const addFiles = useCallback(
    (files: File[]) => {
      // Create preview URLs for the dropped files
      const newImageUrls = files.map((file) => {
        const url = convertFileToUrl(file);
        fileByPreview.current.set(url, file);
        return url;
      });
      applyUrls([...latestUrls.current, ...newImageUrls]);
    },
    [applyUrls],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (!prepareFiles) {
        addFiles(acceptedFiles);
        return;
      }

      setIsPreparing(true);
      prepareFiles(acceptedFiles)
        .then(addFiles)
        .finally(() => setIsPreparing(false));
    },
    [prepareFiles, addFiles],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected: onFilesRejected,
    accept: generateClientDropzoneAccept(['image/*']),
    multiple: true,
    disabled: isPreparing,
  });

  const removeImage = (index: number) => {
    const newImageUrls = [...imageUrls];
    newImageUrls.splice(index, 1);
    applyUrls(newImageUrls);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= imageUrls.length) return;
    const newImageUrls = [...imageUrls];
    const [moved] = newImageUrls.splice(from, 1);
    newImageUrls.splice(to, 0, moved);
    applyUrls(newImageUrls);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <ImageDropzone
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        title="Placez vos images ici"
        hint={formatsHint}
        disabled={isPreparing}
      />

      {imageUrls.length > 0 && (
        <div className="flex flex-col gap-4">
          <ImageSlider
            images={imageUrls}
            onRemove={removeImage}
            onMove={reorderable ? moveImage : undefined}
            onRecrop={onRecrop && ((index) => onRecrop(imageUrls[index]))}
            creditFor={(url) => creditFor(credits, url)}
            onCreditChange={
              onCreditsChange &&
              ((url, credit) => onCreditsChange(setCredit(credits, url, credit)))
            }
          />
        </div>
      )}
    </div>
  );
}
