"use client";

import { useCurrency } from "@/contexts/currency-context";

interface PriceDisplayProps {
  price: number; // Price in USD
  comparePrice?: number | null; // Compare price in USD
  size?: "sm" | "md" | "lg" | "xl";
  showDiscount?: boolean;
}

export default function PriceDisplay({
  price,
  comparePrice,
  size = "md",
  showDiscount = true,
}: PriceDisplayProps) {
  const { convertPrice, formatPrice } = useCurrency();
  
  // Convert prices from USD to user's selected currency
  const convertedPrice = convertPrice(price);
  const convertedComparePrice = comparePrice ? convertPrice(comparePrice) : null;
  
  const hasDiscount = convertedComparePrice && convertedComparePrice > convertedPrice;
  const discountPercent = hasDiscount
    ? Math.round(((convertedComparePrice! - convertedPrice) / convertedComparePrice!) * 100)
    : 0;

  const sizeClasses = {
    sm: { new: "text-lg", old: "text-sm" },
    md: { new: "text-2xl", old: "text-lg" },
    lg: { new: "text-3xl", old: "text-xl" },
    xl: { new: "text-4xl", old: "text-2xl" },
  };

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className={`font-bold text-sage ${sizeClasses[size].new}`}>
        {formatPrice(price)}
      </span>
      {hasDiscount && (
        <>
          <span className={`text-charcoal/40 line-through ${sizeClasses[size].old}`}>
            {formatPrice(comparePrice!)}
          </span>
          {showDiscount && discountPercent > 0 && (
            <span className="px-2 py-1 bg-coral/20 text-coral rounded text-xs font-medium">
              -{discountPercent}%
            </span>
          )}
        </>
      )}
    </div>
  );
}







