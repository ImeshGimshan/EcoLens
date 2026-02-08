"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, Shield, Leaf, Award, MapPin, Loader2, Camera } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";

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
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--color-eggshell)' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-t-transparent rounded-full"
            style={{ borderColor: 'var(--color-forest)' }}
          />
        </div>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-4 text-white"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
          >
            <img src="/logo.svg" alt="EcoLens Logo" className="w-8 h-8" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold">EcoLens</h1>
            <p className="text-sm text-white/90">Heritage Guardian</p>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6" style={{ background: 'var(--color-eggshell)' }}>
        {/* Welcome Section */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <img src="/logo.svg" alt="EcoLens Logo" className="w-12 h-12" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-forest)' }}>
            Welcome Back
          </h2>
          <p className="text-gray-600 text-sm">
            Sign in to continue protecting heritage sites
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-sm grid grid-cols-2 gap-3 mb-8"
        >
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center" style={{ background: 'rgba(126, 217, 87, 0.1)' }}>
              <Camera size={20} style={{ color: 'var(--color-forest)' }} />
            </div>
            <p className="font-semibold text-sm" style={{ color: 'var(--color-forest)' }}>
              AI Scanning
            </p>
            <p className="text-xs text-gray-600">
              Analyze heritage sites
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center bg-yellow-50">
              <Award size={20} className="text-yellow-600" />
            </div>
            <p className="font-semibold text-sm text-yellow-600">
              Achievements
            </p>
            <p className="text-xs text-gray-600">
              Unlock rewards
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center bg-purple-50">
              <Shield size={20} className="text-purple-600" />
            </div>
            <p className="font-semibold text-sm text-purple-600">
              Protection
            </p>
            <p className="text-xs text-gray-600">
              Monitor damage
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center bg-orange-50">
              <Sparkles size={20} className="text-orange-600" />
            </div>
            <p className="font-semibold text-sm text-orange-600">
              Leaderboard
            </p>
            <p className="text-xs text-gray-600">
              Compete & rank
            </p>
          </div>
        </motion.div>

        {/* Sign In Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          className="w-full max-w-sm bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-sm border border-gray-200 flex items-center justify-center gap-3 transition-all"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
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
          Continue with Google
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
            className="text-sm text-gray-400 hover:text-forest transition-colors flex items-center gap-2"
          >
            Admin Access
          </a>
        </motion.div>
      </main>
    </MobileFrame>
  );
}
