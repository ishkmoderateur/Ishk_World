"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe, Leaf, Heart, Sparkles, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function FeaturesSection() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: Globe,
      title: t("features.items.globalReach.title"),
      description: t("features.items.globalReach.description"),
      color: "text-sky",
      bgColor: "bg-sky/10",
    },
    {
      icon: Leaf,
      title: t("features.items.sustainable.title"),
      description: t("features.items.sustainable.description"),
      color: "text-sage",
      bgColor: "bg-sage/10",
    },
    {
      icon: Heart,
      title: t("features.items.communityDriven.title"),
      description: t("features.items.communityDriven.description"),
      color: "text-coral",
      bgColor: "bg-coral/10",
    },
    {
      icon: Sparkles,
      title: t("features.items.curatedQuality.title"),
      description: t("features.items.curatedQuality.description"),
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      icon: Shield,
      title: t("features.items.trusted.title"),
      description: t("features.items.trusted.description"),
      color: "text-forest",
      bgColor: "bg-forest/10",
    },
    {
      icon: CheckCircle2,
      title: t("features.items.verified.title"),
      description: t("features.items.verified.description"),
      color: "text-amber",
      bgColor: "bg-amber/10",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            {t("features.title")}
          </h2>
          <p className="text-lg text-stone max-w-2xl mx-auto">
            {t("features.subtitle")}
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-charcoal mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "5", label: t("features.stats.services") },
            { number: "5", label: t("features.stats.languages") },
            { number: "100%", label: t("features.stats.sustainable") },
            { number: "∞", label: t("features.stats.possibilities") },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-heading font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-charcoal/60 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}










