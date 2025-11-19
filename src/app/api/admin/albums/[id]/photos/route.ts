import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    const { id: albumId } = await params;
    const { photoId, orientation, description, order } = await request.json();

    if (!photoId) {
      return NextResponse.json(
        { error: "Photo ID is required" },
        { status: 400 }
      );
    }

    // Check if album exists
    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        photos: true,
      },
    });

    if (!album) {
      return NextResponse.json(
        { error: "Album not found" },
        { status: 404 }
      );
    }

    // Check if album already has 10 photos
    if (album.photos.length >= 10) {
      return NextResponse.json(
        { error: "Album can only contain a maximum of 10 photos" },
        { status: 400 }
      );
    }

    // Check if photo is already in album
    const existing = album.photos.find((p) => p.photoId === photoId);
    if (existing) {
      return NextResponse.json(
        { error: "Photo is already in this album" },
        { status: 400 }
      );
    }

    const albumPhoto = await prisma.albumPhoto.create({
      data: {
        albumId,
        photoId,
        orientation: orientation || "horizontal",
        description: description || null,
        order: order || album.photos.length,
      },
      include: {
        photo: true,
      },
    });

    return NextResponse.json(albumPhoto, { status: 201 });
  } catch (error) {
    console.error("Error adding photo to album:", error);
    return NextResponse.json(
      { error: "Failed to add photo to album" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    const { id: albumId } = await params;
    const { albumPhotoId, orientation, description, order } = await request.json();

    if (!albumPhotoId) {
      return NextResponse.json(
        { error: "Album photo ID is required" },
        { status: 400 }
      );
    }

    const albumPhoto = await prisma.albumPhoto.update({
      where: { id: albumPhotoId },
      data: {
        orientation: orientation || "horizontal",
        description: description || null,
        order: order !== undefined ? order : undefined,
      },
      include: {
        photo: true,
      },
    });

    return NextResponse.json(albumPhoto);
  } catch (error) {
    console.error("Error updating album photo:", error);
    return NextResponse.json(
      { error: "Failed to update album photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const albumPhotoId = searchParams.get("albumPhotoId");

    if (!albumPhotoId) {
      return NextResponse.json(
        { error: "Album photo ID is required" },
        { status: 400 }
      );
    }

    await prisma.albumPhoto.delete({
      where: { id: albumPhotoId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing photo from album:", error);
    return NextResponse.json(
      { error: "Failed to remove photo from album" },
      { status: 500 }
    );
  }
}

