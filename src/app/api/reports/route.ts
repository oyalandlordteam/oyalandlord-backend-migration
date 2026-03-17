import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const reports = await prisma.propertyReport.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const report = await prisma.propertyReport.create({
      data: {
        propertyId: data.propertyId,
        reporterId: data.reporterId || data.userId, // Support both naming variants if needed
        reason: data.reason,
        details: data.details,
        status: 'pending',
      },
    });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    const report = await prisma.propertyReport.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 });
  }
}
