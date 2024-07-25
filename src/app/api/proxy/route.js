
import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextResponse } from 'next/server';

const proxy = createProxyMiddleware({
  target: 'https://www.youtube.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '',
  },
});

export async function GET(req) {
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
    };
    
    proxy(req, res, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
}