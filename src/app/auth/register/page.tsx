"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, User, Loader2, UserPlus } from "lucide-react";
import { isAdmin } from "@/lib/roles";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { update } = useSession();
  const callbackUrl = params.get("callbackUrl");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Client-side validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirm.trim();
    
    console.log("🔐 Form submission triggered", {
      email: trimmedEmail ? "***" : "EMPTY",
      hasPassword: !!trimmedPassword,
      passwordLength: trimmedPassword.length,
      hasConfirm: !!trimmedConfirm,
      confirmLength: trimmedConfirm.length
    });
    
    if (!trimmedEmail) {
      setError("Email is required");
      setLoading(false);
      return;
    }
    
    if (!trimmedPassword) {
      setError("Password is required");
      setLoading(false);
      return;
    }
    
    if (trimmedPassword.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }
    
    if (trimmedPassword !== trimmedConfirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log("🔐 Client: Attempting registration for:", trimmedEmail);
      console.log("🔐 Client: Registration data prepared:", { 
        email: trimmedEmail ? "***" : "MISSING", 
        hasPassword: !!trimmedPassword,
        passwordLength: trimmedPassword.length,
        hasName: !!trimmedName
      });
      
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: trimmedEmail, 
          password: trimmedPassword, 
          name: trimmedName || undefined 
        }),
      });
      
      const data = await res.json().catch(() => ({}));
      console.log("🔐 Client: Registration response:", JSON.stringify({ status: res.status, ok: res.ok, error: data.error }, null, 2));
      
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      
      console.log("✅ Client: Registration successful");
      
      // Auto sign-in after registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: trimmedEmail,
        password: trimmedPassword,
        callbackUrl: callbackUrl || undefined,
      });
      
      console.log("🔐 Client: SignIn response:", JSON.stringify(signInRes, null, 2));
      
      if (signInRes?.error) {
        console.log("⚠️ Auto sign-in failed, redirecting to sign-in page");
        setError("Registration successful but auto sign-in failed. Please sign in manually.");
        setLoading(false);
        // Redirect to sign-in page after a short delay
        setTimeout(() => {
          router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl || "/profile")}`);
        }, 2000);
        return;
      }
      
      if (signInRes?.ok) {
        console.log("✅ Client: Auto sign-in successful");
        setLoading(false);
        
        // Update session and determine redirect based on role
        try {
          await update();
          console.log("✅ Client: Session updated successfully");
          // Wait a moment for session to be fully synced
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Fetch fresh session to get user role
          const response = await fetch("/api/auth/session");
          const sessionData = await response.json();
          
          console.log("🔐 Session data:", sessionData);
          
          // Determine redirect URL based on user role
          let redirectUrl = callbackUrl || "/profile";
          
          // If callbackUrl is explicitly set to /admin, use it
          // If callbackUrl is /profile or not set, check if user is admin
          if (!callbackUrl || callbackUrl === "/profile") {
            if (sessionData?.user?.role && isAdmin(sessionData.user.role)) {
              // Admin users go to admin dashboard
              redirectUrl = "/admin";
              console.log("🔐 Admin user detected (role: " + sessionData.user.role + "), redirecting to admin dashboard");
            } else {
              // Regular users go to profile
              redirectUrl = "/profile";
              console.log("👤 Regular user, redirecting to profile");
            }
          } else {
            // Use the explicitly set callbackUrl
            console.log("🔗 Using explicit callbackUrl:", callbackUrl);
            redirectUrl = callbackUrl;
          }
          
          console.log("✅ Client: Redirecting to:", redirectUrl);
          
          // Use router.push for better Next.js integration, with fallback to window.location
          try {
            router.push(redirectUrl);
            // Also use window.location as backup to ensure redirect happens
            setTimeout(() => {
              if (window.location.pathname === "/auth/register") {
                console.log("⚠️ Router push didn't work, using window.location");
                window.location.href = redirectUrl;
              }
            }, 500);
          } catch (redirectError) {
            console.warn("⚠️ Router push failed, using window.location:", redirectError);
            window.location.href = redirectUrl;
          }
        } catch (sessionError) {
          console.warn("⚠️ Session update warning (might still work):", sessionError);
          // Fallback to default redirect
          const fallbackUrl = callbackUrl || "/profile";
          router.push(fallbackUrl);
          setTimeout(() => {
            if (window.location.pathname === "/auth/register") {
              window.location.href = fallbackUrl;
            }
          }, 500);
        }
      } else {
        setError("Registration successful but auto sign-in failed. Please sign in manually.");
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Client: Registration error:", err);
      setError("Something went wrong. Please try again.");
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
              Create account
            </h1>
            <p className="text-charcoal/60 mb-6">
              Join us to shop, track orders, and more.
            </p>

            {error && (
              <div className="mb-4 rounded-lg border border-coral/30 bg-coral/10 text-coral px-3 py-2 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
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
                    placeholder="At least 8 characters"
                    required
                    minLength={8}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/20 focus:outline-none focus:ring-2 focus:ring-sage"
                    placeholder="Repeat your password"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-sage text-white rounded-xl font-medium hover:bg-sage/90 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Create account
              </button>
            </form>

            <p className="text-sm text-charcoal/60 mt-6 text-center">
              Already have an account?{" "}
              <Link className="text-sage hover:text-sage/80 font-medium" href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl || "/profile")}`}>
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-b from-sage/5 via-cream to-white">
        <Navbar />
        <section className="pt-32 pb-16 px-4 md:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-sage/10 shadow-sm">
              <div className="animate-pulse">
                <div className="h-8 bg-sage/20 rounded mb-4"></div>
                <div className="h-4 bg-sage/10 rounded mb-6"></div>
                <div className="space-y-4">
                  <div className="h-12 bg-sage/10 rounded"></div>
                  <div className="h-12 bg-sage/10 rounded"></div>
                  <div className="h-12 bg-sage/10 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <RegisterForm />
    </Suspense>
  );
}




