"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Shield, Leaf, Award, MapPin, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#7ED957]/5 via-white to-emerald-50">
        <Loader2 className="w-12 h-12 animate-spin text-[#7ED957]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#7ED957]/5 via-white to-emerald-50 p-6">
      {/* Logo Section */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center mb-10"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-[#7ED957] to-[#6DC54D] rounded-[2rem] flex items-center justify-center text-6xl shadow-2xl shadow-[#7ED957]/30"
        >
          🌿
        </motion.div>
        <h1 className="text-5xl font-bold text-gray-900 mb-3">EcoLens</h1>
        <p className="text-gray-600 font-medium text-lg">Heritage Guardian</p>
      </motion.div>

      {/* Features Cards */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full max-w-md space-y-4 mb-10"
      >
        <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-[#7ED957]/30 transition-all hover:shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#7ED957] to-[#6DC54D] rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Protect Heritage</p>
              <p className="text-sm text-gray-600">
                AI-powered site monitoring & analysis
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-[#7ED957]/30 transition-all hover:shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Award size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Earn Rewards</p>
              <p className="text-sm text-gray-600">
                Climb the leaderboard & get recognized
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-lg border-2 border-gray-100 hover:border-[#7ED957]/30 transition-all hover:shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin size={24} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-base">Discover Sites</p>
              <p className="text-sm text-gray-600">
                Explore heritage locations nearby
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sign In Button */}
      <motion.button
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleGoogleSignIn}
        disabled={isSigningIn}
        className="w-full max-w-md bg-white hover:bg-gray-50 text-gray-900 font-bold py-5 px-6 rounded-2xl shadow-xl border-2 border-gray-200 hover:border-[#7ED957]/50 flex items-center justify-center gap-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isSigningIn ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin text-[#7ED957]" />
            <span>Signing In...</span>
          </>
        ) : (
          <>
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
            <Sparkles className="w-5 h-5 text-[#7ED957] group-hover:scale-125 transition-transform" />
          </>
        )}
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="text-xs text-gray-500 text-center mt-8 max-w-md px-6"
      >
        By continuing, you agree to our Terms of Service and Privacy Policy.
        Help preserve heritage sites for future generations.
      </motion.p>

      {/* Admin Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-6"
      >
        <a
          href="/admin/login"
          className="text-sm text-gray-400 hover:text-[#7ED957] transition-colors flex items-center gap-2"
        >
          <Shield size={14} />
          Admin Portal
        </a>
      </motion.div>
    </div>
  );
}
