// middleware.js (or middleware.ts for TypeScript)
import { NextResponse } from 'next/server';
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'https://www.youtube.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '',
  },
});

export function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/api/proxy')) {
    return new Promise((resolve, reject) => {
      proxy(req, NextResponse.json, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(NextResponse.next());
        }
      });
    });
  }

  return NextResponse.next();
}
