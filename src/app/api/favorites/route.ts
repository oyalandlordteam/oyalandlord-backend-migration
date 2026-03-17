import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  try {
    const favorites = await prisma.favorite.findMany({
      where: userId ? { userId } : {},
    });
    return NextResponse.json(favorites);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, propertyId } = await request.json();
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        propertyId,
      },
    });
    return NextResponse.json(favorite);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create favorite' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const propertyId = searchParams.get('propertyId');

  if (!userId || !propertyId) {
    return NextResponse.json({ error: 'Missing userId or propertyId' }, { status: 400 });
  }

  try {
    await prisma.favorite.deleteMany({
      where: {
        userId,
        propertyId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 });
  }
}
