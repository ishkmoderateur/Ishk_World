"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { User, Package, Heart, Settings, LogOut, Mail, Phone, Edit, ArrowRight } from "lucide-react";

export default function ProfilePage() {
  const menuItems = [
    { icon: Package, label: "Orders", count: 3, href: "#orders", color: "sage" },
    { icon: Heart, label: "Wishlist", count: 5, href: "#wishlist", color: "coral" },
    { icon: Settings, label: "Settings", href: "#settings", color: "amber" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-sand/5 to-cream"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <User className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
              My Profile
            </h1>
            <p className="text-lg text-charcoal/60">
              Manage your account and preferences
            </p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm mb-8"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-sage/20 to-sand/20 flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-sage" />
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-sage text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sage/90 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-2">
                  Welcome Back
                </h2>
                <p className="text-charcoal/60 mb-6">
                  Manage your account and preferences
                </p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-charcoal/70">
                    <Mail className="w-5 h-5 text-sage" />
                    <span>user@example.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-charcoal/70">
                    <Phone className="w-5 h-5 text-sage" />
                    <span>+33 6 12 34 56 78</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 border-2 border-sage/30 text-sage rounded-full font-medium hover:bg-sage/5 transition-colors flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-sage/10 flex items-center justify-center">
                  <Package className="w-7 h-7 text-sage" />
                </div>
                <span className="text-3xl font-bold text-charcoal">3</span>
              </div>
              <h3 className="font-medium text-charcoal">Total Orders</h3>
              <p className="text-sm text-charcoal/60 mt-1">View all orders</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-coral/10 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-coral" />
                </div>
                <span className="text-3xl font-bold text-charcoal">5</span>
              </div>
              <h3 className="font-medium text-charcoal">Wishlist Items</h3>
              <p className="text-sm text-charcoal/60 mt-1">Saved favorites</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-amber/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-amber" />
                </div>
                <span className="text-lg font-bold text-charcoal">Member</span>
              </div>
              <h3 className="font-medium text-charcoal">Account Status</h3>
              <p className="text-sm text-charcoal/60 mt-1">Active membership</p>
            </motion.div>
          </div>

          {/* Menu Items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const getColorClasses = (color: string) => {
                switch (color) {
                  case "sage":
                    return { bg: "bg-sage/10", text: "text-sage" };
                  case "coral":
                    return { bg: "bg-coral/10", text: "text-coral" };
                  case "amber":
                    return { bg: "bg-amber/10", text: "text-amber" };
                  default:
                    return { bg: "bg-sage/10", text: "text-sage" };
                }
              };
              const colors = getColorClasses(item.color);
              
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-all text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-7 h-7 ${colors.text}`} />
                    </div>
                    {item.count !== undefined && (
                      <span className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-sm font-medium`}>
                        {item.count}
                      </span>
                    )}
                    <ArrowRight className="w-5 h-5 text-charcoal/40 group-hover:text-charcoal group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-charcoal">
                    {item.label}
                  </h3>
                </motion.button>
              );
            })}
          </div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-charcoal">
                Recent Orders
              </h2>
              <button className="text-sage hover:text-sage/80 text-sm font-medium flex items-center gap-1">
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((order) => (
                <div
                  key={order}
                  className="flex items-center justify-between p-4 bg-cream/30 rounded-xl hover:bg-cream/50 transition-colors border border-sage/5"
                >
                  <div>
                    <p className="font-semibold text-charcoal">Order #{1000 + order}</p>
                    <p className="text-sm text-charcoal/60">Placed on Dec {order}, 2025</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-charcoal">€{85 + order * 10}</p>
                    <p className="text-sm text-sage font-medium">Delivered</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 text-center"
          >
            <button className="inline-flex items-center gap-2 px-6 py-3 text-charcoal/60 hover:text-coral transition-colors border border-charcoal/10 hover:border-coral/30 rounded-full">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
