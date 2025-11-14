import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all venues
export async function GET() {
  try {
    const venues = await prisma.venue.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(venues);
  } catch (error) {
    console.error("Error fetching venues:", error);
    return NextResponse.json(
      { error: "Failed to fetch venues" },
      { status: 500 }
    );
  }
}

// POST - Create new venue
export async function POST(request: NextRequest) {
  try {
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
      amenities,
      isActive,
    } = body;

    if (!name || !slug || !city || !country || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const venue = await prisma.venue.create({
      data: {
        name,
        slug,
        description: description || "",
        location: location || city,
        city,
        country,
        address: address || "",
        capacity: capacity || `${minCapacity || 0}-${maxCapacity || 0} guests`,
        minCapacity: minCapacity ? parseInt(minCapacity) : 0,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : 0,
        price: parseFloat(price),
        currency: currency || "EUR",
        images: images ? JSON.stringify(images) : JSON.stringify([]),
        features: features ? JSON.stringify(features) : JSON.stringify([]),
        amenities: amenities || null,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(venue, { status: 201 });
  } catch (error: any) {
    console.error("Error creating venue:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Venue with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create venue" },
      { status: 500 }
    );
  }
}

