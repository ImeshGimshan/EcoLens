"use client";

import { motion } from "framer-motion";
import { AlertCircle, Camera, XCircle } from "lucide-react";

interface RejectionOverlayProps {
  reason?: string;
  onRetake: () => void;
}

export function RejectionOverlay({ reason, onRetake }: RejectionOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
        >
          <XCircle size={48} className="text-red-600 dark:text-red-400" />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-3">
          Image Not Suitable
        </h2>

        {/* Message */}
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={20}
              className="text-red-600 dark:text-red-400 shrink-0 mt-0.5"
            />
            <p className="text-sm text-red-800 dark:text-red-200">
              {reason ||
                "This image doesn't appear to contain a heritage site or historical structure."}
            </p>
          </div>
        </div>

        {/* Guidance */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            What to scan:
          </h3>
          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Heritage sites and monuments</li>
            <li>• Historical buildings and temples</li>
            <li>• Architectural structures</li>
            <li>• Cultural landmarks</li>
          </ul>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetake}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
        >
          <Camera size={20} />
          Take Another Photo
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
