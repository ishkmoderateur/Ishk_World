"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PartyPopper, Music, UtensilsCrossed, Wine, Sparkles, Calendar, Mail, Phone, ArrowRight, Search, Filter, Headphones, Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function PartyPage() {
  const { t } = useLanguage();
  
  const services = [
    {
      id: 1,
      name: t("party.services.dj.name"),
      description: t("party.services.dj.description"),
      rating: 4.9,
      reviews: 203,
      price: `${t("party.from")} €300`,
      image: "bg-gradient-to-br from-amber/20 to-coral/20",
      features: [
        t("party.services.dj.features.soundSystem"),
        t("party.services.dj.features.lighting"),
        t("party.services.dj.features.playlistCreation")
      ],
    },
    {
      id: 2,
      name: t("party.services.bartending.name"),
      description: t("party.services.bartending.description"),
      rating: 4.8,
      reviews: 156,
      price: `${t("party.from")} €250`,
      image: "bg-gradient-to-br from-amber/20 to-gold/20",
      features: [
        t("party.services.bartending.features.cocktailMenu"),
        t("party.services.bartending.features.barSetup"),
        t("party.services.bartending.features.staffIncluded")
      ],
    },
    {
      id: 3,
      name: t("party.services.catering.name"),
      description: t("party.services.catering.description"),
      rating: 4.9,
      reviews: 289,
      price: `${t("party.from")} €500`,
      image: "bg-gradient-to-br from-coral/20 to-amber/20",
      features: [
        t("party.services.catering.features.customMenu"),
        t("party.services.catering.features.dietaryOptions"),
        t("party.services.catering.features.setupCleanup")
      ],
    },
    {
      id: 4,
      name: t("party.services.planning.name"),
      description: t("party.services.planning.description"),
      rating: 4.9,
      reviews: 127,
      price: `${t("party.from")} €800`,
      image: "bg-gradient-to-br from-gold/20 to-amber/20",
      features: [
        t("party.services.planning.features.coordination"),
        t("party.services.planning.features.timelineManagement"),
        t("party.services.planning.features.vendorLiaison")
      ],
    },
    {
      id: 5,
      name: t("party.services.lighting.name"),
      description: t("party.services.lighting.description"),
      rating: 4.7,
      reviews: 94,
      price: `${t("party.from")} €350`,
      image: "bg-gradient-to-br from-sky/20 to-amber/20",
      features: [
        t("party.services.lighting.features.soundSystem"),
        t("party.services.lighting.features.lightingDesign"),
        t("party.services.lighting.features.technicalSupport")
      ],
    },
    {
      id: 6,
      name: t("party.services.decoration.name"),
      description: t("party.services.decoration.description"),
      rating: 4.8,
      reviews: 178,
      price: `${t("party.from")} €200`,
      image: "bg-gradient-to-br from-coral/20 to-gold/20",
      features: [
        t("party.services.decoration.features.themeDesign"),
        t("party.services.decoration.features.floralArrangements"),
        t("party.services.decoration.features.setupRemoval")
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-amber/10 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber/20 via-coral/10 to-gold/10"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber/20 mb-6">
              <PartyPopper className="w-12 h-12 text-amber" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-charcoal mb-6">
              {t("party.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("party.hero.description")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-amber text-white rounded-full font-medium hover:bg-amber/90 transition-colors flex items-center gap-2 mx-auto"
            >
              {t("party.hero.startSearch")}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-3 h-3 bg-amber/40 rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-2 h-2 bg-coral/40 rounded-full"
            animate={{
              y: [0, -40, 0],
              x: [0, -15, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 px-4 md:px-8 bg-white/50 backdrop-blur-sm sticky top-20 z-40 border-b border-amber/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
              <input
                type="text"
                placeholder={t("party.search.placeholder")}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-amber/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber/50"
              />
            </div>
            <button className="px-6 py-3 rounded-full border border-amber/20 bg-white hover:bg-amber/5 transition-colors flex items-center gap-2 text-charcoal">
              <Filter className="w-5 h-5" />
              {t("party.search.filter")}
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              {t("party.sectionTitle")}
            </h2>
            <p className="text-charcoal/60 text-lg">
              {t("party.sectionDescription")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const getIcon = () => {
                switch(service.id) {
                  case 1: return <Music className="w-16 h-16 text-white/30" />;
                  case 2: return <Wine className="w-16 h-16 text-white/30" />;
                  case 3: return <UtensilsCrossed className="w-16 h-16 text-white/30" />;
                  case 4: return <Sparkles className="w-16 h-16 text-white/30" />;
                  case 5: return <Headphones className="w-16 h-16 text-white/30" />;
                  case 6: return <Sparkles className="w-16 h-16 text-white/30" />;
                  default: return <PartyPopper className="w-16 h-16 text-white/30" />;
                }
              };

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border border-amber/10"
                >
                  {/* Image Placeholder */}
                  <div className={`h-48 ${service.image} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getIcon()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-heading font-bold text-charcoal">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber fill-amber" />
                        <span className="text-sm font-medium text-charcoal">
                          {service.rating}
                        </span>
                      </div>
                    </div>

                    <p className="text-charcoal/60 mb-4 text-sm">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4 text-sm text-charcoal/60">
                      <div className="flex items-center gap-1">
                        <span>{service.reviews} {t("party.reviews")}</span>
                      </div>
                      <div className="text-amber font-semibold">{service.price}</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((feature) => (
                        <span
                          key={feature}
                          className="text-xs text-charcoal/60 bg-amber/10 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-amber text-white rounded-full font-medium hover:bg-amber/90 transition-colors"
                    >
                      {t("party.getQuote")}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-amber/5 to-coral/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/20 mb-4">
              <Mail className="w-8 h-8 text-amber" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              {t("party.inquiry.title")}
            </h2>
            <p className="text-charcoal/60 text-lg">
              {t("party.inquiry.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-amber/10"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.name")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.email")}
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("party.inquiry.phone")}
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.eventDate")}
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.guests")}
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                    placeholder="50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("party.inquiry.message")}
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  placeholder={t("party.inquiry.messagePlaceholder")}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-amber text-white rounded-full font-medium hover:bg-amber/90 transition-colors"
              >
                {t("party.inquiry.submit")}
              </motion.button>

              <p className="text-center text-sm text-charcoal/60">
                {t("party.inquiry.responseTime")}
              </p>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/20 mb-4">
                <Calendar className="w-8 h-8 text-amber" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("party.features.easyBooking.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("party.features.easyBooking.description")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/20 mb-4">
                <Star className="w-8 h-8 text-amber" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("party.features.curatedSelection.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("party.features.curatedSelection.description")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber/20 mb-4">
                <Phone className="w-8 h-8 text-amber" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("party.features.personalService.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("party.features.personalService.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
