"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/contexts/currency-context";
import { Currency, currencySymbols, currencyNames } from "@/lib/currency";
import { ChevronDown } from "lucide-react";

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currencies: Currency[] = ["USD", "EUR", "GBP", "MAD"];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-charcoal/5 transition-colors text-sm font-medium"
        aria-label="Select currency"
      >
        <span className="text-charcoal">{currencySymbols[currency]}</span>
        <span className="text-charcoal/70 hidden sm:inline">{currency}</span>
        <ChevronDown 
          className={`w-4 h-4 text-charcoal/60 transition-transform ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-charcoal/10 overflow-hidden z-50"
          >
            {currencies.map((curr) => (
              <button
                key={curr}
                onClick={() => handleCurrencyChange(curr)}
                className={`w-full text-left px-4 py-3 hover:bg-charcoal/5 transition-colors flex items-center justify-between ${
                  currency === curr ? "bg-sage/10 font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{currencySymbols[curr]}</span>
                  <div className="flex flex-col">
                    <span className="text-sm text-charcoal font-medium">{curr}</span>
                    <span className="text-xs text-charcoal/60">{currencyNames[curr]}</span>
                  </div>
                </div>
                {currency === curr && (
                  <span className="text-sage text-sm">✓</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


