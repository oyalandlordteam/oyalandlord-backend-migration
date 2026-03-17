import { PrismaClient } from '@prisma/client';
import { 
  mockUsers, 
  mockProperties, 
  mockInspectionRequests, 
  mockRentalAgreements, 
  mockBids, 
  mockMessages, 
  mockNotifications, 
  mockAnnouncements, 
  mockReports, 
  mockFavorites 
} from '../src/lib/mock-data';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Users
  console.log('Users...');
  for (const user of mockUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        isActive: user.isActive,
        isVerified: user.isVerified,
        phone: user.phone,
        nin: user.nin,
        documentUrl: user.documentUrl,
        createdAt: new Date(user.createdAt),
      },
    });
  }

  // 2. Properties
  console.log('Properties...');
  for (const prop of mockProperties) {
    await prisma.property.upsert({
      where: { propertyCode: prop.propertyCode },
      update: {},
      create: {
        id: prop.id,
        propertyCode: prop.propertyCode,
        title: prop.title,
        description: prop.description,
        price: prop.price,
        location: prop.location,
        type: prop.type,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        images: JSON.stringify(prop.images),
        featured: prop.featured,
        available: prop.available,
        amenities: JSON.stringify(prop.amenities),
        security: JSON.stringify(prop.security || []),
        parking: JSON.stringify(prop.parking || []),
        outdoorSpace: JSON.stringify(prop.outdoorSpace || []),
        petPolicy: prop.petPolicy,
        furnishing: prop.furnishing,
        inspectionFee: prop.inspectionFee || 0,
        whatsappEnabled: prop.whatsappEnabled ?? true,
        whatsappNumber: prop.whatsappNumber,
        landmark: prop.landmark,
        allowNegotiation: prop.allowNegotiation ?? true,
        viewCount: prop.viewCount || 0,
        nearbyAmenities: JSON.stringify(prop.nearbyAmenities || []),
        powerSupply: JSON.stringify(prop.powerSupply || []),
        waterSupply: JSON.stringify(prop.waterSupply || []),
        rentPeriod: prop.rentPeriod || 'year',
        earliestMoveIn: prop.earliestMoveIn ? new Date(prop.earliestMoveIn) : null,
        address: prop.address,
        landlordId: prop.landlordId,
        solicitorId: prop.solicitorId,
        createdAt: new Date(prop.createdAt),
        updatedAt: new Date(prop.updatedAt),
        breakdownItems: {
          create: prop.breakdownItems.map(item => ({
            name: item.name,
            amount: item.amount,
          })),
        },
      },
    });
  }

  // 3. Inspection Requests
  console.log('Inspections...');
  for (const ins of mockInspectionRequests) {
    await prisma.inspectionRequest.upsert({
      where: { id: ins.id },
      update: {},
      create: {
        id: ins.id,
        status: ins.status,
        date: ins.date,
        time: ins.time,
        notes: ins.notes,
        createdAt: new Date(ins.createdAt),
        requestedAt: ins.requestedAt ? new Date(ins.requestedAt) : new Date(ins.createdAt),
        approvedAt: ins.approvedAt ? new Date(ins.approvedAt) : null,
        rejectedAt: ins.rejectedAt ? new Date(ins.rejectedAt) : null,
        propertyId: ins.propertyId,
        landlordId: ins.landlordId,
        tenantId: ins.tenantId,
      },
    });
  }

  // 4. Bids
  console.log('Bids...');
  for (const bid of mockBids) {
    await prisma.bid.upsert({
      where: { id: bid.id },
      update: {},
      create: {
        id: bid.id,
        amount: bid.amount,
        message: bid.message,
        status: bid.status,
        createdAt: new Date(bid.createdAt),
        propertyId: bid.propertyId,
        tenantId: bid.tenantId,
      },
    });
  }

  // 5. Rentals
  console.log('Rentals...');
  for (const rental of mockRentalAgreements) {
    await prisma.rental.upsert({
      where: { id: rental.id },
      update: {},
      create: {
        id: rental.id,
        type: rental.type,
        startDate: new Date(rental.startDate),
        endDate: new Date(rental.endDate),
        totalAmount: rental.totalAmount,
        cautionFee: rental.cautionFee,
        status: rental.status,
        receiptNumber: rental.receiptNumber,
        agreementUrl: rental.agreementUrl,
        renewedFrom: rental.renewedFrom,
        renewedAt: rental.renewedAt ? new Date(rental.renewedAt) : null,
        createdAt: new Date(rental.createdAt),
        propertyId: rental.propertyId,
        landlordId: rental.landlordId,
        tenantId: rental.tenantId,
        breakdownItems: {
          create: rental.breakdownItems.map(item => ({
            name: item.name,
            amount: item.amount,
          })),
        },
      },
    });
  }

  // 6. Messages
  console.log('Messages...');
  for (const msg of mockMessages) {
    await prisma.message.upsert({
      where: { id: msg.id },
      update: {},
      create: {
        id: msg.id,
        content: msg.content,
        isRead: msg.isRead,
        createdAt: new Date(msg.createdAt),
        propertyId: msg.propertyId,
        senderId: msg.senderId,
        recipientId: msg.recipientId,
      },
    });
  }

  // 7. Notifications
  console.log('Notifications...');
  for (const notif of mockNotifications) {
    await prisma.notification.upsert({
      where: { id: notif.id },
      update: {},
      create: {
        id: notif.id,
        title: notif.title,
        message: notif.message,
        type: notif.type,
        read: notif.read,
        actionUrl: notif.actionUrl,
        createdAt: new Date(notif.createdAt),
        userId: notif.userId,
      },
    });
  }

  // 8. Announcements
  console.log('Announcements...');
  for (const ann of mockAnnouncements) {
    await prisma.announcement.upsert({
      where: { id: ann.id },
      update: {},
      create: {
        id: ann.id,
        title: ann.title,
        message: ann.message,
        isActive: ann.isActive,
        createdAt: new Date(ann.createdAt),
      },
    });
  }

  // 9. Reports
  console.log('Reports...');
  for (const report of mockReports) {
    await prisma.propertyReport.upsert({
      where: { id: report.id },
      update: {},
      create: {
        id: report.id,
        reason: report.reason,
        description: report.description,
        status: report.status,
        createdAt: new Date(report.createdAt),
        propertyId: report.propertyId,
        reporterId: report.reporterId,
      },
    });
  }

  // 10. Favorites
  console.log('Favorites...');
  for (const fav of mockFavorites) {
    await prisma.favorite.upsert({
      where: { id: fav.id },
      update: {},
      create: {
        id: fav.id,
        userId: fav.userId,
        propertyId: fav.propertyId,
        createdAt: new Date(fav.createdAt),
      },
    });
  }

  console.log('✅ Seeding finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
