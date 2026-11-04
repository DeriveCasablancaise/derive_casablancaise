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
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import LocaleSwitcher from './locale-switcher-select';

// orange at rest, burnt orange on hover, focus, active page and open menu
const itemClass =
  'w-full h-full flex justify-center items-center border-white text-white bg-brand-chrome transition-colors hover:bg-brand-chrome-active focus-within:bg-brand-chrome-active data-[state=open]:bg-brand-chrome-active';
const activeClass = 'bg-brand-chrome-active';
// white ring, drawn inside so it shows on both oranges
const focusRing =
  'focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:-outline-offset-4';

const trimSlash = (path: string) => path.replace(/\/+$/, '') || '/';

const DesktopNav = () => {
  const t = useTranslations('Layout');
  const navKeys = ['home', 'darja', 'contact'];
  const deriveNavKeys = ['derive2026', 'derive', 'previous'];
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const pathname = trimSlash(usePathname() ?? '');

  const hrefFor = (key: string) =>
    trimSlash(`/${locale}${t(`Navigation.${key}.href`)}`);
  // home only matches itself, the others also match their sub pages
  const isCurrent = (key: string) => {
    const href = hrefFor(key);
    if (href === `/${locale}`) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  const deriveOpen = deriveNavKeys.some(isCurrent);

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
            itemClass,
            isCurrent(navKeys[0]) && activeClass,
            isArabic ? 'border-l-2' : 'border-r-2'
          )}
        >
          <NavigationMenuLink
            href={hrefFor(navKeys[0])}
            active={isCurrent(navKeys[0])}
            className={cn(
              'group w-max items-center justify-center px-4 py-2 transition-colors text-xl font-extrabold ',
              focusRing,
              isArabic
                ? 'arabic-subtitle-regular'
                : 'latin-subtitle-light font-light'
            )}
          >
            {t(`Navigation.${navKeys[0]}.title`)}
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem
          className={cn(
            itemClass,
            'group nav-trigger relative',
            deriveOpen && activeClass
          )}
        >
          <NavigationMenuTrigger
            className={cn(
              ' text-xl bg-transparent text-white font-extrabold',
              focusRing,
              isArabic
                ? 'arabic-subtitle-regular'
                : 'latin-subtitle-light font-light'
            )}
          >
            {t('Navigation.derivecasa')}
          </NavigationMenuTrigger>
          <NavigationMenuContent
            className={cn(
              'bg-brand-chrome left-0 border-white',
              isArabic && 'right-0'
            )}
            style={{ width: `${triggerWidth + 2}px` }}
          >
            <ul className="flex flex-col gap-3 " dir={isArabic ? 'rtl' : 'ltr'}>
              {deriveNavKeys.map((deriveNav, i) => (
                <NavigationMenuLink
                  key={`b_${i}`}
                  href={hrefFor(deriveNav)}
                  active={isCurrent(deriveNav)}
                  className={cn(
                    'flex items-center justify-start text-xl transition-colors text-white hover:bg-brand-chrome-active focus-visible:bg-brand-chrome-active data-[active]:bg-brand-chrome-active font-extrabold px-8 py-2 w-full',
                    focusRing,
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
                itemClass,
                isCurrent(key) && activeClass,
                isArabic ? 'border-r-2' : 'border-l-2'
              )}
            >
              <NavigationMenuLink
                href={hrefFor(key)}
                active={isCurrent(key)}
                className={cn(
                  'group w-max items-center justify-center px-4 py-2 transition-colors text-xl font-extrabold ',
                  focusRing,
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
          className={cn(itemClass, isArabic ? 'border-r-2' : 'border-l-2')}
        >
          <LocaleSwitcher />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default DesktopNav;
