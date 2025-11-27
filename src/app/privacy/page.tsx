"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      icon: Database,
      title: "Information We Collect",
      content: [
        "Personal information you provide (name, email, phone number)",
        "Account information and preferences",
        "Payment and transaction information",
        "Usage data and analytics",
        "Cookies and tracking technologies",
      ],
    },
    {
      icon: Eye,
      title: "How We Use Your Information",
      content: [
        "To provide and improve our services",
        "To process transactions and orders",
        "To communicate with you about your account",
        "To send you updates and marketing communications (with your consent)",
        "To analyze usage and improve our platform",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "We use industry-standard encryption to protect your data",
        "Access to personal information is restricted to authorized personnel",
        "We regularly review and update our security practices",
        "Your payment information is processed securely through trusted providers",
      ],
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        "Access your personal information",
        "Request correction of inaccurate data",
        "Request deletion of your data",
        "Opt-out of marketing communications",
        "Data portability",
      ],
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
              <Shield className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              Privacy Policy
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-base text-charcoal/60 mt-4 max-w-2xl mx-auto">
              At ishk., we take your privacy seriously. This policy explains how we collect, 
              use, and protect your personal information.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3 text-charcoal/70">
                          <span className="text-sage mt-1">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Additional Information */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-sage/5 rounded-2xl p-8 border border-sage/10"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage, 
              and assist with marketing efforts. You can control cookie preferences through your 
              browser settings.
            </p>
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4 mt-8">
              Third-Party Services
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-4">
              We may use third-party services for analytics, payment processing, and other 
              functions. These services have their own privacy policies governing the use of 
              your information.
            </p>
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-4 mt-8">
              Changes to This Policy
            </h2>
            <p className="text-charcoal/70 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any 
              significant changes by posting the new policy on this page and updating the 
              "Last updated" date.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-6">
              Questions About Privacy?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              If you have questions about this privacy policy or wish to exercise your rights, 
              please contact us.
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








