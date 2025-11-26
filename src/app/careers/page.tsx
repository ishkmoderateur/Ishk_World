"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Briefcase, Users, Heart, Sparkles, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const benefits = [
    {
      icon: Heart,
      title: "Purpose-Driven Work",
      description: "Join a team that's making a real difference in how people connect and live.",
    },
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "Work with passionate, creative individuals who value teamwork and innovation.",
    },
    {
      icon: Sparkles,
      title: "Growth Opportunities",
      description: "Continuous learning and development in a supportive environment.",
    },
    {
      icon: Briefcase,
      title: "Flexible Work",
      description: "Balance your professional and personal life with flexible arrangements.",
    },
  ];

  const openPositions = [
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "Content Creator",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
    },
    {
      title: "Community Manager",
      department: "Community",
      location: "Remote",
      type: "Full-time",
    },
    {
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
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
              <Briefcase className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-6">
              Join Our Team
            </h1>
            <p className="text-lg text-charcoal/70 leading-relaxed max-w-2xl mx-auto">
              We're building something meaningful. If you're passionate about slow living, 
              sustainability, and creating authentic connections, we'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Why Work With Us
            </h2>
            <p className="text-lg text-charcoal/60">
              What makes ishk. a great place to grow your career
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm"
                >
                  <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <h3 className="text-2xl font-heading font-bold text-charcoal mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-4 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              Open Positions
            </h2>
            <p className="text-lg text-charcoal/60">
              Explore current opportunities to join our team
            </p>
          </motion.div>

          <div className="space-y-4">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-sage/5 rounded-xl p-6 border border-sage/10 hover:border-sage/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-charcoal mb-2">
                      {position.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-charcoal/60">
                      <span>{position.department}</span>
                      <span>•</span>
                      <span>{position.location}</span>
                      <span>•</span>
                      <span>{position.type}</span>
                    </div>
                  </div>
                  <Link
                    href="/contact?subject=Job Application"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-lg font-medium hover:bg-sage/90 transition-colors"
                  >
                    Apply Now
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
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
              Don't See a Role That Fits?
            </h2>
            <p className="text-lg text-charcoal/70 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who share our values. 
              Send us your resume and let us know how you'd like to contribute.
            </p>
            <Link
              href="/contact?subject=General Application"
              className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}




