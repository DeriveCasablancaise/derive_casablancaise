'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const SubCategories = {
  rencontres: { fr: 'Rencontres', ar: 'لقاءات' },
  expositions: { fr: 'Expositions', ar: 'معارض' },
} as const;

type SubCategoryKey = keyof typeof SubCategories;

interface SubCategoryDropdownProps {
  value?: string;
  onChangeHandler: (value: string) => void;
}

const SubCategoryDropdown = ({
  value,
  onChangeHandler,
}: SubCategoryDropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} value={value}>
      <SelectTrigger className="input-field">
        <SelectValue placeholder="Sélectionner une sous-catégorie" />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(SubCategories) as SubCategoryKey[]).map((subCat) => (
          <SelectItem key={subCat} value={subCat}>
            {SubCategories[subCat].fr}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SubCategoryDropdown;
