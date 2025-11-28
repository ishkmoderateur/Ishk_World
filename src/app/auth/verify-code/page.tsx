"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, CheckCircle, XCircle, Loader2, RefreshCw, ArrowRight } from "lucide-react";

function VerifyCodeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string>("");

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    }
  }, [searchParams]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);
      // Focus last input
      setTimeout(() => {
        document.getElementById(`code-5`)?.focus();
      }, 0);
    }
  };

  const handleVerify = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      setStatus("error");
      return;
    }

    const codeString = code.join("");
    if (codeString.length !== 6) {
      setMessage("Please enter the complete 6-digit code");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: codeString }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage("Email verified successfully! Redirecting to your profile...");

        // Redirect to profile page after 2 seconds
        setTimeout(() => {
          router.push("/profile");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.error || "Invalid verification code");
        // Clear code on error
        setCode(["", "", "", "", "", ""]);
        document.getElementById("code-0")?.focus();
      }
    } catch (error) {
      setStatus("error");
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleResendCode = async () => {
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
        // Clear code inputs
        setCode(["", "", "", "", "", ""]);
        setStatus("idle");
        setMessage("");
        document.getElementById("code-0")?.focus();
      } else {
        setResendError(data.error || "Failed to resend verification code");
      }
    } catch (error) {
      setResendError("An error occurred. Please try again later.");
    } finally {
      setResending(false);
    }
  };

  const codeComplete = code.join("").length === 6;

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
            {status === "success" ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  Email Verified!
                </h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <p className="text-sm text-gray-500">Redirecting to sign in...</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <Mail className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Verify Your Email
                  </h1>
                  <p className="text-gray-600">
                    Enter the 6-digit code sent to your email address
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Email Input */}
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
                      disabled={status === "loading"}
                    />
                  </div>

                  {/* Code Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Code
                    </label>
                    <div className="flex gap-2 justify-center">
                      {code.map((digit, index) => (
                        <input
                          key={index}
                          id={`code-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleCodeChange(index, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          disabled={status === "loading"}
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Messages */}
                  {message && (
                    <div
                      className={`p-3 rounded-lg text-sm ${
                        status === "error"
                          ? "bg-red-50 text-red-600 border border-red-200"
                          : "bg-green-50 text-green-600 border border-green-200"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  {/* Resend Code */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                    {resendError && (
                      <p className="text-red-600 text-sm mb-2">{resendError}</p>
                    )}
                    {resendSuccess && (
                      <p className="text-green-600 text-sm mb-2">
                        Verification code sent! Please check your email.
                      </p>
                    )}
                    <button
                      onClick={handleResendCode}
                      disabled={resending || !email}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto"
                    >
                      {resending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Resend Code
                        </>
                      )}
                    </button>
                  </div>

                  {/* Verify Button */}
                  <button
                    onClick={handleVerify}
                    disabled={status === "loading" || !codeComplete || !email}
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <ArrowRight className="w-4 h-4" />
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
              </>
            )}
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <VerifyCodeContent />
    </Suspense>
  );
}

