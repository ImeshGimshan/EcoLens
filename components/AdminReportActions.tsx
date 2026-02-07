"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Play,
  CheckSquare,
  Loader2,
  FileText,
  RotateCcw,
} from "lucide-react";

interface Props {
  reportId: string;
  currentStatus: string;
  currentNotes?: string;
}

export function AdminReportActions({
  reportId,
  currentStatus,
  currentNotes,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState(currentNotes || "");
  const [showNotesInput, setShowNotesInput] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          adminNotes: notes,
        }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      router.refresh(); // Refresh server data
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">
            Pending Review
          </span>
        );
      case "accepted":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase">
            Accepted
          </span>
        );
      case "declined":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold uppercase">
            Declined
          </span>
        );
      case "in_progress":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold uppercase">
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold uppercase">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  const saveNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes: notes,
        }),
      });

      if (!response.ok) throw new Error("Failed to save notes");

      // Optional: Show success state or toast
      alert("Notes saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error saving notes:", error);
      alert("Failed to save notes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Admin Actions
        </h2>
        {getStatusBadge(currentStatus)}
      </div>

      {/* Admin Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={16} />
            Internal Notes
          </div>
          <button
            onClick={saveNotes}
            disabled={loading || notes === currentNotes}
            className="text-xs px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Notes"}
          </button>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes for other admins..."
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all text-sm min-h-[80px]"
        />
      </div>

      {/* Status Management */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Current Status
        </label>

        <div className="relative">
          <select
            value={currentStatus}
            onChange={(e) => updateStatus(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all appearance-none font-medium capitalize disabled:opacity-50"
          >
            <option value="pending">Pending Review</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="declined">Declined</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Changing status will immediately update the report.
        </p>
      </div>
    </div>
  );
}
