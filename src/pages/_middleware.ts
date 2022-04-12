import type { NextFetchEvent, NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import airtable from 'src/lib/airtable';

const api = airtable();

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  let { pathname } = req.nextUrl;
  pathname = pathname.split('/')[1];

  if (req.method !== 'GET' || ['favicon.ico', 'api', ''].includes(pathname)) {
    return;
  }

  try {
    const params = {
      filterByFormula: `OR(
        FIND("${pathname}", {uid}),
        FIND("${pathname}", {alias})
      )`,
    };
    const { data } = await api.getLinks(params);
    const url = data.records[0].fields.link;
    return NextResponse.redirect(url);
  } catch (error) {
    return;
  }
}
