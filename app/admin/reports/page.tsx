"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Info,
  Calendar,
  AlertOctagon,
  Eye,
  Loader2,
  ArrowLeft,
  LayoutGrid,
  List as ListIcon,
  MapPin,
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
  status?: string;
  userId?: string;
  userEmail?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export default function AdminReportsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchReports = async () => {
      if (!isAdmin) return;

      try {
        const response = await fetch(`/api/admin/reports`);
        const data = await response.json();

        if (data.success) {
          setReports(data.reports);
        } else {
          throw new Error(data.error || "Failed to fetch reports");
        }
      } catch (err: any) {
        console.error("Error loading reports:", err);
        setError("Could not load reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      if (isAdmin) {
        fetchReports();
      } else {
        setLoading(false);
      }
    }
  }, [isAdmin, authLoading]);

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
      case "good":
        return "bg-[#7ED957]/10 text-[#6DC54D] border-[#7ED957]/30";
      case "fair":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "poor":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "critical":
        return "bg-[#e07856]/10 text-[#c85a42] border-[#e07856]/30";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  if (authLoading || (loading && isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <Loader2 className="w-8 h-8 animate-spin text-[#7ED957]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-6 text-center">
        <div className="w-20 h-20 bg-[#7ED957]/10 rounded-full flex items-center justify-center mb-4">
          <Info className="text-[#7ED957]" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Access Required
        </h1>
        <p className="text-gray-500 mb-6">
          You need admin permissions to view this page.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-[#7ED957] hover:bg-[#6DC54D] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-24">
      {/* Modern Top Bar */}
      <div style={{ background: 'linear-gradient(135deg, #7ED957 0%, #8FE066 100%)' }} className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
              >
                <ArrowLeft size={24} className="text-white" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white">All Reports</h1>
                <p className="text-white/90 text-lg mt-1">
                  {reports.length} report{reports.length !== 1 && "s"} in system
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-1.5 rounded-xl border border-white/20 w-fit">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-[#7ED957] shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <LayoutGrid size={20} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-white text-[#7ED957] shadow-md"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <ListIcon size={20} />
              </button>
            </div>
          </header>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-6">
        {/* Content */}
        {error ? (
          <div className="bg-[#e07856]/10 p-4 rounded-xl text-[#c85a42] text-sm border-2 border-[#e07856]/30">
            {error}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-lg">
            <div className="w-20 h-20 bg-[#7ED957]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="text-[#7ED957]" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              No reports yet
            </h3>
            <p className="text-gray-500 mt-3 text-lg max-w-sm mx-auto mb-6">
              No reports have been submitted to the system yet.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                : "space-y-4"
            }
          >
            {reports.map((report) => (
              <Link
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className={`group bg-white rounded-2xl overflow-hidden border-2 border-gray-100 hover:border-[#7ED957] transition-all shadow-md hover:shadow-xl flex ${
                  viewMode === "list"
                    ? "flex-row items-center p-4 gap-5"
                    : "flex-col"
                }`}
              >
                {/* Thumbnail */}
                <div
                  className={`relative bg-gradient-to-br from-[#f5f5f5] to-[#fafafa] overflow-hidden shrink-0 ${
                    viewMode === "list"
                      ? "w-24 h-24 rounded-xl"
                      : "w-full aspect-video"
                  }`}
                >
                  {report.imageUrl ? (
                    <img
                      src={report.imageUrl}
                      alt="Scan"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <AlertOctagon size={28} />
                    </div>
                  )}
                  {viewMode === "grid" && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium">
                      <Calendar size={12} />
                      {formatDistanceToNow(new Date(report.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 min-w-0 ${viewMode === "grid" ? "p-5" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border-2 shadow-sm ${getConditionColor(report.condition)}`}
                    >
                      {report.condition}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wide border ${getStatusColor(report.status || "pending")}`}
                    >
                      {report.status || "pending"}
                    </span>
                    {viewMode === "list" && (
                      <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                        <Calendar size={12} />
                        {formatDistanceToNow(new Date(report.timestamp), {
                          addSuffix: true,
                        })}
                      </span>
                    )}
                  </div>

                  <h3 className="text-gray-900 font-semibold line-clamp-1 mb-1 text-base">
                    {report.comment || report.description || "Untitled Scan"}
                  </h3>

                  {report.comment && (
                    <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                      {report.description}
                    </p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-600 font-medium mt-auto pt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7ED957]"></span>
                      {(report.confidence * 100).toFixed(0)}%
                    </span>
                    <span>•</span>
                    <span className="uppercase text-[#7ED957]">{report.provider || "AI"}</span>
                    {report.userEmail && (
                      <>
                        <span>•</span>
                        <span className="text-gray-500 truncate max-w-[150px]" title={report.userEmail}>
                          {report.userEmail}
                        </span>
                      </>
                    )}
                    {report.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#7ED957]">
                          <MapPin size={12} />
                          Location
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {viewMode === "list" && (
                  <div className="pr-4 text-gray-400 group-hover:text-[#7ED957] group-hover:scale-110 transition-all">
                    <Eye size={22} />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}