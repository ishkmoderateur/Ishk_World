"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { RotateCcw, Clock, CheckCircle, AlertCircle, Package } from "lucide-react";

export default function ReturnsPage() {
  const returnInfo = [
    {
      icon: Clock,
      title: "Return Window",
      content: "Items can be returned within 30 days of delivery. Items must be in original condition with tags attached.",
    },
    {
      icon: Package,
      title: "Return Process",
      content: "Contact us to initiate a return. We'll provide a return authorization and shipping label. Pack items securely and ship within 7 days.",
    },
    {
      icon: CheckCircle,
      title: "Refund Processing",
      content: "Refunds are processed within 5-10 business days after we receive and inspect the returned items. Original shipping costs are non-refundable.",
    },
    {
      icon: AlertCircle,
      title: "Non-Returnable Items",
      content: "Custom items, personalized products, and items marked as final sale cannot be returned. Digital products are non-refundable.",
    },
  ];

  const returnSteps = [
    {
      step: "1",
      title: "Contact Us",
      description: "Reach out via our contact form or email with your order number and reason for return.",
    },
    {
      step: "2",
      title: "Get Authorization",
      description: "We'll review your request and provide a return authorization number and shipping instructions.",
    },
    {
      step: "3",
      title: "Ship Your Return",
      description: "Pack items securely in original packaging (if possible) and ship using the provided label.",
    },
    {
      step: "4",
      title: "Receive Refund",
      description: "Once we receive and inspect your return, we'll process your refund to the original payment method.",
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
              <RotateCcw className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              Returns & Refunds
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              We want you to be completely satisfied with your purchase. Learn about our 
              return policy and how to process a return or exchange.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Return Information */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Return Policy Overview
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {returnInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    {info.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed">
                    {info.content}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Return Process Steps */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              How to Return an Item
            </h2>
            <p className="text-lg text-charcoal/60">
              Follow these simple steps to process your return
            </p>
          </motion.div>

          <div className="space-y-8">
            {returnSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-sage text-white flex items-center justify-center text-2xl font-heading font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    {step.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-sage/5 rounded-2xl p-8 border border-sage/10"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">
              Additional Return Information
            </h2>
            <div className="space-y-4 text-charcoal/70">
              <p>
                <strong className="text-charcoal">Exchanges:</strong> We're happy to exchange items 
                for a different size or color, subject to availability. Contact us to arrange an exchange.
              </p>
              <p>
                <strong className="text-charcoal">Damaged Items:</strong> If you receive a damaged item, 
                please contact us immediately with photos. We'll arrange a replacement or full refund.
              </p>
              <p>
                <strong className="text-charcoal">Wrong Items:</strong> If you receive the wrong item, 
                we'll cover return shipping and send the correct item immediately.
              </p>
              <p>
                <strong className="text-charcoal">Return Shipping:</strong> Return shipping costs are 
                the customer's responsibility unless the return is due to our error (wrong item, damaged item).
              </p>
              <p>
                <strong className="text-charcoal">Store Credit:</strong> In some cases, we may offer 
                store credit instead of a refund. This will be discussed during the return process.
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
              Need Help With a Return?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Our customer service team is here to help with any questions about returns, 
              exchanges, or refunds.
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



