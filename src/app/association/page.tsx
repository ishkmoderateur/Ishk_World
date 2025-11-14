"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, TrendingUp, Users, Target, ArrowRight, CheckCircle, Leaf, Globe } from "lucide-react";

export default function AssociationPage() {
  const campaigns = [
    {
      id: 1,
      title: "Tree Planting Initiative",
      description: "Planting trees in deforested areas to restore ecosystems and combat climate change.",
      progress: 75,
      goal: "10,000 trees",
      raised: "7,500 trees",
      image: "bg-gradient-to-br from-forest/20 to-sage/20",
      category: "Environment",
      impact: "🌳 7,500 trees planted",
    },
    {
      id: 2,
      title: "Clean Water Access",
      description: "Providing clean water wells and filtration systems to communities in need.",
      progress: 45,
      goal: "€50,000",
      raised: "€22,500",
      image: "bg-gradient-to-br from-sky/20 to-sage/20",
      category: "Community",
      impact: "💧 15 wells installed",
    },
    {
      id: 3,
      title: "Education for All",
      description: "Supporting schools and providing educational materials to underserved communities.",
      progress: 60,
      goal: "€30,000",
      raised: "€18,000",
      image: "bg-gradient-to-br from-amber/20 to-coral/20",
      category: "Education",
      impact: "📚 500 students supported",
    },
    {
      id: 4,
      title: "Wildlife Conservation",
      description: "Protecting endangered species and their habitats through conservation efforts.",
      progress: 30,
      goal: "€75,000",
      raised: "€22,500",
      image: "bg-gradient-to-br from-forest/20 to-sand/20",
      category: "Wildlife",
      impact: "🦋 3 protected areas",
    },
  ];

  const impactStats = [
    { label: "Trees Planted", value: "12,500+", icon: Leaf },
    { label: "Lives Impacted", value: "5,000+", icon: Users },
    { label: "Projects Completed", value: "25+", icon: CheckCircle },
    { label: "Countries Reached", value: "12", icon: Globe },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-coral/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-amber/5 to-cream"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-coral/20 mb-6">
              <Heart className="w-12 h-12 text-coral" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-charcoal mb-6">
              Small Actions, Big Impact
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join a community that cares. Non-profit actions with complete transparency.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-coral text-white rounded-full font-medium hover:bg-coral/90 transition-colors flex items-center gap-2 mx-auto"
            >
              Explore Campaigns
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-3 h-3 bg-coral/30 rounded-full"
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

      {/* Impact Stats */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coral/10 mb-4">
                    <Icon className="w-8 h-8 text-coral" />
                  </div>
                  <div className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-2">
                    {stat.value}
                  </div>
                  <div className="text-charcoal/60">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Campaigns */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-coral/5 to-amber/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Active Campaigns
            </h2>
            <p className="text-charcoal/60 text-lg">
              Support causes that align with our values
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {campaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-coral/10"
              >
                {/* Image */}
                <div className={`h-48 ${campaign.image} relative`}>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-sm font-medium text-charcoal">
                      {campaign.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    {campaign.title}
                  </h3>
                  <p className="text-charcoal/60 mb-6 leading-relaxed">
                    {campaign.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-charcoal">
                        {campaign.raised}
                      </span>
                      <span className="text-sm text-charcoal/60">
                        of {campaign.goal}
                      </span>
                    </div>
                    <div className="w-full bg-coral/10 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${campaign.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="h-full bg-coral rounded-full"
                      />
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm text-charcoal/60">
                        {campaign.progress}% complete
                      </span>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="flex items-center gap-2 mb-6 text-coral">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{campaign.impact}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-3 bg-coral text-white rounded-full font-medium hover:bg-coral/90 transition-colors"
                    >
                      Donate Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 border border-coral/30 text-coral rounded-full font-medium hover:bg-coral/5 transition-colors"
                    >
                      Learn More
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-coral/20 mb-4">
              <Target className="w-8 h-8 text-coral" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Complete Transparency
            </h2>
            <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
              Every donation is tracked, every impact is measured, and every result is shared.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center p-6 bg-gradient-to-br from-coral/5 to-amber/5 rounded-2xl"
            >
              <TrendingUp className="w-12 h-12 text-coral mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                Track Your Impact
              </h3>
              <p className="text-charcoal/60">
                See exactly where your donation goes and the difference it makes
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-coral/5 to-amber/5 rounded-2xl"
            >
              <CheckCircle className="w-12 h-12 text-coral mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                Verified Partners
              </h3>
              <p className="text-charcoal/60">
                All our partner organizations are vetted and verified for maximum impact
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 bg-gradient-to-br from-coral/5 to-amber/5 rounded-2xl"
            >
              <Heart className="w-12 h-12 text-coral mx-auto mb-4" />
              <h3 className="text-xl font-heading font-semibold text-charcoal mb-2">
                Regular Updates
              </h3>
              <p className="text-charcoal/60">
                Receive updates on campaign progress and see the real-world impact
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-coral/10 to-amber/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Join the Movement
            </h2>
            <p className="text-charcoal/60 text-lg mb-8">
              Together, we can create meaningful change. Every contribution, no matter how small, makes a difference.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-coral text-white rounded-full font-medium hover:bg-coral/90 transition-colors inline-flex items-center gap-2"
            >
              Start Making an Impact
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
