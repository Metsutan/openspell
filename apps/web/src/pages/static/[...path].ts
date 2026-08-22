import type { APIRoute } from 'astro';
import { getAsset } from '@/lib/assetOverlay';

export const GET: APIRoute = async ({ params }) => {
  const reqPath = params.path || '';
  const asset = getAsset(reqPath);

  if (!asset) {
    return new Response('Not Found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }

  return new Response(asset.body as any, {
    status: asset.status,
    headers: {
      'Content-Type': asset.contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

export const HEAD: APIRoute = async ({ params }) => {
  const reqPath = params.path || '';
  const asset = getAsset(reqPath);

  if (!asset) {
    return new Response(null, {
      status: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS'
      }
    });
  }

  return new Response(null, {
    status: 200,
    headers: {
      'Content-Type': asset.contentType,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*'
    }
  });
};

export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '1728000'
    }
  });
};
