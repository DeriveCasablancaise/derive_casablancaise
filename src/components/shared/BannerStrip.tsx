import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { BannerView } from '@/lib/banner';

interface BannerStripProps {
  view: BannerView;
  // the admin preview shows the link without making it clickable
  preview?: boolean;
}

// Presentational only, shared by the home page and the admin preview
const BannerStrip = ({ view, preview = false }: BannerStripProps) => {
  const { text, isArabic, link } = view;
  const linkClass = cn(
    'mx-2 font-bold underline decoration-brand-orange decoration-2 underline-offset-4',
    isArabic ? 'arabic-subtitle-bold' : 'latin-subtitle-bold',
  );

  return (
    <div
      dir={isArabic ? 'rtl' : 'ltr'}
      className="w-full bg-[#094142] px-4 py-3 text-center text-[#E9EAEB]"
    >
      <p
        className={cn(
          'mx-auto max-w-4xl text-sm leading-relaxed md:text-base',
          isArabic ? 'arabic-text-regular text-lg md:text-xl' : 'latin-subtitle-regular',
        )}
      >
        {text}
        {link &&
          (preview ? (
            <span className={linkClass}>{link.label}</span>
          ) : link.external ? (
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
      </p>
    </div>
  );
};

export default BannerStrip;
