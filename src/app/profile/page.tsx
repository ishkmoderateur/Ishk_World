"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { User, Package, Heart, Settings, LogOut, Mail, Edit, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllOrders, setShowAllOrders] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Add a small delay to ensure the page is ready
      setTimeout(() => {
        const yOffset = -100; // Offset for fixed navbar
        const elementTop = section.getBoundingClientRect().top;
        const elementPosition = elementTop + window.pageYOffset;
        const offsetPosition = elementPosition + yOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }, 100);
    } else {
      console.warn(`Section with id "${sectionId}" not found`);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin?callbackUrl=/profile");
      return;
    }
    if (status === "authenticated" && session?.user) {
      fetchUserData();
    }
  }, [status, session, router]);

  // Handle hash navigation from URL
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove the #
      setTimeout(() => {
        scrollToSection(hash);
      }, 500); // Wait for page to load
    }
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch orders
      const ordersResponse = await fetch("/api/orders");
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        // Handle both array and object with orders property
        setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.orders || []));
      }

      // Fetch wishlist items
      const wishlistResponse = await fetch("/api/wishlist");
      if (wishlistResponse.ok) {
        const wishlistData = await wishlistResponse.json();
        setWishlistItems(wishlistData.items || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // Remove from local state
        setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const menuItems = [
    { icon: Package, label: "Orders", count: orders.length, sectionId: "orders", color: "sage" },
    { icon: Heart, label: "Wishlist", count: wishlistItems.length, sectionId: "wishlist", color: "coral" },
    { icon: Settings, label: "Settings", sectionId: "settings", color: "amber" },
  ];

  const handleEditProfile = () => {
    scrollToSection("settings");
  };

  const handleViewAllOrders = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("View All button clicked, current showAllOrders:", showAllOrders);
    
    // Toggle showing all orders
    const newShowAll = !showAllOrders;
    setShowAllOrders(newShowAll);
    
    console.log("Setting showAllOrders to:", newShowAll);
    
    // Scroll to orders section to ensure it's visible
    setTimeout(() => {
      scrollToSection("orders");
    }, 150);
  };

  const handleMenuClick = (sectionId: string) => {
    scrollToSection(sectionId);
  };

  if (loading || status === "loading") {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="pt-32 pb-16 px-4 md:px-8 text-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

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
                <button 
                  onClick={handleEditProfile}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-sage text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sage/90 transition-colors"
                  title="Edit profile picture"
                >
                  <Edit className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-heading font-bold text-charcoal mb-2">
                  {session.user.name || "Welcome Back"}
                </h2>
                <p className="text-charcoal/60 mb-6">
                  Manage your account and preferences
                </p>
                <div className="flex flex-wrap gap-6 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-charcoal/70">
                    <Mail className="w-5 h-5 text-sage" />
                    <span>{session.user.email || "No email"}</span>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEditProfile}
                className="px-6 py-3 border-2 border-sage/30 text-sage rounded-full font-medium hover:bg-sage/5 transition-colors flex items-center gap-2"
              >
                <Edit className="w-5 h-5" />
                Edit Profile
              </motion.button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.button
              onClick={handleViewAllOrders}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-shadow text-left w-full cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-sage/10 flex items-center justify-center">
                  <Package className="w-7 h-7 text-sage" />
                </div>
                <span className="text-3xl font-bold text-charcoal">{orders.length}</span>
              </div>
              <h3 className="font-medium text-charcoal">Total Orders</h3>
              <p className="text-sm text-charcoal/60 mt-1">View all orders</p>
            </motion.button>
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
                <span className="text-3xl font-bold text-charcoal">{wishlistItems.length}</span>
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
                  onClick={() => handleMenuClick(item.sectionId)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm hover:shadow-md transition-all text-left group cursor-pointer w-full"
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
            id="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-charcoal">
                Recent Orders
              </h2>
              {orders.length > 5 && (
                <button 
                  onClick={handleViewAllOrders}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="text-sage hover:text-sage/80 active:text-sage/60 text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-sage/20 rounded px-2 py-1 -mr-2 relative z-10"
                  type="button"
                  aria-label={showAllOrders ? "Show fewer orders" : "Show all orders"}
                >
                  {showAllOrders ? "Show Less" : `View All (${orders.length})`}
                  <ArrowRight className={`w-4 h-4 transition-transform ${showAllOrders ? "rotate-90" : ""}`} />
                </button>
              )}
            </div>
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-charcoal/60">
                  No orders yet. Start shopping to see your orders here!
                </div>
              ) : (
                (showAllOrders ? orders : orders.slice(0, 5)).map((order) => (
                  <Link
                    key={order.id}
                    href={`/profile?order=${order.id}`}
                    className="block"
                  >
                    <div className="flex items-center justify-between p-4 bg-cream/30 rounded-xl hover:bg-cream/50 transition-colors border border-sage/5 cursor-pointer">
                      <div>
                        <p className="font-semibold text-charcoal">{order.orderNumber || `Order #${order.id.slice(0, 8)}`}</p>
                        <p className="text-sm text-charcoal/60">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-charcoal">€{order.total?.toFixed(2) || "0.00"}</p>
                        <p className="text-sm text-sage font-medium">{order.status || "Pending"}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </motion.div>

          {/* Wishlist Section */}
          <motion.div
            id="wishlist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm mt-8"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              My Wishlist ({wishlistItems.length})
            </h2>
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12 text-charcoal/60">
                <Heart className="w-16 h-16 mx-auto mb-4 text-charcoal/20" />
                <p className="text-lg mb-2">Your wishlist is empty</p>
                <p className="text-sm mb-6">Start adding products to your wishlist!</p>
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage/90 transition-colors"
                >
                  Browse Products
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wishlistItems.map((item) => {
                  const product = item.product;
                  const productImage = Array.isArray(product.images) && product.images.length > 0 
                    ? product.images[0] 
                    : null;
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-cream/30 rounded-xl border border-sage/5 overflow-hidden hover:shadow-md transition-all group"
                    >
                      <Link href={`/boutique/${product.slug}`} className="block">
                        <div className="relative h-48 bg-gradient-to-br from-sage/20 to-sand/20">
                          {productImage && (
                            <Image
                              src={productImage}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-charcoal mb-2 line-clamp-2">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-sage">
                                €{product.price.toFixed(2)}
                              </p>
                              {product.comparePrice && product.comparePrice > product.price && (
                                <p className="text-sm text-charcoal/60 line-through">
                                  €{product.comparePrice.toFixed(2)}
                                </p>
                              )}
                            </div>
                            {!product.inStock && (
                              <span className="text-xs bg-coral/10 text-coral px-2 py-1 rounded">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div className="px-4 pb-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFromWishlist(product.id);
                          }}
                          className="w-full px-4 py-2 border border-coral/30 text-coral rounded-lg hover:bg-coral/10 transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                          <Heart className="w-4 h-4 fill-coral" />
                          Remove from Wishlist
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Settings Section */}
          <motion.div
            id="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white rounded-2xl p-6 border border-sage/10 shadow-sm mt-8"
          >
            <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
              Account Settings
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-cream/30 rounded-xl border border-sage/5">
                <h3 className="font-semibold text-charcoal mb-2">Email Address</h3>
                <p className="text-charcoal/60 mb-3">{session.user.email || "No email"}</p>
                <button className="text-sm text-sage hover:text-sage/80 font-medium">
                  Change Email
                </button>
              </div>
              <div className="p-4 bg-cream/30 rounded-xl border border-sage/5">
                <h3 className="font-semibold text-charcoal mb-2">Password</h3>
                <p className="text-charcoal/60 mb-3">••••••••</p>
                <button className="text-sm text-sage hover:text-sage/80 font-medium">
                  Change Password
                </button>
              </div>
              <div className="p-4 bg-cream/30 rounded-xl border border-sage/5">
                <h3 className="font-semibold text-charcoal mb-2">Notifications</h3>
                <p className="text-charcoal/60 mb-3">Manage your notification preferences</p>
                <button className="text-sm text-sage hover:text-sage/80 font-medium">
                  Configure
                </button>
              </div>
            </div>
          </motion.div>

          {/* Logout Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 text-center"
          >
            <button 
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-3 text-charcoal/60 hover:text-coral transition-colors border border-charcoal/10 hover:border-coral/30 rounded-full"
            >
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
