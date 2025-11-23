"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle, Package, ArrowRight, Loader2, Home } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [orderVerified, setOrderVerified] = useState(false);

  useEffect(() => {
    // Wait a bit for session to load after Stripe redirect
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Try to verify order if we have session and sessionId
      if (sessionId && status === "authenticated" && session?.user) {
        verifyAndCreateOrder();
      }
    }, 1000); // Give NextAuth time to restore session

    return () => clearTimeout(timer);
  }, [session, status, sessionId]);

  const verifyAndCreateOrder = async () => {
    if (!sessionId || orderVerified) return;
    
    try {
      const response = await fetch("/api/orders/verify-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Order verification:", data.message);
        if (data.order) {
          console.log("✅ Order created/verified:", data.order.orderNumber);
          setOrderVerified(true);
        }
      } else {
        const error = await response.json();
        console.error("⚠️ Order verification failed:", error.error);
        // Still show success page - webhook might handle it later
      }
    } catch (error) {
      console.error("❌ Error verifying order:", error);
      // Still show success page
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-24 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sage mx-auto mb-4" />
          <p className="text-charcoal/60">Processing your order...</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 border border-sage/10 shadow-sm text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sage/20 mb-6">
              <CheckCircle className="w-12 h-12 text-sage" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-charcoal mb-4">
              Thank You for Your Purchase! 🎉
            </h1>
            
            <p className="text-lg text-charcoal/70 mb-2">
              Your order has been successfully received and is being processed.
            </p>
            <p className="text-md text-charcoal/60 mb-8">
              We'll send you a confirmation email shortly with your order details.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors shadow-lg"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
              {session?.user && (
                <Link
                  href="/profile"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-sage/30 text-sage rounded-xl font-medium hover:bg-sage/5 transition-colors"
                >
                  <Package className="w-5 h-5" />
                  View Orders
                </Link>
              )}
              <Link
                href="/boutique"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-sage/30 text-sage rounded-xl font-medium hover:bg-sage/5 transition-colors"
              >
                Continue Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 md:px-8 py-24 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-sage mx-auto mb-4" />
          <p className="text-charcoal/60">Loading...</p>
        </div>
        <Footer />
      </main>
    }>
      <SuccessContent />
    </Suspense>
  );
}

