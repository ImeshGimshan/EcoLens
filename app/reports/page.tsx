"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";
import {
  Calendar,
  AlertOctagon,
  Eye,
  Loader2,
  LayoutGrid,
  List as ListIcon,
  MapPin,
  Shield,
} from "lucide-react";

interface Report {
  id: string;
  imageUrl?: string;
  condition: string;
  confidence: number;
  description: string;
  timestamp: string;
  issues?: string[];
  provider?: string;
  comment?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export default function UserReportsPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(`/api/reports/user?userId=${user.uid}`);
        const data = await response.json();

        if (data.success) {
          setReports(data.reports);
        } else {
          throw new Error(data.error || "Failed to fetch reports");
        }
      } catch (err: any) {
        console.error("Error loading history:", err);
        setError("Could not load your history. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (user) {
        fetchReports();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
      case "good":
        return "bg-green-100 text-green-700 border-green-200";
      case "fair":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "poor":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--color-eggshell)' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-forest)' }} />
        </div>
      </MobileFrame>
    );
  }

  if (!user) {
    return (
      <MobileFrame>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ background: 'var(--color-eggshell)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(126, 217, 87, 0.1)' }}>
            <Shield size={32} style={{ color: 'var(--color-forest)' }} />
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-forest)' }}>
            Login Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please sign in to view your scan history.
          </p>
          <Link
            href="/"
            className="px-6 py-3 text-white rounded-xl font-semibold"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Return Home
          </Link>
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg"
            >
              <img src="/logo.svg" alt="EcoLens Logo" className="w-8 h-8" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-semibold">My Reports</h1>
              <p className="text-sm text-white/90">
                {reports.length} scan{reports.length !== 1 && "s"}
              </p>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-all ${viewMode === "grid"
                ? "bg-white/30 text-white"
                : "text-white/60 hover:text-white"
                }`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-all ${viewMode === "list"
                ? "bg-white/30 text-white"
                : "text-white/60 hover:text-white"
                }`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4" style={{ background: 'var(--color-eggshell)' }}>
        {error ? (
          <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm border border-red-100">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--color-eggshell)' }}>
              <Calendar size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-forest)' }}>
              No scans yet
            </h3>
            <p className="text-gray-600 text-sm max-w-sm mx-auto mb-6">
              Your scan history will appear here. Start by analyzing a heritage site.
            </p>
            <Link
              href="/scan"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold shadow-lg"
              style={{ background: 'var(--gradient-primary)' }}
            >
              Start Scanning
            </Link>
          </motion.div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-3"
                : "space-y-3"
            }
          >
            {reports.map((report, idx) => (
              <motion.div
                key={report.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={`/reports/${report.id}`}
                  className={`group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all flex ${viewMode === "list"
                    ? "flex-row items-center p-3 gap-4"
                    : "flex-col"
                    }`}
                >
                  {/* Thumbnail */}
                  <div
                    className={`relative bg-gray-100 overflow-hidden shrink-0 ${viewMode === "list"
                      ? "w-20 h-20 rounded-lg"
                      : "w-full aspect-video"
                      }`}
                  >
                    {report.imageUrl ? (
                      <img
                        src={report.imageUrl}
                        alt="Scan"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <AlertOctagon size={24} />
                      </div>
                    )}
                    {viewMode === "grid" && (
                      <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDistanceToNow(new Date(report.timestamp), {
                          addSuffix: true,
                        })}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 min-w-0 ${viewMode === "grid" ? "p-4" : ""}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getConditionColor(report.condition)}`}
                      >
                        {report.condition}
                      </span>
                      {viewMode === "list" && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDistanceToNow(new Date(report.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold line-clamp-1 mb-1 text-sm" style={{ color: 'var(--color-forest)' }}>
                      {report.comment || report.description || "Untitled Scan"}
                    </h3>

                    {report.comment && (
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                        {report.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-2">
                      <span>
                        {(report.confidence * 100).toFixed(0)}% confidence
                      </span>
                      <span>•</span>
                      <span className="uppercase">{report.provider || "AI"}</span>
                      {report.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1" style={{ color: 'var(--color-forest)' }}>
                            <MapPin size={12} />
                            Location
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {viewMode === "list" && (
                    <div className="pr-4 text-gray-400" style={{ color: 'var(--color-forest)' }}>
                      <Eye size={20} />
                    </div>
                  )}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </MobileFrame>
  );
}