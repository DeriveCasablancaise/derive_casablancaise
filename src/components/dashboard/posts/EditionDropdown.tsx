'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EDITION_YEARS } from '@/constants/editions';

type EditionDropdownProps = {
  id?: string;
  value?: string | null;
  onChangeHandler: (value: string) => void;
};

const editions = EDITION_YEARS.map((year) => ({
  id: year,
  name: `Édition ${year}`,
}));

const EditionDropdown = ({
  id,
  value,
  onChangeHandler,
}: EditionDropdownProps) => {
  return (
    <Select value={value || undefined} onValueChange={onChangeHandler}>
      <SelectTrigger id={id} className="select-field">
        <SelectValue placeholder="Année d'édition" />
      </SelectTrigger>
      <SelectContent>
        {editions.map((edition) => (
          <SelectItem
            key={edition.id}
            value={edition.id}
            className="select-item"
          >
            {edition.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EditionDropdown;
