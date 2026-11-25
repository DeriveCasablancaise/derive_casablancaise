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
// Rendered as plain text, never as HTML. One line with an ellipsis; the full
// credit is in the title (it stays hoverable for that) and in the image alt.
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
      title={label}
      className={cn(
        'absolute z-20 max-w-[70%] truncate rounded-sm bg-black/45 px-[5px] py-[2px] text-[9px] leading-tight text-white md:text-[10px]',
        position === 'top-end' ? 'top-1.5' : 'bottom-1.5',
        isArabic ? 'left-1.5' : 'right-1.5',
        className,
      )}
    >
      {label}
    </span>
  );
};
