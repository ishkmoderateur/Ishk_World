"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Heart, TrendingUp, Target, ArrowRight, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function AssociationPage() {
  const { t } = useLanguage();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns?active=true");
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (raised: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min(100, Math.round((raised / goal) * 100));
  };

  const formatGoal = (goal: number, category?: string) => {
    if (category && category.toLowerCase().includes("tree")) {
      return `${goal.toLocaleString()} trees`;
    }
    return `€${goal.toLocaleString()}`;
  };

  const formatRaised = (raised: number, category?: string) => {
    if (category && category.toLowerCase().includes("tree")) {
      return `${raised.toLocaleString()} trees`;
    }
    return `€${raised.toLocaleString()}`;
  };


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
              {t("association.hero.title")}
            </h1>
            <p className="text-xl md:text-2xl text-charcoal/70 mb-8 max-w-3xl mx-auto leading-relaxed">
              {t("association.hero.description")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const campaignsSection = document.getElementById('active-campaigns');
                if (campaignsSection) {
                  campaignsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="px-8 py-4 bg-coral text-white rounded-full font-medium hover:bg-coral/90 transition-colors flex items-center gap-2 mx-auto"
            >
              {t("association.hero.exploreCampaigns")}
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

      {/* Active Campaigns */}
      <section id="active-campaigns" className="py-16 px-4 md:px-8 bg-gradient-to-br from-coral/5 to-amber/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              {t("association.campaigns.title")}
            </h2>
            <p className="text-charcoal/60 text-lg">
              {t("association.campaigns.description")}
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12 text-charcoal/60">{t("common.loading")}</div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 text-charcoal/60">No active campaigns found</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {campaigns.map((campaign, index) => {
                const progress = calculateProgress(campaign.raised, campaign.goal);
                const goalFormatted = formatGoal(campaign.goal, campaign.category);
                const raisedFormatted = formatRaised(campaign.raised, campaign.category);
                const imageGradient = campaign.image || "bg-gradient-to-br from-coral/20 to-amber/20";
                
                return (
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
                    <div className={`h-48 ${imageGradient} relative`}>
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
                            {raisedFormatted}
                          </span>
                          <span className="text-sm text-charcoal/60">
                            {t("association.common.of")} {goalFormatted}
                          </span>
                        </div>
                        <div className="w-full bg-coral/10 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3 }}
                            className="h-full bg-coral rounded-full"
                          />
                        </div>
                        <div className="text-right mt-1">
                          <span className="text-sm text-charcoal/60">
                            {progress}% {t("association.common.complete")}
                          </span>
                        </div>
                      </div>

                      {/* Impact */}
                      {campaign.impact && (
                        <div className="flex items-center gap-2 mb-6 text-coral">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{campaign.impact}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <motion.a
                          href="https://www.paypal.com/donate"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 py-3 bg-coral text-white rounded-full font-medium hover:bg-coral/90 transition-colors text-center"
                        >
                          {t("association.common.donate")}
                        </motion.a>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-6 py-3 border border-coral/30 text-coral rounded-full font-medium hover:bg-coral/5 transition-colors"
                        >
                          {t("association.common.learnMore")}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
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
              {t("association.transparency.title")}
            </h2>
            <p className="text-charcoal/60 text-lg max-w-2xl mx-auto">
              {t("association.transparency.description")}
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
                {t("association.transparency.trackImpact.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("association.transparency.trackImpact.description")}
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
                {t("association.transparency.verifiedPartners.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("association.transparency.verifiedPartners.description")}
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
                {t("association.transparency.regularUpdates.title")}
              </h3>
              <p className="text-charcoal/60">
                {t("association.transparency.regularUpdates.description")}
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
              {t("association.cta.title")}
            </h2>
            <p className="text-charcoal/60 text-lg mb-8">
              {t("association.cta.description")}
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log("💚 Start Making an Impact clicked");
                
                // Scroll to campaigns section
                const scrollToCampaigns = () => {
                  const campaignsSection = document.getElementById('active-campaigns');
                  if (campaignsSection) {
                    console.log("💚 Found campaigns section, scrolling...");
                    
                    // Method 1: scrollIntoView with options
                    campaignsSection.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start',
                      inline: 'nearest'
                    });
                    
                    // Method 2: Calculate position and scroll (backup)
                    setTimeout(() => {
                      const rect = campaignsSection.getBoundingClientRect();
                      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                      const targetPosition = rect.top + scrollTop - 100;
                      
                      window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                      });
                    }, 50);
                  } else {
                    console.error("❌ Campaigns section not found!");
                    // Try again after a short delay in case DOM isn't ready
                    setTimeout(scrollToCampaigns, 200);
                  }
                };
                
                // Try immediately and also after delays
                scrollToCampaigns();
                setTimeout(scrollToCampaigns, 100);
                setTimeout(scrollToCampaigns, 300);
              }}
              className="px-8 py-4 bg-coral text-white rounded-full font-medium hover:bg-coral/90 transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              {t("association.cta.startMakingImpact")}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
