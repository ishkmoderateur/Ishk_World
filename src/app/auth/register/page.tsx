"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, User, Loader2, UserPlus, Globe } from "lucide-react";
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
  const [success, setSuccess] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);

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
      
      // Handle existing account with matching password - auto sign in
      if (res.ok && data.shouldSignIn && data.existingAccount) {
        console.log("✅ Client: Existing account found, signing in...");
        
        // Auto sign-in with credentials
        try {
          const signInRes = await signIn("credentials", {
            redirect: false,
            email: trimmedEmail.toLowerCase().trim(),
            password: trimmedPassword,
          });
          
          if (signInRes?.ok) {
            console.log("✅ Client: Auto sign-in successful");
            await update();
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const redirectUrl = callbackUrl || "/profile";
            console.log("✅ Client: Redirecting to:", redirectUrl);
            window.location.href = redirectUrl;
          } else {
            setError("Account found but sign-in failed. Please try signing in manually.");
            setLoading(false);
          }
        } catch (signInError) {
          console.error("❌ Exception during auto sign-in:", signInError);
          setError("Account found but sign-in failed. Please try signing in manually.");
          setLoading(false);
        }
        return;
      }
      
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      
      console.log("✅ Client: Registration successful");
      
      // Show success message and email verification notice
      setSuccess(true);
      setVerificationEmailSent(data.emailSent || false);
      setLoading(false);
      
      // Store email for redirect before clearing form
      const registeredEmail = trimmedEmail;
      
      // Clear form (but keep email for display in success message)
      setName("");
      setPassword("");
      setConfirm("");
      
      // Redirect to code verification page after 3 seconds
      setTimeout(() => {
        router.push(`/auth/verify-code?email=${encodeURIComponent(registeredEmail)}`);
      }, 3000);
    } catch (err) {
      console.error("❌ Client: Registration error:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const redirectUrl = callbackUrl || "/profile";
      console.log("🔐 Google OAuth: Starting direct OAuth flow, redirect to:", redirectUrl);
      
      // Redirect to our direct Google OAuth endpoint
      window.location.href = `/api/auth/google?callbackUrl=${encodeURIComponent(redirectUrl)}`;
      
      // Note: We won't reach here as the page will redirect
    } catch (err) {
      console.error("❌ Google OAuth exception:", err);
      setError("Something went wrong with Google sign-in. Please try again.");
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

            {success && (
              <div className="mb-4 rounded-lg border border-green-300 bg-green-50 text-green-800 px-4 py-3">
                <h3 className="font-semibold mb-1">Account Created Successfully!</h3>
                {verificationEmailSent ? (
                  <p className="text-sm">
                    We've sent a verification email to <strong>{email || "your email"}</strong>. 
                    Please check your inbox and click the verification link to activate your account.
                  </p>
                ) : (
                  <p className="text-sm">
                    Your account has been created. Please verify your email address to continue.
                  </p>
                )}
                <p className="text-sm mt-2">
                  Redirecting to verification page...
                </p>
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




