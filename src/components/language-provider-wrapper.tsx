"use client";

import { LanguageProvider } from "@/contexts/language-context";

export function LanguageProviderWrapper({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}









