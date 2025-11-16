import { NextRequest, NextResponse } from "next/server";
import { translateText, translateObject } from "@/lib/translator";

/**
 * API route for translating text or objects
 * POST /api/translate
 * Body: { text?: string, object?: any, targetLang: string, sourceLang?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, object, targetLang, sourceLang = "EN" } = body;

    if (!targetLang) {
      return NextResponse.json(
        { error: "targetLang is required" },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_TRANSLATE_API_KEY && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      return NextResponse.json(
        { error: "Google Translate API key not configured. Set GOOGLE_TRANSLATE_API_KEY in .env", text: text || object },
        { status: 503 }
      );
    }

    if (text) {
      const translated = await translateText(text, targetLang, sourceLang);
      return NextResponse.json({ translated });
    }

    if (object) {
      const translated = await translateObject(object, targetLang, sourceLang);
      return NextResponse.json({ translated });
    }

    return NextResponse.json(
      { error: "Either 'text' or 'object' is required" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Translation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

