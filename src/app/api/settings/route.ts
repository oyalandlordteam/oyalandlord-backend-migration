import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Return mock settings for now or fetch from a setting table
    return NextResponse.json({
      maintenanceMode: false,
      defaultInspectionFee: 5000,
      language: 'en',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const updates = await request.json();
    // Placeholder for updating settings persistently
    return NextResponse.json(updates);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
