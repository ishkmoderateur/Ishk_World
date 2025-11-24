import { prisma } from "../src/lib/prisma";

async function checkServices() {
  try {
    console.log("🔍 Checking services in database...\n");

    const photoServices = await prisma.photographyService.findMany({
      orderBy: { order: "asc" },
    });

    const partyServices = await prisma.partyService.findMany({
      orderBy: { order: "asc" },
    });

    console.log(`📸 Photography Services: ${photoServices.length}`);
    console.log("─".repeat(60));
    photoServices.forEach((s) => {
      console.log(`  ✓ ${s.name}`);
      console.log(`    Slug: ${s.slug}`);
      console.log(`    Price: €${s.price || "Contact for price"}`);
      console.log(`    Duration: ${s.duration}`);
      console.log(`    Active: ${s.isActive ? "✅ Yes" : "❌ No"}`);
      console.log(`    Featured: ${s.featured ? "⭐" : ""}`);
      console.log("");
    });

    console.log(`🎉 Party Services: ${partyServices.length}`);
    console.log("─".repeat(60));
    partyServices.forEach((s) => {
      console.log(`  ✓ ${s.name}`);
      console.log(`    Slug: ${s.slug}`);
      console.log(`    Price: €${s.price}`);
      console.log(`    Active: ${s.isActive ? "✅ Yes" : "❌ No"}`);
      console.log(`    Featured: ${s.featured ? "⭐" : ""}`);
      console.log("");
    });

    console.log(`\n✅ Total Services: ${photoServices.length + partyServices.length}`);
    console.log(`   - Photography: ${photoServices.length}`);
    console.log(`   - Party: ${partyServices.length}`);

  } catch (error) {
    console.error("❌ Error checking services:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServices();
