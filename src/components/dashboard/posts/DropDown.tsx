'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CATEGORIES,
  getEdition,
  type EditionYear,
} from '@/constants/editions';

type DropdownProps = {
  id?: string;
  value?: string | null;
  onChangeHandler: (value: string) => void;
  edition: EditionYear;
};

const Dropdown = ({ id, value, onChangeHandler, edition }: DropdownProps) => {
  const categories = getEdition(edition).categories.map((key) => ({
    id: key,
    name: CATEGORIES[key].fr,
  }));

  return (
    <Select value={value || undefined} onValueChange={onChangeHandler}>
      <SelectTrigger id={id} className="select-field">
        <SelectValue placeholder="Catégorie de l'événement" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="select-item"
            >
              {category.name}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
