"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  showActions?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  icon,
  showActions = true,
}: AppHeaderProps) {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 text-white z-50"
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            >
              {icon}
            </motion.div>
          )}
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm opacity-90 font-medium">{subtitle}</p>
            )}
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Bell size={20} strokeWidth={2} />
            </motion.button>

            {user ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/30 transition-colors border-2 border-white/30"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={20} strokeWidth={2} />
                  )}
                </motion.button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-[9999]"
                    >
                      {/* User Info */}
                      <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <Image
                              src={user.photoURL}
                              alt={user.displayName || "User"}
                              width={48}
                              height={48}
                              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center">
                              <User
                                size={24}
                                className="text-white"
                                strokeWidth={2}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {user.displayName || "User"}
                            </p>
                            <p className="text-xs text-gray-600 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignOut}
                        className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        <LogOut size={20} strokeWidth={2} />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push("/login")}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <User size={20} strokeWidth={2} />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Decorative gradient orb */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
    </motion.header>
  );
}
