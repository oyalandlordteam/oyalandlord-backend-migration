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

    const inspections = await prisma.inspectionRequest.findMany({
      where,
      include: {
        property: true,
        tenant: { select: { name: true, email: true } },
        landlord: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(inspections);
  } catch (error) {
    console.error('Error fetching inspections:', error);
    return NextResponse.json({ error: 'Failed to fetch inspections' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { propertyId, landlordId, tenantId, date, time, notes } = body;

    const inspection = await prisma.inspectionRequest.create({
      data: {
        propertyId,
        landlordId,
        tenantId,
        date,
        time,
        notes,
        status: 'pending',
      }
    });

    return NextResponse.json(inspection, { status: 201 });
  } catch (error) {
    console.error('Error creating inspection:', error);
    return NextResponse.json({ error: 'Failed to create inspection' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    const updateData: any = { status };
    if (status === 'approved') updateData.approvedAt = new Date();
    if (status === 'rejected') updateData.rejectedAt = new Date();

    const inspection = await prisma.inspectionRequest.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(inspection);
  } catch (error) {
    console.error('Error updating inspection:', error);
    return NextResponse.json({ error: 'Failed to update inspection' }, { status: 500 });
  }
}
