'use client';

import { useId } from 'react';
import { Input } from '@/components/ui/input';
import { MAX_CREDIT_LENGTH } from '@/lib/photo-credits';

type CreditInputProps = {
  value: string;
  onChange: (value: string) => void;
};

// the "Crédit photo" field under an image preview
export function CreditInput({ value, onChange }: CreditInputProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1 p-3">
      <label htmlFor={id} className="text-sm font-semibold">
        Crédit photo
      </label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nom du photographe"
        maxLength={MAX_CREDIT_LENGTH}
        className="input-field"
      />
    </div>
  );
}
