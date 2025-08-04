'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParentLinkProps {
  /**
   * The text label for the link. Defaults to "Back".
   */
  label?: string;
  /**
   * Optional className for the container div.
   */
  className?: string;
  /**
   * Optional className for the Button component.
   */
  buttonClassName?: string;
}

/**
 * A reusable component to create a link to the parent page based on the current URL.
 * It automatically determines the parent path and provides a customizable label and styling.
 */
export function ParentLink({
  label = 'Back',
  className,
  buttonClassName,
}: ParentLinkProps) {
  const pathname = usePathname();

  // Split the pathname into segments and filter out any empty strings (e.g., from leading/trailing slashes)
  const pathSegments = pathname.split('/').filter(Boolean);

  // Remove the last segment to get the parent path
  const parentPathSegments = pathSegments.slice(0, -1);
  const parentPath = '/' + parentPathSegments.join('/');

  return (
    <div className={cn('flex items-center', className)}>
      <Button variant="ghost" asChild className={buttonClassName}>
        <Link
          href={parentPath}
          className="text-lg xl:text-2xl latin-title-light text-[#094142]"
        >
          <ArrowLeft className="mr-2 size-8" />
          {label}
        </Link>
      </Button>
    </div>
  );
}
