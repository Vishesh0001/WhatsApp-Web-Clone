import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token_test')?.value; // or 'token_test'
  const path = request.nextUrl.pathname;


  if (token && path === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }


  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login'],
};
