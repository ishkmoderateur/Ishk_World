"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Heart, Camera, PartyPopper } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function ServiceCards() {
  const { t } = useLanguage();

  const services = [
    {
      id: "boutique",
      icon: ShoppingBag,
      title: t("services.boutique.title"),
      subtitle: t("services.boutique.subtitle"),
      description: t("services.boutique.description"),
      href: "/boutique",
      accentColor: "#6B8E6F",
      gradient: "from-[#6B8E6F]/10 to-[#6B8E6F]/5",
    },
    {
      id: "association",
      icon: Heart,
      title: t("services.association.title"),
      subtitle: t("services.association.subtitle"),
      description: t("services.association.description"),
      href: "/association",
      accentColor: "#E07A5F",
      gradient: "from-[#E07A5F]/10 to-[#E07A5F]/5",
    },
    {
      id: "photography",
      icon: Camera,
      title: t("services.photography.title"),
      subtitle: t("services.photography.subtitle"),
      description: t("services.photography.description"),
      href: "/photography",
      accentColor: "#D4AF37",
      gradient: "from-[#D4AF37]/10 to-[#D4AF37]/5",
    },
    {
      id: "services",
      icon: PartyPopper,
      title: "Event Services",
      subtitle: "Celebrate Your Special Moments",
      description: "From intimate gatherings to grand celebrations, we provide comprehensive event planning and coordination services to make your special occasions unforgettable.",
      href: "/party",
      accentColor: "#9B59B6",
      gradient: "from-[#9B59B6]/10 to-[#9B59B6]/5",
    },
  ];
  return (
    <section id="services-section" className="py-24 px-4 md:px-8 bg-gradient-to-b from-[#F5F1E8] to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            {t("home.servicesSection.title")}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("home.servicesSection.subtitle")}
          </p>
        </motion.div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${service.gradient} p-8 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 h-full`}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Icon */}
                    <div className="mb-6">
                      <motion.div
                        className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center"
                        style={{ color: service.accentColor }}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-8 h-8" strokeWidth={1.5} />
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-heading font-semibold text-gray-800 transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-sm font-medium text-gray-600">
                        {service.subtitle}
                      </p>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    {/* Button */}
                    <motion.div
                      className="mt-6"
                      initial={{ x: 0 }}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
                        style={{ backgroundColor: service.accentColor }}
                      >
                        <span>{t("home.servicesSection.explore")}</span>
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
                      </div>
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


