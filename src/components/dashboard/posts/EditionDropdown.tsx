'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

type EditionDropdownProps = {
  value?: string | null;
  onChangeHandler: (value: string) => void;
};

const editions = [
  { id: '2022', name: 'Édition 2022' },
  { id: '2024', name: 'Édition 2024' },
];

const EditionDropdown = ({ value, onChangeHandler }: EditionDropdownProps) => {
  const [selectedValue, setSelectedValue] = useState(value?.toString() || '');

  useEffect(() => {
    setSelectedValue(value?.toString() || '');
  }, [value]);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChangeHandler(value);
  };

  return (
    <Select value={value || undefined} onValueChange={onChangeHandler}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Année d'édition" />
      </SelectTrigger>
      <SelectContent className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border">
        {editions.map((edition) => (
          <SelectItem
            key={edition.id}
            value={edition.id}
            className="select-item text-gray-100 focus:text-gray-900"
          >
            {edition.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EditionDropdown;
