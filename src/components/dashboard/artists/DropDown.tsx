'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';

type DropdownProps = {
  value?: string | null;
  onChangeHandler: (value: string) => void;
};

const categories = [
  { id: '2022', name: '2022' },
  { id: '2024', name: '2024' },
];

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
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
        <SelectValue placeholder="Catégorie de l'artiste" />
      </SelectTrigger>
      <SelectContent className=" bg-gray-800 bg-opacity-50 backdrop-blur-md  shadow-lg border ">
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="select-item text-gray-100  focus:text-gray-900"
            >
              {category.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
