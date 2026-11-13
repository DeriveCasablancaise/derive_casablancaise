'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ArtistBackLinkProps {
  label: string;
  // used when the previous page is not on this site
  fallbackHref: string;
  className?: string;
}

// true when going back stays on this site
const cameFromThisSite = () => {
  try {
    if (document.referrer && new URL(document.referrer).origin === location.origin) {
      return true;
    }
    // the referrer is not updated by client-side navigation, so I also check
    // whether this document was first loaded on another page of ours
    const entry = performance.getEntriesByType('navigation')[0];
    const loadedAt = entry ? new URL(entry.name) : null;
    return (
      loadedAt !== null &&
      loadedAt.origin === location.origin &&
      loadedAt.pathname + loadedAt.search !== location.pathname + location.search
    );
  } catch {
    return false;
  }
};

export function ArtistBackLink({ label, fallbackHref, className }: ArtistBackLinkProps) {
  const router = useRouter();

  return (
    <div className={cn('flex items-center', className)}>
      <Button variant="ghost" asChild>
        <Link
          href={fallbackHref}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            if (window.history.length > 1 && cameFromThisSite()) {
              e.preventDefault();
              router.back();
            }
          }}
          className="text-lg xl:text-2xl latin-title-light text-[#094142] px-0"
        >
          <ArrowLeft className="me-2 size-8 rtl:rotate-180" />
          {label}
        </Link>
      </Button>
    </div>
  );
}
