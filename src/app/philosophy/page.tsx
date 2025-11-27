"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Leaf, Heart, Clock, Users, Sparkles, Globe } from "lucide-react";

export default function PhilosophyPage() {
  const principles = [
    {
      icon: Clock,
      title: "Slow Living",
      description: "We believe in taking time to appreciate the present moment, savoring experiences, and moving at a pace that allows for reflection and connection.",
    },
    {
      icon: Heart,
      title: "Mindful Connection",
      description: "Authentic relationships and meaningful interactions are at the core of what we do. We foster spaces where people can connect genuinely.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We're committed to environmental responsibility, supporting sustainable practices, and making choices that benefit our planet and future generations.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Together we're stronger. We build supportive communities that uplift, inspire, and create positive change in the world.",
    },
    {
      icon: Sparkles,
      title: "Creativity",
      description: "We celebrate artistic expression, innovation, and the unique contributions each person brings to our community.",
    },
    {
      icon: Globe,
      title: "Cultural Exchange",
      description: "We embrace diversity, learn from different perspectives, and create bridges between cultures through shared experiences.",
    },
  ];

  const quotes = [
    {
      text: "Slow down and enjoy life. It's not only the scenery you miss by going too fast—you also miss the sense of where you are going and why.",
      author: "Eddie Cantor",
    },
    {
      text: "The best things in life aren't things. They're moments, connections, and experiences that enrich our souls.",
      author: "Unknown",
    },
    {
      text: "Sustainability is not about sacrifice. It's about making choices that align with our values and create a better future.",
      author: "ishk. Philosophy",
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
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <Heart className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              Our Philosophy
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              At ishk., we believe in slow living, mindful connections, and sustainable practices. 
              Our philosophy guides everything we do, from the content we share to the communities we build.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Core Principles
            </h2>
            <p className="text-lg text-charcoal/60">
              The values that shape our platform and community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed">
                    {principle.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quotes Section */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Words That Inspire Us
            </h2>
          </motion.div>

          <div className="space-y-8">
            {quotes.map((quote, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-sage/5 rounded-2xl p-8 border-l-4 border-sage"
              >
                <p className="text-xl text-charcoal/80 italic mb-4 leading-relaxed">
                  "{quote.text}"
                </p>
                <p className="text-charcoal/60 font-medium">— {quote.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-20 px-4 md:px-8 bg-sage/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-8">
              Our Manifesto
            </h2>
            <div className="bg-white rounded-2xl p-8 md:p-12 border border-sage/10 shadow-sm text-left">
              <div className="space-y-6 text-charcoal/80 leading-relaxed text-lg">
                <p>
                  We believe in <strong>slowing down</strong> in a world that moves too fast. 
                  We choose <strong>quality over quantity</strong>, <strong>depth over breadth</strong>, 
                  and <strong>meaning over noise</strong>.
                </p>
                <p>
                  We believe in <strong>authentic connections</strong>—real conversations, genuine 
                  relationships, and communities built on trust and mutual respect.
                </p>
                <p>
                  We believe in <strong>sustainable living</strong>—making choices that honor our 
                  planet, support ethical practices, and create a better future for generations to come.
                </p>
                <p>
                  We believe in <strong>creativity and expression</strong>—celebrating art, culture, 
                  and the unique contributions each person brings to our community.
                </p>
                <p>
                  We believe in <strong>coming together</strong>—supporting one another, sharing 
                  knowledge, and building something greater than ourselves.
                </p>
                <p className="text-sage font-heading font-bold text-xl pt-4">
                  This is ishk. This is slow living. This is what matters.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}





