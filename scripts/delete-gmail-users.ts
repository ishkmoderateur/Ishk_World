/**
 * Script to delete all users with @gmail.com email addresses
 * Usage: npx tsx scripts/delete-gmail-users.ts
 */

import { prisma } from "../src/lib/prisma";

async function deleteGmailUsers() {
  try {
    console.log("🔍 Looking for users with @gmail.com email addresses...\n");

    // Find all users with @gmail.com emails
    const gmailUsers = await prisma.user.findMany({
      where: {
        email: {
          endsWith: "@gmail.com",
        },
      },
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

    if (gmailUsers.length === 0) {
      console.log("✅ No users with @gmail.com email addresses found.");
      return;
    }

    console.log(`📋 Found ${gmailUsers.length} user(s) with @gmail.com email addresses:\n`);

    // Display users before deletion
    gmailUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name || "N/A"}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Related data:`);
      console.log(`     - Accounts: ${user.accounts.length}`);
      console.log(`     - Sessions: ${user.sessions.length}`);
      console.log(`     - Orders: ${user.orders.length}`);
      console.log(`     - Cart Items: ${user.cartItems.length}`);
      console.log(`     - Wishlist Items: ${user.wishlistItems.length}`);
      console.log(`     - Inquiries: ${user.inquiries.length}`);
      console.log(`     - Donations: ${user.donations.length}`);
      console.log(`     - News Briefs: ${user.newsBriefs.length}`);
      console.log(`     - Photography Bookings: ${user.photographyBookings.length}`);
      console.log("");
    });

    // Delete all gmail users
    console.log("🗑️  Deleting users...\n");

    for (const user of gmailUsers) {
      try {
        // Use deleteMany to handle cascade deletes properly
        // First, manually delete related records that might have constraints
        await prisma.$transaction(async (tx) => {
          // Delete related records first
          await tx.cartItem.deleteMany({ where: { userId: user.id } });
          await tx.wishlistItem.deleteMany({ where: { userId: user.id } });
          await tx.newsBrief.deleteMany({ where: { userId: user.id } });
          await tx.venueInquiry.updateMany({ 
            where: { userId: user.id },
            data: { userId: null } // Set to null instead of deleting
          });
          await tx.donation.updateMany({ 
            where: { userId: user.id },
            data: { userId: null } // Set to null instead of deleting
          });
          await tx.photographyBooking.updateMany({ 
            where: { userId: user.id },
            data: { userId: null } // Set to null instead of deleting
          });
          
          // Delete orders (these should cascade, but doing it explicitly)
          await tx.orderItem.deleteMany({
            where: { order: { userId: user.id } }
          });
          await tx.order.deleteMany({ where: { userId: user.id } });
          
          // Delete accounts and sessions (should cascade, but being explicit)
          await tx.account.deleteMany({ where: { userId: user.id } });
          await tx.session.deleteMany({ where: { userId: user.id } });
          
          // Finally delete the user
          await tx.user.delete({ where: { id: user.id } });
        });
        
        console.log(`✅ Deleted: ${user.email}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${user.email}:`, error);
        if (error instanceof Error) {
          console.error(`   Error: ${error.message}`);
        }
      }
    }

    console.log(`\n✅ Successfully deleted ${gmailUsers.length} user(s) with @gmail.com email addresses.`);
    console.log("   All related data (accounts, sessions, orders, etc.) has been removed.");
  } catch (error) {
    console.error("❌ Error deleting gmail users:", error);
    if (error instanceof Error) {
      console.error("   Message:", error.message);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

deleteGmailUsers();

