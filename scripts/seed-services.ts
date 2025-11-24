import { prisma } from "../src/lib/prisma";

async function seedServices() {
  try {
    console.log("🌱 Seeding database with party and photography services...\n");

    // Party Services
    const partyServices = [
      {
        name: "DJ Services",
        slug: "dj-services",
        description: "Professional DJ services for your event with high-quality sound equipment, music selection, and MC services. Perfect for weddings, parties, and corporate events.",
        price: 500,
        currency: "EUR",
        features: JSON.stringify([
          "Professional DJ Equipment",
          "Music Library (All Genres)",
          "MC Services",
          "Sound System Setup",
          "Lighting Effects",
          "4-6 Hours Service",
        ]),
        image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800",
        featured: true,
        isActive: true,
        order: 1,
      },
      {
        name: "Lighting & Effects",
        slug: "lighting-effects",
        description: "Professional lighting and special effects to transform your venue. Includes LED lights, spotlights, color-changing effects, and atmospheric lighting.",
        price: 300,
        currency: "EUR",
        features: JSON.stringify([
          "LED Lighting Setup",
          "Color-Changing Effects",
          "Spotlights & Stage Lighting",
          "Atmospheric Lighting",
          "DMX Control System",
          "Professional Setup & Breakdown",
        ]),
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
        featured: true,
        isActive: true,
        order: 2,
      },
      {
        name: "Clown Entertainment",
        slug: "clown-entertainment",
        description: "Fun and interactive clown entertainment perfect for children's parties, birthdays, and family events. Includes magic tricks, balloon animals, face painting, and games.",
        price: 200,
        currency: "EUR",
        features: JSON.stringify([
          "Magic Tricks & Illusions",
          "Balloon Animals",
          "Face Painting",
          "Interactive Games",
          "Photo Opportunities",
          "2-3 Hours Service",
        ]),
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
        featured: true,
        isActive: true,
        order: 3,
      },
      {
        name: "Complete Party Package",
        slug: "complete-party-package",
        description: "All-inclusive party package including DJ, lighting, and entertainment. Perfect for large celebrations and special events.",
        price: 800,
        currency: "EUR",
        features: JSON.stringify([
          "DJ Services Included",
          "Full Lighting Setup",
          "Entertainment Options",
          "Sound System",
          "Professional Coordination",
          "8+ Hours Service",
        ]),
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800",
        featured: true,
        isActive: true,
        order: 0,
      },
    ];

    console.log("🎉 Creating party services...");
    let partyCreated = 0;
    for (const serviceData of partyServices) {
      try {
        const existing = await prisma.partyService.findUnique({
          where: { slug: serviceData.slug },
        });

        if (existing) {
          console.log(`   ⚠️  Party service "${serviceData.name}" already exists, skipping...`);
        } else {
          await prisma.partyService.create({
            data: serviceData,
          });
          console.log(`   ✅ Created: ${serviceData.name} (€${serviceData.price})`);
          partyCreated++;
        }
      } catch (error: any) {
        console.log(`   ❌ Error creating "${serviceData.name}": ${error.message}`);
      }
    }

    // Photography Services
    const photographyServices = [
      {
        name: "Portrait Photography",
        slug: "portrait-photography",
        description: "Professional portrait sessions for individuals, couples, and families. Includes location scouting, professional editing, and high-resolution digital images.",
        duration: "2 hours",
        price: 300,
        comparePrice: 400,
        features: JSON.stringify([
          "2 Hour Session",
          "Location Scouting",
          "Professional Editing",
          "20+ High-Resolution Images",
          "Online Gallery",
          "Print Release",
        ]),
        image: "https://images.unsplash.com/photo-1493863641943-9b67192f5a3f?w=800",
        featured: true,
        isActive: true,
        order: 1,
      },
      {
        name: "Event Photography",
        slug: "event-photography",
        description: "Comprehensive event coverage for parties, corporate events, and celebrations. Captures all the important moments with professional equipment and editing.",
        duration: "4 hours",
        price: 600,
        comparePrice: 800,
        features: JSON.stringify([
          "4 Hour Coverage",
          "Multiple Photographers Available",
          "Candid & Posed Shots",
          "Professional Editing",
          "100+ High-Resolution Images",
          "Online Gallery",
          "Quick Turnaround",
        ]),
        image: "https://images.unsplash.com/photo-1493863641943-9b67192f5a3f?w=800",
        featured: true,
        isActive: true,
        order: 2,
      },
      {
        name: "Wedding Photography",
        slug: "wedding-photography",
        description: "Complete wedding photography package covering ceremony, reception, and all special moments. Includes engagement session, full-day coverage, and beautifully edited album.",
        duration: "Full day",
        price: 1500,
        comparePrice: 2000,
        features: JSON.stringify([
          "Full Day Coverage (8+ hours)",
          "Engagement Session Included",
          "Second Photographer Available",
          "Professional Editing",
          "200+ High-Resolution Images",
          "Online Gallery",
          "Print Release",
          "Photo Album Option",
        ]),
        image: "https://images.unsplash.com/photo-1493863641943-9b67192f5a3f?w=800",
        featured: true,
        isActive: true,
        order: 0,
      },
      {
        name: "Commercial Photography",
        slug: "commercial-photography",
        description: "Professional commercial photography for businesses, products, and marketing materials. Includes product shots, lifestyle photography, and brand imagery.",
        duration: "Half day",
        price: 800,
        comparePrice: 1000,
        features: JSON.stringify([
          "Half Day Session (4 hours)",
          "Product Photography",
          "Lifestyle Shots",
          "Professional Editing",
          "Multiple Image Formats",
          "Commercial License",
          "Quick Delivery",
        ]),
        image: "https://images.unsplash.com/photo-1493863641943-9b67192f5a3f?w=800",
        featured: true,
        isActive: true,
        order: 3,
      },
      {
        name: "Social Media Photography",
        slug: "social-media-photography",
        description: "Specialized photography for social media content. Perfect for influencers, brands, and businesses looking to enhance their online presence.",
        duration: "2 hours",
        price: 250,
        features: JSON.stringify([
          "2 Hour Session",
          "Multiple Outfit Changes",
          "Instagram-Ready Images",
          "Basic Editing Included",
          "15+ High-Resolution Images",
          "Social Media Optimization",
          "Quick Turnaround (24-48h)",
        ]),
        image: "https://images.unsplash.com/photo-1493863641943-9b67192f5a3f?w=800",
        featured: false,
        isActive: true,
        order: 4,
      },
    ];

    console.log("\n📸 Creating photography services...");
    let photoCreated = 0;
    for (const serviceData of photographyServices) {
      try {
        const existing = await prisma.photographyService.findUnique({
          where: { slug: serviceData.slug },
        });

        if (existing) {
          console.log(`   ⚠️  Photography service "${serviceData.name}" already exists, skipping...`);
        } else {
          await prisma.photographyService.create({
            data: serviceData,
          });
          console.log(`   ✅ Created: ${serviceData.name} (${serviceData.duration}, €${serviceData.price})`);
          photoCreated++;
        }
      } catch (error: any) {
        console.log(`   ❌ Error creating "${serviceData.name}": ${error.message}`);
      }
    }

    console.log(`\n✅ Seeding complete!`);
    console.log(`   - Party Services: ${partyCreated}`);
    console.log(`   - Photography Services: ${photoCreated}`);
    console.log(`\n🎉 All services created successfully!`);

  } catch (error) {
    console.error("❌ Error seeding services:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedServices();

