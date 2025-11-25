import { prisma } from "../src/lib/prisma";

async function seedEvents() {
  try {
    console.log("🌱 Seeding database with venues and events...\n");

    // Create sample venues
    const venues = [
      {
        name: "Garden Terrace Venue",
        slug: "garden-terrace-venue",
        description: "A beautiful outdoor venue with a spacious garden and elegant terrace, perfect for intimate gatherings and celebrations.",
        location: "Downtown",
        city: "Paris",
        country: "France",
        address: "123 Champs-Élysées, 75008 Paris",
        capacity: "30-50 guests",
        minCapacity: 30,
        maxCapacity: 50,
        price: 1500,
        comparePrice: 2000,
        currency: "EUR",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
        ]),
        features: JSON.stringify(["Garden", "Terrace", "Parking", "Catering", "Sound System"]),
        isActive: true,
      },
      {
        name: "Grand Ballroom",
        slug: "grand-ballroom",
        description: "An elegant ballroom with high ceilings and crystal chandeliers, ideal for large celebrations and formal events.",
        location: "City Center",
        city: "London",
        country: "United Kingdom",
        address: "456 Oxford Street, London W1C 1JN",
        capacity: "100-200 guests",
        minCapacity: 100,
        maxCapacity: 200,
        price: 3500,
        comparePrice: 4500,
        currency: "EUR",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
        ]),
        features: JSON.stringify(["Ballroom", "Stage", "Dance Floor", "Bar", "VIP Area"]),
        isActive: true,
      },
      {
        name: "Beachside Villa",
        slug: "beachside-villa",
        description: "A stunning beachfront villa with panoramic ocean views, perfect for destination weddings and special occasions.",
        location: "Coastal",
        city: "Barcelona",
        country: "Spain",
        address: "789 Beach Road, 08003 Barcelona",
        capacity: "50-80 guests",
        minCapacity: 50,
        maxCapacity: 80,
        price: 5000,
        comparePrice: 6000,
        currency: "EUR",
        images: JSON.stringify([
          "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800",
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800",
        ]),
        features: JSON.stringify(["Beach Access", "Pool", "Ocean View", "Outdoor Dining", "Parking"]),
        isActive: true,
      },
    ];

    console.log("📝 Creating venues...");
    const createdVenues = [];
    for (const venueData of venues) {
      // Check if venue already exists
      const existing = await prisma.venue.findUnique({
        where: { slug: venueData.slug },
      });

      if (existing) {
        console.log(`   ⚠️  Venue "${venueData.name}" already exists, skipping...`);
        createdVenues.push(existing);
      } else {
        const venue = await prisma.venue.create({
          data: venueData,
        });
        console.log(`   ✅ Created venue: ${venue.name}`);
        createdVenues.push(venue);
      }
    }

    // Get or create a test user (or use null for guest inquiries)
    let testUser = await prisma.user.findFirst({
      where: { email: "ali@allal.com" },
    });

    if (!testUser) {
      // Try to find any user
      testUser = await prisma.user.findFirst();
    }

    // Create sample event inquiries
    const inquiries = [
      {
        venueId: createdVenues[0].id,
        userId: testUser?.id || null,
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+33 6 12 34 56 78",
        eventDate: new Date("2024-12-25T18:00:00Z"),
        guestCount: 40,
        message: "Looking for a venue for our Christmas celebration. Would love to have outdoor space for the kids.",
        status: "NEW" as const,
      },
      {
        venueId: createdVenues[1].id,
        userId: testUser?.id || null,
        name: "Sarah Johnson",
        email: "sarah.johnson@example.com",
        phone: "+44 20 7946 0958",
        eventDate: new Date("2025-01-15T19:00:00Z"),
        guestCount: 150,
        message: "Planning a corporate gala event. Need a formal venue with stage and sound system.",
        status: "CONTACTED" as const,
        respondedAt: new Date("2024-11-20T10:00:00Z"),
      },
      {
        venueId: createdVenues[2].id,
        userId: testUser?.id || null,
        name: "Michael Brown",
        email: "michael.brown@example.com",
        phone: "+34 93 123 45 67",
        eventDate: new Date("2025-02-14T17:00:00Z"),
        guestCount: 60,
        message: "Wedding celebration. Would love the beachside location for our special day!",
        status: "QUOTED" as const,
        respondedAt: new Date("2024-11-18T14:30:00Z"),
      },
      {
        venueId: createdVenues[0].id,
        userId: testUser?.id || null,
        name: "Emma Wilson",
        email: "emma.wilson@example.com",
        phone: "+33 6 98 76 54 32",
        eventDate: new Date("2025-03-20T19:30:00Z"),
        guestCount: 35,
        message: "Birthday party for my 30th. Looking for something intimate and elegant.",
        status: "BOOKED" as const,
        respondedAt: new Date("2024-11-15T09:00:00Z"),
      },
      {
        venueId: createdVenues[1].id,
        userId: null, // Guest inquiry
        name: "David Lee",
        email: "david.lee@example.com",
        phone: "+44 20 7946 1234",
        eventDate: new Date("2025-04-10T18:00:00Z"),
        guestCount: 120,
        message: "Company anniversary celebration. Need a large space for networking.",
        status: "NEW" as const,
      },
    ];

    console.log("\n📅 Creating event inquiries...");
    let createdCount = 0;
    for (const inquiryData of inquiries) {
      try {
        const inquiry = await prisma.venueInquiry.create({
          data: inquiryData,
        });
        console.log(`   ✅ Created inquiry: ${inquiry.name} - ${new Date(inquiry.eventDate).toLocaleDateString()} (${inquiry.guestCount} guests)`);
        createdCount++;
      } catch (error: any) {
        if (error.code === "P2002") {
          console.log(`   ⚠️  Inquiry already exists, skipping...`);
        } else {
          console.log(`   ❌ Error creating inquiry: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   - Venues: ${createdVenues.length}`);
    console.log(`   - Event Inquiries: ${createdCount}`);
    console.log(`\n🎉 Database seeded successfully!`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents();







