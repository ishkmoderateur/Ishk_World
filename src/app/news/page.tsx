"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Map, Globe, Sparkles, ArrowRight, Clock, BookOpen } from "lucide-react";

export default function NewsPage() {
  const regions = [
    { name: "Europe", code: "eu", flag: "🇪🇺" },
    { name: "North America", code: "na", flag: "🇺🇸" },
    { name: "Asia", code: "as", flag: "🌏" },
    { name: "Africa", code: "af", flag: "🌍" },
    { name: "South America", code: "sa", flag: "🌎" },
    { name: "Oceania", code: "oc", flag: "🌊" },
  ];

  const newsBriefs = [
    {
      id: 1,
      title: "Climate Action Summit",
      region: "Global",
      summary: "World leaders gather to discuss new climate commitments and renewable energy transitions.",
      time: "2 hours ago",
      topics: ["Environment", "Politics"],
    },
    {
      id: 2,
      title: "Tech Innovation Breakthrough",
      region: "North America",
      summary: "New sustainable technology promises to reduce carbon emissions by 40% in manufacturing.",
      time: "5 hours ago",
      topics: ["Technology", "Sustainability"],
    },
    {
      id: 3,
      title: "Cultural Heritage Preservation",
      region: "Europe",
      summary: "Historic sites receive funding for restoration, preserving cultural identity for future generations.",
      time: "1 day ago",
      topics: ["Culture", "Heritage"],
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-navy via-navy/95 to-sky/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-sky/20 mb-6">
              <Globe className="w-12 h-12 text-sky" />
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              The World, Simplified
            </h1>
            <p className="text-xl md:text-2xl text-sky/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stay connected to what matters, without the noise. AI-powered news briefs that respect your time.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-sky text-white rounded-full font-medium hover:bg-sky/90 transition-colors flex items-center gap-2 mx-auto"
            >
              Choose Your Region
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-2 h-2 bg-sky rounded-full"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-3 h-3 bg-sky/60 rounded-full"
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.7, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>
      </section>

      {/* Interactive Globe Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Explore by Region
            </h2>
            <p className="text-sky/80 text-lg">
              Click on a region to see curated news briefs
            </p>
          </motion.div>

          {/* Globe Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative bg-navy/50 rounded-3xl p-12 mb-12 border border-sky/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Map className="w-32 h-32 text-sky/40 mx-auto mb-6" />
                <p className="text-sky/60 text-lg">
                  Interactive Globe Coming Soon
                </p>
                <p className="text-white/40 text-sm mt-2">
                  Click regions below to explore news
                </p>
              </div>
            </div>
          </motion.div>

          {/* Region Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {regions.map((region, index) => (
              <motion.button
                key={region.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-sky/20 hover:border-sky/40 hover:bg-white/15 transition-all cursor-pointer group"
              >
                <div className="text-4xl mb-3">{region.flag}</div>
                <div className="text-white font-medium text-sm">{region.name}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* News Briefs Section */}
      <section className="py-16 px-4 md:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky/20 mb-4">
              <Sparkles className="w-8 h-8 text-sky" />
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              Today's Curated Briefs
            </h2>
            <p className="text-sky/80 text-lg">
              AI-powered summaries of what matters most
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsBriefs.map((brief, index) => (
              <motion.div
                key={brief.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-sky/20 hover:border-sky/40 hover:bg-white/15 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-xs font-medium text-sky/80 bg-sky/10 px-3 py-1 rounded-full">
                    {brief.region}
                  </span>
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Clock className="w-3 h-3" />
                    {brief.time}
                  </div>
                </div>
                <h3 className="text-xl font-heading font-semibold text-white mb-3">
                  {brief.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {brief.summary}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {brief.topics.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs text-sky/70 bg-sky/5 px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
                <button className="text-sky hover:text-sky/80 text-sm font-medium flex items-center gap-2 group">
                  Read Full Brief
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <button className="px-8 py-3 bg-sky/20 text-sky rounded-full font-medium hover:bg-sky/30 transition-colors border border-sky/30">
              Load More Briefs
            </button>
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky/20 mb-4">
                <BookOpen className="w-8 h-8 text-sky" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">
                Curated Content
              </h3>
              <p className="text-white/60">
                Hand-picked stories that matter, filtered from the noise
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky/20 mb-4">
                <Sparkles className="w-8 h-8 text-sky" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">
                AI-Powered Summaries
              </h3>
              <p className="text-white/60">
                Get the essence of every story in minutes, not hours
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sky/20 mb-4">
                <Clock className="w-8 h-8 text-sky" />
              </div>
              <h3 className="text-xl font-heading font-semibold text-white mb-2">
                Time-Respecting
              </h3>
              <p className="text-white/60">
                Stay informed without sacrificing your peace of mind
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
