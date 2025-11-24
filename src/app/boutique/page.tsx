"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ShoppingBag, Leaf, Heart, Star, ArrowRight, Filter, Search, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PriceDisplay from "@/components/price-display";

function BoutiqueContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = [
    { name: t("boutique.categories.all"), icon: ShoppingBag, active: true },
    { name: t("boutique.categories.homeLiving"), icon: Leaf },
    { name: t("boutique.categories.wellness"), icon: Heart },
    { name: t("boutique.categories.books"), icon: ShoppingBag },
    { name: t("boutique.categories.originals"), icon: Star, highlight: true },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const filter = searchParams?.get("filter");
      let categoryParam = selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
      
      // If filter is "originals", filter by isIshkOriginal
      if (filter === "originals") {
        categoryParam = categoryParam ? `${categoryParam}&isIshkOriginal=true` : "?isIshkOriginal=true";
      }
      
      const response = await fetch(`/api/products${categoryParam}`);
      if (response.ok) {
        const data = await response.json();
        let filteredData = data;
        
        // Client-side filter for originals if needed
        if (filter === "originals") {
          filteredData = data.filter((p: any) => p.isIshkOriginal === true);
        }
        
        setProducts(filteredData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchParams]);

  const ishkOriginals = products.filter((p) => p.isIshkOriginal === true);
  
  const getProductImage = (product: any) => {
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    // Fallback gradient based on category
    const gradients: { [key: string]: string } = {
      "Ishk Originals": "bg-gradient-to-br from-sage/20 to-sand/20",
      "Home & Living": "bg-gradient-to-br from-clay/20 to-sand/20",
      "Lifestyle": "bg-gradient-to-br from-cream to-sage/10",
    };
    return gradients[product.category] || "bg-gradient-to-br from-sage/20 to-sand/20";
  };
  
  const formatPrice = (price: number) => {
    return `€${price.toFixed(0)}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-sand/5 to-cream"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-sage/20 mb-6">
              <ShoppingBag className="w-12 h-12 text-sage" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-charcoal mb-6">
              {t("boutique.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("boutique.hero.description")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors flex items-center gap-2 mx-auto"
            >
              {t("boutique.hero.exploreCollection")}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-3 h-3 bg-sage/30 rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Ishk Originals Featured Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-sage/10 to-sand/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <Star className="w-8 h-8 text-amber" />
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal">
                {t("boutique.originals.title")}
              </h2>
            </div>
            <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
              {t("boutique.originals.description")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ishkOriginals.slice(0, 4).map((product, index) => {
              const productImage = getProductImage(product);
              const isImageUrl = typeof productImage === 'string' && (productImage.startsWith('http') || productImage.startsWith('/'));
              
              return (
                <Link key={product.id} href={`/boutique/${product.slug}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-sage/10 group"
                  >
                    <div className={`h-64 ${!isImageUrl ? productImage : ''} relative`}>
                      {isImageUrl && (
                        <Image
                          src={productImage}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                      {product.badge && (
                        <div className="absolute top-4 left-4 bg-amber text-white text-xs font-medium px-3 py-1 rounded-full z-10">
                          {product.badge === "Bestseller" ? t("boutique.products.bestseller") : product.badge === "New" ? t("boutique.products.new") : product.badge}
                        </div>
                      )}
                      {product.isIshkOriginal && (
                        <div className="absolute top-4 right-4 bg-amber/20 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                          <Star className="w-4 h-4 text-amber" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 z-10">
                          <ShoppingCart className="w-6 h-6 text-sage" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-amber fill-amber" />
                          <span className="text-sm text-charcoal/60">
                            {product.rating.toFixed(1)} ({product.reviewCount || 0})
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-charcoal/40 mb-1">{product.category}</p>
                      <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <PriceDisplay
                          price={product.price}
                          comparePrice={product.comparePrice}
                          currency="EUR"
                          size="md"
                          showDiscount={true}
                        />
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          className="text-charcoal/40 hover:text-sage transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/boutique?filter=originals">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors flex items-center gap-2 mx-auto"
              >
                {t("boutique.originals.viewAll")}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories & Search */}
      <section className="py-8 px-4 md:px-8 bg-white/50 backdrop-blur-sm sticky top-20 z-40 border-b border-sage/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder={t("boutique.search.placeholder")}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-sage/20 bg-white focus:outline-none focus:ring-2 focus:ring-sage/50"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.name}
                    className={`px-6 py-3 rounded-full border transition-all whitespace-nowrap flex items-center gap-2 ${
                      category.active
                        ? "bg-sage text-white border-sage"
                        : category.highlight
                        ? "bg-amber/10 text-amber border-amber/30 hover:bg-amber/20"
                        : "bg-white text-charcoal border-sage/20 hover:bg-sage/5"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* All Products Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-2">
                {t("boutique.products.title")}
              </h2>
              <p className="text-charcoal/60">
                {products.length} {t("boutique.products.description")}
              </p>
            </div>
            <button className="px-6 py-3 rounded-full border border-sage/20 bg-white hover:bg-sage/5 transition-colors flex items-center gap-2 text-charcoal">
              <Filter className="w-5 h-5" />
              {t("boutique.search.sort")}
            </button>
          </motion.div>

          {loading ? (
            <div className="text-center py-12 text-charcoal/60">{t("common.loading")}</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">No products found</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, index) => {
                const productImage = getProductImage(product);
                const isImageUrl = typeof productImage === 'string' && (productImage.startsWith('http') || productImage.startsWith('/'));
                
                return (
                  <Link key={product.id} href={`/boutique/${product.slug}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.05 }}
                      whileHover={{ y: -5 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-sage/10 group"
                    >
                      <div className={`h-64 ${!isImageUrl ? productImage : ''} relative`}>
                        {isImageUrl && (
                          <Image
                            src={productImage}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        {product.badge && (
                          <div className="absolute top-4 left-4 bg-amber text-white text-xs font-medium px-3 py-1 rounded-full z-10">
                            {product.badge === "Bestseller" ? t("boutique.products.bestseller") : product.badge === "New" ? t("boutique.products.new") : product.badge}
                          </div>
                        )}
                        {product.isIshkOriginal && (
                          <div className="absolute top-4 right-4 bg-amber/20 backdrop-blur-sm rounded-full px-3 py-1 z-10">
                            <Star className="w-4 h-4 text-amber" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 z-10">
                            <ShoppingCart className="w-6 h-6 text-sage" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        {product.rating > 0 && (
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 text-amber fill-amber" />
                            <span className="text-sm text-charcoal/60">
                              {product.rating.toFixed(1)} ({product.reviewCount})
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-charcoal/40 mb-1">{product.category}</p>
                        <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <PriceDisplay
                            price={product.price}
                            comparePrice={product.comparePrice}
                            currency="EUR"
                            size="md"
                            showDiscount={true}
                          />
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="text-charcoal/40 hover:text-sage transition-colors"
                          >
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-sage/5 to-sand/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 mb-4">
                <Leaf className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("boutique.features.sustainable.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("boutique.features.sustainable.description")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 mb-4">
                <Heart className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("boutique.features.ethical.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("boutique.features.ethical.description")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 mb-4">
                <ShoppingBag className="w-8 h-8 text-sage" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("boutique.features.carbonNeutral.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("boutique.features.carbonNeutral.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function BoutiquePage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="pt-32 pb-16 px-4 md:px-8 text-center">
          <div className="animate-pulse text-charcoal/60">Loading...</div>
        </div>
        <Footer />
      </main>
    }>
      <BoutiqueContent />
    </Suspense>
  );
}
