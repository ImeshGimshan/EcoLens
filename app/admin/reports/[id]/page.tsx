import { adminDb } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Activity,
  Layers,
  FileText,
} from "lucide-react";
import { AdminReportActions } from "@/components/AdminReportActions";

export const dynamic = "force-dynamic";

interface Report {
  id: string;
  imageUrl?: string;
  condition?: string;
  confidence: number;
  description?: string;
  timestamp: Date;
  issues?: string[];
  recommendations?: string[];
  provider?: string;
  model?: string;
  status?: string;
  adminNotes?: string;
}

async function getReport(id: string): Promise<Report | null> {
  if (!adminDb) return null;

  try {
    const doc = await adminDb.collection("reports").doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      timestamp: data?.timestamp?.toDate() || new Date(),
    } as Report;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReport(id);

  if (!report) {
    notFound();
  }

  const getConditionColor = (condition: string) => {
    switch (condition?.toLowerCase()) {
      case "excellent":
      case "good":
        return "text-green-600 bg-green-50 border-green-200";
      case "fair":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "poor":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Admin Actions Panel */}
        <AdminReportActions
          reportId={report.id}
          currentStatus={report.status || "pending"}
          currentNotes={report.adminNotes}
        />

        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/reports"
            className="p-2 -ml-2 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Analysis Report
            </h1>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              ID: {report.id}
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              {format(report.timestamp, "PPP p")}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
              <Activity className="text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">
                Condition Assessment
              </p>
              <div
                className={`mt-2 inline-flex items-center px-4 py-1 rounded-full border text-sm font-bold uppercase ${getConditionColor(report.condition || "")}`}
              >
                {report.condition || "Unknown"}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-1">
            <p className="text-sm text-gray-500">Confidence Score</p>
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
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 relative aspect-[4/3] group cursor-zoom-in">
              {report.imageUrl ? (
                <img
                  src={report.imageUrl}
                  alt="Analyzed Site"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 text-xs text-gray-500 space-y-2">
              <div className="flex justify-between">
                <span>Provider</span>
                <span className="font-mono text-gray-900 dark:text-white">
                  {report.provider}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Model</span>
                <span className="font-mono text-gray-900 dark:text-white">
                  {report.model}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Description
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 leading-relaxed">
                {report.description || "No specific description available."}
              </div>
            </div>

            {/* Issues */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-500" />
                Identified Issues
              </h2>
              {report.issues && report.issues.length > 0 ? (
                <ul className="space-y-3">
                  {report.issues.map((issue: string, i: number) => (
                    <li
                      key={i}
                      className="bg-amber-50 dark:bg-amber-900/10 text-amber-900 dark:text-amber-100 px-4 py-3 rounded-xl text-sm border border-amber-100 dark:border-amber-900/20"
                    >
                      {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No significant issues detected.
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                Recommendations
              </h2>
              {report.recommendations && report.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {report.recommendations.map((rec: string, i: number) => (
                    <li
                      key={i}
                      className="bg-green-50 dark:bg-green-900/10 text-green-900 dark:text-green-100 px-4 py-3 rounded-xl text-sm border border-green-100 dark:border-green-900/20"
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm italic">
                  No recommendations available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
