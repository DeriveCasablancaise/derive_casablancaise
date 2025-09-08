'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ParentLinkProps {
  label?: string;
  className?: string;
  buttonClassName?: string;
  hash?: string;
  href?: string;
}

export function ParentLink({
  label = 'Back',
  className,
  buttonClassName,
  hash,
  href,
}: ParentLinkProps) {
  const pathname = usePathname();

  // Split the pathname into segments and filter out any empty strings (e.g., from leading/trailing slashes)
  const pathSegments = pathname.split('/').filter(Boolean);

  // Remove the last segment to get the parent path
  const parentPathSegments = pathSegments.slice(0, -1);
  const parentPath = href
    ? href
    : '/' + parentPathSegments.join('/') + (hash || '');

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
