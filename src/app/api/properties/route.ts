import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      where: { isDeleted: false },
      include: {
        breakdownItems: true,
        landlord: {
          select: {
            id: true,
            name: true,
            email: true,
            isVerified: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Parse JSON strings back to arrays
    const parsedProperties = properties.map(prop => ({
      ...prop,
      images: prop.images ? JSON.parse(prop.images) : [],
      amenities: prop.amenities ? JSON.parse(prop.amenities) : [],
      security: prop.security ? JSON.parse(prop.security) : [],
      parking: prop.parking ? JSON.parse(prop.parking) : [],
      outdoorSpace: prop.outdoorSpace ? JSON.parse(prop.outdoorSpace) : [],
      nearbyAmenities: prop.nearbyAmenities ? JSON.parse(prop.nearbyAmenities) : [],
      powerSupply: prop.powerSupply ? JSON.parse(prop.powerSupply) : [],
      waterSupply: prop.waterSupply ? JSON.parse(prop.waterSupply) : [],
    }));

    return NextResponse.json(parsedProperties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      propertyCode, title, description, price, location, type, bedrooms, bathrooms, 
      images, featured, available, amenities, security, parking, outdoorSpace, 
      petPolicy, furnishing, inspectionFee, whatsappEnabled, whatsappNumber, 
      landlordId, solicitorId, landmark, allowNegotiation, rentPeriod, address 
    } = body;

    const property = await prisma.property.create({
      data: {
        propertyCode,
        title,
        description,
        price,
        location,
        type,
        bedrooms,
        bathrooms,
        images: JSON.stringify(images || []),
        featured: featured || false,
        available: available ?? true,
        amenities: JSON.stringify(amenities || []),
        security: JSON.stringify(security || []),
        parking: JSON.stringify(parking || []),
        outdoorSpace: JSON.stringify(outdoorSpace || []),
        petPolicy,
        furnishing,
        inspectionFee: inspectionFee || 0,
        whatsappEnabled: whatsappEnabled ?? true,
        whatsappNumber,
        landlordId,
        solicitorId,
        landmark,
        allowNegotiation: allowNegotiation ?? true,
        rentPeriod: rentPeriod || 'year',
        address
      }
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
