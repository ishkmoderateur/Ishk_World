"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, Users, Sparkles } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

export default function PhilosophySection() {
  const { t, language } = useLanguage();
  
  const values = [
    {
      icon: Leaf,
      title: t("philosophy.values.natureFirst.title"),
      description: t("philosophy.values.natureFirst.description"),
    },
    {
      icon: Heart,
      title: t("philosophy.values.mindfulLiving.title"),
      description: t("philosophy.values.mindfulLiving.description"),
    },
    {
      icon: Users,
      title: t("philosophy.values.community.title"),
      description: t("philosophy.values.community.description"),
    },
    {
      icon: Sparkles,
      title: t("philosophy.values.authenticity.title"),
      description: t("philosophy.values.authenticity.description"),
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Main Philosophy Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
              {t("philosophy.title")} <span className="text-[#6B8E6F]">{language === "AR" ? "عشق" : "ishk"}</span>{t("philosophy.subtitle")}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t("philosophy.paragraph1")} <span className="font-semibold text-gray-900">{language === "AR" ? "عشق" : "ishk"}</span> {t("philosophy.paragraph1Bold")}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {t("philosophy.paragraph2")}
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {t("philosophy.paragraph3")}
            </p>
          </motion.div>

          {/* Real Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80&auto=format&fit=crop"
                alt="Person in peaceful garden practicing mindfulness"
                fill
                className="object-cover"
                quality={90}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent" />
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-[#6B8E6F]/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-[#E8D5B7]/20 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-[#F5F1E8] to-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#6B8E6F]/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#6B8E6F]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

