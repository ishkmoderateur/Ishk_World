"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PartyPopper, Music, UtensilsCrossed, Wine, Sparkles, Calendar, Mail, Phone, ArrowRight, Search, Filter, Headphones, Star } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import PriceDisplay from "@/components/price-display";

export default function PartyPage() {
  const { t } = useLanguage();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/party/services");
      if (response.ok) {
        const data = await response.json();
        console.log("🎉 Fetched party services:", data);
        setServices(data);
      } else {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
      }
    } catch (error) {
      console.error("❌ Error fetching party services:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined) return t("party.from") + " €0";
    return `${t("party.from")} €${price.toFixed(0)}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🎉 Party inquiry form submission started", formData);
    
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.eventDate || !formData.guestCount) {
      setError("Please fill in all required fields (name, email, event date, and number of guests)");
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone?.trim() || null,
        eventDate: formData.eventDate,
        guestCount: parseInt(formData.guestCount) || 0,
        message: formData.message?.trim() || null,
      };

      console.log("🎉 Sending party inquiry:", payload);

      const response = await fetch("/api/party/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("🎉 Response status:", response.status);

      const data = await response.json().catch(() => ({ error: "Unknown error" }));

      if (response.ok) {
        console.log("✅ Party inquiry submitted successfully:", data);
        setSuccess("Inquiry submitted successfully! We'll contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventDate: "",
          guestCount: "",
          message: "",
        });
      } else {
        console.error("❌ Party inquiry submission failed:", data);
        setError(data.error || "Failed to submit inquiry. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting party inquiry:", error);
      setError(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

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

          {loading ? (
            <div className="text-center py-12 text-charcoal/60">{t("common.loading")}</div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">No services found</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                // Parse features if it's a string (JSON stored in DB)
                let features: string[] = [];
                if (typeof service.features === 'string') {
                  try {
                    features = JSON.parse(service.features);
                  } catch (e) {
                    console.error("Error parsing features:", e);
                    features = [];
                  }
                } else if (Array.isArray(service.features)) {
                  features = service.features;
                }
                const getIcon = () => {
                  return <PartyPopper className="w-16 h-16 text-white/30" />;
                };
                const getImageGradient = () => {
                  const gradients = ["bg-gradient-to-br from-amber/20 to-coral/20", "bg-gradient-to-br from-amber/20 to-gold/20", "bg-gradient-to-br from-coral/20 to-amber/20", "bg-gradient-to-br from-gold/20 to-amber/20", "bg-gradient-to-br from-sky/20 to-amber/20", "bg-gradient-to-br from-coral/20 to-gold/20"];
                  return gradients[index % gradients.length];
                };

                return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border border-amber/10 flex flex-col h-full"
                >
                  {/* Image Placeholder */}
                  <div className={`h-48 ${service.image || getImageGradient()} relative`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {getIcon()}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-heading font-bold text-charcoal">
                        {service.name}
                      </h3>
                      {service.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber fill-amber" />
                          <span className="text-sm font-medium text-charcoal">
                            {service.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {service.description && (
                      <p className="text-charcoal/60 mb-4 text-sm">
                        {service.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 mb-4 text-sm text-charcoal/60">
                      {service.reviewCount > 0 && (
                        <div className="flex items-center gap-1">
                          <span>{service.reviewCount} {t("party.reviews")}</span>
                        </div>
                      )}
                      <PriceDisplay
                        price={service.price}
                        comparePrice={service.comparePrice}
                        currency="EUR"
                        size="sm"
                        showDiscount={true}
                      />
                    </div>

                    {features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {features.map((feature: string, idx: number) => (
                          <span
                            key={idx}
                            className="text-xs text-charcoal/60 bg-amber/10 px-2 py-1 rounded"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        console.log("🎉 Get Quote clicked for service:", service.name);
                        
                        // Scroll to form - try multiple methods for reliability
                        const scrollToForm = () => {
                          const formSection = document.getElementById('party-inquiry-form');
                          if (formSection) {
                            console.log("🎉 Found party inquiry form, scrolling...");
                            
                            // Method 1: scrollIntoView with options
                            formSection.scrollIntoView({ 
                              behavior: 'smooth', 
                              block: 'start',
                              inline: 'nearest'
                            });
                            
                            // Method 2: Calculate position and scroll (backup)
                            setTimeout(() => {
                              const rect = formSection.getBoundingClientRect();
                              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                              const targetPosition = rect.top + scrollTop - 100;
                              
                              window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                              });
                            }, 50);
                          } else {
                            console.error("❌ Party inquiry form section not found!");
                            // Try again after a short delay in case DOM isn't ready
                            setTimeout(scrollToForm, 200);
                          }
                        };
                        
                        // Try immediately and also after delays
                        scrollToForm();
                        setTimeout(scrollToForm, 100);
                        setTimeout(scrollToForm, 300);
                      }}
                      className="w-full py-3 bg-amber text-white rounded-full font-medium hover:bg-amber/90 transition-colors mt-auto cursor-pointer"
                    >
                      {t("party.getQuote")}
                    </motion.button>
                  </div>
                </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="party-inquiry-form" className="py-16 px-4 md:px-8 bg-gradient-to-br from-amber/5 to-coral/5">
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
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {error && (
                <div className="rounded-lg border border-coral/30 bg-coral/10 text-coral px-4 py-3 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-lg border border-sage/30 bg-sage/10 text-sage px-4 py-3 text-sm">
                  {success}
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.name")} <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.email")} <span className="text-coral">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.eventDate")} <span className="text-coral">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("party.inquiry.guests")} <span className="text-coral">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
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
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  placeholder={t("party.inquiry.messagePlaceholder")}
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !formData.name.trim() || !formData.email.trim() || !formData.eventDate || !formData.guestCount}
                className="w-full py-4 bg-amber text-white rounded-full font-medium hover:bg-amber/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  // Ensure form validation
                  if (!formData.name.trim() || !formData.email.trim() || !formData.eventDate || !formData.guestCount) {
                    e.preventDefault();
                    setError("Please fill in all required fields");
                    return;
                  }
                }}
              >
                {submitting ? "Submitting..." : t("party.inquiry.submit")}
              </button>

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
