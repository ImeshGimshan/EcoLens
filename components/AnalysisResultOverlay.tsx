import React from "react";
import { motion } from "framer-motion";
import {
  X,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Info,
  ChevronRight,
  MapPin,
  Clock,
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
      <RejectionOverlay
        reason={result.rejectionReason ?? "This image does not appear to contain heritage-related content."}
        onRetake={onClose}
      />
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
        return "from-emerald-400 to-emerald-600";
      case "good":
        return "from-green-400 to-green-600";
      case "fair":
        return "from-yellow-400 to-yellow-600";
      case "poor":
        return "from-orange-400 to-orange-600";
      case "critical":
        return "from-red-400 to-red-600";
      default:
        return "from-gray-400 to-gray-600";
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
      className="absolute inset-0 z-50 rounded-t-3xl overflow-hidden flex flex-col"
      style={{ background: 'var(--color-eggshell)' }}
    >
      {/* Header with Gradient */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-4 text-white relative overflow-hidden"
        style={{ background: 'var(--gradient-primary)' }}
      >
        {/* Background Image */}
        {imageUrl && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={imageUrl}
              alt="Analyzed Site"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className={`w-12 h-12 bg-linear-to-br ${getConditionColor(result.condition)} rounded-2xl flex items-center justify-center shadow-lg`}
            >
              {getConditionIcon(result.condition)}
            </motion.div>
            <div>
              <h1 className="text-2xl font-semibold capitalize">
                {result.condition} Condition
              </h1>
              <p className="text-sm text-white/90">
                {Math.round(result.confidence * 100)}% Confidence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </motion.header>

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4">
        {/* Description Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
            Analysis Summary
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {result.description}
          </p>
        </motion.div>

        {/* Issues List */}
        {result.issues && result.issues.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
              Identified Issues
            </h3>
            <div className="space-y-2">
              {result.issues.map((issue, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-100"
                >
                  <AlertTriangle
                    size={18}
                    className="text-red-500 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-700">{issue}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations */}
        {result.recommendations && result.recommendations.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
              Recommendations
            </h3>
            <div className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{
                    background: 'rgba(126, 217, 87, 0.1)',
                    borderColor: 'rgba(126, 217, 87, 0.2)'
                  }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(126, 217, 87, 0.2)' }}
                  >
                    <span className="text-xs font-bold" style={{ color: 'var(--color-forest)' }}>
                      {idx + 1}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{rec}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Location Capture */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={16} style={{ color: 'var(--color-forest)' }} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
              Location
            </h3>
          </div>
          <div className="px-4 py-3 rounded-xl" style={{ background: 'var(--color-eggshell)' }}>
            <LocationCapture
              autoCapture={true}
              onLocationCaptured={setLocation}
              onError={(error) =>
                console.warn("Location capture failed:", error)
              }
            />
          </div>
        </motion.div>

        {/* Comment Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
        >
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3">
            Inspector's Note
          </h3>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Enter specific observations or location details..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest outline-none transition-all text-sm min-h-[100px] resize-none"
            style={{
              background: 'var(--color-eggshell)'
            }}
            disabled={isSubmitting || isSaved}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isSubmitting || isSaved}
          className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${isSaved
            ? "bg-green-500"
            : ""
            } disabled:opacity-70 disabled:cursor-not-allowed`}
          style={!isSaved ? { background: 'var(--gradient-primary)' } : {}}
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
        </motion.button>
      </main>
    </motion.div>
  );
}
