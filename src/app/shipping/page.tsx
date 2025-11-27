"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Truck, Package, Clock, Globe, MapPin } from "lucide-react";

export default function ShippingPage() {
  const shippingOptions = [
    {
      icon: Truck,
      title: "Standard Shipping",
      duration: "5-7 business days",
      price: "Free on orders over $50",
      description: "Reliable standard shipping for most locations.",
    },
    {
      icon: Package,
      title: "Express Shipping",
      duration: "2-3 business days",
      price: "Starting at $15",
      description: "Faster delivery for urgent orders.",
    },
    {
      icon: Globe,
      title: "International Shipping",
      duration: "10-21 business days",
      price: "Varies by location",
      description: "We ship to over 50 countries worldwide.",
    },
  ];

  const shippingInfo = [
    {
      icon: Clock,
      title: "Processing Time",
      content: "Orders are typically processed within 1-2 business days. During peak seasons, processing may take up to 3-5 business days.",
    },
    {
      icon: MapPin,
      title: "Delivery Areas",
      content: "We ship to most countries worldwide. Some remote locations may have limited shipping options or additional fees.",
    },
    {
      icon: Package,
      title: "Tracking",
      content: "Once your order ships, you'll receive a tracking number via email. You can track your package's journey in real-time.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <Truck className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              Shipping Information
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              We're committed to getting your orders to you safely and on time. 
              Learn more about our shipping options and policies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Shipping Options
            </h2>
            <p className="text-lg text-charcoal/60">
              Choose the delivery speed that works best for you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-2">
                    {option.title}
                  </h3>
                  <p className="text-sage font-semibold mb-2">{option.duration}</p>
                  <p className="text-charcoal/60 mb-4">{option.price}</p>
                  <p className="text-charcoal/70 leading-relaxed">
                    {option.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Important Information
            </h2>
          </motion.div>

          <div className="space-y-8">
            {shippingInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                      {info.title}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed">
                      {info.content}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Details */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-sage/5 rounded-2xl p-8 border border-sage/10"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">
              Additional Shipping Details
            </h2>
            <div className="space-y-4 text-charcoal/70">
              <p>
                <strong className="text-charcoal">Customs and Duties:</strong> International orders may be subject to 
                customs fees and import duties, which are the responsibility of the recipient.
              </p>
              <p>
                <strong className="text-charcoal">Damaged or Lost Packages:</strong> If your package arrives damaged 
                or is lost in transit, please contact us immediately. We'll work with you to resolve the issue.
              </p>
              <p>
                <strong className="text-charcoal">Address Changes:</strong> Please ensure your shipping address is 
                correct at checkout. We cannot be held responsible for packages sent to incorrect addresses.
              </p>
              <p>
                <strong className="text-charcoal">Holiday Shipping:</strong> During peak holiday seasons, delivery 
                times may be extended. We recommend placing orders early to ensure timely delivery.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-6">
              Questions About Shipping?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              If you have questions about shipping options, delivery times, or need to track 
              your order, we're here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}






