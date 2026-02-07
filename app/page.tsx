"use client";

import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { AppHeader } from "@/components/AppHeader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { motion } from "framer-motion";
import { MapPin, Shield, Sparkles, TrendingUp } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Shield,
      label: "Protected Sites",
      value: "5",
      color: "from-green-400 to-emerald-600",
    },
    {
      icon: Sparkles,
      label: "AI Scans",
      value: "0",
      color: "from-orange-400 to-red-500",
    },
    {
      icon: TrendingUp,
      label: "Your Rank",
      value: "-",
      color: "from-purple-400 to-pink-500",
    },
  ];

  return (
    <ProtectedRoute>
      <MobileFrame>
        <AppHeader title="EcoLens" subtitle="Heritage Guardian" icon="🌿" />

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto pb-24 px-4 pt-4">
          {/* Stats Cards */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={feature.label}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 + idx * 0.1, duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-2 mx-auto`}
                >
                  <feature.icon
                    size={20}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <p className="text-2xl font-bold text-gray-800 text-center">
                  {feature.value}
                </p>
                <p className="text-xs text-gray-500 text-center mt-1">
                  {feature.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Map Preview Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden mb-4"
          >
            <div className="relative h-64 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
              {/* Animated grid background */}
              <div className="absolute inset-0 opacity-20">
                <div
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, #228B22 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    width: "100%",
                    height: "100%",
                  }}
                ></div>
              </div>

              {/* Floating map pins */}
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-8 -left-8"
                >
                  <MapPin size={32} className="text-green-600 fill-green-200" />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                  className="absolute -top-4 left-12"
                >
                  <MapPin
                    size={28}
                    className="text-emerald-600 fill-emerald-200"
                  />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.6,
                  }}
                  className="absolute top-4 -right-6"
                >
                  <MapPin size={30} className="text-green-700 fill-green-300" />
                </motion.div>

                <div className="text-center bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <MapPin
                      size={32}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    Explore Heritage Sites
                  </h3>
                  <p className="text-sm text-gray-600">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Action Card */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 shadow-xl text-white"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Start Scanning</h3>
                <p className="text-sm opacity-90">Protect heritage with AI</p>
              </div>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center cursor-pointer"
              >
                <Sparkles size={28} className="text-white" strokeWidth={2.5} />
              </motion.div>
            </div>
          </motion.div>
        </main>

        <BottomNav />
      </MobileFrame>
    </ProtectedRoute>
  );
}
