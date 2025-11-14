"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import enTranslations from "@/locales/en.json";
import frTranslations from "@/locales/fr.json";
import esTranslations from "@/locales/es.json";
import deTranslations from "@/locales/de.json";
import arTranslations from "@/locales/ar.json";

type Language = "EN" | "FR" | "ES" | "DE" | "AR";

const translations = {
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
  // Initialize with EN, will be updated from localStorage on mount
  const [language, setLanguageState] = useState<Language>("EN");
  const [mounted, setMounted] = useState(false);

  // Load language from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("ishk-language") as Language;
    if (savedLanguage && ["EN", "FR", "ES", "DE", "AR"].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
      // Update HTML lang and dir attributes
      document.documentElement.lang = savedLanguage.toLowerCase();
      document.documentElement.dir = savedLanguage === "AR" ? "rtl" : "ltr";
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem("ishk-language", lang);
      // Update HTML lang and dir attributes
      document.documentElement.lang = lang.toLowerCase();
      document.documentElement.dir = lang === "AR" ? "rtl" : "ltr";
    }
  };

  // Translation function that navigates the JSON structure
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        // Fallback to English if translation not found
        value = translations.EN;
        for (const fallbackKey of keys) {
          if (value && typeof value === "object" && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === "string" ? value : key;
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

