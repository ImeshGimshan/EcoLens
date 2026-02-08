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
        return "text-[#6DC54D] bg-[#7ED957]/10 border-[#7ED957]/30";
      case "fair":
        return "text-yellow-700 bg-yellow-50 border-yellow-200";
      case "poor":
        return "text-orange-700 bg-orange-50 border-orange-200";
      case "critical":
        return "text-[#c85a42] bg-[#e07856]/10 border-[#e07856]/30";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Modern Top Bar */}
      <div style={{ background: 'linear-gradient(135deg, #7ED957 0%, #8FE066 100%)' }} className="shadow-lg">
        <div className="max-w-4xl mx-auto px-6 md:px-10 py-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/reports"
              className="p-2.5 hover:bg-white/20 rounded-xl transition-colors"
            >
              <ArrowLeft size={24} className="text-white" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-white">
                Analysis Report
              </h1>
              <p className="text-white/90 text-lg flex items-center gap-2 mt-1">
                ID: {report.id.slice(0, 8)}...
                <span className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                {format(report.timestamp, "PPP p")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 space-y-8">
        {/* Admin Actions Panel */}
        <AdminReportActions
          reportId={report.id}
          currentStatus={report.status || "pending"}
          currentNotes={report.adminNotes}
        />

        {/* Status Card */}
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex items-start gap-5">
            <div className="p-4 bg-[#7ED957]/10 rounded-2xl">
              <Activity className="text-[#7ED957]" size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-3">
                Condition Assessment
              </p>
              <div
                className={`inline-flex items-center px-5 py-2 rounded-xl border-2 text-sm font-bold uppercase shadow-sm ${getConditionColor(report.condition || "")}`}
              >
                {report.condition || "Unknown"}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:items-end gap-2">
            <p className="text-sm text-gray-500 font-semibold">Confidence Score</p>
            <div className="text-4xl font-mono font-bold text-[#7ED957]">
              {(report.confidence * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Layers size={22} className="text-[#7ED957]" />
              Captured Image
            </h2>
            <div className="rounded-3xl overflow-hidden border-2 border-gray-100 bg-gradient-to-br from-[#f5f5f5] to-[#fafafa] relative aspect-[4/3] group cursor-zoom-in shadow-md hover:shadow-xl transition-shadow">
              {report.imageUrl ? (
                <img
                  src={report.imageUrl}
                  alt="Analyzed Site"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="text-sm font-medium">No image available</span>
                </div>
              )}
            </div>
            <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 text-sm text-gray-600 space-y-3 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Provider</span>
                <span className="font-mono text-[#7ED957] font-bold">
                  {report.provider}
                </span>
              </div>
              <div className="h-px bg-gray-100"></div>
              <div className="flex justify-between items-center">
                <span className="font-semibold">Model</span>
                <span className="font-mono text-[#7ED957] font-bold">
                  {report.model}
                </span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-8">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">
                Description
              </h2>
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-100 text-gray-700 leading-relaxed shadow-sm">
                {report.description || "No specific description available."}
              </div>
            </div>

            {/* Issues */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle size={22} className="text-[#e07856]" />
                Identified Issues
              </h2>
              {report.issues && report.issues.length > 0 ? (
                <ul className="space-y-3">
                  {report.issues.map((issue: string, i: number) => (
                    <li
                      key={i}
                      className="bg-[#e07856]/5 text-[#c85a42] px-5 py-4 rounded-xl text-sm border-2 border-[#e07856]/20 font-medium leading-relaxed shadow-sm"
                    >
                      {issue}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm italic bg-gray-50 p-4 rounded-xl">
                  No significant issues detected.
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle size={22} className="text-[#7ED957]" />
                Recommendations
              </h2>
              {report.recommendations && report.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {report.recommendations.map((rec: string, i: number) => (
                    <li
                      key={i}
                      className="bg-[#7ED957]/5 text-[#6DC54D] px-5 py-4 rounded-xl text-sm border-2 border-[#7ED957]/20 font-medium leading-relaxed shadow-sm"
                    >
                      {rec}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm italic bg-gray-50 p-4 rounded-xl">
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