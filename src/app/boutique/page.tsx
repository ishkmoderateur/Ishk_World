"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ShoppingBag, Leaf, Heart, Star, ArrowRight, Filter, Search, ShoppingCart } from "lucide-react";

export default function BoutiquePage() {
  const categories = [
    { name: "All Products", icon: ShoppingBag, active: true },
    { name: "Home & Living", icon: Leaf },
    { name: "Wellness", icon: Heart },
    { name: "Books", icon: ShoppingBag },
    { name: "🌟 Ishk Originals", icon: Star, highlight: true },
  ];

  const products = [
    {
      id: 1,
      name: "Classic Tee",
      category: "Ishk Originals",
      price: "€45",
      image: "bg-gradient-to-br from-sage/20 to-sand/20",
      rating: 4.9,
      reviews: 89,
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Canvas Tote Bag",
      category: "Ishk Originals",
      price: "€35",
      image: "bg-gradient-to-br from-sand/20 to-clay/20",
      rating: 4.8,
      reviews: 127,
    },
    {
      id: 3,
      name: "Slow Living Journal",
      category: "Lifestyle",
      price: "€35",
      image: "bg-gradient-to-br from-cream to-sage/10",
      rating: 4.9,
      reviews: 203,
      badge: "New",
    },
    {
      id: 4,
      name: "Essential Hoodie",
      category: "Ishk Originals",
      price: "€85",
      image: "bg-gradient-to-br from-charcoal/20 to-sage/20",
      rating: 4.7,
      reviews: 156,
    },
    {
      id: 5,
      name: "Ceramic Mug",
      category: "Home & Living",
      price: "€28",
      image: "bg-gradient-to-br from-clay/20 to-sand/20",
      rating: 4.8,
      reviews: 94,
    },
    {
      id: 6,
      name: "Organic Cotton Cap",
      category: "Ishk Originals",
      price: "€38",
      image: "bg-gradient-to-br from-sage/20 to-cream",
      rating: 4.6,
      reviews: 78,
    },
    {
      id: 7,
      name: "Glass Water Bottle",
      category: "Lifestyle",
      price: "€32",
      image: "bg-gradient-to-br from-sky/10 to-sage/10",
      rating: 4.9,
      reviews: 145,
    },
    {
      id: 8,
      name: "Philosophy Tee",
      category: "Ishk Originals",
      price: "€48",
      image: "bg-gradient-to-br from-cream to-sand/20",
      rating: 4.8,
      reviews: 112,
    },
  ];

  const ishkOriginals = products.filter((p) => p.category === "Ishk Originals");

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
              Curated with Consciousness
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Every product tells a story of care, craft, and purpose. Sustainable products & Ishk originals.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors flex items-center gap-2 mx-auto"
            >
              Explore Collection
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
                Ishk Originals
              </h2>
            </div>
            <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
              Wear your values. Live the philosophy. Premium sustainable merchandise designed with care.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ishkOriginals.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-sage/10 group"
              >
                <div className={`h-64 ${product.image} relative`}>
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-amber text-white text-xs font-medium px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                      <ShoppingCart className="w-6 h-6 text-sage" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-amber fill-amber" />
                    <span className="text-sm text-charcoal/60">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-sage">{product.price}</span>
                    <button className="text-sage hover:text-sage/80 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="px-8 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors">
              View All Ishk Originals
            </button>
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
                placeholder="Search products..."
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
                All Products
              </h2>
              <p className="text-charcoal/60">
                {products.length} carefully curated items
              </p>
            </div>
            <button className="px-6 py-3 rounded-full border border-sage/20 bg-white hover:bg-sage/5 transition-colors flex items-center gap-2 text-charcoal">
              <Filter className="w-5 h-5" />
              Sort
            </button>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer border border-sage/10 group"
              >
                <div className={`h-64 ${product.image} relative`}>
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-amber text-white text-xs font-medium px-3 py-1 rounded-full">
                      {product.badge}
                    </div>
                  )}
                  {product.category === "Ishk Originals" && (
                    <div className="absolute top-4 right-4 bg-amber/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <Star className="w-4 h-4 text-amber" />
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                      <ShoppingCart className="w-6 h-6 text-sage" />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-amber fill-amber" />
                    <span className="text-sm text-charcoal/60">
                      {product.rating} ({product.reviews})
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/40 mb-1">{product.category}</p>
                  <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-sage">{product.price}</span>
                    <button className="text-charcoal/40 hover:text-sage transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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
                Sustainable Materials
              </h3>
              <p className="text-charcoal/60">
                Organic, recycled, and ethically sourced materials only
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
                Ethical Production
              </h3>
              <p className="text-charcoal/60">
                Fair wages, safe working conditions, and transparent supply chains
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
                Carbon Neutral
              </h3>
              <p className="text-charcoal/60">
                Every order plants a tree. Free shipping over €75
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
