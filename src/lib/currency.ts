// Currency types
export type Currency = "USD" | "EUR" | "GBP" | "MAD";

// Exchange rates (base: USD)
// These are approximate rates - in production, you'd fetch these from an API
export const exchangeRates: Record<Currency, number> = {
  USD: 1.0,
  EUR: 0.92, // 1 USD = 0.92 EUR
  GBP: 0.79, // 1 USD = 0.79 GBP
  MAD: 10.0, // 1 USD = 10 MAD (Moroccan Dirham)
};

// Currency symbols
export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  MAD: "د.م.",
};

// Currency names
export const currencyNames: Record<Currency, string> = {
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  MAD: "Moroccan Dirham",
};

// Country to currency mapping for automatic detection
export const countryToCurrency: Record<string, Currency> = {
  // North America
  US: "USD",
  CA: "USD", // Canada often uses USD for international sites
  
  // Europe
  FR: "EUR",
  DE: "EUR",
  ES: "EUR",
  IT: "EUR",
  NL: "EUR",
  BE: "EUR",
  AT: "EUR",
  PT: "EUR",
  IE: "EUR",
  FI: "EUR",
  GR: "EUR",
  LU: "EUR",
  
  // UK
  GB: "GBP",
  
  // Morocco
  MA: "MAD",
  
  // Default to USD for other countries
};

/**
 * Convert USD amount to target currency
 */
export function convertCurrency(amountUSD: number, targetCurrency: Currency): number {
  if (targetCurrency === "USD") return amountUSD;
  const rate = exchangeRates[targetCurrency];
  return amountUSD * rate;
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(amount: number, currency: Currency, decimals: number = 2): string {
  const symbol = currencySymbols[currency];
  const formatted = amount.toFixed(decimals);
  
  // For RTL currencies like MAD, put symbol after
  if (currency === "MAD") {
    return `${formatted} ${symbol}`;
  }
  
  return `${symbol}${formatted}`;
}

/**
 * Detect currency based on country code
 */
export function detectCurrencyFromCountry(countryCode: string): Currency {
  return countryToCurrency[countryCode.toUpperCase()] || "USD";
}

/**
 * Get currency from user's locale/timezone
 * This is a fallback if geolocation API is not available
 */
export function detectCurrencyFromLocale(): Currency {
  if (typeof window === "undefined") return "USD";
  
  const locale = navigator.language || navigator.languages?.[0] || "en-US";
  const countryCode = locale.split("-")[1]?.toUpperCase() || "US";
  
  return detectCurrencyFromCountry(countryCode);
}

/**
 * Detect currency using IP geolocation (client-side)
 * Falls back to locale-based detection
 */
export async function detectCurrencyFromIP(): Promise<Currency> {
  try {
    // Using a free IP geolocation service
    const response = await fetch("https://ipapi.co/json/");
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code;
      if (countryCode) {
        return detectCurrencyFromCountry(countryCode);
      }
    }
  } catch (error) {
    console.warn("Failed to detect currency from IP:", error);
  }
  
  // Fallback to locale-based detection
  return detectCurrencyFromLocale();
}

/**
 * PayPal supported currencies
 * Reference: https://developer.paypal.com/docs/integration/direct/rest/currency-codes/
 */
const PAYPAL_SUPPORTED_CURRENCIES = [
  "USD", "EUR", "GBP", "CAD", "AUD", "JPY", "CNY", "HKD", "SGD", "NZD",
  "MXN", "BRL", "ARS", "CLP", "COP", "PEN", "UYU", "VEF", "ILS", "AED",
  "SAR", "QAR", "KWD", "BHD", "OMR", "JOD", "LBP", "EGP", "TRY", "RUB",
  "INR", "PKR", "BDT", "LKR", "NPR", "THB", "MYR", "SGD", "IDR", "PHP",
  "VND", "KRW", "TWD", "HKD", "NOK", "SEK", "DKK", "PLN", "CZK", "HUF",
  "RON", "BGN", "HRK", "RSD", "BAM", "MKD", "ALL", "ISK", "CHF"
];

/**
 * Map unsupported currencies to PayPal-supported alternatives
 */
const CURRENCY_FALLBACK_MAP: Record<string, Currency> = {
  MAD: "EUR", // Moroccan Dirham -> Euro
  // Add more unsupported currencies as needed
};

/**
 * Get PayPal-supported currency, converting if necessary
 * Returns the currency code and conversion rate
 */
export function getPayPalCurrency(userCurrency: Currency): {
  currency: string;
  conversionRate: number;
  originalCurrency: Currency;
} {
  const upperCurrency = userCurrency.toUpperCase() as Currency;
  
  // Check if currency is directly supported
  if (PAYPAL_SUPPORTED_CURRENCIES.includes(upperCurrency)) {
    return {
      currency: upperCurrency,
      conversionRate: 1.0,
      originalCurrency: upperCurrency,
    };
  }
  
  // Check if we have a fallback mapping
  const fallback = CURRENCY_FALLBACK_MAP[upperCurrency];
  if (fallback) {
    // Convert from user currency to USD, then to fallback currency
    // Example: MAD -> USD -> EUR
    const toUSD = 1 / exchangeRates[upperCurrency]; // MAD to USD
    const toFallback = exchangeRates[fallback]; // USD to EUR
    const conversionRate = toUSD * toFallback; // MAD to EUR
    
    return {
      currency: fallback,
      conversionRate,
      originalCurrency: upperCurrency,
    };
  }
  
  // Default fallback to USD
  const toUSD = 1 / exchangeRates[upperCurrency];
  return {
    currency: "USD",
    conversionRate: toUSD,
    originalCurrency: upperCurrency,
  };
}

/**
 * Convert amount to PayPal-supported currency
 */
export function convertToPayPalCurrency(
  amount: number,
  fromCurrency: Currency
): {
  amount: number;
  currency: string;
  originalAmount: number;
  originalCurrency: Currency;
} {
  const paypalCurrency = getPayPalCurrency(fromCurrency);
  const convertedAmount = amount * paypalCurrency.conversionRate;
  
  return {
    amount: convertedAmount,
    currency: paypalCurrency.currency,
    originalAmount: amount,
    originalCurrency: paypalCurrency.originalCurrency,
  };
}


