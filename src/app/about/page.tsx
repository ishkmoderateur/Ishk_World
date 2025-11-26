"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Users, Heart, Globe, Lightbulb, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const { data: session } = useSession();
  const storySections = [
    {
      year: "2019",
      title: "The Beginning",
      description: "ishk. was born from a simple idea: to create a space where people could slow down, connect authentically, and focus on what truly matters in life.",
    },
    {
      year: "2020",
      title: "Building Community",
      description: "We launched our platform, bringing together news, events, and sustainable shopping. Our community began to grow, united by shared values.",
    },
    {
      year: "2022",
      title: "Expanding Impact",
      description: "We added photography services, party planning, and association features, creating a comprehensive platform for mindful living.",
    },
    {
      year: "2024",
      title: "Global Reach",
      description: "Today, ishk. connects thousands of members across the globe, fostering meaningful connections and supporting sustainable practices.",
    },
  ];

  const teamValues = [
    {
      icon: Heart,
      title: "Authenticity",
      description: "We stay true to our values and encourage genuine connections.",
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "We're committed to environmental responsibility and ethical practices.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously evolve to better serve our community.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in the power of coming together for positive change.",
    },
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
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              About Us
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              We're a community-driven platform dedicated to slow living, meaningful connections, 
              and sustainable practices. Learn more about our story, values, and vision for the future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Our Story
            </h2>
            <p className="text-lg text-charcoal/60">
              A journey of growth, connection, and purpose
            </p>
          </motion.div>

          <div className="space-y-12">
            {storySections.map((section, index) => (
              <motion.div
                key={section.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-8"
              >
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-sage/20 flex items-center justify-center">
                    <span className="text-2xl font-heading font-bold text-sage">{section.year}</span>
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    {section.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-charcoal/60 max-w-2xl mx-auto">
              The principles that guide our work and shape our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {teamValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-sage/5 rounded-2xl p-8 border border-sage/10"
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

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8 bg-sage/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-6">
              Join Our Community
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              Be part of a movement that values authenticity, sustainability, and meaningful connections.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!session?.user && (
                <Link
                  href="/auth/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-sage border-2 border-sage rounded-xl font-medium hover:bg-sage/5 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

