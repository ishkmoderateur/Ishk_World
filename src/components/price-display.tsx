"use client";

interface PriceDisplayProps {
  price: number;
  comparePrice?: number | null;
  currency?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showDiscount?: boolean;
}

export default function PriceDisplay({
  price,
  comparePrice,
  currency = "EUR",
  size = "md",
  showDiscount = true,
}: PriceDisplayProps) {
  const hasDiscount = comparePrice && comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice! - price) / comparePrice!) * 100)
    : 0;

  const sizeClasses = {
    sm: { new: "text-lg", old: "text-sm" },
    md: { new: "text-2xl", old: "text-lg" },
    lg: { new: "text-3xl", old: "text-xl" },
    xl: { new: "text-4xl", old: "text-2xl" },
  };

  const currencySymbol = currency === "EUR" ? "€" : currency;

  return (
    <div className="flex items-baseline gap-3 flex-wrap">
      <span className={`font-bold text-sage ${sizeClasses[size].new}`}>
        {currencySymbol} {price.toFixed(2)}
      </span>
      {hasDiscount && (
        <>
          <span className={`text-charcoal/40 line-through ${sizeClasses[size].old}`}>
            {currencySymbol} {comparePrice!.toFixed(2)}
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





