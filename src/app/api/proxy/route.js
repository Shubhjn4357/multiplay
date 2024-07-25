// pages/api/proxy.js
import { createProxyMiddleware } from 'http-proxy-middleware';

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: 'https://www.youtube.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/proxy': '',
  },
});

export async function GET(req) {
  return new Promise((resolve, reject) => {
    proxy(req, NextResponse.json, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(NextResponse.json());
      }
    });
  });
}
