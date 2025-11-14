"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Heart } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    services: [
      { href: "/news", label: "World News" },
      { href: "/party", label: "Party" },
      { href: "/boutique", label: "Boutique" },
      { href: "/association", label: "Association" },
      { href: "/photography", label: "Photography" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/philosophy", label: "Philosophy" },
      { href: "/contact", label: "Contact" },
      { href: "/careers", label: "Careers" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/shipping", label: "Shipping Info" },
      { href: "/returns", label: "Returns" },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Mail, href: "mailto:hello@ishk.com", label: "Email" },
  ];

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-display font-bold mb-4">ishk.</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              Slow living closer to what really matters. Join us in creating a
              more conscious, connected, and meaningful way of life.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} ishk. All rights reserved.
          </p>
          <p className="text-white/60 text-sm flex items-center gap-2">
            Made with <Heart className="w-4 h-4 text-coral" /> for mindful living
          </p>
        </div>
      </div>
    </footer>
  );
}







