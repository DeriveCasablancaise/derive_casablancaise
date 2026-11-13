import { cn } from '@/lib/utils';
import { formatCredit } from '@/lib/photo-credits';

type PhotoCreditProps = {
  credit?: string | null;
  isArabic?: boolean;
  // cards with a title at the bottom put the credit at the top
  position?: 'bottom-end' | 'top-end';
  className?: string;
};

// Sits in the end corner of its (relative) parent, mirrored in Arabic.
// Rendered as plain text, never as HTML.
export const PhotoCredit = ({
  credit,
  isArabic = false,
  position = 'bottom-end',
  className,
}: PhotoCreditProps) => {
  const label = formatCredit(credit);
  if (!label) return null;

  return (
    <span
      dir="auto"
      className={cn(
        'pointer-events-none absolute z-20 max-w-[75%] line-clamp-2 break-words rounded-sm bg-black/55 px-1.5 py-0.5 text-[10px] leading-snug text-white sm:text-[11px] lg:text-xs',
        position === 'top-end' ? 'top-1.5' : 'bottom-1.5',
        isArabic ? 'left-1.5' : 'right-1.5',
        className,
      )}
    >
      {label}
    </span>
  );
};
