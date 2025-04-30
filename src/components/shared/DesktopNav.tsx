'use client';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import LocaleSwitcher from './locale-switcher-select';
import Link from 'next/link';

const DesktopNav = () => {
  const t = useTranslations('Layout');
  const navKeys = ['darja', 'community', 'contact'];
  const deriveNavKeys = ['derive', 'previous'];
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const [triggerWidth, setTriggerWidth] = useState(0);

  useEffect(() => {
    const trigger = document.querySelector('.nav-trigger') as HTMLElement; // Add a class to your trigger element
    if (trigger) {
      setTriggerWidth(trigger.offsetWidth);
    }
  }, []);

  return (
    <NavigationMenu
      className="h-full w-screen justify-between"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <NavigationMenuList className="lg:h-[15vh] w-screen justify-between">
        <NavigationMenuItem className="group w-full h-full flex justify-center items-center hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-[#00b0db]  nav-trigger">
          <Link href={`/${locale}`}>
            <NavigationMenuTrigger
              className={cn(
                ' text-xl bg-transparent font-extrabold ',

                isArabic ? 'arabic-subtitle-regular' : 'latin-title-bold'
              )}
            >
              {t('Navigation.derivecasa')}
            </NavigationMenuTrigger>
          </Link>
          <NavigationMenuContent
            className={cn('bg-[#094142] w-full', isArabic && 'right-0')}
            style={{ width: `${triggerWidth + 2}px` }}
          >
            <ul
              className="flex flex-col w-full gap-3 "
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              {deriveNavKeys.map((deriveNav, i) => (
                <NavigationMenuLink
                  key={`b_${i}`}
                  href={`/${locale}${t(`Navigation.${deriveNav}.href`)}`}
                  className={cn(
                    'flex h-10 items-center justify-start text-xl transition-colors hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-[#00b0db] data-[state=open]:bg-[#00b0db] font-extrabold p-8 w-full',
                    isArabic ? 'arabic-subtitle-regular' : 'latin-title-bold'
                  )}
                >
                  {t(`Navigation.${deriveNav}.title`)}
                </NavigationMenuLink>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {navKeys.map((key, i) => {
          return (
            <NavigationMenuItem
              key={`b_${i}`}
              className={cn(
                'w-full h-full  flex justify-center items-center border-white hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-[#00b0db] data-[state=open]:bg-[#00b0db] bg-[#094142] ',
                isArabic ? 'border-r-2' : 'border-l-2'
              )}
            >
              <NavigationMenuLink
                href={`/${locale}${t(`Navigation.${key}.href`)}`}
                className={cn(
                  'group  h-10 w-max items-center justify-center  px-4 py-2 transition-colors   text-xl font-extrabold  ',
                  isArabic ? 'arabic-subtitle-regular' : 'latin-title-bold'
                )}
              >
                {t(`Navigation.${key}.title`)}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
        <NavigationMenuItem
          className={cn(
            'w-full h-full flex justify-center items-center border-white hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-[#00b0db] data-[state=open]:bg-[#00b0db] bg-[#094142] ',
            isArabic ? 'border-r-2' : 'border-l-2'
          )}
        >
          <LocaleSwitcher />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
