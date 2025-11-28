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

const DesktopNav = () => {
  const t = useTranslations('Layout');
  const navKeys = ['home', 'darja', 'contact'];
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
      className="h-full w-full" // Apply w-full here to make NavigationMenu span the full width of DesktopHeader
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <NavigationMenuList className="lg:h-[10vh] w-screen justify-between">
        {' '}
        {/* w-full and justify-between to distribute items */}
        {/* First navKey */}
        <NavigationMenuItem
          className={cn(
            'w-full h-full flex justify-center items-center border-white hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-white data-[state=open]:bg-[#00b0db] bg-[#094142] ',
            isArabic ? 'border-l-2' : 'border-r-2'
          )}
        >
          <NavigationMenuLink
            href={`/${locale}${t(`Navigation.${navKeys[0]}.href`)}`}
            className={cn(
              'group w-max items-center justify-center px-4 py-2 transition-colors text-xl font-extrabold ',
              isArabic
                ? 'arabic-subtitle-regular'
                : 'latin-subtitle-light font-light'
            )}
          >
            {t(`Navigation.${navKeys[0]}.title`)}
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="group w-full h-full flex justify-center items-center hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-white nav-trigger relative">
          <NavigationMenuTrigger
            className={cn(
              ' text-xl bg-transparent font-extrabold',
              isArabic
                ? 'arabic-subtitle-regular'
                : 'latin-subtitle-light font-light'
            )}
          >
            {t('Navigation.derivecasa')}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={cn('bg-[#094142] left-0', isArabic && 'right-0')}
            style={{ width: `${triggerWidth + 2}px` }}
          >
            <ul className="flex flex-col gap-3 " dir={isArabic ? 'rtl' : 'ltr'}>
              {deriveNavKeys.map((deriveNav, i) => (
                <NavigationMenuLink
                  key={`b_${i}`}
                  href={`/${locale}${t(`Navigation.${deriveNav}.href`)}`}
                  className={cn(
                    'flex items-center justify-start text-xl transition-colors hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-white data-[state=open]:bg-[#00b0db] font-extrabold px-8 py-2 w-full',
                    isArabic
                      ? 'arabic-subtitle-regular'
                      : 'latin-subtitle-light font-light'
                  )}
                >
                  {t(`Navigation.${deriveNav}.title`)}
                </NavigationMenuLink>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* Remaining navKeys */}
        {navKeys.slice(1).map((key, i) => {
          return (
            <NavigationMenuItem
              key={`nav_${i + 1}`}
              className={cn(
                'w-full h-full flex justify-center items-center border-white hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-white data-[state=open]:bg-[#00b0db] bg-[#094142] ',
                isArabic ? 'border-r-2' : 'border-l-2'
              )}
            >
              <NavigationMenuLink
                href={`/${locale}${t(`Navigation.${key}.href`)}`}
                className={cn(
                  'group w-max items-center justify-center px-4 py-2 transition-colors text-xl font-extrabold ',
                  isArabic
                    ? 'arabic-subtitle-regular'
                    : 'latin-subtitle-light font-light'
                )}
              >
                {t(`Navigation.${key}.title`)}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
        <NavigationMenuItem
          className={cn(
            'w-full h-full flex justify-center items-center border-white hover:bg-[#00b0db] hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-[#00b0db] text-white data-[state=open]:bg-[#00b0db] bg-[#094142] ',
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
