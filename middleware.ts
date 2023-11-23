import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import acceptLanguage from 'accept-language';
import { fallbackLng, languages } from './app/i18n/settings';

acceptLanguage.languages(languages);

export const config = {
  // matcher: '/:lng*'
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)'],
};

export function middleware(req: NextRequest) {
  // Redirect if lng in path is not supported
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    let lng;
    if (!lng) lng = acceptLanguage.get(req.headers.get('Accept-Language'));
    if (!lng) lng = fallbackLng;
    
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  return NextResponse.next();
}
