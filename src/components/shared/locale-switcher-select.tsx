'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useTransition } from 'react';
import { useLocale } from 'next-intl';

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
      <p className=" font-[800] text-xl"> FR / AR</p>
    </div>
  );
}
