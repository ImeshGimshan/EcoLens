"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";
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
      className="relative px-8 py-4 border-b border-gray-100 z-50 bg-white"
    >
      {/* Content */}
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Left Section - Title and Icon */}
        <div className="flex items-center gap-4">
          {icon && (
            <motion.div
              animate={{ rotate: [0, 2, -2, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100"
            >
              <img src="/logo.svg" alt="EcoLens Logo" className="w-6 h-6" />
            </motion.div>
          )}
          <div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 font-regular mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        {showActions && (
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative">
                {/* User Avatar Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="w-9 h-9 rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-200 transition-all duration-200"
                >
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User size={18} strokeWidth={2} className="text-gray-600" />
                    </div>
                  )}
                </motion.button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden z-9999"
                    >
                      {/* User Info Section */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <Image
                              src={user.photoURL}
                              alt={user.displayName || "User"}
                              width={44}
                              height={44}
                              className="w-11 h-11 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-gray-200 flex items-center justify-center">
                              <User
                                size={22}
                                className="text-gray-600"
                                strokeWidth={1.8}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">
                              {user.displayName || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                      >
                        <LogOut size={18} strokeWidth={1.8} />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login Button for Non-Authenticated Users */
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push("/login")}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <User size={19} strokeWidth={1.8} />
              </motion.button>
            )}
          </div>
        )}
      </div>
    </motion.header>
  );
}