import { motion } from 'framer-motion';
import { UserStats } from '@/lib/achievements/types';
import { getNextLevelPoints } from '@/lib/achievements/config';
import { TrendingUp, Zap, Award, Flame } from 'lucide-react';

interface UserStatsCardProps {
    stats: UserStats;
    rank?: number;
}

export function UserStatsCard({ stats, rank }: UserStatsCardProps) {
    const levelProgress = getNextLevelPoints(stats.points);

    return (
        <div className="space-y-4">
            {/* Level and Progress */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Your Level</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold" style={{ color: 'var(--color-forest)' }}>
                                {stats.level}
                            </span>
                            <span className="text-sm text-gray-500">
                                {stats.points.toLocaleString()} pts
                            </span>
                        </div>
                    </div>

                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                        style={{ background: 'var(--gradient-primary)' }}
                    >
                        ⭐
                    </motion.div>
                </div>

                {/* Progress to Next Level */}
                <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                        <span className="text-gray-500">Progress to Level {stats.level + 1}</span>
                        <span className="font-medium" style={{ color: 'var(--color-forest)' }}>
                            {Math.round(levelProgress.progress)}%
                        </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${levelProgress.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: 'var(--gradient-primary)' }}
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs mt-1 text-gray-400">
                        <span>{levelProgress.current.toLocaleString()}</span>
                        <span>{levelProgress.next.toLocaleString()}</span>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Total Scans */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(126, 217, 87, 0.1)' }}>
                            <Zap size={16} style={{ color: 'var(--color-forest)' }} />
                        </div>
                        <p className="text-xs text-gray-500">Total Scans</p>
                    </div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-forest)' }}>
                        {stats.totalScans}
                    </p>
                </motion.div>

                {/* Achievements */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-yellow-50">
                            <Award size={16} className="text-yellow-600" />
                        </div>
                        <p className="text-xs text-gray-500">Achievements</p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">
                        {stats.achievementsUnlocked.length}
                    </p>
                </motion.div>

                {/* Current Streak */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-50">
                            <Flame size={16} className="text-orange-500" />
                        </div>
                        <p className="text-xs text-gray-500">Current Streak</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-500">
                        {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
                    </p>
                </motion.div>

                {/* Rank */}
                {rank && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-purple-50">
                                <TrendingUp size={16} className="text-purple-600" />
                            </div>
                            <p className="text-xs text-gray-500">Your Rank</p>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                            #{rank}
                        </p>
                    </motion.div>
                )}
            </div>

            {/* Longest Streak Badge */}
            {stats.longestStreak > 0 && (
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-linear-to-r from-orange-500 to-red-500 rounded-xl p-4 text-white"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs opacity-90 mb-1">Longest Streak</p>
                            <p className="text-2xl font-bold">
                                🔥 {stats.longestStreak} {stats.longestStreak === 1 ? 'day' : 'days'}
                            </p>
                        </div>
                        <div className="text-4xl opacity-20">🏆</div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
