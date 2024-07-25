// middleware.js (or middleware.ts for TypeScript)
import { NextResponse } from 'next/server';
import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = createProxyMiddleware({
  target: 'https://www.youtube.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '', // Adjust if needed
  },
  selfHandleResponse: true, // Ensure the proxy middleware does not automatically handle the response
});

export function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/api/proxy')) {
    return new Promise((resolve, reject) => {
      const res = {
        writeHead: (statusCode, headers) => {
          const headersList = new Headers();
          Object.entries(headers).forEach(([key, value]) => {
            headersList.append(key, value);
          });
          resolve(
            new NextResponse(null, {
              status: statusCode,
              headers: headersList,
            })
          );
        },
        end: (body) => {
          resolve(
            new NextResponse(body)
          );
        },
        write: (chunk) => {
          // This can be used to handle streaming responses
          resolve(
            new NextResponse(chunk)
          );
        },
      };

      proxy(req, res, (err) => {
        if (err) {
          reject(err);
        }
      });
    });
  }

  return NextResponse.next();
}
