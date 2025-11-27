"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      icon: CheckCircle,
      title: "Acceptance of Terms",
      content: "By accessing and using ishk., you accept and agree to be bound by these Terms of Service. If you do not agree, please do not use our platform.",
    },
    {
      icon: FileText,
      title: "Use of Service",
      content: "You may use our service for lawful purposes only. You agree not to use the service in any way that violates applicable laws or regulations, or infringes on the rights of others.",
    },
    {
      icon: AlertCircle,
      title: "User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account.",
    },
    {
      icon: XCircle,
      title: "Prohibited Activities",
      content: "You may not: spam or harass other users, upload malicious content, attempt to gain unauthorized access, or use automated systems to scrape data from our platform.",
    },
  ];

  const additionalTerms = [
    {
      title: "Intellectual Property",
      content: "All content on ishk., including text, graphics, logos, and software, is the property of ishk. or its licensors and is protected by copyright and other intellectual property laws.",
    },
    {
      title: "User-Generated Content",
      content: "By submitting content to our platform, you grant us a license to use, modify, and display that content. You retain ownership of your content but grant us these rights.",
    },
    {
      title: "Payment Terms",
      content: "All payments are processed securely. Refunds are subject to our returns policy. Prices may change at any time, but changes will not affect orders already placed.",
    },
    {
      title: "Limitation of Liability",
      content: "ishk. is provided 'as is' without warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.",
    },
    {
      title: "Termination",
      content: "We reserve the right to suspend or terminate your account at any time for violation of these terms or for any other reason we deem necessary.",
    },
    {
      title: "Changes to Terms",
      content: "We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.",
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
              <FileText className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              Terms of Service
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-base text-charcoal/60 mt-4 max-w-2xl mx-auto">
              Please read these terms carefully before using ishk. By using our platform, 
              you agree to these terms and conditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Terms Sections */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
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
                    <h2 className="text-2xl font-heading font-bold text-charcoal mb-3">
                      {section.title}
                    </h2>
                    <p className="text-charcoal/70 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Additional Terms */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-8 text-center">
              Additional Terms
            </h2>
          </motion.div>

          <div className="space-y-6">
            {additionalTerms.map((term, index) => (
              <motion.div
                key={term.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-sage/5 rounded-xl p-6 border border-sage/10"
              >
                <h3 className="text-xl font-heading font-bold text-charcoal mb-3">
                  {term.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">
                  {term.content}
                </p>
              </motion.div>
            ))}
          </div>
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
              Questions About Our Terms?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              If you have any questions about these terms, please contact us for clarification.
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





