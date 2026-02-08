import { motion } from "framer-motion";
import { XCircle, ArrowLeft, Camera } from "lucide-react";

interface RejectionOverlayProps {
  reason: string;
  onRetake: () => void;
}

export function RejectionOverlay({ reason, onRetake }: RejectionOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.7)" }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 10 }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-red-50"
        >
          <XCircle size={48} className="text-red-500" strokeWidth={2} />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-center mb-3"
          style={{ color: 'var(--color-forest)' }}
        >
          Image Not Suitable
        </motion.h2>

        {/* Reason */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-red-50 rounded-xl p-4 mb-6"
        >
          <p className="text-sm text-gray-700 text-center leading-relaxed">
            {reason}
          </p>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-forest)' }}>
            Tips for better results:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Ensure good lighting conditions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Focus on heritage site structures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Avoid blurry or dark images</span>
            </li>
          </ul>
        </motion.div>

        {/* Action Button */}
        <motion.button
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetake}
          className="w-full py-4 px-6 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <Camera size={20} />
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
