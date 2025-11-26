"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Currency, detectCurrencyFromIP, detectCurrencyFromLocale } from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceUSD: number) => number;
  formatPrice: (priceUSD: number, decimals?: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [mounted, setMounted] = useState(false);
  const [detecting, setDetecting] = useState(true);

  // Detect currency on mount
  useEffect(() => {
    setMounted(true);
    
    // Load saved currency preference
    const savedCurrency = localStorage.getItem("ishk-currency") as Currency;
    if (savedCurrency && ["USD", "EUR", "GBP", "MAD"].includes(savedCurrency)) {
      setCurrencyState(savedCurrency);
      setDetecting(false);
      return;
    }

    // Auto-detect currency based on location
    const detectCurrency = async () => {
      try {
        // Try IP-based detection first
        const detected = await detectCurrencyFromIP();
        setCurrencyState(detected);
        // Save detected currency as preference
        localStorage.setItem("ishk-currency", detected);
      } catch (error) {
        console.warn("Failed to detect currency, using locale fallback:", error);
        // Fallback to locale-based detection
        const localeCurrency = detectCurrencyFromLocale();
        setCurrencyState(localeCurrency);
        localStorage.setItem("ishk-currency", localeCurrency);
      } finally {
        setDetecting(false);
      }
    };

    detectCurrency();
  }, []);

  // Save currency to localStorage when it changes
  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    if (mounted) {
      localStorage.setItem("ishk-currency", newCurrency);
    }
  };

  // Convert USD price to current currency
  const convertPrice = (priceUSD: number): number => {
    if (currency === "USD") return priceUSD;
    
    // Import exchange rates dynamically to avoid circular dependencies
    const exchangeRates: Record<Currency, number> = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      MAD: 10.0,
    };
    
    return priceUSD * exchangeRates[currency];
  };

  // Format price with currency symbol
  const formatPrice = (priceUSD: number, decimals: number = 2): string => {
    const converted = convertPrice(priceUSD);
    const currencySymbols: Record<Currency, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      MAD: "د.م.",
    };
    
    const symbol = currencySymbols[currency];
    const formatted = converted.toFixed(decimals);
    
    // For RTL currencies like MAD, put symbol after
    if (currency === "MAD") {
      return `${formatted} ${symbol}`;
    }
    
    return `${symbol}${formatted}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}







