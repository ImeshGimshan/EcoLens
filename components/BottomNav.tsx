"use client";

import React from "react";
import { Map, Camera, Trophy, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const navItems = [
    { path: "/", icon: Map, label: "Explore" },
    { path: "/scan", icon: Camera, label: "Scan", isCenter: true },
    { path: "/reports", icon: History, label: "History" },
    { path: "/leaderboard", icon: Trophy, label: "Rank" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center z-40 pointer-events-none pb-safe">
      <div className="w-full max-w-md pointer-events-auto">
        {/* Clean White Nav Container with subtle shadow */}
        <div className="mx-4 mb-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible">
          <div className="flex items-center justify-around px-3 py-3 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              if (item.isCenter) {
                // Center Scan Button - Premium Style
                return (
                  <Link key={item.path} href={item.path} className="relative flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      className="relative flex items-center justify-center"
                    >
                      {/* Main button with gradient background */}
                      <motion.div
                        animate={{
                          boxShadow: active
                            ? "0 12px 24px rgba(126, 217, 87, 0.25)"
                            : "0 8px 16px rgba(126, 217, 87, 0.15)",
                        }}
                        className="relative w-14 h-14 rounded-xl shadow-lg flex items-center justify-center border transition-all"
                        style={{
                          background: "var(--gradient-primary)",
                          borderColor: "rgba(126, 217, 87, 0.2)",
                        }}
                      >
                        <Icon
                          size={24}
                          className="text-white shrink-0"
                          strokeWidth={2.2}
                        />
                      </motion.div>

                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="centerIndicator"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                          style={{ background: "var(--color-forest)" }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              }

              // Side navigation items
              return (
                <Link key={item.path} href={item.path} className="flex-1">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-1.5 py-2.5 relative cursor-pointer"
                  >
                    {/* Icon with smooth transition */}
                    <motion.div
                      animate={{
                        color: active ? "var(--color-forest)" : "#D1D5DB",
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative"
                    >
                      <Icon
                        size={22}
                        strokeWidth={active ? 2.2 : 1.8}
                        className="transition-all"
                      />

                      {/* Subtle background glow on active */}
                      {active && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute inset-0 -z-10 rounded-lg blur-md scale-125 opacity-0 group-hover:opacity-100"
                          style={{
                            background: "var(--color-forest)",
                            opacity: 0.1,
                          }}
                        />
                      )}
                    </motion.div>

                    {/* Label with smooth color transition */}
                    <motion.span
                      animate={{
                        color: active ? "var(--color-forest)" : "#9CA3AF",
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-xs font-semibold tracking-wide"
                    >
                      {item.label}
                    </motion.span>

                    {/* Active indicator line */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="absolute -bottom-0.5 w-1.5 h-1 rounded-full origin-center"
                        style={{ background: "var(--color-forest)" }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}