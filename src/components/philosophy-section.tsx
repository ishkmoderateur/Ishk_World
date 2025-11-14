"use client";

import { motion } from "framer-motion";
import { Leaf, Heart, Users, Sparkles } from "lucide-react";
import Image from "next/image";

export default function PhilosophySection() {
  const values = [
    {
      icon: Leaf,
      title: "Nature First",
      description: "We believe in living in harmony with nature, respecting the earth that sustains us.",
    },
    {
      icon: Heart,
      title: "Mindful Living",
      description: "Every choice matters. We curate experiences and products that align with conscious values.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Building connections that matter, supporting each other in our journey toward slow living.",
    },
    {
      icon: Sparkles,
      title: "Authenticity",
      description: "Embracing what's real, meaningful, and true to who we are and what we value.",
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
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              What is <span className="text-primary">'išq</span>?
            </h2>
            <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
              In a world that moves too fast, <span className="font-semibold text-charcoal">'išq</span> reminds us
              to pause, breathe, and reconnect with what truly matters: nature, community, mindful living.
            </p>
            <p className="text-lg text-charcoal/70 leading-relaxed mb-6">
              It's not about doing less—it's about doing what matters. Choosing quality over quantity.
              Building relationships over transactions. Living intentionally, not reactively.
            </p>
            <p className="text-lg text-charcoal/70 leading-relaxed">
              Join us in creating a movement toward a more conscious, connected, and meaningful way of life.
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
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 to-transparent" />
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-sage/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 left-4 w-32 h-32 bg-sand/20 rounded-full blur-xl" />
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
                className="bg-gradient-to-br from-cream to-white p-6 rounded-2xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                  {value.title}
                </h3>
                <p className="text-charcoal/60 leading-relaxed">
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

