"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Activity,
  Layers,
  Loader2,
  Info,
} from "lucide-react";

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
}

export default function UserReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user, loading: authLoading } = useAuth();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!user?.uid) return;

      try {
        const response = await fetch(
          `/api/reports/${params.id}?userId=${user.uid}`,
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
      if (user) {
        fetchReport();
      } else {
        setLoading(false); // Not logged in
      }
    }
  }, [user, authLoading, params.id]);

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
      case "good":
        return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
      case "fair":
        return "text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
      case "poor":
        return "text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-6 text-center">
        <Info className="w-12 h-12 text-gray-400 mb-4" />
        <h1 className="text-xl font-bold mb-2 dark:text-white">
          Access Denied
        </h1>
        <p className="text-gray-500 mb-6">Please log in to view this report.</p>
        <Link href="/" className="text-orange-500 hover:underline">
          Go Home
        </Link>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen p-6 bg-gray-50 dark:bg-black flex flex-col items-center justify-center">
        <div className="text-red-500 mb-4 font-medium">
          {error || "Report not found"}
        </div>
        <Link
          href="/reports"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-orange-500 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to My Scans
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-6 md:p-10 pb-24">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/reports"
            className="p-2 -ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Scan Details
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">
              <Calendar size={14} />
              {format(new Date(report.timestamp), "PPP p")}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Activity className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                Condition Assessment
              </p>
              <div
                className={`mt-2 inline-flex items-center px-4 py-1 rounded-full border text-sm font-bold uppercase ${getConditionColor(report.condition)}`}
              >
                {report.condition}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-1">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Confidence Score
            </p>
            <div className="text-2xl font-mono font-bold text-gray-900 dark:text-white">
              {(report.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Layers size={18} />
              Captured Image
            </h2>
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 relative aspect-[4/3] group">
              {report.imageUrl ? (
                <img
                  src={report.imageUrl}
                  alt="Analyzed Site"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            {/* Inspector Note */}
            {report.comment && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Your Note
                </h2>
                <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl p-4 border border-orange-100 dark:border-orange-900/20 text-gray-800 dark:text-gray-200 italic">
                  "{report.comment}"
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Analysis
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {report.description}
              </div>
            </div>

            {/* Issues */}
            {report.issues && report.issues.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Identified Issues
                </h2>
                <ul className="space-y-2">
                  {report.issues.map((issue, i) => (
                    <li
                      key={i}
                      className="bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 px-4 py-3 rounded-xl text-sm border border-amber-100 dark:border-amber-900/20"
                    >
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
