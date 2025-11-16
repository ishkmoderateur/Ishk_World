import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require party admin access
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const {
      name,
      slug,
      description,
      location,
      city,
      country,
      address,
      capacity,
      minCapacity,
      maxCapacity,
      price,
      currency,
      images,
      features,
      isActive,
    } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (description !== undefined) updateData.description = description;
    if (location) updateData.location = location;
    if (city) updateData.city = city;
    if (country) updateData.country = country;
    if (address) updateData.address = address;
    if (capacity) updateData.capacity = capacity;
    if (minCapacity !== undefined) updateData.minCapacity = parseInt(minCapacity);
    if (maxCapacity !== undefined) updateData.maxCapacity = parseInt(maxCapacity);
    if (price !== undefined) updateData.price = parseFloat(price);
    if (currency) updateData.currency = currency;
    if (images !== undefined) updateData.images = images;
    if (features !== undefined) updateData.features = features;
    if (isActive !== undefined) updateData.isActive = isActive;

    const venue = await prisma.venue.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(venue);
  } catch (error: any) {
    console.error("Error updating venue:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update venue" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Require party admin access
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }
    await prisma.venue.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting venue:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Venue not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete venue" },
      { status: 500 }
    );
  }
}

