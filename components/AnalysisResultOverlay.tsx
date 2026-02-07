import React from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  ChevronRight,
} from "lucide-react";
import { AnalysisResult } from "@/lib/ai/types";
import { LocationCapture } from "./LocationCapture";
import { RejectionOverlay } from "./RejectionOverlay";

interface Props {
  result: AnalysisResult;
  imageUrl?: string;
  provider?: string;
  userId?: string;
  userEmail?: string;
  onClose: () => void;
}

export function AnalysisResultOverlay({
  result,
  imageUrl,
  provider,
  userId,
  userEmail,
  onClose,
}: Props) {
  // Check if image was rejected as not relevant
  // Default to true for backward compatibility with old reports
  if (result.isRelevant === false) {
    return (
      <RejectionOverlay reason={result.rejectionReason} onRetake={onClose} />
    );
  }

  // Continue with normal analysis display for relevant images

  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSaved, setIsSaved] = React.useState(false);
  const [location, setLocation] = React.useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  // Determine color based on condition
  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "bg-emerald-500";
      case "good":
        return "bg-green-500";
      case "fair":
        return "bg-yellow-500";
      case "poor":
        return "bg-orange-500";
      case "critical":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getConditionIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
      case "good":
        return <CheckCircle size={24} className="text-white" />;
      case "fair":
        return <Info size={24} className="text-white" />;
      case "poor":
        return <AlertTriangle size={24} className="text-white" />;
      case "critical":
        return <AlertOctagon size={24} className="text-white" />;
      default:
        return <Info size={24} className="text-white" />;
    }
  };

  const handleSubmit = async () => {
    if (!imageUrl) {
      console.error("No image URL provided");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis: result,
          imageUrl,
          provider,
          comment,
          userId,
          userEmail,
          location, // Include location data
        }),
      });

      if (!response.ok) throw new Error("Failed to save report");

      setIsSaved(true);
      // Optional: Close after delay or let user close
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl overflow-y-auto"
    >
      {/* Header Image/Gradient */}
      <div className={`relative h-48 ${getConditionColor(result.condition)}`}>
        <div className="absolute inset-0 bg-black/20" />

        {/* Show image if available */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Analyzed Site"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50"
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 backdrop-blur-md rounded-full text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="absolute -bottom-8 left-6 z-10">
          <div
            className={`w-16 h-16 rounded-2xl shadow-xl flex items-center justify-center ${getConditionColor(result.condition)} border-4 border-white dark:border-gray-900`}
          >
            {getConditionIcon(result.condition)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 px-6 pb-32 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {result.condition} Condition
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getConditionColor(result.condition)}`}
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 font-medium">
              {Math.round(result.confidence * 100)}% Confidence
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {result.description}
        </p>

        {/* Issues List */}
        {result.issues && result.issues.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Identified Issues
            </h3>
            <div className="space-y-2">
              {result.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/10 rounded-xl"
                >
                  <AlertTriangle
                    size={18}
                    className="text-red-500 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {issue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Recommendations
            </h3>
            <div className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {idx + 1}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-200">
                    {rec}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comment & Submit Section */}
        <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
          {/* Location Capture */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Location
            </label>
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
              <LocationCapture
                autoCapture={true}
                onLocationCaptured={setLocation}
                onError={(error) =>
                  console.warn("Location capture failed:", error)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Inspector's Note
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter specific observations or location details..."
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm min-h-[100px]"
              disabled={isSubmitting || isSaved}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isSaved}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? "bg-green-500"
                : "bg-black dark:bg-white dark:text-black hover:opacity-90 active:scale-[0.98]"
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>Saving Report...</>
            ) : isSaved ? (
              <>
                <CheckCircle size={20} />
                Saved Successfully
              </>
            ) : (
              <>
                Submit Report via {provider || "AI"}
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
