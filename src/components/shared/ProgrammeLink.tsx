'use client';

import { type ReactNode, type MouseEvent, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { shouldOpenReader } from '@/lib/programmeLink';
import type { ProgrammeBook } from '@/constants/editions';

const FlipbookReader = dynamic(
  () => import('@/components/shared/FlipbookReader'),
  { ssr: false },
);

interface ProgrammeLinkProps {
  href: string;
  programmeBook?: ProgrammeBook;
  className?: string;
  children: ReactNode;
  download?: boolean;
}

export default function ProgrammeLink({
  href,
  programmeBook,
  className,
  children,
  download,
}: ProgrammeLinkProps) {
  const [open, setOpen] = useState(false);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (shouldOpenReader(e, !!programmeBook)) {
        e.preventDefault();
        setOpen(true);
      }
    },
    [programmeBook],
  );

  return (
    <>
      <a
        href={href}
        download={download}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
      {open && programmeBook && (
        <FlipbookReader
          book={programmeBook}
          pdfHref={href}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}

