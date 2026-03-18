import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { level = 'ERROR', message, meta } = body;
    
    if (level === 'ERROR') logger.error(message, meta);
    else if (level === 'WARN') logger.warn(message, meta);
    else if (level === 'INFO') logger.info(message, meta);
    else logger.debug(message, meta);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to log' }, { status: 500 });
  }
}
