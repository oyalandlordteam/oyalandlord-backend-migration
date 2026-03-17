import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let where: any = {};
    if (userId) {
      where.tenantId = userId;
    }

    const bids = await prisma.bid.findMany({
      where,
      include: {
        property: true,
        tenant: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(bids);
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, tenantId, amount, message } = body;

    const bid = await prisma.bid.create({
      data: {
        propertyId,
        tenantId,
        amount,
        message,
        status: 'pending',
      }
    });

    return NextResponse.json(bid, { status: 201 });
  } catch (error) {
    console.error('Error creating bid:', error);
    return NextResponse.json({ error: 'Failed to create bid' }, { status: 500 });
  }
}
