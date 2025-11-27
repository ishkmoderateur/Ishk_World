"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Scale, FileText, Shield, Gavel } from "lucide-react";
import Link from "next/link";

export default function LegalPage() {
  const legalDocs = [
    {
      icon: Shield,
      title: "Privacy Policy",
      description: "Learn how we collect, use, and protect your personal information.",
      href: "/privacy",
    },
    {
      icon: FileText,
      title: "Terms of Service",
      description: "Understand the terms and conditions for using our platform.",
      href: "/terms",
    },
    {
      icon: Gavel,
      title: "Shipping Information",
      description: "Details about shipping policies, rates, and delivery times.",
      href: "/shipping",
    },
    {
      icon: Scale,
      title: "Returns Policy",
      description: "Information about returns, refunds, and exchanges.",
      href: "/returns",
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
              <Scale className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              Legal Information
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              Important legal documents and policies that govern your use of ishk. 
              We're committed to transparency and protecting your rights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Legal Documents */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {legalDocs.map((doc, index) => {
              const Icon = doc.icon;
              return (
                <motion.div
                  key={doc.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link
                    href={doc.href}
                    className="block bg-white rounded-2xl p-8 border border-sage/10 shadow-sm hover:shadow-md hover:border-sage/30 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage/20 transition-colors">
                      <Icon className="w-8 h-8 text-sage" />
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-charcoal mb-3 group-hover:text-sage transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed mb-4">
                      {doc.description}
                    </p>
                    <span className="text-sage font-medium inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read More
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
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
              Questions About Our Policies?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              If you have any questions about our legal policies or need clarification 
              on any terms, please don't hesitate to reach out.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
            >
              Contact Us
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}








