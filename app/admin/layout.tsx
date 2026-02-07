import Link from "next/link";
import { ShieldCheck, BarChart3, LayoutDashboard, Home } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/admin/reports"
              className="flex items-center gap-2 font-bold text-xl text-green-600 dark:text-green-500"
            >
              <ShieldCheck className="w-6 h-6" />
              <span>EcoLens Admin</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                href="/admin/reports"
                className="flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-500 transition-colors"
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

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Home size={16} />
              <span className="hidden md:inline">Back to App</span>
            </Link>
            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-700 dark:text-green-400 font-bold text-xs">
              AD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
