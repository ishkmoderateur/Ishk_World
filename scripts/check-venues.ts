import { prisma } from "../src/lib/prisma";

async function checkVenues() {
  try {
    console.log("🏢 Fetching all venues...\n");

    const venues = await prisma.venue.findMany({
      include: {
        inquiries: {
          select: {
            id: true,
            name: true,
            email: true,
            eventDate: true,
            guestCount: true,
            status: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (venues.length === 0) {
      console.log("❌ No venues found in the database.");
      return;
    }

    console.log(`✅ Found ${venues.length} venue(s):\n`);
    console.log("=".repeat(80));

    venues.forEach((venue, index) => {
      console.log(`\n🏢 Venue #${index + 1}`);
      console.log(`   ID: ${venue.id}`);
      console.log(`   Name: ${venue.name}`);
      console.log(`   Slug: ${venue.slug}`);
      console.log(`   Location: ${venue.location}, ${venue.city}, ${venue.country}`);
      console.log(`   Capacity: ${venue.capacity} (${venue.minCapacity}-${venue.maxCapacity} guests)`);
      console.log(`   Price: €${venue.price} ${venue.currency}`);
      console.log(`   Active: ${venue.isActive ? "Yes" : "No"}`);
      console.log(`   Created: ${new Date(venue.createdAt).toLocaleDateString()}`);
      console.log(`   Inquiries/Events: ${venue.inquiries.length}`);
      
      if (venue.inquiries.length > 0) {
        console.log(`\n   📅 Events for this venue:`);
        venue.inquiries.forEach((inquiry, idx) => {
          console.log(`      ${idx + 1}. ${inquiry.name} (${inquiry.email})`);
          console.log(`         Event Date: ${new Date(inquiry.eventDate).toLocaleDateString()}`);
          console.log(`         Guests: ${inquiry.guestCount}`);
          console.log(`         Status: ${inquiry.status}`);
          console.log(`         Created: ${new Date(inquiry.createdAt).toLocaleDateString()}`);
        });
      }
      console.log("-".repeat(80));
    });

    // Total inquiries count
    const totalInquiries = venues.reduce((sum, venue) => sum + venue.inquiries.length, 0);
    console.log(`\n📊 Total Events/Inquiries across all venues: ${totalInquiries}`);

  } catch (error) {
    console.error("❌ Error fetching venues:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkVenues();











