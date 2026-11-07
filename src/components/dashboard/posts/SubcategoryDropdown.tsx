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
  productions: { fr: 'Productions', ar: 'إنتاجات' },
} as const;

type SubCategoryKey = keyof typeof SubCategories;

interface SubCategoryDropdownProps {
  id?: string;
  value?: string;
  onChangeHandler: (value: string) => void;
}

const SubCategoryDropdown = ({
  id,
  value,
  onChangeHandler,
}: SubCategoryDropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} value={value}>
      <SelectTrigger id={id} className="select-field">
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
