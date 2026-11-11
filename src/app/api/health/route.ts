import { NextResponse } from 'next/server';
import { isDbConfigured } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const mem = process.memoryUsage();
  return NextResponse.json(
    {
      status: 'healthy',
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: isDbConfigured ? 'configured' : 'offline_contingency',
      memory: {
        rssMB: Math.round(mem.rss / 1024 / 1024),
        heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      },
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Server-Health': 'OK',
      },
    }
  );
}

export async function HEAD() {
  return new Response(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Server-Health': 'OK',
    },
  });
}
