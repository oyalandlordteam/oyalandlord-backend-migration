import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// This is a special endpoint for global configuration/content that might not need a full table
// We'll use a simple JSON file or just handle it via environmental variables for now, 
// but for a "full backend" we should probably have a Setting table.
// However, looking at the stores, ContentManagement and SolicitorComments are needed.

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    // Return mock-like content if not found or implement a basic settings table
    // For now, let's just return a default structure
    return NextResponse.json({
      faq: [
        { id: '1', question: 'How do I book an inspection?', answer: 'Search for a property you like, click View Details, and use the Book Inspection button.' },
        { id: '2', question: 'Do I pay an agent fee?', answer: 'No! Oyalandlord connects you directly to verified landlords, so there are absolutely no agent fees.' }
      ],
      aboutUs: 'Oyalandlord is a platform that connects verified landlords directly with tenants, eliminating exorbitant agent fees.',
      termsAndConditions: 'By using OyaLandlord, you agree to our terms of service...',
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  // Placeholder for updating content
  return NextResponse.json({ success: true });
}
