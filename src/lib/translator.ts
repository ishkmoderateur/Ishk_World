const languageMap: Record<string, string> = {
  EN: "en",
  FR: "fr",
  ES: "es",
  DE: "de",
  AR: "ar",
};

/**
 * Translate text using Google Translate REST API
 * @param text - Text to translate
 * @param targetLang - Target language code (EN, FR, ES, DE, AR)
 * @param sourceLang - Source language code (default: EN)
 * @returns Translated text or original text if translation fails
 */
export async function translateText(
  text: string,
  targetLang: "EN" | "FR" | "ES" | "DE" | "AR",
  sourceLang: "EN" | "FR" | "ES" | "DE" | "AR" = "EN"
): Promise<string> {
  // If no API key or same language, return original
  if (!process.env.GOOGLE_TRANSLATE_API_KEY || targetLang === sourceLang) {
    return text;
  }

  try {
    const sourceLangCode = languageMap[sourceLang];
    const targetLangCode = languageMap[targetLang];

    if (!sourceLangCode || !targetLangCode) {
      console.warn(`⚠️ Unsupported language pair: ${sourceLang} -> ${targetLang}`);
      return text;
    }

    // Use Google Translate REST API v2
    const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: sourceLangCode,
        target: targetLangCode,
        format: "text",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Google Translate API error: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    if (data.data?.translations?.[0]?.translatedText) {
      return data.data.translations[0].translatedText;
    }

    throw new Error("Invalid response from Google Translate API");
  } catch (error) {
    console.error(`❌ Translation error (${sourceLang} -> ${targetLang}):`, error);
    return text; // Return original text on error
  }
}

/**
 * Translate a nested object structure
 * @param obj - Object to translate
 * @param targetLang - Target language code
 * @param sourceLang - Source language code
 * @returns Translated object
 */
export async function translateObject(
  obj: any,
  targetLang: "EN" | "FR" | "ES" | "DE" | "AR",
  sourceLang: "EN" | "FR" | "ES" | "DE" | "AR" = "EN"
): Promise<any> {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY || targetLang === sourceLang) {
    return obj;
  }

  const translated: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      // Small delay to respect rate limits (100ms between requests)
      await new Promise((resolve) => setTimeout(resolve, 100));
      translated[key] = await translateText(value, targetLang, sourceLang);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      translated[key] = await translateObject(value, targetLang, sourceLang);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}
