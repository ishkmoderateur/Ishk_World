"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MessageCircle, Mail, Phone, Send, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

function ContactForm() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const inquiryType = params.get("type"); // "order" for cart inquiries
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartDetails, setCartDetails] = useState<any>(null);

  useEffect(() => {
    // Load cart details if this is an order inquiry
    if (inquiryType === "order") {
      const stored = sessionStorage.getItem("cart_inquiry");
      if (stored) {
        try {
          const details = JSON.parse(stored);
          setCartDetails(details);
          // Pre-fill message with cart summary
          const itemsList = details.items.map((item: any) => 
            `- ${item.name} (Qty: ${item.quantity}${item.size ? `, Size: ${item.size}` : ""}${item.color ? `, Color: ${item.color}` : ""}) - ${details.currency === "USD" ? "$" : details.currency === "EUR" ? "€" : details.currency === "GBP" ? "£" : ""}${(item.price * item.quantity).toFixed(2)}`
          ).join("\n");
          
          setMessage(`Hello,\n\nI would like to place an order for the following items:\n\n${itemsList}\n\nSubtotal: ${details.currency === "USD" ? "$" : details.currency === "EUR" ? "€" : details.currency === "GBP" ? "£" : ""}${details.subtotal.toFixed(2)}\nShipping: ${details.currency === "USD" ? "$" : details.currency === "EUR" ? "€" : details.currency === "GBP" ? "£" : ""}${details.shipping.toFixed(2)}\nTotal: ${details.currency === "USD" ? "$" : details.currency === "EUR" ? "€" : details.currency === "GBP" ? "£" : ""}${details.total.toFixed(2)}\n\nPlease contact me to complete this order.\n\nThank you!`);
        } catch (e) {
          console.error("Failed to parse cart details:", e);
        }
      }
    }
    
    // Pre-fill user info if logged in
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [inquiryType, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          message,
          type: inquiryType || "general",
          cartDetails: inquiryType === "order" ? cartDetails : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        // Clear cart inquiry from storage
        if (inquiryType === "order") {
          sessionStorage.removeItem("cart_inquiry");
        }
      } else {
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <MessageCircle className="w-10 h-10 text-sage" />
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
              {inquiryType === "order" ? "Order Inquiry" : "Contact Us"}
            </h1>
            <p className="text-lg text-charcoal/60">
              {inquiryType === "order" 
                ? "Get in touch with our team to complete your order"
                : "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm"
            >
              {success ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sage/20 mb-4">
                    <Mail className="w-8 h-8 text-sage" />
                  </div>
                  <h2 className="text-2xl font-heading font-bold text-charcoal mb-2">
                    Message Sent!
                  </h2>
                  <p className="text-charcoal/60 mb-6">
                    We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Message *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage resize-none"
                      required
                    />
                  </div>
                  {error && (
                    <div className="rounded-lg border border-coral/30 bg-coral/10 text-coral px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
                <h2 className="text-2xl font-heading font-bold text-charcoal mb-6">
                  Get in Touch
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-sage" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Email</h3>
                      <a href="mailto:contact@ishk.com" className="text-charcoal/60 hover:text-sage transition-colors">
                        contact@ishk.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-sage/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-sage" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal mb-1">Phone</h3>
                      <a href="tel:+212612345678" className="text-charcoal/60 hover:text-sage transition-colors">
                        +212 6 12 34 56 78
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {cartDetails && (
                <div className="bg-sage/5 rounded-2xl p-6 border border-sage/20">
                  <h3 className="font-semibold text-charcoal mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm text-charcoal/70">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{cartDetails.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{cartDetails.currency === "USD" ? "$" : cartDetails.currency === "EUR" ? "€" : cartDetails.currency === "GBP" ? "£" : ""}{cartDetails.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>{cartDetails.currency === "USD" ? "$" : cartDetails.currency === "EUR" ? "€" : cartDetails.currency === "GBP" ? "£" : ""}{cartDetails.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-charcoal pt-2 border-t border-sage/20">
                      <span>Total:</span>
                      <span>{cartDetails.currency === "USD" ? "$" : cartDetails.currency === "EUR" ? "€" : cartDetails.currency === "GBP" ? "£" : ""}{cartDetails.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-24 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sage mx-auto mb-4" />
          <p className="text-charcoal/60">Loading...</p>
        </div>
        <Footer />
      </main>
    }>
      <ContactForm />
    </Suspense>
  );
}




