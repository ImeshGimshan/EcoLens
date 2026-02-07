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
        {/* Glassmorphism Nav Container */}
        <div className="mx-4 mb-4 bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-visible">
          <div className="flex items-center justify-around px-2 py-3 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              if (item.isCenter) {
                // Center Scan Button
                return (
                  <Link key={item.path} href={item.path} className="relative">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative -mt-8"
                    >
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl blur-xl opacity-50"></div>

                      {/* Main button */}
                      <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl shadow-xl flex items-center justify-center border-4 border-white">
                        <Icon
                          size={28}
                          className="text-white"
                          strokeWidth={2.5}
                        />
                      </div>

                      {/* Active indicator dot */}
                      {active && (
                        <motion.div
                          layoutId="centerIndicator"
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full"
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
                    className="flex flex-col items-center gap-1 py-2 relative"
                  >
                    <div
                      className={`relative transition-colors ${
                        active ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <Icon size={24} strokeWidth={active ? 2.5 : 2} />

                      {/* Active background glow */}
                      {active && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute inset-0 -z-10 bg-green-100 rounded-xl blur-sm scale-150"
                        />
                      )}
                    </div>

                    <span
                      className={`text-xs font-medium transition-colors ${
                        active ? "text-green-600" : "text-gray-500"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Active indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 w-1 h-1 bg-green-600 rounded-full"
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
