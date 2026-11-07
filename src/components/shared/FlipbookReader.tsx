'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo,
  useCallback,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type FormEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useLocale, useTranslations } from 'next-intl';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Download,
  ScanSearch,
} from 'lucide-react';
import type { ProgrammeBook } from '@/constants/editions';
import { cn } from '@/lib/utils';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  clampZoom,
  keepCentreScroll,
  lastIndex,
  needsFallback,
  parsePageInput,
  snapIndex,
  stepIndex,
  stepZoom,
  toggleZoom,
  visiblePages,
} from '@/lib/readerView';

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

// room kept around the book: the close button above, a little air elsewhere
const PAD_X = 32;
const PAD_TOP = 64;
const PAD_BOTTOM = 16;
const TAP_MS = 300;
const TAP_MOVE = 10;
const FLIP_MS = 600;
// the library's own threshold between a click and a drag
const LIB_MOVE = 5;
// a fresh object every render makes the memoised book re-render
const BOOK_STYLE = {};

const toolBtn =
  'inline-flex h-11 min-w-11 items-center justify-center rounded-md bg-white/15 px-2 text-white transition-colors hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange disabled:opacity-40 disabled:hover:bg-white/15';

const pagePath = (dir: string, index: number, suffix = '') =>
  `${dir}/page-${String(index + 1).padStart(3, '0')}${suffix}.webp`;

