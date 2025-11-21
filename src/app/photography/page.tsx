"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Camera, Calendar, Star, ArrowRight, Mail, Phone, Image as ImageIcon, Video, Edit } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSession } from "next-auth/react";

export default function PhotographyPage() {
  const { t } = useLanguage();
  const { data: session } = useSession();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    serviceType: "portrait",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  useEffect(() => {
    fetchPortfolio();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchPortfolio();
  }, [selectedCategory]);

  const fetchPortfolio = async () => {
    try {
      const categoryParam = selectedCategory !== "all" ? `?category=${selectedCategory}` : "";
      const response = await fetch(`/api/photography${categoryParam}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (error) {
      console.error("Error fetching portfolio:", error);
    } finally {
      setPortfolioLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/photography/services");
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setServicesLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await fetch("/api/photography/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          preferredDate: formData.preferredDate || null,
        }),
      });

      if (response.ok) {
        setSuccess("Booking request submitted successfully! We'll contact you soon.");
        setFormData({
          name: "",
          email: "",
          phone: "",
          preferredDate: "",
          serviceType: "portrait",
          message: "",
        });
      } else {
        const data = await response.json();
        setError(data.error || "Failed to submit booking request");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const testimonials = [
    {
      id: 1,
      name: "Sarah & James",
      event: "Wedding",
      text: "Absolutely stunning photos that captured every moment perfectly. The attention to detail was incredible.",
      rating: 5,
    },
    {
      id: 2,
      name: "Maria",
      event: "Portrait Session",
      text: "The photographer made me feel so comfortable and the results exceeded all expectations.",
      rating: 5,
    },
    {
      id: 3,
      name: "EcoBrand Co.",
      event: "Commercial",
      text: "Professional, creative, and delivered exactly what we needed for our campaign. Highly recommend!",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gold/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-amber/5 to-cream"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gold/20 mb-6">
              <Camera className="w-12 h-12 text-gold" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-charcoal mb-6">
              {t("photography.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("photography.hero.description")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gold text-white rounded-full font-medium hover:bg-gold/90 transition-colors flex items-center gap-2 mx-auto"
            >
              {t("photography.hero.bookSession")}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-3 h-3 bg-gold/30 rounded-full"
            animate={{
              y: [0, -30, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </section>

      {/* Portfolio Gallery */}
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
              {t("photography.portfolio.title")}
            </h2>
            <p className="text-charcoal/60 text-lg">
              {t("photography.portfolio.description")}
            </p>
          </motion.div>

          {portfolioLoading ? (
            <div className="text-center py-12 text-charcoal/60">{t("common.loading")}</div>
          ) : portfolio.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">No photos found</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="relative group cursor-pointer rounded-2xl overflow-hidden h-80"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                      <span className="text-xs font-medium text-gold mb-2 block">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-heading font-semibold">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gold/5 to-amber/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              {t("photography.services.title")}
            </h2>
            <p className="text-charcoal/60 text-lg">
              {t("photography.services.description")}
            </p>
          </motion.div>

          {servicesLoading ? (
            <div className="text-center py-12 text-charcoal/60">{t("common.loading")}</div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">No services found</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const features = Array.isArray(service.features) ? service.features : [];
                const formatPrice = (price: number | null | undefined) => {
                  if (price === null || price === undefined) return t("photography.services.contactForPrice");
                  return `€${price.toFixed(0)}`;
                };
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gold/10"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                      <Camera className="w-8 h-8 text-gold" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-charcoal mb-2">
                      {service.name}
                    </h3>
                    <div className="text-3xl font-bold text-gold mb-2">
                      {formatPrice(service.price)}
                    </div>
                    <div className="text-sm text-charcoal/60 mb-6">
                      {service.duration || ""}
                    </div>
                    {features.length > 0 && (
                      <ul className="space-y-2 mb-6">
                        {features.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-charcoal/70">
                            <span className="text-gold mt-1">✓</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        const formSection = document.getElementById('booking-form');
                        if (formSection) {
                          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                        setFormData({ ...formData, serviceType: service.slug || service.name.toLowerCase() });
                      }}
                      className="w-full py-3 bg-gold text-white rounded-full font-medium hover:bg-gold/90 transition-colors"
                    >
                      {t("photography.services.bookNow")}
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              {t("photography.testimonials.title")}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gold/5 to-amber/5 rounded-2xl p-6 border border-gold/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-gold fill-gold"
                    />
                  ))}
                </div>
                <p className="text-charcoal/70 mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-charcoal">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-charcoal/60">
                    {testimonial.event}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-gold/5 to-amber/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
              <Calendar className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              {t("photography.booking.title")}
            </h2>
            <p className="text-charcoal/60 text-lg">
              {t("photography.booking.description")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gold/10"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    {t("photography.booking.name")}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("photography.booking.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("photography.booking.phone")}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("photography.booking.preferredDate")}
                  </label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    {t("photography.booking.serviceType")}
                  </label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="portrait">{t("photography.booking.serviceTypes.portrait")}</option>
                    <option value="event">{t("photography.booking.serviceTypes.event")}</option>
                    <option value="commercial">{t("photography.booking.serviceTypes.commercial")}</option>
                    <option value="wedding">{t("photography.booking.serviceTypes.wedding")}</option>
                    <option value="other">{t("photography.booking.serviceTypes.other")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  {t("photography.booking.message")}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gold/20 focus:outline-none focus:ring-2 focus:ring-gold/50"
                  placeholder={t("photography.booking.messagePlaceholder")}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gold text-white rounded-full font-medium hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : t("photography.booking.submit")}
              </motion.button>

              <p className="text-center text-sm text-charcoal/60">
                {t("photography.booking.responseTime")}
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <Edit className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("photography.features.editing.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("photography.features.editing.description")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <ImageIcon className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("photography.features.resolution.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("photography.features.resolution.description")}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-4">
                <Video className="w-8 h-8 text-gold" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                {t("photography.features.video.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("photography.features.video.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
