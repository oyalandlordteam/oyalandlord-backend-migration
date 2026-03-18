import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {
    const contents = await prisma.systemContent.findMany();
    
    // Convert array of {key, content} to a single object
    const contentMap = contents.reduce((acc: any, curr) => {
      try {
        acc[curr.key] = JSON.parse(curr.content);
      } catch (e) {
        acc[curr.key] = curr.content;
      }
      return acc;
    }, {});

    // Provide defaults if database is empty
    const defaultContent = {
      faq: [
        { id: '1', question: 'How do I book an inspection?', answer: 'Search for a property you like, click View Details, and use the Book Inspection button.' },
        { id: '2', question: 'Do I pay an agent fee?', answer: 'No! Oyalandlord connects you directly to verified landlords, so there are absolutely no agent fees.' }
      ],
      aboutUs: 'Oyalandlord is a platform that connects verified landlords directly with tenants, eliminating exorbitant agent fees.',
      termsAndConditions: 'By using OyaLandlord, you agree to our terms of service...',
    };

    const finalContent = {
      faq: contentMap.faq || defaultContent.faq,
      aboutUs: contentMap.aboutUs || defaultContent.aboutUs,
      termsAndConditions: contentMap.termsAndConditions || defaultContent.termsAndConditions,
    };

    if (type && finalContent[type as keyof typeof finalContent]) {
      return NextResponse.json(finalContent[type as keyof typeof finalContent]);
    }

    return NextResponse.json(finalContent);
  } catch (error) {
    console.error('Failed to fetch content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, content } = body;

    if (!key || content === undefined) {
      return NextResponse.json({ error: 'Missing key or content' }, { status: 400 });
    }

    // Stringify content if it's an object/array
    const contentString = typeof content === 'string' ? content : JSON.stringify(content);

    const updated = await prisma.systemContent.upsert({
      where: { key },
      update: { content: contentString },
      create: { key, content: contentString },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Failed to update content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
