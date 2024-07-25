import { NextResponse } from 'next/server';
import http from 'http';
import https from 'https';

const proxyHandler = async (req) => {
  const url = new URL(req.url);
  const targetUrl = new URL(url.pathname.replace('/api/proxy', ''), 'https://www.youtube.com');

  const options = {
    hostname: targetUrl.hostname,
    port: 443,
    path: targetUrl.pathname + targetUrl.search,
    method: req.method,
    headers: req.headers,
  };

  return new Promise((resolve, reject) => {
    const proxyReq = https.request(options, (proxyRes) => {
      const responseHeaders = {};
      Object.entries(proxyRes.headers).forEach(([key, value]) => {
        responseHeaders[key] = value;
      });

      const bodyChunks = [];

      proxyRes.on('data', (chunk) => {
        bodyChunks.push(chunk);
      });

      proxyRes.on('end', () => {
        const responseBody = Buffer.concat(bodyChunks);
        const response = new NextResponse(responseBody, {
          headers: responseHeaders,
          status: proxyRes.statusCode,
        });
        resolve(response);
      });
    });

    proxyReq.on('error', (err) => {
      reject(new NextResponse(`Error: ${err.message}`, { status: 500 }));
    });

    if (req.body) {
      req.body.pipe(proxyReq);
    } else {
      proxyReq.end();
    }
  });
};

export async function GET(req) {
  return proxyHandler(req);
}

export async function POST(req) {
  return proxyHandler(req);
}

export async function PUT(req) {
  return proxyHandler(req);
}

export async function DELETE(req) {
  return proxyHandler(req);
}
