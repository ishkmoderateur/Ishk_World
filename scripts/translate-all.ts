/**
 * Script to translate all English translations to other languages using Google Translate API
 * 
 * Usage: npx tsx scripts/translate-all.ts
 * 
 * Make sure you have GOOGLE_TRANSLATE_API_KEY in your .env file
 */

import * as fs from "fs";
import * as path from "path";
import { translateObject } from "../src/lib/translator";
import "dotenv/config";

const localesDir = path.join(process.cwd(), "src", "locales");
const languages = ["FR", "ES", "DE", "AR"] as const;

async function translateAll() {
  // Check for API key
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    console.error("❌ Error: GOOGLE_TRANSLATE_API_KEY not found in .env file");
    console.log("📝 Please add: GOOGLE_TRANSLATE_API_KEY=your_key_here");
    process.exit(1);
  }

  // Read English source file
  const enPath = path.join(localesDir, "en.json");
  if (!fs.existsSync(enPath)) {
    console.error(`❌ Error: ${enPath} not found`);
    process.exit(1);
  }

  const enContent = fs.readFileSync(enPath, "utf-8");
  const enTranslations = JSON.parse(enContent);

  console.log("✅ Loaded English translations");
  console.log(`📝 Translating to: ${languages.join(", ")}\n`);

  // Translate to each language
  for (const lang of languages) {
    console.log(`🔄 Translating to ${lang}...`);
    
    try {
      const translated = await translateObject(enTranslations, lang, "EN");
      
      // Write translated file with proper UTF-8 encoding
      const outputPath = path.join(localesDir, `${lang.toLowerCase()}.json`);
      const jsonContent = JSON.stringify(translated, null, 2);
      
      // Write with UTF-8 encoding (no BOM)
      fs.writeFileSync(outputPath, jsonContent, { encoding: "utf8" });
      
      console.log(`✅ ${lang} translations saved to ${outputPath}\n`);
      
      // Small delay to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error translating to ${lang}:`, error);
      console.log(`⏭️  Skipping ${lang} and continuing...\n`);
    }
  }

  console.log("🎉 Translation complete! All locale files have been updated.");
  console.log("💡 Tip: Review the translations and edit if needed for better accuracy.");
}

// Run the script
translateAll().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});

