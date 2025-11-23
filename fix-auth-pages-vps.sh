#!/bin/bash
# Fix auth pages on VPS - Run this on your VPS

cd /var/www/ishk-platform

echo "🔧 Fixing auth pages with Suspense boundaries..."

# Create fixed register page
cat > src/app/auth/register/page.tsx << 'REGISTER_EOF'
"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, User, Loader2, UserPlus } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/profile";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password, name }),
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }
      
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password,
        callbackUrl,
      });
      
      if (signInRes?.error) {
        router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      } else if (signInRes?.ok) {
        window.location.href = signInRes.url || callbackUrl;
      } else {
        setError("Registration successful but auto sign-in failed. Please sign in manually.");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
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

            <form onSubmit={onSubmit} className="space-y-4">
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
              <Link className="text-sage hover:text-sage/80 font-medium" href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
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
REGISTER_EOF

echo "✅ Register page fixed!"

# Fix signin page
cat > src/app/auth/signin/page.tsx << 'SIGNIN_EOF'
"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, LogIn, Loader2, Globe } from "lucide-react";

function SignInForm() {
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
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
      });
      
      if (!res) {
        setError("Unexpected error. Please try again.");
        setLoading(false);
        return;
      }
      
      if (res.error) {
        setError(res.error === "CredentialsSignin" ? "Invalid email or password" : res.error);
        setLoading(false);
        return;
      }
      
      if (res.ok) {
        try {
          await update();
        } catch (sessionError) {
          console.warn("Session update warning:", sessionError);
        }
        window.location.href = res.url || callbackUrl;
      } else {
        setError("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
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

export default function SignInPage() {
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
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    }>
      <SignInForm />
    </Suspense>
  );
}
SIGNIN_EOF

echo "✅ Signin page fixed!"

# Fix signout page
cat > src/app/auth/signout/page.tsx << 'SIGNOUT_EOF'
"use client";

import { useEffect, Suspense } from "react";
import { signOut } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

function SignOutForm() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";

  useEffect(() => {
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
SIGNOUT_EOF

echo "✅ Signout page fixed!"
echo ""
echo "🔨 Now rebuilding..."
rm -rf .next
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build successful! Restarting PM2..."
  pm2 restart ishk-platform --update-env
  echo "✅ All done!"
else
  echo ""
  echo "❌ Build failed. Check errors above."
fi







