import { prisma } from "../src/lib/prisma";

async function updateServicesActive() {
  try {
    console.log("🔄 Updating services to ensure they're all active...\n");

    // Update photography services
    const photoResult = await prisma.photographyService.updateMany({
      where: {
        isActive: false,
      },
      data: {
        isActive: true,
      },
    });
    console.log(`✅ Updated ${photoResult.count} photography services to active`);

    // Update party services
    const partyResult = await prisma.partyService.updateMany({
      where: {
        isActive: false,
      },
      data: {
        isActive: true,
      },
    });
    console.log(`✅ Updated ${partyResult.count} party services to active`);

    // Count active services
    const activePhoto = await prisma.photographyService.count({
      where: { isActive: true },
    });
    const activeParty = await prisma.partyService.count({
      where: { isActive: true },
    });

    console.log(`\n📊 Active Services:`);
    console.log(`   - Photography: ${activePhoto}`);
    console.log(`   - Party: ${activeParty}`);
    console.log(`\n🎉 All services are now active!`);

  } catch (error) {
    console.error("❌ Error updating services:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateServicesActive();







