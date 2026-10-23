'use client';

import {
  useEffect,
  useRef,
  useCallback,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProgrammeBook } from '@/constants/editions';

interface Props {
  book: ProgrammeBook;
  pdfHref: string;
  onClose: () => void;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export default function FlipbookReader({ book, pdfHref, onClose }: Props) {
  const t = useTranslations('Layout');
  const flipBook = useRef<any>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );
  const [viewport, setViewport] = useState({ w: 1024, h: 768 });
  useEffect(() => {
    const update = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // lock body scroll and trap focus
  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    overlayRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      if (returnFocusRef.current instanceof HTMLElement) {
        returnFocusRef.current.focus();
      }
    };
  }, []);

  // global Esc
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const prevPage = useCallback(() => {
    flipBook.current?.pageFlip()?.flipPrev();
  }, []);

  const nextPage = useCallback(() => {
    flipBook.current?.pageFlip()?.flipNext();
  }, []);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'ArrowRight') nextPage();
      // keep Tab inside the dialog
      if (e.key === 'Tab' && overlayRef.current) {
        const items = overlayRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href]',
        );
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || active === overlayRef.current)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [prevPage, nextPage],
  );

  const onFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  // display page number (1-based)
  const displayPage = currentPage + 1;

  // compute book dimensions to fit viewport
  // landscape pages are already spreads: show one at a time, no cover logic
  const aspectRatio = book.height / book.width;
  const landscape = aspectRatio < 1;
  const singlePage = isMobile || landscape;
  const availW = viewport.w - (isMobile ? 112 : 160);
  const availH = viewport.h - 160;
  const maxW = singlePage
    ? Math.min(availW, availH / aspectRatio, 1000)
    : Math.min(availW / 2, availH / aspectRatio, 550);
  const pageWidth = Math.max(200, Math.round(maxW));
  const pageHeight = Math.round(pageWidth * aspectRatio);

  const pages = Array.from({ length: book.pages }, (_, i) => {
    const num = String(i + 1).padStart(3, '0');
    return `${book.dir}/page-${num}.webp`;
  });

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('Download')}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-teal/95"
    >
      {/* close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      {/* book */}
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={prevPage}
          aria-label="Previous page"
          className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <HTMLFlipBook
          ref={flipBook}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          minWidth={pageWidth}
          maxWidth={pageWidth}
          minHeight={pageHeight}
          maxHeight={pageHeight}
          showCover={!singlePage}
          mobileScrollSupport={true}
          onFlip={onFlip}
          flippingTime={prefersReducedMotion ? 0 : 600}
          usePortrait={singlePage}
          startPage={0}
          drawShadow={!prefersReducedMotion}
          maxShadowOpacity={0.3}
          className=""
          style={{}}
          startZIndex={0}
          autoSize={false}
          clickEventForward={false}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={!prefersReducedMotion}
          disableFlipByClick={false}
        >
          {pages.map((src, i) => (
            <div key={i} className="bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Page ${i + 1}`}
                width={book.width}
                height={book.height}
                loading={i < 4 ? 'eager' : 'lazy'}
                className="h-full w-full object-contain"
              />
            </div>
          ))}
        </HTMLFlipBook>

        <button
          onClick={nextPage}
          aria-label="Next page"
          className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          disabled={currentPage >= book.pages - 1}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* controls bar */}
      <div className="mt-4 flex items-center gap-6 text-white">
        <span className="latin-subtitle-regular text-sm">
          {displayPage} / {book.pages}
        </span>
        <a
          href={pdfHref}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm underline underline-offset-4 decoration-brand-orange decoration-2 transition-colors hover:text-brand-orange latin-subtitle-regular"
        >
          {t('Download')}
        </a>
      </div>
    </div>
  );
}
