import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import airtable from 'src/lib/airtable';
import { config } from 'config/env';

const api = airtable();
const { LINK_DOMAIN } = config;

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  let { pathname } = req.nextUrl;
  pathname = pathname.split('/')[1];

  if (req.method !== 'GET' || ['favicon.ico', 'api', ''].includes(pathname)) {
    return;
  }

  try {
    const res = await fetch(LINK_DOMAIN + '/api/v2/link?q=' + pathname);

    if (res.status >= 400 && res.status < 500) {
      const error = await res.json();
      throw error;
    }

    const { link } = await res.json();
    const url = link.link;
    return NextResponse.redirect(url);
  } catch (error: any) {
    console.log(error);
    return NextResponse.redirect(`${LINK_DOMAIN}?error=${error.name}`);
  }
}
