"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useCart } from "@/contexts/cart-context";
import { ArrowLeft, Heart, Star, ShoppingCart, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useCurrency } from "@/contexts/currency-context";
import Link from "next/link";
import Image from "next/image";
import PriceDisplay from "@/components/price-display";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { t } = useLanguage();
  const { data: session } = useSession();
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);

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
        
        // Check if product is in wishlist
        if (session?.user && data.id) {
          checkWishlistStatus(data.id);
        }
      } else if (response.status === 404) {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async (productId: string) => {
    try {
      const response = await fetch("/api/wishlist");
      if (response.ok) {
        const data = await response.json();
        const inWishlist = data.items?.some((item: any) => item.productId === productId);
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error("Error checking wishlist status:", error);
    }
  };

  useEffect(() => {
    if (session?.user && product?.id) {
      checkWishlistStatus(product.id);
    } else {
      setIsInWishlist(false);
    }
  }, [session?.user?.id, product?.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=/boutique/${slug}`);
      return;
    }

    setAddingToCart(true);
    try {
      await addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        size: selectedSize || undefined,
        color: selectedColor || undefined,
        image: getProductImage(product) || undefined,
      });
      // Show success message (you could add a toast notification here)
    } catch (error) {
      console.error("Error adding to cart:", error);
      // Show error message
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;

    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=/boutique/${slug}`);
      return;
    }

    setTogglingWishlist(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const response = await fetch(`/api/wishlist?productId=${product.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product.id }),
        });
        if (response.ok) {
          setIsInWishlist(true);
        } else {
          const error = await response.json();
          console.error("Error adding to wishlist:", error);
        }
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setTogglingWishlist(false);
    }
  };

  const { formatPrice: formatCurrencyPrice } = useCurrency();
  
  const formatPrice = (price: number) => {
    return formatCurrencyPrice(price, 0);
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
              <div className="mb-6">
                <PriceDisplay
                  price={product.price}
                  comparePrice={product.comparePrice}
                  size="xl"
                  showDiscount={true}
                />
              </div>
              
              {!product.inStock && (
                <div className="mb-4 p-3 bg-coral/10 border border-coral/20 rounded-lg text-coral text-sm">
                  Out of stock
                </div>
              )}

              {product.inStock && (
                <div className="flex gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart || !product.inStock}
                    className="flex-1 px-8 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {t("boutique.products.addToCart")}
                      </>
                    )}
                  </button>
                  <button 
                    onClick={handleToggleWishlist}
                    disabled={togglingWishlist}
                    className={`px-6 py-4 border rounded-xl transition-colors flex items-center justify-center ${
                      isInWishlist
                        ? "border-coral/30 bg-coral/10 text-coral hover:bg-coral/20"
                        : "border-sage/20 text-charcoal hover:bg-sage/5"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-6 h-6 ${isInWishlist ? "fill-coral" : ""}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
