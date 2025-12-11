"use client";

import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function Footer() {
  const { t } = useLanguage();
  
  const footerLinks = {
    services: [
      { href: "/news", label: t("footer.links.worldNews") },
      { href: "/party", label: t("footer.links.party") },
      { href: "/boutique", label: t("footer.links.boutique") },
      { href: "/association", label: t("footer.links.association") },
      { href: "/photography", label: t("footer.links.photography") },
    ],
    company: [
      { href: "/about", label: t("footer.links.aboutUs") },
      { href: "/philosophy", label: t("footer.links.philosophy") },
      { href: "/contact", label: t("footer.links.contact") },
      { href: "/careers", label: t("footer.links.careers") },
    ],
    legal: [
      { href: "/privacy", label: t("footer.links.privacyPolicy") },
      { href: "/terms", label: t("footer.links.termsOfService") },
      { href: "/shipping", label: t("footer.links.shippingInfo") },
      { href: "/returns", label: t("footer.links.returns") },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: t("footer.social.instagram"), external: true },
    { icon: Facebook, href: "https://facebook.com", label: t("footer.social.facebook"), external: true },
    { icon: Twitter, href: "https://x.com", label: t("footer.social.twitter"), external: true },
    { icon: Mail, href: "/social/email", label: t("footer.social.email"), external: false },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-display font-bold mb-4">ishk.</h3>
            <p className="text-white/70 mb-6 leading-relaxed">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                if (social.external) {
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6B8E6F] transition-colors"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                }
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#6B8E6F] transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("footer.services")}</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#6B8E6F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#6B8E6F] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-[#6B8E6F] transition-colors"
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
            © {new Date().getFullYear()} ishk. {t("footer.copyright")}
          </p>
          <p className="text-white/60 text-sm flex items-center gap-2">
            {t("footer.madeWith")} <Heart className="w-4 h-4 text-[#E07A5F]" /> {t("footer.forMindfulLiving")}
          </p>
        </div>
      </div>
    </footer>
  );
}










