"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function Navbar() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/news", label: t("nav.news") },
    { href: "/party", label: t("nav.party") },
    { href: "/boutique", label: t("nav.boutique") },
    { href: "/association", label: t("nav.association") },
    { href: "/photography", label: t("nav.photography") },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className={`text-2xl font-display font-bold transition-colors ${
                isScrolled ? "text-charcoal" : "text-white"
              }`}
              whileHover={{ scale: 1.05 }}
            >
              ishk.
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-medium transition-colors hover:text-primary ${
                  isScrolled ? "text-charcoal" : "text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions - Cart & Profile */}
          <div className="hidden md:flex items-center gap-2 ml-6">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/cart"
                className={`relative p-2.5 rounded-lg transition-colors duration-200 ${
                  isScrolled
                    ? "text-charcoal hover:text-sage"
                    : "text-white hover:text-cream"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {/* Cart Badge - can be dynamic based on cart items */}
                <span className="absolute top-0.5 right-0.5 w-4.5 h-4.5 bg-coral text-white text-[10px] rounded-full flex items-center justify-center font-semibold shadow-md pointer-events-none">
                  2
                </span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/profile"
                className={`p-2.5 rounded-lg transition-colors duration-200 ${
                  isScrolled
                    ? "text-charcoal hover:text-sage"
                    : "text-white hover:text-cream"
                }`}
              >
                <User className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${
              isScrolled ? "text-charcoal" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden pb-4 bg-white/95 backdrop-blur-md rounded-b-2xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-charcoal hover:bg-cream transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Mobile Cart & Profile */}
            <div className="border-t border-charcoal/10 mt-2 pt-2">
              <Link
                href="/cart"
                className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-cream transition-colors relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-coral text-white text-xs rounded-full flex items-center justify-center font-medium">
                    2
                  </span>
                </div>
                <span>Cart</span>
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-cream transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}


