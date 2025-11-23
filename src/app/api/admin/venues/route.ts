import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all venues
export async function GET() {
  try {
    // Require party admin access
    const session = await requireSectionAccess("party");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Party admin access required" },
        { status: 401 }
      );
    }
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
      comparePrice,
      currency,
      images,
      videos,
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

    // Validate images (min 1, max 10)
    if (!images || !Array.isArray(images) || images.length < 1) {
      return NextResponse.json(
        { error: "At least 1 image is required" },
        { status: 400 }
      );
    }
    if (images.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 images allowed" },
        { status: 400 }
      );
    }

    // Validate videos (max 2)
    if (videos && !Array.isArray(videos)) {
      return NextResponse.json(
        { error: "Videos must be an array" },
        { status: 400 }
      );
    }
    if (videos && videos.length > 2) {
      return NextResponse.json(
        { error: "Maximum 2 videos allowed" },
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
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        currency: currency || "EUR",
        images: images,
        videos: videos && videos.length > 0 ? videos : null,
        features: features || [],
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

