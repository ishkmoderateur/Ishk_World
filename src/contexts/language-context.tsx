"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import enTranslations from "@/locales/en.json";
import frTranslations from "@/locales/fr.json";
import esTranslations from "@/locales/es.json";
import deTranslations from "@/locales/de.json";
import arTranslations from "@/locales/ar.json";

type Language = "EN" | "FR" | "ES" | "DE" | "AR";

const translations: Record<Language, any> = {
  EN: enTranslations,
  FR: frTranslations,
  ES: esTranslations,
  DE: deTranslations,
  AR: arTranslations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const savedLanguage = localStorage.getItem("ishk-language") as Language;
      if (savedLanguage && ["EN", "FR", "ES", "DE", "AR"].includes(savedLanguage)) {
        document.documentElement.lang = savedLanguage.toLowerCase();
        document.documentElement.dir = savedLanguage === "AR" ? "rtl" : "ltr";
        return savedLanguage;
      }
    }
    return "EN";
  });

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("ishk-language", lang);
      document.documentElement.lang = lang.toLowerCase();
      document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    }
  };

  // Translation function that navigates the JSON structure
  const t = (key: string): string => {
    const keys = key.split(".");
    const resolve = (obj: unknown, path: string[]): unknown => {
      let cur: unknown = obj;
      for (const k of path) {
        if (cur && typeof cur === "object" && k in (cur as Record<string, unknown>)) {
          cur = (cur as Record<string, unknown>)[k];
        } else {
          return undefined;
        }
      }
      return cur;
    };

    const val = resolve(translations[language], keys);
    if (typeof val === "string" && val.length > 0 && !val.includes("Ã") && !val.includes("Å")) {
      return val;
    }

    const fallback = resolve(translations.EN, keys);
    return typeof fallback === "string" ? fallback : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
