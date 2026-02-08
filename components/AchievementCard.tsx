import { motion } from 'framer-motion';
import { Achievement, AchievementRarity } from '@/lib/achievements/types';
import { RARITY_COLORS } from '@/lib/achievements/config';
import { Lock, Check } from 'lucide-react';

interface AchievementCardProps {
    achievement: Achievement;
    isUnlocked: boolean;
    progress?: number; // 0-100
    currentValue?: number;
    targetValue?: number;
    onClick?: () => void;
}

export function AchievementCard({
    achievement,
    isUnlocked,
    progress = 0,
    currentValue = 0,
    targetValue = 1,
    onClick,
}: AchievementCardProps) {
    const rarityStyle = RARITY_COLORS[achievement.rarity];

    return (
        <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`relative rounded-xl p-4 border transition-all cursor-pointer ${isUnlocked ? 'bg-white' : 'bg-gray-50'
                }`}
            style={{
                borderColor: isUnlocked ? rarityStyle.border : 'rgba(0,0,0,0.1)',
                opacity: isUnlocked ? 1 : 0.7,
            }}
        >
            {/* Rarity Badge */}
            <div
                className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold uppercase"
                style={{
                    background: rarityStyle.bg,
                    color: rarityStyle.text,
                    border: `1px solid ${rarityStyle.border}`,
                }}
            >
                {achievement.rarity}
            </div>

            {/* Icon */}
            <div className="flex items-start gap-3 mb-3">
                <div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shadow-sm ${isUnlocked ? '' : 'grayscale opacity-50'
                        }`}
                    style={{
                        background: isUnlocked ? rarityStyle.gradient : 'rgba(0,0,0,0.05)',
                    }}
                >
                    {isUnlocked ? achievement.icon : <Lock size={24} className="text-gray-400" />}
                </div>

                <div className="flex-1">
                    <h3
                        className="font-bold text-sm mb-1"
                        style={{ color: isUnlocked ? 'var(--color-forest)' : '#6B7280' }}
                    >
                        {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">
                        {achievement.description}
                    </p>
                </div>
            </div>

            {/* Progress Bar (for locked achievements) */}
            {!isUnlocked && achievement.criteria.target && (
                <div className="mb-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium" style={{ color: rarityStyle.text }}>
                            {currentValue} / {targetValue}
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: rarityStyle.gradient }}
                        />
                    </div>
                </div>
            )}

            {/* Points and Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <span className="text-yellow-500 text-sm">⭐</span>
                    <span className="text-xs font-bold" style={{ color: rarityStyle.text }}>
                        +{achievement.points} pts
                    </span>
                </div>

                {isUnlocked && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: rarityStyle.gradient }}
                    >
                        <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}
