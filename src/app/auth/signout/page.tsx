"use client";

import { useEffect, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function SignOutForm() {
  const params = useSearchParams();
  const callbackUrlParam = params.get("callbackUrl") || "/";
  // Ensure callbackUrl uses current origin, not NEXTAUTH_URL
  const callbackUrl = callbackUrlParam.startsWith("http") 
    ? callbackUrlParam 
    : window.location.origin + callbackUrlParam;

  useEffect(() => {
    // Trigger sign out on mount, then redirect back
    signOut({ callbackUrl });
  }, [callbackUrl]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />
      <section className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm text-center"
          >
            <p className="text-charcoal/70">Signing you out...</p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default function SignOutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <section className="pt-32 pb-16 px-4 md:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm text-center">
              <p className="text-charcoal/70">Signing you out...</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <SignOutForm />
    </Suspense>
  );
}





