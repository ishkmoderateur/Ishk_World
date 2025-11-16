"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Map, ShoppingBag, Heart, Camera, Home, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function ServiceCards() {
  const { t } = useLanguage();

  const services = [
    {
      id: "news",
      icon: Map,
      title: t("services.news.title"),
      subtitle: t("services.news.subtitle"),
      description: t("services.news.description"),
      href: "/news",
      accent: "news-accent",
      gradient: "from-sky/10 to-sky/5",
    },
    {
      id: "boutique",
      icon: ShoppingBag,
      title: t("services.boutique.title"),
      subtitle: t("services.boutique.subtitle"),
      description: t("services.boutique.description"),
      href: "/boutique",
      accent: "boutique-accent",
      gradient: "from-sage/10 to-sage/5",
    },
    {
      id: "association",
      icon: Heart,
      title: t("services.association.title"),
      subtitle: t("services.association.subtitle"),
      description: t("services.association.description"),
      href: "/association",
      accent: "association-accent",
      gradient: "from-coral/10 to-coral/5",
    },
    {
      id: "photography",
      icon: Camera,
      title: t("services.photography.title"),
      subtitle: t("services.photography.subtitle"),
      description: t("services.photography.description"),
      href: "/photography",
      accent: "photo-accent",
      gradient: "from-gold/10 to-gold/5",
    },
    {
      id: "housing",
      icon: Home,
      title: t("services.housing.title"),
      subtitle: t("services.housing.subtitle"),
      description: t("services.housing.description"),
      href: "/party",
      accent: "housing-accent",
      gradient: "from-amber/10 to-amber/5",
    },
    {
      id: "party-services",
      icon: Sparkles,
      title: t("services.partyServices.title"),
      subtitle: t("services.partyServices.subtitle"),
      description: t("services.partyServices.description"),
      href: "/party",
      accent: "party-services-accent",
      gradient: "from-coral/10 to-coral/5",
    },
  ];
  return (
    <section id="services-section" className="py-24 px-4 md:px-8 bg-gradient-to-b from-cream to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            Your Journey Begins
          </h2>
          <p className="text-lg text-stone max-w-2xl mx-auto">
            Discover six pathways to a more mindful, connected life
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={service.href}>
                  <motion.div
                    className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${service.gradient} p-8 border border-border shadow-sm hover:shadow-xl transition-all duration-300 h-full`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Icon */}
                    <div className="mb-6">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-${service.accent}`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-8 h-8" strokeWidth={1.5} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-heading font-semibold text-charcoal group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-sm font-medium text-stone">
                        {service.subtitle}
                      </p>
                      
                      <p className="text-charcoal/70 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <motion.div
                      className="mt-6 flex items-center gap-2 text-primary font-medium"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span>Explore</span>
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17 8l4 4m0 0l-4 4m4-4H3" 
                        />
                      </svg>
                    </motion.div>

                    {/* Hover effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


