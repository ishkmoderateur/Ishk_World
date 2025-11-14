"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Globe, Leaf, Heart, Sparkles, Shield } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: "Global Reach",
      description: "Available in 5 languages, connecting people worldwide",
      color: "text-sky",
      bgColor: "bg-sky/10",
    },
    {
      icon: Leaf,
      title: "Sustainable",
      description: "Eco-friendly products and practices at our core",
      color: "text-sage",
      bgColor: "bg-sage/10",
    },
    {
      icon: Heart,
      title: "Community Driven",
      description: "Built by and for people who value meaningful connections",
      color: "text-coral",
      bgColor: "bg-coral/10",
    },
    {
      icon: Sparkles,
      title: "Curated Quality",
      description: "Every product and service carefully selected for excellence",
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      icon: Shield,
      title: "Trusted",
      description: "Secure, reliable, and transparent in everything we do",
      color: "text-forest",
      bgColor: "bg-forest/10",
    },
    {
      icon: CheckCircle2,
      title: "Verified",
      description: "All partners and products meet our high standards",
      color: "text-amber",
      bgColor: "bg-amber/10",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
            Why Choose Ishk?
          </h2>
          <p className="text-lg text-stone max-w-2xl mx-auto">
            More than a platform—a movement toward intentional living
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="bg-gradient-to-br from-cream to-white p-8 rounded-2xl border border-border hover:shadow-xl transition-all duration-300 h-full">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-charcoal mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-charcoal/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "5", label: "Services" },
            { number: "5", label: "Languages" },
            { number: "100%", label: "Sustainable" },
            { number: "∞", label: "Possibilities" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-5xl md:text-6xl font-heading font-bold text-primary mb-2">
                {stat.number}
              </div>
              <div className="text-charcoal/60 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}







