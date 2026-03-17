import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Note: I'll use Message model or create a new SolicitorComment model if needed.
// Based on the schema, I don't have a dedicated SolicitorComment model, 
// so I'll check the schema again or use a variant of Message.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const inspectionId = searchParams.get('inspectionId');

  try {
    const comments = await prisma.solicitorComment.findMany({
      where: {
        inspectionId: inspectionId || undefined,
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { inspectionId, solicitorId, comment } = await request.json();
    const newComment = await prisma.solicitorComment.create({
      data: {
        inspectionId,
        solicitorId,
        comment,
      },
    });
    return NextResponse.json(newComment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