export default function FlipbookReader({ book, pdfHref, onClose }: Props) {
  const t = useTranslations('Layout');
  const locale = useLocale();
  const flipBook = useRef<any>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const zoomViewRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<Element | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageInput, setPageInput] = useState('1');
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [dragging, setDragging] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [area, setArea] = useState({ w: 0, h: 0 });

  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  // where the zoom view must scroll to once the new zoom is laid out
  const pendingScroll = useRef<{ left: number; top: number } | null>(null);
  const tapStart = useRef({ x: 0, y: 0, t: 0 });
  const lastTap = useRef(0);
  // the page shown by the book, as last reported by its flip event
  const pageRef = useRef(0);
  // the last page asked for while a flip is still running, so rapid clicks chain
  const pendingRef = useRef<number | null>(null);
  const verifyTimer = useRef<number | undefined>(undefined);
  // last resort: a fresh book opened on the page
  const [bookKey, setBookKey] = useState(0);
  const [startPage, setStartPage] = useState(0);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const prefersReducedMotion = useMediaQuery(
    '(prefers-reduced-motion: reduce)',
  );

  // landscape pages are already spreads: show one at a time, no cover logic
  const aspectRatio = book.height / book.width;
  const singlePage = isMobile || aspectRatio < 1;
  const spread = !singlePage;
  const zoomed = zoom > MIN_ZOOM;

  // the book area is whatever the toolbar leaves, so it shrinks on short screens
  useLayoutEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const update = () => setArea({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // lock body scroll and trap focus
  useEffect(() => {
    returnFocusRef.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    overlayRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
      if (returnFocusRef.current instanceof HTMLElement) {
        returnFocusRef.current.focus();
      }
    };
  }, []);

  // not there on iPhone Safari
  useEffect(() => {
    setCanFullscreen(
      Boolean(document.fullscreenEnabled && overlayRef.current?.requestFullscreen),
    );
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // global Esc
  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const pageCount = book.pages;
  const lastPage = lastIndex(pageCount, spread);
  const shownPages = visiblePages(currentPage, pageCount, spread);
  const shownCount = shownPages.length;

  // compute book dimensions to fit the book area
  const availW = area.w - PAD_X;
  const availH = area.h - PAD_TOP - PAD_BOTTOM;
  const maxW = singlePage
    ? Math.min(availW, availH / aspectRatio, 1000)
    : Math.min(availW / 2, availH / aspectRatio, 550);
  const pageWidth = Math.max(120, Math.round(maxW));
  const pageHeight = Math.round(pageWidth * aspectRatio);

  const settle = useCallback((index: number) => {
    pageRef.current = index;
    setCurrentPage(index);
    setPageInput(String(index + 1));
  }, []);

  useEffect(() => () => window.clearTimeout(verifyTimer.current), []);

  // the one way to move: reads the live book at call time. If the animated
  // flip did not land, I jump without animation, then remount on the page.
  const goTo = useCallback(
    (index: number) => {
      const pf = flipBook.current?.pageFlip();
      if (!pf) return;
      const target = snapIndex(index, pageCount, spread);
      window.clearTimeout(verifyTimer.current);
      // the hidden book needs no animation while the zoom view is on screen
      if (prefersReducedMotion || zoomed) {
        pendingRef.current = null;
        pf.turnToPage(target);
        if (zoomed && needsFallback(pf.getCurrentPageIndex(), target)) {
          setStartPage(target);
          setBookKey((k) => k + 1);
        }
        settle(target);
        return;
      }
      pendingRef.current = target;
      if (needsFallback(pf.getCurrentPageIndex(), target)) pf.flip(target);
      verifyTimer.current = window.setTimeout(() => {
        pendingRef.current = null;
        const live = flipBook.current?.pageFlip();
        if (live && needsFallback(live.getCurrentPageIndex(), target)) {
          live.turnToPage(target);
        }
        if (!live || needsFallback(live.getCurrentPageIndex(), target)) {
          setStartPage(target);
          setBookKey((k) => k + 1);
        }
        settle(target);
      }, FLIP_MS + 150);
    },
    [pageCount, spread, prefersReducedMotion, zoomed, settle],
  );

  const prevPage = useCallback(
    () =>
      goTo(
        stepIndex(pendingRef.current ?? pageRef.current, -1, pageCount, spread),
      ),
    [goTo, pageCount, spread],
  );

  const nextPage = useCallback(
    () =>
      goTo(
        stepIndex(pendingRef.current ?? pageRef.current, 1, pageCount, spread),
      ),
    [goTo, pageCount, spread],
  );

  // A plain click or tap on a page must never flip it (a double-click zooms).
  // Before the library's own mouseup/touchend runs, I end its touch as a
  // swipe, which it ignores. Drags (over 5 px) and the corner peel are left alone.
  useEffect(() => {
    let down: { x: number; y: number; moved: boolean } | null = null;
    const point = (e: MouseEvent | TouchEvent) =>
      'changedTouches' in e ? e.changedTouches[0] : e;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const p = point(e);
      down =
        p && areaRef.current?.contains(e.target as Node)
          ? { x: p.clientX, y: p.clientY, moved: false }
          : null;
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      const p = point(e);
      if (down && p && Math.hypot(p.clientX - down.x, p.clientY - down.y) > LIB_MOVE) {
        down.moved = true;
      }
    };
    const onUp = () => {
      if (down && !down.moved) {
        flipBook.current?.pageFlip()?.userStop({ x: 0, y: 0 }, true);
      }
      down = null;
    };
    const opts = { capture: true };
    window.addEventListener('mousedown', onDown, opts);
    window.addEventListener('touchstart', onDown, opts);
    window.addEventListener('mousemove', onMove, opts);
    window.addEventListener('touchmove', onMove, opts);
    window.addEventListener('mouseup', onUp, opts);
    window.addEventListener('touchend', onUp, opts);
    return () => {
      window.removeEventListener('mousedown', onDown, opts);
      window.removeEventListener('touchstart', onDown, opts);
      window.removeEventListener('mousemove', onMove, opts);
      window.removeEventListener('touchmove', onMove, opts);
      window.removeEventListener('mouseup', onUp, opts);
      window.removeEventListener('touchend', onUp, opts);
    };
  }, []);

  const applyZoom = useCallback(
    (next: number) => {
      const z = clampZoom(next);
      const el = zoomViewRef.current;
      const padX = PAD_X / 2;
      pendingScroll.current = {
        left: keepCentreScroll({
          scroll: el?.scrollLeft ?? 0,
          view: el?.clientWidth ?? area.w,
          from: shownCount * pageWidth * zoom,
          to: shownCount * pageWidth * z,
          padStart: padX,
          padEnd: padX,
        }),
        top: keepCentreScroll({
          scroll: el?.scrollTop ?? 0,
          view: el?.clientHeight ?? area.h,
          from: pageHeight * zoom,
          to: pageHeight * z,
          padStart: PAD_TOP,
          padEnd: PAD_BOTTOM,
        }),
      };
      setZoom(z);
    },
    [area, pageWidth, pageHeight, shownCount, zoom],
  );

  // sizes are explicit, so the new scroll range exists as soon as React commits
  useLayoutEffect(() => {
    const el = zoomViewRef.current;
    const target = pendingScroll.current;
    pendingScroll.current = null;
    if (!el || !target) return;
    el.scrollLeft = target.left;
    el.scrollTop = target.top;
  }, [zoom]);

  // a new page starts at its top
  useLayoutEffect(() => {
    if (zoomViewRef.current) zoomViewRef.current.scrollTop = 0;
  }, [currentPage]);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    } else {
      overlayRef.current?.requestFullscreen?.().catch(() => {});
    }
  }, []);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      const typing = (e.target as HTMLElement).tagName === 'INPUT';
      if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            prevPage();
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextPage();
            break;
          case 'Home':
            e.preventDefault();
            goTo(0);
            break;
          case 'End':
            e.preventDefault();
            goTo(lastPage);
            break;
          case '+':
          case '=':
            applyZoom(stepZoom(zoom, 1));
            break;
          case '-':
          case '_':
            applyZoom(stepZoom(zoom, -1));
            break;
          case '0':
            applyZoom(MIN_ZOOM);
            break;
          case 'f':
          case 'F':
            if (canFullscreen) toggleFullscreen();
            break;
        }
      }
      // keep Tab inside the dialog
      if (e.key === 'Tab' && overlayRef.current) {
        const items = overlayRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled])',
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
    [
      prevPage,
      nextPage,
      goTo,
      lastPage,
      applyZoom,
      zoom,
      canFullscreen,
      toggleFullscreen,
    ],
  );

  const onFlip = useCallback((e: { data: number }) => settle(e.data), [settle]);

  const onJump = (e: FormEvent) => {
    e.preventDefault();
    const index = parsePageInput(pageInput, pageCount);
    if (index === null) {
      setPageInput(String(currentPage + 1));
      return;
    }
    goTo(index);
  };

  // taps (any zoom level) and mouse drag-to-pan (zoomed only). Touch and pen
  // pan through the native scroll of the zoom view.
  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    const view = zoomViewRef.current;
    if (view) {
      const box = view.getBoundingClientRect();
      // a press on a scrollbar belongs to the browser
      if (
        e.clientX - box.left >= view.clientWidth ||
        e.clientY - box.top >= view.clientHeight
      ) {
        tapStart.current = { x: 0, y: 0, t: 0 };
        return;
      }
    }
    tapStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    if (view && e.pointerType === 'mouse' && e.button === 0) {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = {
        x: e.clientX,
        y: e.clientY,
        left: view.scrollLeft,
        top: view.scrollTop,
      };
      setDragging(true);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const view = zoomViewRef.current;
    if (!d || !view) return;
    view.scrollLeft = d.left - (e.clientX - d.x);
    view.scrollTop = d.top - (e.clientY - d.y);
  };

  // a cancelled pointer is a touch the browser took over to scroll, never a tap
  const onPointerCancel = () => {
    drag.current = null;
    setDragging(false);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    onPointerCancel();
    const s = tapStart.current;
    const now = Date.now();
    const isTap =
      now - s.t < TAP_MS &&
      Math.hypot(e.clientX - s.x, e.clientY - s.y) < TAP_MOVE;
    if (!isTap) return;
    if (now - lastTap.current < TAP_MS) {
      lastTap.current = 0;
      applyZoom(toggleZoom(zoom));
    } else {
      lastTap.current = now;
    }
  };

  // stable children: new ones make react-pageflip rebuild the book on every flip
  const pageEls = useMemo(
    () =>
      Array.from({ length: book.pages }, (_, i) => (
        <div key={i} className="bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pagePath(book.dir, i)}
            alt={`Page ${i + 1}`}
            width={book.width}
            height={book.height}
            loading={i < 4 ? 'eager' : 'lazy'}
            draggable={false}
            className="h-full w-full object-contain"
          />
        </div>
      )),
    [book],
  );

  const label = (key: string) => t(`Reader.${key}`);
  const zoomPageWidth = Math.round(pageWidth * zoom);
  const zoomPageHeight = Math.round(pageHeight * zoom);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={t('Download')}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-50 flex flex-col bg-black/90"
    >
      {/* close button */}
      <button
        onClick={onClose}
        aria-label={t('Menu.close')}
        title={t('Menu.close')}
        className="absolute end-[max(0.75rem,env(safe-area-inset-right))] top-[max(0.75rem,env(safe-area-inset-top))] z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black shadow-xl ring-2 ring-brand-orange transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4"
      >
        <X className="h-7 w-7" strokeWidth={2.5} />
      </button>

      {/* book area */}
      <div
        ref={areaRef}
        dir="ltr"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        style={{
          paddingTop: PAD_TOP,
          paddingBottom: PAD_BOTTOM,
        }}
        className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden"
      >
        {area.w > 0 && (
          // hidden rather than unmounted: the book keeps its page while zoomed
          <div
            aria-hidden={zoomed || undefined}
            style={{ visibility: zoomed ? 'hidden' : undefined }}
          >
            <HTMLFlipBook
              key={bookKey}
              ref={flipBook}
              width={pageWidth}
              height={pageHeight}
              size="fixed"
              minWidth={pageWidth}
              maxWidth={pageWidth}
              minHeight={pageHeight}
              maxHeight={pageHeight}
              showCover={spread}
              mobileScrollSupport={true}
              onFlip={onFlip}
              flippingTime={prefersReducedMotion ? 0 : 600}
              usePortrait={singlePage}
              startPage={startPage}
              drawShadow={!prefersReducedMotion}
              maxShadowOpacity={0.3}
              className=""
              style={BOOK_STYLE}
              startZIndex={0}
              autoSize={false}
              clickEventForward={false}
              useMouseEvents={true}
              swipeDistance={30}
              showPageCorners={!prefersReducedMotion}
              disableFlipByClick={false}
            >
              {pageEls}
            </HTMLFlipBook>
          </div>
        )}
        {zoomed && (
          <div
            ref={zoomViewRef}
            style={{ touchAction: 'pan-x pan-y' }}
            className={cn(
              'absolute inset-0 z-10 select-none overflow-auto',
              dragging ? 'cursor-grabbing' : 'cursor-grab',
            )}
          >
            {/* auto margins centre what fits, and overflow stays reachable */}
            <div className="flex min-h-full w-max min-w-full">
              <div
                className="m-auto flex shrink-0"
                style={{
                  padding: `${PAD_TOP}px ${PAD_X / 2}px ${PAD_BOTTOM}px`,
                }}
              >
                {shownPages.map((i) => (
                  <div
                    key={i}
                    className="relative shrink-0 bg-white"
                    style={{ width: zoomPageWidth, height: zoomPageHeight }}
                  >
                    {/* the 1100px image stays underneath while the sharp one loads */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pagePath(book.dir, i)}
                      alt={book.zoomWidth ? '' : `Page ${i + 1}`}
                      draggable={false}
                      className="absolute inset-0 h-full w-full"
                    />
                    {book.zoomWidth && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={pagePath(book.dir, i)}
                        srcSet={`${pagePath(book.dir, i)} ${book.width}w, ${pagePath(book.dir, i, '@3x')} ${book.zoomWidth}w`}
                        sizes={`${zoomPageWidth}px`}
                        alt={`Page ${i + 1}`}
                        draggable={false}
                        className="absolute inset-0 h-full w-full"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* toolbar */}
      <div
        dir="ltr"
        role="toolbar"
        aria-label={t('Download')}
        className="z-20 flex shrink-0 flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-white/20 bg-black px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-white"
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => goTo(0)}
            disabled={currentPage === 0}
            aria-label={label('first')}
            title={label('first')}
            className={toolBtn}
          >
            <ChevronsLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={prevPage}
            disabled={currentPage === 0}
            aria-label={label('previous')}
            title={label('previous')}
            className={toolBtn}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <form onSubmit={onJump} className="flex items-center gap-1.5 px-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ''))}
              onBlur={() => setPageInput(String(currentPage + 1))}
              aria-label={label('goTo')}
              title={label('goTo')}
              className="h-11 w-14 rounded-md bg-white text-center text-base font-semibold text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
            />
            <span className="whitespace-nowrap text-sm" aria-live="polite">
              {label('of')} {pageCount}
            </span>
          </form>
          <button
            type="button"
            onClick={nextPage}
            disabled={currentPage >= lastPage}
            aria-label={label('next')}
            title={label('next')}
            className={toolBtn}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => goTo(lastPage)}
            disabled={currentPage >= lastPage}
            aria-label={label('last')}
            title={label('last')}
            className={toolBtn}
          >
            <ChevronsRight className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => applyZoom(stepZoom(zoom, -1))}
            disabled={zoom <= MIN_ZOOM}
            aria-label={label('zoomOut')}
            title={label('zoomOut')}
            className={toolBtn}
          >
            <ZoomOut className="h-6 w-6" />
          </button>
          <span
            className="min-w-12 text-center text-sm font-semibold tabular-nums"
            aria-live="polite"
          >
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => applyZoom(stepZoom(zoom, 1))}
            disabled={zoom >= MAX_ZOOM}
            aria-label={label('zoomIn')}
            title={label('zoomIn')}
            className={toolBtn}
          >
            <ZoomIn className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={() => applyZoom(MIN_ZOOM)}
            disabled={!zoomed}
            aria-label={label('zoomReset')}
            title={label('zoomReset')}
            className={toolBtn}
          >
            <ScanSearch className="h-6 w-6" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {canFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={label(isFullscreen ? 'exitFullscreen' : 'fullscreen')}
              title={label(isFullscreen ? 'exitFullscreen' : 'fullscreen')}
              className={toolBtn}
            >
              {isFullscreen ? (
                <Minimize className="h-6 w-6" />
              ) : (
                <Maximize className="h-6 w-6" />
              )}
            </button>
          )}
          <a
            href={pdfHref}
            download
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('Download')}
            title={t('Download')}
            className={toolBtn}
          >
            <Download className="h-6 w-6" />
          </a>
        </div>
      </div>
    </div>
  );
}
