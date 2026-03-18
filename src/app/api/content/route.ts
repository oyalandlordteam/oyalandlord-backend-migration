import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contents = await prisma.systemContent.findMany();
    
    // Transform into a key-value object
    const result: Record<string, any> = {};
    contents.forEach(item => {
      try {
        result[item.key] = JSON.parse(item.content);
      } catch {
        result[item.key] = item.content;
      }
    });

    // Provide defaults if nothing is in DB
    if (!result.faq) {
      result.faq = [
        { id: '1', question: 'How do I book an inspection?', answer: 'Search for a property you like, click View Details, and use the Book Inspection button.' },
        { id: '2', question: 'Do I pay an agent fee?', answer: 'No! Oyalandlord connects you directly to verified landlords, so there are absolutely no agent fees.' }
      ];
    }
    if (!result.aboutUs) {
      result.aboutUs = 'Oyalandlord is a platform that connects verified landlords directly with tenants, eliminating exorbitant agent fees.';
    }
    if (!result.terms) {
      result.terms = 'By using Oyalandlord, you agree to our terms of direct landlord-tenant connection...';
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Content GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { key, content } = await request.json();

    if (!key || content === undefined) {
      return NextResponse.json({ error: 'Key and content are required' }, { status: 400 });
    }

    // Upsert the content
    const updated = await prisma.systemContent.upsert({
      where: { key },
      update: { 
        content: typeof content === 'string' ? content : JSON.stringify(content) 
      },
      create: { 
        key, 
        content: typeof content === 'string' ? content : JSON.stringify(content) 
      },
    });

    return NextResponse.json({ success: true, updated });
  } catch (error) {
    console.error('Content POST Error:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
