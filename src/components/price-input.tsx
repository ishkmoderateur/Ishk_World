"use client";

import { useState, useEffect } from "react";
import { Percent, Euro } from "lucide-react";

interface PriceInputProps {
  price: string;
  comparePrice: string;
  onPriceChange: (price: string) => void;
  onComparePriceChange: (comparePrice: string) => void;
  label?: string;
  currency?: string;
}

export default function PriceInput({
  price,
  comparePrice,
  onPriceChange,
  onComparePriceChange,
  label = "Price",
  currency = "EUR",
}: PriceInputProps) {
  const [discountPercent, setDiscountPercent] = useState<string>("");
  const [useDiscount, setUseDiscount] = useState(false);

  // Calculate discount percentage when comparePrice or price changes
  useEffect(() => {
    if (comparePrice && price) {
      const oldPrice = parseFloat(comparePrice);
      const newPrice = parseFloat(price);
      if (oldPrice > newPrice && oldPrice > 0) {
        const discount = ((oldPrice - newPrice) / oldPrice) * 100;
        setDiscountPercent(discount.toFixed(0));
      } else {
        setDiscountPercent("");
      }
    } else {
      setDiscountPercent("");
    }
  }, [comparePrice, price]);

  const handleDiscountChange = (percent: string) => {
    setDiscountPercent(percent);
    if (percent && comparePrice) {
      const oldPrice = parseFloat(comparePrice);
      if (!isNaN(oldPrice) && oldPrice > 0) {
        const discount = parseFloat(percent);
        if (!isNaN(discount) && discount >= 0 && discount <= 100) {
          const newPrice = oldPrice * (1 - discount / 100);
          onPriceChange(newPrice.toFixed(2));
        }
      }
    }
  };

  const handleComparePriceChange = (value: string) => {
    onComparePriceChange(value);
    // If discount is set, recalculate price
    if (discountPercent && value) {
      const oldPrice = parseFloat(value);
      if (!isNaN(oldPrice) && oldPrice > 0) {
        const discount = parseFloat(discountPercent);
        if (!isNaN(discount) && discount >= 0 && discount <= 100) {
          const newPrice = oldPrice * (1 - discount / 100);
          onPriceChange(newPrice.toFixed(2));
        }
      }
    }
  };

  const toggleDiscountMode = () => {
    setUseDiscount(!useDiscount);
    if (!useDiscount && comparePrice) {
      // When enabling discount mode, calculate discount from existing prices
      const oldPrice = parseFloat(comparePrice);
      const newPrice = parseFloat(price);
      if (oldPrice > newPrice && oldPrice > 0) {
        const discount = ((oldPrice - newPrice) / oldPrice) * 100;
        setDiscountPercent(discount.toFixed(0));
      }
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          {label} ({currency}) *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-charcoal/60 mb-1">Original Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Euro className="w-4 h-4 text-charcoal/40" />
              </div>
              <input
                type="number"
                step="0.01"
                value={comparePrice}
                onChange={(e) => handleComparePriceChange(e.target.value)}
                placeholder="Original price"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-charcoal/60 mb-1">Sale Price</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Euro className="w-4 h-4 text-charcoal/40" />
              </div>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => onPriceChange(e.target.value)}
                placeholder="Sale price"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Discount Percentage Input */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <button
            type="button"
            onClick={toggleDiscountMode}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              useDiscount
                ? "bg-sage/20 text-sage border border-sage/30"
                : "bg-charcoal/5 text-charcoal/60 border border-charcoal/10 hover:bg-charcoal/10"
            }`}
          >
            Use Discount %
          </button>
          {discountPercent && (
            <span className="px-3 py-1.5 bg-coral/10 text-coral rounded-lg text-sm font-medium">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {useDiscount && (
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={discountPercent}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="Enter discount percentage (0-100)"
              className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-xs text-charcoal/60 mt-1">
              Enter discount percentage. The sale price will be calculated automatically.
            </p>
          </div>
        )}
      </div>

      {/* Price Preview */}
      {comparePrice && price && parseFloat(comparePrice) > parseFloat(price) && (
        <div className="p-4 bg-sage/5 rounded-xl border border-sage/20">
          <p className="text-xs text-charcoal/60 mb-2">Price Preview:</p>
          <div className="flex items-center gap-3">
            <span className="text-lg text-charcoal/40 line-through">
              {currency === "EUR" ? "€" : currency} {parseFloat(comparePrice).toFixed(2)}
            </span>
            <span className="text-2xl font-bold text-sage">
              {currency === "EUR" ? "€" : currency} {parseFloat(price).toFixed(2)}
            </span>
            {discountPercent && (
              <span className="px-2 py-1 bg-coral/20 text-coral rounded text-xs font-medium">
                -{discountPercent}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

