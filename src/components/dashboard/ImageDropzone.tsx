'use client';

import type { DropzoneState } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { AdminButton } from './admin-ui';

type ImageDropzoneProps = {
  getRootProps: DropzoneState['getRootProps'];
  getInputProps: DropzoneState['getInputProps'];
  title: string;
  hint: string;
  disabled?: boolean;
};

export function ImageDropzone({
  getRootProps,
  getInputProps,
  title,
  hint,
  disabled,
}: ImageDropzoneProps) {
  return (
    <div {...getRootProps()} className="admin-dropzone">
      <input {...getInputProps()} className="cursor-pointer" />
      <Upload className="h-10 w-10" aria-hidden="true" />
      <h3 className="font-medium">{title}</h3>
      <p className="admin-help">{hint}</p>
      {/* the click bubbles up to the zone, which opens the file dialog */}
      <AdminButton type="button" className="mt-2" disabled={disabled}>
        Choisir à partir de l&apos;appareil
      </AdminButton>
    </div>
  );
}
