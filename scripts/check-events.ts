import { prisma } from "../src/lib/prisma";

async function checkEvents() {
  try {
    console.log("📅 Fetching all venue inquiries (events)...\n");

    const inquiries = await prisma.venueInquiry.findMany({
      include: {
        venue: {
          select: {
            name: true,
            location: true,
            city: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (inquiries.length === 0) {
      console.log("❌ No events found in the database.");
      return;
    }

    console.log(`✅ Found ${inquiries.length} event(s):\n`);
    console.log("=" .repeat(80));

    inquiries.forEach((inquiry, index) => {
      console.log(`\n📋 Event #${index + 1}`);
      console.log(`   ID: ${inquiry.id}`);
      console.log(`   Venue: ${inquiry.venue.name}`);
      console.log(`   Location: ${inquiry.venue.location}, ${inquiry.venue.city}`);
      console.log(`   Event Date: ${new Date(inquiry.eventDate).toLocaleDateString()} ${new Date(inquiry.eventDate).toLocaleTimeString()}`);
      console.log(`   Guest Count: ${inquiry.guestCount}`);
      console.log(`   Name: ${inquiry.name}`);
      console.log(`   Email: ${inquiry.email}`);
      console.log(`   Phone: ${inquiry.phone || "N/A"}`);
      console.log(`   Status: ${inquiry.status}`);
      console.log(`   Created: ${new Date(inquiry.createdAt).toLocaleDateString()} ${new Date(inquiry.createdAt).toLocaleTimeString()}`);
      if (inquiry.user) {
        console.log(`   User Account: ${inquiry.user.name || inquiry.user.email}`);
      } else {
        console.log(`   User Account: Guest (not logged in)`);
      }
      if (inquiry.message) {
        console.log(`   Message: ${inquiry.message.substring(0, 100)}${inquiry.message.length > 100 ? "..." : ""}`);
      }
      if (inquiry.respondedAt) {
        console.log(`   Responded At: ${new Date(inquiry.respondedAt).toLocaleDateString()} ${new Date(inquiry.respondedAt).toLocaleTimeString()}`);
      }
      console.log("-".repeat(80));
    });

    // Summary
    console.log("\n📊 Summary:");
    const statusCounts = inquiries.reduce((acc, inquiry) => {
      acc[inquiry.status] = (acc[inquiry.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });

  } catch (error) {
    console.error("❌ Error fetching events:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkEvents();











