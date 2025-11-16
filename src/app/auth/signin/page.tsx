"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, LogIn, Loader2, Globe } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { update } = useSession();
  const callbackUrl = params.get("callbackUrl") || "/profile";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      console.log("🔐 Client: Attempting login for:", email);
      console.log("🔐 Client: Credentials prepared:", { 
        email: email ? "***" : "MISSING", 
        hasPassword: !!password,
        passwordLength: password.length 
      });
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(), // Normalize email
        password,
        callbackUrl,
      });
      console.log("🔐 Client: SignIn response:", JSON.stringify(res, null, 2));
      
      if (!res) {
        console.error("❌ Client: No response from signIn");
        setError("Unexpected error. Please try again.");
        setLoading(false);
        return;
      }
      
      if (res.error) {
        // Log as info since this is expected behavior for invalid credentials
        console.log("🔐 Client: SignIn failed:", res.error === "CredentialsSignin" ? "Invalid credentials" : res.error);
        setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        setLoading(false);
        return;
      }
      
      if (res.ok) {
        console.log("✅ Client: Login successful, redirecting to:", res.url || callbackUrl);
        // Update session to ensure it's synced before redirect
        try {
          await update();
          console.log("✅ Client: Session updated successfully");
        } catch (sessionError) {
          console.warn("⚠️ Client: Session update warning (might still work):", sessionError);
        }
        // Use window.location for a full page reload to ensure session is picked up
        window.location.href = res.url || callbackUrl;
      } else {
        console.error("❌ Client: SignIn not OK:", res);
        setError("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Client: Exception during login:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
      <Navbar />

      <section className="pt-32 pb-16 px-4 md:px-8">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm"
          >
            <h1 className="text-3xl font-heading font-bold text-charcoal mb-2">
              Sign in
            </h1>
            <p className="text-charcoal/60 mb-6">
              Welcome back. Please enter your details.
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-coral/30 bg-coral/10 text-coral px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Sign in
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-sage/20 flex-1" />
              <span className="text-sm text-charcoal/50">or</span>
              <div className="h-px bg-sage/20 flex-1" />
            </div>

            <button
              onClick={onGoogle}
              disabled={loading}
              className="w-full py-3 border border-sage/20 rounded-xl font-medium hover:bg-sage/5 transition-colors flex items-center justify-center gap-2 text-charcoal"
            >
              <Globe className="w-4 h-4" />
              Continue with Google
            </button>

            <p className="text-sm text-charcoal/60 mt-6 text-center">
              Don&apos;t have an account?{" "}
              <Link className="text-sage hover:text-sage/80 font-medium" href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
                Register
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


