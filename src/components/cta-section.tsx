"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

export default function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-br from-[#6B8E6F]/20 via-[#F5F1E8] to-[#E8D5B7]/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            {t("cta.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="#services-section"
                onClick={(e) => {
                  e.preventDefault();
                  const section = document.getElementById('services-section');
                  section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="group inline-flex items-center gap-2 px-8 py-4 bg-[#6B8E6F] text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {t("cta.exploreServices")}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-2xl font-medium text-lg border-2 border-[#6B8E6F]/20 hover:border-[#6B8E6F]/40 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                {t("cta.shopBoutique")}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="mt-16 flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-[#6B8E6F]/40 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}










