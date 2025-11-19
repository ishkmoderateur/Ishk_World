import { NextRequest, NextResponse } from "next/server";
import { requireSectionAccess } from "@/lib/auth-server";

export async function POST(request: NextRequest) {
  try {
    const session = await requireSectionAccess("photography");
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Photography admin access required" },
        { status: 401 }
      );
    }

    const { profileUrl, albumTitle } = await request.json();

    if (!profileUrl || !profileUrl.includes("instagram.com")) {
      return NextResponse.json(
        { error: "Invalid Instagram URL" },
        { status: 400 }
      );
    }

    // Fetch the Instagram profile page
    const response = await fetch(profileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Instagram profile" },
        { status: 500 }
      );
    }

    const html = await response.text();

    // Extract image URLs from Instagram page
    // Instagram stores image data in JSON within script tags
    const imageUrls: string[] = [];
    
    // Try to find JSON data in script tags
    const scriptTagRegex = /<script[^>]*>window\._sharedData\s*=\s*({[\s\S]+?});<\/script>/;
    const match = html.match(scriptTagRegex);
    
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        // Navigate through Instagram's data structure to find images
        const user = data?.entry_data?.ProfilePage?.[0]?.graphql?.user;
        if (user?.edge_owner_to_timeline_media?.edges) {
          const posts = user.edge_owner_to_timeline_media.edges;
          for (const post of posts.slice(0, 10)) {
            const node = post.node;
            if (node.display_url) {
              imageUrls.push(node.display_url);
            } else if (node.thumbnail_src) {
              imageUrls.push(node.thumbnail_src);
            }
          }
        }
      } catch (e) {
        console.error("Error parsing Instagram data:", e);
      }
    }

    // Fallback: Try to extract image URLs from HTML directly
    if (imageUrls.length === 0) {
      const imgRegex = /https:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi;
      const matches = html.match(imgRegex);
      if (matches) {
        // Filter to get actual post images (not profile pics, icons, etc.)
        const postImages = matches.filter(url => 
          url.includes('scontent') || url.includes('cdninstagram')
        );
        imageUrls.push(...postImages.slice(0, 10));
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json(
        { error: "No images found on this Instagram profile. The profile may be private or the page structure has changed." },
        { status: 404 }
      );
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(imageUrls)].slice(0, 10);

    return NextResponse.json({
      imageUrls: uniqueUrls,
      count: uniqueUrls.length,
    });
  } catch (error) {
    console.error("Error fetching Instagram profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram profile. Instagram may have changed their page structure or the profile may be private." },
      { status: 500 }
    );
  }
}

