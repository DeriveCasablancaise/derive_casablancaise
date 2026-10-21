'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { BannerView } from '@/lib/banner';

interface SubHeaderProps {
  banner?: BannerView | null;
}

const DEFAULT_TEXT =
  'Biennale pluridisciplinaire : Danse/Théâtre/Musique/Cinéma/Lectures/Ateliers/Conférences/Rencontres';

export default function Component({ banner = null }: SubHeaderProps) {
  const text = banner?.text ?? DEFAULT_TEXT;
  const isArabic = banner?.isArabic ?? false;
  const link = banner?.link;
  // longer text needs more time to stay readable
  const duration = Math.max(15, Math.round(text.length * 0.2));
  const linkClass = cn(
    'mx-2 font-bold underline decoration-[#ee7103] decoration-2 underline-offset-4',
    isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold',
  );

  return (
    <div className="w-full flex flex-col py-6 px-2 mt-16 lg:mt-0 relative lg:absolute lg:top-[15vh]">
      {/* First Line */}
      <div className="flex flex-col justify-center items-center text-center font-semibold text-xl lg:text-3xl">
        <span className="text-[#ee7103] latin-title-bold flex w-full flex-row mx-auto justify-center items-center gap-4">
          Dérive Casablancaise
        </span>
        <span className="text-[#ee7103] latin-title-bold flex w-full flex-row mx-auto justify-center items-center gap-4">
          Rencontres des arts de la scène
        </span>
        <span>
          {' '}
          <Image
            src="/images/spiralTrans.png"
            className="rounded-full object-cover"
            alt="spirals"
            width={40}
            height={40}
          />
        </span>{' '}
        <span className="text-[#ee7103] mt-2 lg:mt-0 lg:ml-4 arabic-title-bold flex w-full flex-row mx-auto justify-center items-center gap-4">
          ملتقى فنون الأداء
        </span>
      </div>

      {/* Moving text, pauses on hover and focus */}
      <div className="marquee mt-6 2xl:mb-24 w-full overflow-hidden">
        <div
          className="marquee-track flex justify-center items-center text-center font-normal text-base md:text-lg whitespace-nowrap"
          data-rtl={isArabic}
          style={{ animationDuration: `${duration}s` }}
        >
          <span
            dir={isArabic ? 'rtl' : 'ltr'}
            className={cn(
              'text-[#094142]',
              isArabic ? 'arabic-subtitle-regular' : 'latin-title-light',
            )}
          >
            {text}
            {link &&
              (link.external ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              ))}
          </span>
        </div>
      </div>
    </div>
  );
}
