"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft, Heart, Star, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";

// Product data matching the boutique page
const products = [
  {
    id: 1,
    slug: "classic-tee",
    nameKey: "boutique.products.items.classicTee.name",
    categoryKey: "boutique.products.items.classicTee.category",
    categoryFallback: "Ishk Originals",
    price: "€45",
    image: "bg-gradient-to-br from-sage/20 to-sand/20",
    rating: 4.9,
    reviews: 89,
    badge: "Bestseller",
  },
  {
    id: 2,
    slug: "canvas-tote-bag",
    nameKey: "boutique.products.items.canvasToteBag.name",
    categoryKey: "boutique.products.items.canvasToteBag.category",
    categoryFallback: "Ishk Originals",
    price: "€35",
    image: "bg-gradient-to-br from-sand/20 to-clay/20",
    rating: 4.8,
    reviews: 127,
  },
  {
    id: 3,
    slug: "slow-living-journal",
    nameKey: "boutique.products.items.slowLivingJournal.name",
    categoryKey: "boutique.products.items.slowLivingJournal.category",
    categoryFallback: "Lifestyle",
    price: "€35",
    image: "bg-gradient-to-br from-cream to-sage/10",
    rating: 4.9,
    reviews: 203,
    badge: "New",
  },
  {
    id: 4,
    slug: "essential-hoodie",
    nameKey: "boutique.products.items.essentialHoodie.name",
    categoryKey: "boutique.products.items.essentialHoodie.category",
    categoryFallback: "Ishk Originals",
    price: "€85",
    image: "bg-gradient-to-br from-charcoal/20 to-sage/20",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 5,
    slug: "ceramic-mug",
    nameKey: "boutique.products.items.ceramicMug.name",
    categoryKey: "boutique.products.items.ceramicMug.category",
    categoryFallback: "Home & Living",
    price: "€28",
    image: "bg-gradient-to-br from-clay/20 to-sand/20",
    rating: 4.8,
    reviews: 94,
  },
  {
    id: 6,
    slug: "organic-cotton-cap",
    nameKey: "boutique.products.items.organicCottonCap.name",
    categoryKey: "boutique.products.items.organicCottonCap.category",
    categoryFallback: "Ishk Originals",
    price: "€38",
    image: "bg-gradient-to-br from-sage/20 to-cream",
    rating: 4.6,
    reviews: 78,
  },
  {
    id: 7,
    slug: "glass-water-bottle",
    nameKey: "boutique.products.items.glassWaterBottle.name",
    categoryKey: "boutique.products.items.glassWaterBottle.category",
    categoryFallback: "Lifestyle",
    price: "€32",
    image: "bg-gradient-to-br from-sky/10 to-sage/10",
    rating: 4.9,
    reviews: 145,
  },
  {
    id: 8,
    slug: "philosophy-tee",
    nameKey: "boutique.products.items.philosophyTee.name",
    categoryKey: "boutique.products.items.philosophyTee.category",
    categoryFallback: "Ishk Originals",
    price: "€48",
    image: "bg-gradient-to-br from-cream to-sand/20",
    rating: 4.8,
    reviews: 112,
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center">
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-4">Product not found</h1>
          <Link href="/boutique" className="text-sage hover:underline">Return to boutique</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Link href="/boutique" className="inline-flex items-center gap-2 text-charcoal/70 hover:text-charcoal mb-8">
          <ArrowLeft className="w-5 h-5" />
          <span>{t("common.back")}</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className={`h-96 md:h-[600px] ${product.image} rounded-2xl`} />

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-charcoal/60 mb-2">
                {t(product.categoryKey) || product.categoryFallback}
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                {t(product.nameKey) || product.nameKey}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-amber fill-amber" />
                <span className="text-charcoal/70">
                  {product.rating} ({product.reviews} {t("boutique.products.reviews")})
                </span>
              </div>
              {product.badge && (
                <span className="inline-block bg-amber text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {product.badge === "Bestseller" ? t("boutique.products.bestseller") : product.badge === "New" ? t("boutique.products.new") : product.badge}
                </span>
              )}
            </div>

            <div className="pt-6 border-t border-sage/20">
              <p className="text-4xl font-bold text-sage mb-6">{product.price}</p>
              
              <div className="flex gap-4">
                <button className="flex-1 px-8 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {t("boutique.products.addToCart")}
                </button>
                <button className="px-6 py-4 border border-sage/20 text-charcoal rounded-xl hover:bg-sage/5 transition-colors">
                  <Heart className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

