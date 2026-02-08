"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import dynamic from "next/dynamic";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  AlertTriangle,
  Layers,
  Loader2,
  Info,
  MapPin,
  Shield,
} from "lucide-react";

// Dynamically import MapView to avoid SSR issues with Leaflet
const MapView = dynamic(() => import("@/app/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-forest)' }} />
    </div>
  ),
});

interface Report {
  id: string;
  imageUrl?: string;
  condition: string;
  confidence: number;
  description: string;
  timestamp: string;
  issues?: string[];
  recommendations?: string[];
  provider?: string;
  model?: string;
  comment?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export default function UserReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<string | null>(null);

  // Extract id from params Promise
  useEffect(() => {
    params.then((p) => setReportId(p.id));
  }, [params]);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user?.uid || !reportId) return;

      try {
        const response = await fetch(
          `/api/reports/${reportId}?userId=${user.uid}`,
        );
        const data = await response.json();

        if (data.success) {
          setReport(data.report);
        } else {
          throw new Error(data.error || "Failed to fetch report");
        }
      } catch (err: any) {
        console.error("Error loading report:", err);
        setError(err.message || "Could not load report details.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (user && reportId) {
        fetchReport();
      } else {
        setLoading(false); // Not logged in or no reportId yet
      }
    }
  }, [user, authLoading, reportId]);

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
      case "good":
        return "text-green-700 bg-green-50 border-green-200";
      case "fair":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "poor":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "critical":
        return "text-red-700 bg-red-50 border-red-200";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center" style={{ background: 'var(--color-eggshell)' }}>
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-forest)' }} />
        </div>
        <BottomNav />
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
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">Please log in to view this report.</p>
          <Link
            href="/"
            className="px-6 py-3 text-white rounded-xl font-semibold"
            style={{ background: 'var(--gradient-primary)' }}
          >
            Go Home
          </Link>
        </div>
        <BottomNav />
      </MobileFrame>
    );
  }

  if (error || !report) {
    return (
      <MobileFrame>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center" style={{ background: 'var(--color-eggshell)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-red-50">
            <Info size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-gray-900">
            {error || "Report not found"}
          </h1>
          <Link
            href="/reports"
            className="mt-6 flex items-center gap-2 px-6 py-3 text-white rounded-xl font-semibold"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <ArrowLeft size={20} />
            Back to My Scans
          </Link>
        </div>
        <BottomNav />
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-6 text-white"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Link
            href="/reports"
            className="p-2 -ml-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            >
              📋
            </motion.div>
            <div>
              <h1 className="text-2xl font-semibold">
                Scan Details
              </h1>
              <p className="text-sm text-white/90 flex items-center gap-2 mt-0.5">
                <Calendar size={14} />
                {format(new Date(report.timestamp), "PPP")}
              </p>
            </div>
          </div>
        </div>

        {/* Condition Badge */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <p className="text-xs text-white/80 uppercase tracking-wider font-semibold mb-2">
              Condition
            </p>
            <div className="text-xl font-bold text-white uppercase">
              {report.condition}
            </div>
          </div>
          <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <p className="text-xs text-white/80 uppercase tracking-wider font-semibold mb-2">
              Confidence
            </p>
            <div className="text-xl font-bold text-white">
              {(report.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 py-4" style={{ background: 'var(--color-eggshell)' }}>
        <div className="space-y-4">
          {/* Image */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-forest)' }}>
              <Layers size={18} />
              Captured Image
            </h2>
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md relative aspect-4/3">
              {report.imageUrl ? (
                <img
                  src={report.imageUrl}
                  alt="Analyzed Site"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Your Note */}
          {report.comment && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-forest)' }}>
                Your Note
              </h2>
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm text-gray-700 italic">
                "{report.comment}"
              </div>
            </motion.div>
          )}

          {/* AI Analysis */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-forest)' }}>
              AI Analysis
            </h2>
            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm text-gray-700 leading-relaxed text-sm">
              {report.description}
            </div>
          </motion.div>

          {/* Issues */}
          {report.issues && report.issues.length > 0 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-forest)' }}>
                <AlertTriangle size={18} className="text-amber-500" />
                Identified Issues
              </h2>
              <ul className="space-y-2">
                {report.issues.map((issue, i) => (
                  <li
                    key={i}
                    className="bg-amber-50 text-amber-900 px-4 py-3 rounded-xl text-sm border border-amber-100 shadow-sm"
                  >
                    {issue}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Location Section */}
          {report.location && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="space-y-3"
            >
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--color-forest)' }}>
                <MapPin size={18} />
                Scan Location
              </h2>

              {/* Map Display */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md h-64">
                <MapView
                  userLocation={{
                    latitude: report.location.latitude,
                    longitude: report.location.longitude,
                    accuracy: 0,
                  }}
                  sites={[]}
                  selectedSite={null}
                  onSiteSelect={() => {}}
                />
              </div>

              {/* Address Display */}
              {report.location.address && (
                <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                  <p className="text-sm text-gray-700 flex items-start gap-2">
                    <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--color-forest)' }} />
                    <span>{report.location.address}</span>
                  </p>
                </div>
              )}

              {/* Coordinates */}
              <div className="flex gap-3 text-xs">
                <div className="flex-1 bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <span className="font-semibold text-gray-700">Latitude:</span>{" "}
                  <span className="text-gray-600">{report.location.latitude.toFixed(6)}</span>
                </div>
                <div className="flex-1 bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
                  <span className="font-semibold text-gray-700">Longitude:</span>{" "}
                  <span className="text-gray-600">{report.location.longitude.toFixed(6)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <BottomNav />
    </MobileFrame>
  );
}
