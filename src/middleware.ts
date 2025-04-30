import createMiddleware from 'next-intl/middleware';
import { authMiddleware } from '@clerk/nextjs/server';
import { locales, localePrefix, defaultLocale } from './config';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: defaultLocale,
  localePrefix: localePrefix,
});

// Only protect /admin routes, not /darja-admin
// Create a Clerk middleware that doesn't force protection
const publicClerkMiddleware = authMiddleware({
  publicRoutes: [
    '/darja-admin',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/uploadthing(.*)',
    '/api/webhook(.*)',
  ],
  ignoredRoutes: ['/api/webhook(.*)', '/api/uploadthing(.*)'],
});

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent
) {
  const pathname = req.nextUrl.pathname;

  // Handle darja-admin route with Clerk but keep it public
  if (pathname.startsWith('/darja-admin')) {
    return publicClerkMiddleware(req, event);
  }
  if (pathname.startsWith('/sign-in')) {
    return publicClerkMiddleware(req, event);
  }
  if (pathname.startsWith('/sign-up')) {
    return publicClerkMiddleware(req, event);
  }
  if (pathname.startsWith('/api')) {
    return publicClerkMiddleware(req, event);
  }

  // Handle admin routes with protection
  if (pathname.startsWith('/admin')) {
    return publicClerkMiddleware(req, event);
  }

  // For all other routes, use the intl middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all paths that start with supported locales
    '/(fr|ar)/:path*',
    // Match admin paths
    '/admin(.*)',
    '/darja-admin(.*)',
    // Match root and other paths
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // Add Clerk's matcher requirements
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};
