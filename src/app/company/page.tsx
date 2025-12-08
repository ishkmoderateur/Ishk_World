"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Building2, Users, Target, Heart, Globe, Sparkles } from "lucide-react";

export default function CompanyPage() {
  const values = [
    {
      icon: Heart,
      title: "Purpose-Driven",
      description: "We believe in creating meaningful connections and fostering communities that care about what truly matters.",
    },
    {
      icon: Globe,
      title: "Global Perspective",
      description: "Connecting cultures, sharing stories, and building bridges across borders through our diverse platform.",
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Continuously evolving to meet the needs of our community while staying true to our core values.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Our community is at the heart of everything we do. We listen, learn, and grow together.",
    },
  ];

  const stats = [
    { number: "10K+", label: "Active Members" },
    { number: "50+", label: "Countries Reached" },
    { number: "1000+", label: "Stories Shared" },
    { number: "5", label: "Years of Impact" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <Building2 className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              About ishk.
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              We are a unified platform that brings together news, events, sustainable shopping, 
              charity, and creativity. Our mission is to foster slow living and help people connect 
              with what truly matters in life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-heading font-bold text-sage mb-2">
                  {stat.number}
                </div>
                <div className="text-charcoal/60 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Our Values
            </h2>
            <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    {value.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 md:px-8 bg-sage/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <Target className="w-10 h-10 text-sage" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              To create a platform where people can discover meaningful content, connect with 
              like-minded individuals, support sustainable practices, and engage with their 
              communities in authentic ways. We believe in the power of slow living and the 
              importance of focusing on what truly matters.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}










