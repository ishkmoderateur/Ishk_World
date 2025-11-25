import { prisma } from "../src/lib/prisma";

async function testAPI() {
  try {
    console.log("🧪 Testing Photography Services API...\n");

    const services = await prisma.photographyService.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { featured: "desc" },
        { order: "asc" },
        { createdAt: "desc" },
      ],
    });

    console.log(`✅ Found ${services.length} services\n`);

    services.forEach((service, index) => {
      console.log(`${index + 1}. ${service.name}`);
      console.log(`   ID: ${service.id}`);
      console.log(`   Slug: ${service.slug}`);
      console.log(`   Price: €${service.price || "N/A"}`);
      console.log(`   Duration: ${service.duration}`);
      console.log(`   Active: ${service.isActive}`);
      console.log(`   Featured: ${service.featured}`);
      console.log(`   Features type: ${typeof service.features}`);
      console.log(`   Features:`, service.features);
      console.log("");
    });

    // Test JSON serialization (like API would do)
    const jsonString = JSON.stringify(services);
    console.log(`\n📦 JSON size: ${jsonString.length} bytes`);
    console.log(`📦 First service JSON:`, JSON.stringify(services[0], null, 2));

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();







