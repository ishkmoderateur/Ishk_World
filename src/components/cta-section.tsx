"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 px-4 md:px-8 bg-gradient-to-br from-sage/20 via-cream to-sand/20">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-charcoal/70 mb-8 leading-relaxed">
            Join thousands of people who have chosen to live more intentionally.
            Start exploring our services today.
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
                className="group inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Services
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-charcoal rounded-2xl font-medium text-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Shop Boutique
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="mt-16 flex justify-center gap-4">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-sage/40 rounded-full"
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







