"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, User, LogIn, UserPlus, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "@/contexts/cart-context";
import { isAdmin } from "@/lib/roles";

export default function Navbar() {
  const { t, language } = useLanguage();
  const { data: session, status } = useSession();
  const { itemCount } = useCart();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering auth-dependent content after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/boutique", label: t("nav.boutique") },
    { href: "/party", label: t("nav.services") },
    { href: "/photography", label: t("nav.photography") },
    { href: "/association", label: t("nav.association") },
  ];

  // Pages with light backgrounds that need dark text
  const lightBackgroundPages = [
    "/auth/signin",
    "/auth/register",
    "/auth/signout",
    "/profile",
    "/cart",
    "/boutique",
    "/party",
    "/association",
    "/photography",
    "/admin",
  ];

  // Check if current page has a light background
  const hasLightBackground = lightBackgroundPages.some((page) => 
    pathname?.startsWith(page)
  );

  // Use dark text if scrolled (white background) OR on light background pages
  const textColor = (isScrolled || hasLightBackground) ? "text-charcoal" : "text-white";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || hasLightBackground
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.span
              className={`text-2xl font-display font-bold transition-colors ${textColor}`}
              whileHover={{ scale: 1.05 }}
            >
              {language === "AR" ? "عشق" : "ishk."}
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={`${link.href}-${link.label}-${index}`}
                href={link.href}
                className={`font-medium transition-colors hover:text-primary ${textColor}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center gap-3 ml-6">
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link
                href="/cart"
                className={`relative p-2.5 rounded-lg transition-colors duration-200 ${textColor} hover:text-sage`}
                title="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className={`absolute ${itemCount > 9 ? '-top-0.5 right-0 min-w-[18px] h-[18px] px-1' : '-top-1 -right-1 w-5 h-5'} bg-coral text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-md pointer-events-none leading-none`}>
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {mounted && status === "authenticated" ? (
              <>
                <motion.div whileHover={{ y: -3 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Link
                    href={isAdmin(session.user?.role) ? "/admin" : "/profile"}
                    className={`p-2.5 rounded-lg transition-colors duration-200 ${textColor} hover:text-sage`}
                    title={isAdmin(session.user?.role) ? "Admin Panel" : (session.user?.email || "Profile")}
                  >
                    <User className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className={`p-2.5 rounded-lg transition-colors duration-200 ${textColor} hover:text-coral`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            ) : (
              <>
                <motion.div 
                  whileHover={{ y: -3 }} 
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href="/auth/signin"
                    className={`p-2.5 rounded-lg transition-colors duration-200 ${textColor} hover:text-sage`}
                    title="Login"
                  >
                    <LogIn className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -3 }} 
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Link
                    href="/auth/register"
                    className={`p-2.5 rounded-lg transition-colors duration-200 ${textColor} hover:text-sage`}
                    title="Register"
                  >
                    <UserPlus className="w-5 h-5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 ${textColor}`}
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
            {navLinks.map((link, index) => (
              <Link
                key={`${link.href}-${link.label}-${index}`}
                href={link.href}
                className="block px-4 py-3 text-charcoal hover:bg-cream transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-charcoal/10 mt-2 pt-2">
              <Link
                href="/cart"
                className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-cream transition-colors relative"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className={`absolute ${itemCount > 9 ? '-top-0.5 right-0 min-w-[18px] h-[18px] px-1' : '-top-1 -right-1 w-5 h-5'} bg-coral text-white text-xs rounded-full flex items-center justify-center font-medium leading-none`}>
                      {itemCount > 99 ? '99+' : itemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>
              {mounted && status === "authenticated" ? (
                <>
                  <Link
                    href={isAdmin(session.user?.role) ? "/admin" : "/profile"}
                    className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-cream transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>{isAdmin(session.user?.role) ? "Admin Panel" : "Profile"}</span>
                  </Link>
                  <button
                    className="flex items-center gap-3 w-full text-left px-4 py-3 text-charcoal hover:bg-cream transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-cream transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    href="/auth/register"
                    className="flex items-center gap-3 px-4 py-3 text-charcoal hover:bg-cream transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}

