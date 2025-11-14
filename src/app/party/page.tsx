"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { PartyPopper, MapPin, Star, Users, Calendar, Mail, Phone, ArrowRight, Search, Filter } from "lucide-react";

export default function PartyPage() {
  const venues = [
    {
      id: 1,
      name: "Villa Sunset",
      location: "Paris, France",
      rating: 4.8,
      reviews: 127,
      capacity: "30-50 guests",
      price: "From €500",
      image: "bg-gradient-to-br from-amber/20 to-coral/20",
      features: ["Garden", "Terrace", "Parking"],
    },
    {
      id: 2,
      name: "Garden Pavilion",
      location: "Barcelona, Spain",
      rating: 4.9,
      reviews: 89,
      capacity: "50-100 guests",
      price: "From €800",
      image: "bg-gradient-to-br from-amber/20 to-gold/20",
      features: ["Outdoor", "Catering", "Music"],
    },
    {
      id: 3,
      name: "Riverside Loft",
      location: "Amsterdam, Netherlands",
      rating: 4.7,
      reviews: 156,
      capacity: "20-40 guests",
      price: "From €600",
      image: "bg-gradient-to-br from-coral/20 to-amber/20",
      features: ["Waterfront", "Modern", "Sound System"],
    },
    {
      id: 4,
      name: "Historic Manor",
      location: "London, UK",
      rating: 4.9,
      reviews: 203,
      capacity: "100-200 guests",
      price: "From €1,200",
      image: "bg-gradient-to-br from-gold/20 to-amber/20",
      features: ["Historic", "Elegant", "Full Service"],
    },
    {
      id: 5,
      name: "Beach House",
      location: "Nice, France",
      rating: 4.8,
      reviews: 94,
      capacity: "40-80 guests",
      price: "From €900",
      image: "bg-gradient-to-br from-sky/20 to-amber/20",
      features: ["Beachfront", "Outdoor", "Bar"],
    },
    {
      id: 6,
      name: "Urban Rooftop",
      location: "Berlin, Germany",
      rating: 4.6,
      reviews: 78,
      capacity: "30-60 guests",
      price: "From €700",
      image: "bg-gradient-to-br from-coral/20 to-gold/20",
      features: ["City View", "Modern", "DJ Setup"],
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
              Where Memories Are Made
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Find the perfect space for life's most beautiful moments. Curated venues & services.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-amber text-white rounded-full font-medium hover:bg-amber/90 transition-colors flex items-center gap-2 mx-auto"
            >
              Start Your Search
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
                placeholder="Search venues, locations..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-amber/20 bg-white focus:outline-none focus:ring-2 focus:ring-amber/50"
              />
            </div>
            <button className="px-6 py-3 rounded-full border border-amber/20 bg-white hover:bg-amber/5 transition-colors flex items-center gap-2 text-charcoal">
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </section>

      {/* Venues Grid */}
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
              Curated Venues
            </h2>
            <p className="text-charcoal/60 text-lg">
              Beautiful spaces for your special moments
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue, index) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer border border-amber/10"
              >
                {/* Image Placeholder */}
                <div className={`h-48 ${venue.image} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PartyPopper className="w-16 h-16 text-white/30" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-heading font-bold text-charcoal">
                      {venue.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber fill-amber" />
                      <span className="text-sm font-medium text-charcoal">
                        {venue.rating}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-charcoal/60 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{venue.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-charcoal/60">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {venue.capacity}
                    </div>
                    <div className="text-amber font-semibold">{venue.price}</div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {venue.features.map((feature) => (
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
                    Get Quote
                  </motion.button>
                </div>
              </motion.div>
            ))}
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
              Let's Plan Your Event
            </h2>
            <p className="text-charcoal/60 text-lg">
              Tell us about your celebration and we'll find the perfect venue
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
                    Your Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Email Address
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
                  Phone Number
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
                    Event Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Number of Guests
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
                  Tell us about your event
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-amber/20 focus:outline-none focus:ring-2 focus:ring-amber/50"
                  placeholder="What kind of event are you planning? Any special requirements?"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-amber text-white rounded-full font-medium hover:bg-amber/90 transition-colors"
              >
                Send Inquiry
              </motion.button>

              <p className="text-center text-sm text-charcoal/60">
                We'll respond within 2 hours during business hours
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
                Easy Booking
              </h3>
              <p className="text-charcoal/60">
                Simple inquiry process, personalized service, and quick responses
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
                Curated Selection
              </h3>
              <p className="text-charcoal/60">
                Only the most beautiful, well-maintained venues make our list
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
                Personal Service
              </h3>
              <p className="text-charcoal/60">
                Direct communication with venue owners for the best experience
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
