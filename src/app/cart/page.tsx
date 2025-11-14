"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, CreditCard, Package } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  // Sample cart items (in real app, this would come from context/state)
  const cartItems = [
    {
      id: 1,
      name: "Classic Tee",
      price: 45,
      quantity: 2,
      image: "bg-gradient-to-br from-sage/20 to-sand/20",
      size: "M",
    },
    {
      id: 2,
      name: "Canvas Tote Bag",
      price: 35,
      quantity: 1,
      image: "bg-gradient-to-br from-sand/20 to-clay/20",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 75 ? 0 : 5.90;
  const total = subtotal + shipping;

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-sand/5 to-cream"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <ShoppingBag className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
              Shopping Cart
            </h1>
            <p className="text-lg text-charcoal/60">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/boutique"
            className="inline-flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-white rounded-2xl border border-sage/10 shadow-sm"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-sage/10 mb-6">
                    <ShoppingBag className="w-12 h-12 text-sage/40" />
                  </div>
                  <h2 className="text-2xl font-heading font-semibold text-charcoal mb-3">
                    Your cart is empty
                  </h2>
                  <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
                    Start adding items to your cart to see them here
                  </p>
                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors"
                  >
                    <Package className="w-5 h-5" />
                    Browse Products
                  </Link>
                </motion.div>
              ) : (
                cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className={`w-full sm:w-32 h-32 ${item.image} rounded-xl flex-shrink-0 flex items-center justify-center`}>
                        <Package className="w-12 h-12 text-white/30" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                                {item.name}
                              </h3>
                              {item.size && (
                                <p className="text-sm text-charcoal/60 mb-2">Size: {item.size}</p>
                              )}
                              <div className="text-xl font-bold text-sage">
                                €{item.price * item.quantity}
                              </div>
                            </div>
                            <button 
                              className="p-2 text-charcoal/40 hover:text-coral hover:bg-coral/10 rounded-lg transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-charcoal/60 mr-2">Quantity:</span>
                            <button className="w-10 h-10 rounded-lg border border-sage/20 hover:bg-sage/10 transition-colors flex items-center justify-center">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-lg font-medium text-charcoal w-12 text-center">
                              {item.quantity}
                            </span>
                            <button className="w-10 h-10 rounded-lg border border-sage/20 hover:bg-sage/10 transition-colors flex items-center justify-center">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm sticky top-24"
              >
                <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-charcoal/70">
                    <span>Subtotal</span>
                    <span className="font-medium">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal/70">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-sage font-medium">Free</span>
                      ) : (
                        `€${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal < 75 && (
                    <div className="bg-sage/5 border border-sage/20 rounded-lg p-3">
                      <p className="text-sm text-sage font-medium">
                        Add €{(75 - subtotal).toFixed(2)} more for free shipping
                      </p>
                    </div>
                  )}
                  <div className="border-t border-sage/20 pt-4 flex justify-between text-xl font-bold text-charcoal">
                    <span>Total</span>
                    <span className="text-sage">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors flex items-center justify-center gap-2 mb-4 shadow-lg"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </motion.button>

                <Link
                  href="/boutique"
                  className="block text-center text-sm text-charcoal/60 hover:text-sage transition-colors"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
