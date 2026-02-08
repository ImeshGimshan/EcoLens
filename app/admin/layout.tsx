"use client";

import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { ShieldCheck, LayoutDashboard, Home, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Admin Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/admin/reports"
                className="flex items-center gap-2 font-bold text-xl text-[#7ED957] hover:text-[#6DC54D] transition-colors"
              >
                <ShieldCheck className="w-6 h-6" />
                <span>EcoLens Admin</span>
              </Link>

              <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                <Link
                  href="/admin/reports"
                  className="flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-[#7ED957] dark:hover:text-[#7ED957] transition-colors"
                >
                  <LayoutDashboard size={18} />
                  Reports
                </Link>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 cursor-not-allowed"
                  title="Coming Soon"
                >
                  Analytics
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 cursor-not-allowed"
                  title="Coming Soon"
                >
                  Settings
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Home size={16} />
                <span className="hidden md:inline">Back to App</span>
              </Link>
              
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7ED957]/10 border border-[#7ED957]/20">
                <User size={16} className="text-[#7ED957]" />
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                  {user?.email}
                </span>
              </div>

              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                title="Sign Out"
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </AdminProtectedRoute>
  );
}
