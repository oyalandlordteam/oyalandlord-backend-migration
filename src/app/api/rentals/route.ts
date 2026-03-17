import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    let where: any = {};
    if (userId && role) {
      if (role === 'tenant') where.tenantId = userId;
      if (role === 'landlord') where.landlordId = userId;
    }

    const rentals = await prisma.rental.findMany({
      where,
      include: {
        property: true,
        tenant: { select: { name: true, email: true } },
        landlord: { select: { name: true, email: true } },
        breakdownItems: true,
        paymentHistory: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(rentals);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      propertyId, landlordId, tenantId, type, startDate, endDate, 
      totalAmount, cautionFee, breakdownItems, receiptNumber 
    } = body;

    const rental = await prisma.rental.create({
      data: {
        propertyId,
        landlordId,
        tenantId,
        type,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalAmount,
        cautionFee,
        receiptNumber,
        status: 'pending_signature',
        breakdownItems: {
          create: breakdownItems?.map((item: any) => ({
            name: item.name,
            amount: item.amount,
          })),
        }
      }
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json({ error: 'Failed to create rental' }, { status: 500 });
  }
}
