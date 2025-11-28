/**
 * Script to delete a user by email
 * Usage: npx tsx scripts/delete-user.ts <email>
 */

import { prisma } from "../src/lib/prisma";

async function deleteUser(email: string) {
  try {
    console.log(`🔍 Looking for user with email: ${email}`);

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        accounts: true,
        sessions: true,
        orders: true,
        cartItems: true,
        wishlistItems: true,
        inquiries: true,
        donations: true,
        newsBriefs: true,
        photographyBookings: true,
      },
    });

    if (!user) {
      console.log(`❌ User with email ${email} not found.`);
      return;
    }

    console.log(`📋 Found user:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name || "N/A"}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log(`\n📊 Related data:`);
    console.log(`   Accounts: ${user.accounts.length}`);
    console.log(`   Sessions: ${user.sessions.length}`);
    console.log(`   Orders: ${user.orders.length}`);
    console.log(`   Cart Items: ${user.cartItems.length}`);
    console.log(`   Wishlist Items: ${user.wishlistItems.length}`);
    console.log(`   Inquiries: ${user.inquiries.length}`);
    console.log(`   Donations: ${user.donations.length}`);
    console.log(`   News Briefs: ${user.newsBriefs.length}`);
    console.log(`   Photography Bookings: ${user.photographyBookings.length}`);

    // Delete the user (cascade will handle related records)
    await prisma.user.delete({
      where: { email: email.toLowerCase().trim() },
    });

    console.log(`\n✅ User ${email} has been deleted successfully!`);
    console.log(`   All related data (accounts, sessions, orders, etc.) has been removed.`);
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide an email address");
  console.log("Usage: npx tsx scripts/delete-user.ts <email>");
  process.exit(1);
}

deleteUser(email);

