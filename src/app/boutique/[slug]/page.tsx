"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowLeft, Heart, Star, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import Image from "next/image";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `€${price.toFixed(0)}`;
  };

  const getProductImage = (product: any) => {
    if (product?.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center">
          <div className="text-charcoal/60">{t("common.loading")}</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-24 text-center">
          <h1 className="text-3xl font-heading font-bold text-charcoal mb-4">Product not found</h1>
          <Link href="/boutique" className="text-sage hover:underline">{t("common.back")}</Link>
        </div>
        <Footer />
      </main>
    );
  }

  const productImage = getProductImage(product);
  const isImageUrl = productImage && (productImage.startsWith('http') || productImage.startsWith('/'));

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
          <div className="h-96 md:h-[600px] rounded-2xl relative overflow-hidden bg-gradient-to-br from-sage/20 to-sand/20">
            {isImageUrl && productImage ? (
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : null}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-charcoal/60 mb-2">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
                {product.name}
              </h1>
              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-amber fill-amber" />
                  <span className="text-charcoal/70">
                    {product.rating.toFixed(1)} ({product.reviewCount} {t("boutique.products.reviews")})
                  </span>
                </div>
              )}
              {product.badge && (
                <span className="inline-block bg-amber text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                  {product.badge === "Bestseller" ? t("boutique.products.bestseller") : product.badge === "New" ? t("boutique.products.new") : product.badge}
                </span>
              )}
              {product.description && (
                <p className="text-charcoal/70 leading-relaxed mt-4">
                  {product.description}
                </p>
              )}
            </div>

            <div className="pt-6 border-t border-sage/20">
              <p className="text-4xl font-bold text-sage mb-6">{formatPrice(product.price)}</p>
              
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
