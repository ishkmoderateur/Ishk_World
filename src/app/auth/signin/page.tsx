"use client";

import { useState, FormEvent, Suspense, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Lock, LogIn, Loader2, Globe } from "lucide-react";
import { isAdmin } from "@/lib/roles";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { data: session, update, status } = useSession();
  const callbackUrl = params.get("callbackUrl");
  const emailParam = params.get("email");

  const [email, setEmail] = useState(emailParam || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Determine redirect URL based on user role
      let redirectUrl = callbackUrl;
      
      // If no callback URL specified, redirect based on role
      if (!redirectUrl) {
        if (session.user.role && isAdmin(session.user.role)) {
          redirectUrl = "/admin";
          console.log("🔐 Already authenticated as admin, redirecting to /admin");
        } else {
          redirectUrl = "/profile";
          console.log("👤 Already authenticated as user, redirecting to /profile");
        }
      }
      
      console.log("✅ Already authenticated, redirecting to:", redirectUrl);
      window.location.href = redirectUrl;
    }
  }, [status, session, callbackUrl]);

  // Check for OAuth callback errors
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const details = params.get("details");
    
    if (error) {
      console.error("❌ OAuth error:", error);
      console.error("❌ Error details:", details);
      
      // Provide more specific error messages
      let errorMessage = "Authentication failed. Please try again.";
      
      if (details) {
        errorMessage = decodeURIComponent(details);
        // Log helpful information for token_exchange_failed errors
        if (error === "token_exchange_failed") {
          console.error("🔧 TROUBLESHOOTING: Token exchange failed");
          console.error("🔧 Check your server console logs for the exact redirect URI that was used");
          console.error("🔧 That redirect URI must be added to Google Cloud Console > OAuth 2.0 Client > Authorized redirect URIs");
          console.error("🔧 Common redirect URIs:");
          console.error("   - Development (MAMP port 8888): http://localhost:8888/api/auth/google/callback");
          console.error("   - Development (standard): http://localhost:3000/api/auth/google/callback");
          console.error("   - Production: https://ishk-world.com/api/auth/google/callback");
        }
      } else {
        switch (error) {
          case "token_exchange_failed":
            errorMessage = "Failed to exchange authorization code. Check server logs for the redirect URI that must be added to Google Cloud Console.";
            break;
          case "user_info_failed":
            errorMessage = "Failed to retrieve user information from Google.";
            break;
          case "timeout":
            errorMessage = "Request timed out. Please try again.";
            break;
          case "redirect_mismatch":
            errorMessage = "Redirect URI mismatch. Please contact support.";
            break;
          case "invalid_client":
            errorMessage = "Invalid OAuth configuration. Please contact support.";
            break;
          case "invalid_grant":
            errorMessage = "Authorization expired. Please try again.";
            break;
          case "invalid_state":
            errorMessage = "Security validation failed. Please try again.";
            break;
          case "missing_code":
            errorMessage = "Authorization code missing. Please try again.";
            break;
          default:
            errorMessage = "Authentication failed. Please try again.";
        }
      }
      
      setError(errorMessage);
      
      // Clean up URL
      if (window.history.replaceState) {
        const newUrl = window.location.pathname + (callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : '');
        window.history.replaceState({}, '', newUrl);
      }
    }
  }, [callbackUrl]);

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
        callbackUrl: callbackUrl || undefined,
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
        console.log("✅ Client: Login successful");
        
        // Determine redirect URL - default to profile
        let redirectUrl = callbackUrl || "/profile";
        
        // Update session and check role
        try {
          await update();
          await new Promise(resolve => setTimeout(resolve, 400));
          
          const response = await fetch("/api/auth/session");
          const sessionData = await response.json();
          
          // Check if user is admin and redirect accordingly
          if (!callbackUrl || callbackUrl === "/profile") {
            if (sessionData?.user?.role && isAdmin(sessionData.user.role)) {
              redirectUrl = "/admin";
              console.log("🔐 Admin user, redirecting to /admin");
            } else {
              redirectUrl = "/profile";
              console.log("👤 Regular user, redirecting to /profile");
            }
          }
        } catch (sessionError) {
          console.warn("⚠️ Session check warning, using default redirect:", sessionError);
        }
        
        console.log("✅ Client: Redirecting to:", redirectUrl);
        
        // Force redirect using window.location for reliability
        setLoading(false);
        window.location.href = redirectUrl;
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
              <Link className="text-sage hover:text-sage/80 font-medium" href={`/auth/register?callbackUrl=${encodeURIComponent(callbackUrl || "/profile")}`}>
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


