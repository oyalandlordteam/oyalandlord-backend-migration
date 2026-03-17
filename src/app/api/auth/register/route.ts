import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ success: false, message: 'Email already registered' }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real app, this MUST be hashed!
        role,
        isActive: true,
        isVerified: role === 'admin',
      }
    });

    // Omit password from response
    const { password: _, ...safeUser } = user;

    return NextResponse.json({ success: true, user: safeUser });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
