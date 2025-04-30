'use client';

import { cn } from '../../lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { ChangeEvent, ReactNode, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const nextLocale = locale === 'fr' ? 'ar' : 'fr';

  function handleLocaleChange(nextLocale: string) {
    const path = pathname.replace(`/${locale}`, `/${nextLocale}`);
    const search = searchParams.toString();
    const newUrl = search ? `${path}?${search}` : path;

    startTransition(() => {
      router.replace(newUrl);
    });
  }

  return (
    <div
      className="cursor-pointer"
      onClick={() => handleLocaleChange(nextLocale)}
    >
      <p className="latin-title-bold font-[800] text-xl"> FR / AR</p>
    </div>
  );
}
