import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '@/lib/achievements/types';
import { RARITY_COLORS } from '@/lib/achievements/config';
import { X, Share2, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AchievementUnlockModalProps {
    achievement: Achievement;
    points: number;
    onClose: () => void;
}

export function AchievementUnlockModal({
    achievement,
    points,
    onClose,
}: AchievementUnlockModalProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    const rarityStyle = RARITY_COLORS[achievement.rarity];

    useEffect(() => {
        // Auto-hide confetti after animation
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                onClick={onClose}
            >
                {/* Confetti Effect */}
                {showConfetti && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {[...Array(30)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{
                                    x: '50%',
                                    y: '50%',
                                    scale: 0,
                                    rotate: 0,
                                }}
                                animate={{
                                    x: `${Math.random() * 100}%`,
                                    y: `${Math.random() * 100}%`,
                                    scale: [0, 1, 0.8],
                                    rotate: Math.random() * 360,
                                }}
                                transition={{
                                    duration: 2 + Math.random(),
                                    ease: 'easeOut',
                                }}
                                className="absolute w-3 h-3 rounded-full"
                                style={{
                                    background: ['#FCD34D', '#F59E0B', '#EF4444', '#A855F7', '#3B82F6'][
                                        Math.floor(Math.random() * 5)
                                    ],
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                >
                    {/* Close Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                    >
                        <X size={16} className="text-gray-600" />
                    </motion.button>

                    {/* Achievement Unlocked Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-6"
                    >
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5, repeat: 3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3"
                            style={{
                                background: rarityStyle.gradient,
                            }}
                        >
                            <Sparkles size={16} className="text-white" />
                            <span className="text-white font-bold text-sm uppercase">
                                Achievement Unlocked!
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Achievement Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring', damping: 10 }}
                        className="flex justify-center mb-6"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-32 h-32 rounded-3xl flex items-center justify-center text-6xl shadow-2xl"
                            style={{ background: rarityStyle.gradient }}
                        >
                            {achievement.icon}
                        </motion.div>
                    </motion.div>

                    {/* Achievement Details */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-center mb-6"
                    >
                        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-forest)' }}>
                            {achievement.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">{achievement.description}</p>

                        {/* Rarity Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase mb-4"
                            style={{
                                background: rarityStyle.bg,
                                color: rarityStyle.text,
                                border: `1px solid ${rarityStyle.border}`,
                            }}
                        >
                            {achievement.rarity}
                        </div>

                        {/* Points Earned */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.6, type: 'spring' }}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-50 border-2 border-yellow-200"
                        >
                            <span className="text-2xl">⭐</span>
                            <span className="text-xl font-bold text-yellow-600">
                                +{points} points
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="flex gap-3"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="flex-1 px-6 py-3 rounded-xl font-semibold text-white"
                            style={{ background: 'var(--gradient-primary)' }}
                        >
                            Awesome!
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
                        >
                            <Share2 size={20} style={{ color: 'var(--color-forest)' }} />
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
