import { adminDb } from "@/lib/firebase-admin";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  Eye,
  Calendar,
  Filter,
} from "lucide-react";

export const dynamic = "force-dynamic"; // Always fetch fresh data

async function getReports(status?: string) {
  if (!adminDb) return [];

  try {
    let query = adminDb.collection("reports").orderBy("timestamp", "desc");

    if (status && status !== "all") {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.limit(50).get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // specific handling for timestamp
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    }));
  } catch (error) {
    console.error("Error fetching reports:", error);
    return [];
  }
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const statusFilter = status || "all";
  const reports = await getReports(statusFilter);

  // Check if firebase is configured
  if (!process.env.FIREBASE_PROJECT_ID) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Configuration Error
        </h1>
        <p className="text-gray-600">
          Firebase Admin credentials are not configured. Please check your
          .env.local file.
        </p>
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      case "fair":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "poor":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      case "in_progress":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "declined", label: "Declined" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Analysis Reports
            </h1>
            <p className="text-gray-500 mt-2">Review management dashboard</p>
          </div>
          <Link
            href="/scan"
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity self-start md:self-auto"
          >
            New Scan
          </Link>
        </header>

        {/* Status Filter */}
        <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
          {filters.map((filter) => (
            <Link
              key={filter.id}
              href={`/admin/reports?status=${filter.id}`}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === filter.id
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
              }`}
            >
              {filter.label}
            </Link>
          ))}
        </div>

        {reports.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No reports found
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm mx-auto">
              There are no reports in the "{statusFilter}" category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {reports.map((report: any) => (
              <Link
                key={report.id}
                href={`/admin/reports/${report.id}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-all shadow-sm hover:shadow-md flex flex-col md:flex-row gap-6 items-start md:items-center"
              >
                {/* Thumbnail */}
                <div className="relative w-full md:w-32 h-32 md:h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
                  {/* Status Badge (Desktop) */}
                  <div className="absolute top-2 right-2 md:hidden">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(report.status || "pending")}`}
                    >
                      {report.status || "Pending"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getConditionColor(report.condition)}`}
                    >
                      {report.condition || "Unknown"}
                    </span>
                    <span
                      className={`hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(report.status || "pending")}`}
                    >
                      {report.status || "Pending"}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDistanceToNow(report.timestamp, {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <h3 className="text-gray-900 dark:text-white font-medium line-clamp-1 mb-1">
                    {report.description || "No description provided"}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{report.issues?.length || 0} issues detected</span>
                    <span>•</span>
                    <span>
                      {(report.confidence * 100).toFixed(0)}% confidence
                    </span>
                    <span>•</span>
                    <span className="uppercase">{report.provider}</span>
                  </div>
                </div>

                {/* Action */}
                <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700 group-hover:bg-orange-50 dark:group-hover:bg-orange-900/20 group-hover:text-orange-600 transition-colors">
                  <Eye size={20} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
