"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import enTranslations from "@/locales/en.json";
import frTranslations from "@/locales/fr.json";
import esTranslations from "@/locales/es.json";
import deTranslations from "@/locales/de.json";
import arTranslations from "@/locales/ar.json";

const translations = {
  EN: enTranslations,
  FR: frTranslations,
  ES: esTranslations,
  DE: deTranslations,
  AR: arTranslations,
};

export default function HeroSection() {
  const { language, setLanguage, t } = useLanguage();
  // Generate particle positions only on client side to avoid hydration errors
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    xMove: number;
    duration: number;
  }>>([]);
  
  // Random tagline that changes on each visit
  const [currentTagline, setCurrentTagline] = useState<string>("");

  useEffect(() => {
    // Generate particles only on client side
    setParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        xMove: Math.random() * 20 - 10,
        duration: 6 + Math.random() * 4,
      }))
    );
    
    // Get taglines array from translations directly
    const currentTranslations = translations[language];
    const taglines = currentTranslations?.hero?.taglines;
    
    if (Array.isArray(taglines) && taglines.length > 0) {
      // Randomly select a tagline
      const randomIndex = Math.floor(Math.random() * taglines.length);
      setCurrentTagline(taglines[randomIndex]);
    } else {
      // Fallback to single tagline if array doesn't exist
      setCurrentTagline(t("hero.tagline"));
    }
  }, [language, t]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background - Nature Scene */}
      <div className="absolute inset-0 z-0">
        {/* Beautiful tranquil nature scene */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80&auto=format&fit=crop"
            alt="Peaceful nature scene with forest and natural landscape"
            fill
            className="object-cover"
            priority
            quality={90}
            sizes="100vw"
          />
        </div>
        {/* Natural green overlay to enhance nature colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-forest/10 via-sage/20 to-mint/10" />
        
        {/* Overlay gradient for better text readability */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated particles (nature elements) */}
        <div className="absolute inset-0">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-sage/40 rounded-full"
              style={{ 
                left: `${particle.left}%`, 
                top: `${particle.top}%` 
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, particle.xMove, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.id * 0.5,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-7xl md:text-9xl font-display font-bold text-white drop-shadow-lg tracking-tight">
            {language === "AR" ? t("hero.subtitle") : "ishk."}
          </h1>
        </motion.div>

        {/* Subtitle and Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="space-y-2 mb-12"
        >
          <p className="text-xl md:text-2xl text-white/90 font-sans max-w-2xl mx-auto leading-relaxed drop-shadow">
            {currentTagline || t("hero.tagline")}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <motion.button
            onClick={() => {
              const servicesSection = document.getElementById('services-section');
              if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="group relative px-8 py-4 bg-[#6B8E6F] text-white rounded-2xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("hero.cta")}
              <svg 
                className="w-5 h-5 group-hover:translate-y-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                />
              </svg>
            </span>
            
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-white/10"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Language Selector - Bottom Right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-8 right-8 z-20"
      >
        <div className="flex items-center gap-2 text-sm text-white/80 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
          <span className="text-white/60">🌐</span>
          {(['EN', 'FR', 'ES', 'DE', 'AR'] as const).map((lang, index) => (
            <div key={lang} className="flex items-center gap-2">
              {index > 0 && <span className="text-white/30">•</span>}
              <motion.button
                onClick={() => {
                  setLanguage(lang);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  language === lang
                    ? "text-white font-semibold bg-white/20 border border-white/40"
                    : "text-white/70 hover:text-white"
                }`}
                title={`Switch to ${lang === 'EN' ? 'English' : lang === 'FR' ? 'French' : lang === 'ES' ? 'Spanish' : lang === 'DE' ? 'German' : 'Arabic'}`}
              >
                {lang}
              </motion.button>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
