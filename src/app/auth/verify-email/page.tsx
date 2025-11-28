"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string>("");

  useEffect(() => {
    const token = searchParams.get("token");
    const success = searchParams.get("success");
    const error = searchParams.get("error");
    const emailParam = searchParams.get("email");

    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }

    if (token) {
      // Verify token via API
      verifyToken(token);
    } else if (success === "true") {
      setStatus("success");
      setMessage("Your email has been verified successfully!");
    } else if (error) {
      setStatus("error");
      setMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  const verifyToken = async (token: string) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "Your email has been verified successfully!");
        if (data.email) {
          setEmail(data.email);
        }
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin?verified=true");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to verify email");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred while verifying your email. Please try again.");
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setResendError("Please enter your email address");
      return;
    }

    setResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResendSuccess(true);
        setResendError("");
        if (data.alreadyVerified) {
          setMessage("Your email is already verified. You can now sign in.");
          setStatus("success");
        }
      } else {
        setResendError(data.error || "Failed to resend verification email");
      }
    } catch (error) {
      setResendError("An error occurred. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-lg shadow-xl p-8">
            {status === "loading" && (
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Verifying your email...
                </h1>
                <p className="text-gray-600">Please wait while we verify your email address.</p>
              </div>
            )}

            {status === "success" && (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Email Verified!
                </h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link
                  href="/auth/signin"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Verification Failed
                </h1>
                <p className="text-gray-600 mb-6">{message}</p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {resendError && (
                    <p className="text-red-600 text-sm">{resendError}</p>
                  )}
                  
                  {resendSuccess && (
                    <p className="text-green-600 text-sm">
                      Verification email sent! Please check your inbox.
                    </p>
                  )}
                  
                  <button
                    onClick={handleResendEmail}
                    disabled={resending || !email}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {status === "idle" && (
              <div className="text-center">
                <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Verify Your Email
                </h1>
                <p className="text-gray-600 mb-6">
                  Please check your email and click the verification link, or enter your email below to resend the verification email.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {resendError && (
                    <p className="text-red-600 text-sm">{resendError}</p>
                  )}
                  
                  {resendSuccess && (
                    <p className="text-green-600 text-sm">
                      Verification email sent! Please check your inbox.
                    </p>
                  )}
                  
                  <button
                    onClick={handleResendEmail}
                    disabled={resending || !email}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        Resend Verification Email
                      </>
                    )}
                  </button>
                  
                  <Link
                    href="/auth/signin"
                    className="block text-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}

