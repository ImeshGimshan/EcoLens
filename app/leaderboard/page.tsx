"use client";

import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, TrendingUp, Star, Award, Filter } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats, useAchievementProgress, useLeaderboard } from "@/hooks/useAchievements";
import { AchievementCard } from "@/components/AchievementCard";
import { UserStatsCard } from "@/components/UserStatsCard";
import { ACHIEVEMENTS, CATEGORY_INFO } from "@/lib/achievements/config";
import { AchievementCategory } from "@/lib/achievements/types";

type TabType = 'leaderboard' | 'achievements' | 'mystats';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('leaderboard');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  const { stats } = useUserStats(user?.uid);
  const { progress, loading: progressLoading } = useAchievementProgress(user?.uid);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(50);

  // Find user's rank
  const userRank = leaderboard.findIndex(entry => entry.userId === user?.uid) + 1;

  // Filter achievements by category
  const filteredProgress = selectedCategory === 'all'
    ? progress
    : progress.filter(p => p.achievement.category === selectedCategory);

  const tabs = [
    { id: 'leaderboard' as TabType, label: 'Leaderboard', icon: Trophy },
    { id: 'achievements' as TabType, label: 'Achievements', icon: Award },
    { id: 'mystats' as TabType, label: 'My Stats', icon: Star },
  ];

  return (
    <MobileFrame>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="px-6 py-4 text-white"
        style={{ background: 'var(--gradient-primary)' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg"
          >
            🏆
          </motion.div>
          <div>
            <h1 className="text-2xl font-semibold">Rank</h1>
            <p className="text-sm text-white/90">Achievements & Leaderboard</p>
          </div>
        </div>
      </motion.header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 font-medium text-sm relative transition-colors ${isActive ? '' : 'text-gray-500'
                  }`}
                style={{ color: isActive ? 'var(--color-forest)' : undefined }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'var(--color-forest)' }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4" style={{ background: 'var(--color-eggshell)' }}>
        <AnimatePresence mode="wait">
          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Podium - Top 3 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-end justify-center gap-2 mb-4">
                  {leaderboard.slice(0, 3).map((guardian, idx) => {
                    const positions = [1, 0, 2]; // Order: 2nd, 1st, 3rd
                    const actualIdx = positions[idx];
                    const entry = leaderboard[actualIdx];
                    if (!entry) return null;

                    const heights = ['h-24', 'h-32', 'h-20'];
                    const sizes = ['w-16 h-16', 'w-20 h-20', 'w-16 h-16'];
                    const badges = ['🥈', '🥇', '🥉'];
                    const gradients = [
                      'from-gray-300 to-gray-500',
                      'from-yellow-400 to-orange-500',
                      'from-orange-400 to-orange-600',
                    ];

                    return (
                      <motion.div
                        key={entry.userId}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className={`flex-1 text-center ${actualIdx === 0 ? '-mt-4' : ''}`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`${sizes[idx]} mx-auto mb-2 bg-linear-to-br ${gradients[idx]} rounded-2xl flex items-center justify-center text-3xl shadow-lg ${actualIdx === 0 ? 'animate-pulse' : ''
                            }`}
                        >
                          {badges[idx]}
                        </motion.div>
                        <div
                          className={`bg-linear-to-br ${gradients[idx]} bg-opacity-10 rounded-xl p-3 ${heights[idx]} flex flex-col justify-end`}
                        >
                          <p className="font-bold text-sm truncate" style={{ color: 'var(--color-forest)' }}>
                            {entry.userName || 'Anonymous'}
                          </p>
                          <p className="text-xs text-gray-600">{entry.points} pts</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Rankings List */}
              <div className="space-y-2">
                {leaderboard.slice(3).map((entry, idx) => (
                  <motion.div
                    key={entry.userId}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    whileHover={{ x: 5 }}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl bg-linear-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
                      >
                        {entry.rank}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm" style={{ color: 'var(--color-forest)' }}>
                          {entry.userName || 'Anonymous'}
                        </p>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Star size={12} className="fill-yellow-400 text-yellow-400" />
                          <p className="text-xs">{entry.points} points</p>
                          {entry.achievementCount > 0 && (
                            <>
                              <span className="mx-1">•</span>
                              <Award size={12} />
                              <p className="text-xs">{entry.achievementCount}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: 'var(--color-eggshell)', color: 'var(--color-forest)' }}>
                        Lv {entry.level}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Your Rank Card */}
              {user && stats && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border-2"
                  style={{ borderColor: 'var(--color-forest)' }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Your Rank</p>
                      <p className="text-3xl font-bold" style={{ color: 'var(--color-forest)' }}>
                        {userRank > 0 ? `#${userRank}` : '-'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {stats.points} points • Level {stats.level}
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-linear-to-br rounded-2xl flex items-center justify-center text-3xl" style={{ background: 'var(--gradient-primary)' }}>
                      <Medal size={32} className="text-white" strokeWidth={2} />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {/* Category Filter */}
              <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Filter size={16} style={{ color: 'var(--color-forest)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--color-forest)' }}>Filter by Category</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === 'all'
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-600'
                      }`}
                    style={selectedCategory === 'all' ? { background: 'var(--gradient-primary)' } : {}}
                  >
                    All
                  </button>
                  {Object.entries(CATEGORY_INFO).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as AchievementCategory)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === key
                        ? 'text-white'
                        : 'bg-gray-100 text-gray-600'
                        }`}
                      style={selectedCategory === key ? { background: info.color } : {}}
                    >
                      {info.icon} {info.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Achievement Stats */}
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Achievements Unlocked</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--color-forest)' }}>
                      {progress.filter(p => p.isUnlocked).length} / {ACHIEVEMENTS.length}
                    </p>
                  </div>
                  <div className="text-4xl">🏆</div>
                </div>
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress.filter(p => p.isUnlocked).length / ACHIEVEMENTS.length) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full rounded-full"
                    style={{ background: 'var(--gradient-primary)' }}
                  />
                </div>
              </div>

              {/* Achievements Grid */}
              <div className="grid grid-cols-1 gap-3">
                {filteredProgress.map((item, idx) => (
                  <motion.div
                    key={item.achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <AchievementCard
                      achievement={item.achievement}
                      isUnlocked={item.isUnlocked}
                      progress={item.progress}
                      currentValue={item.currentValue}
                      targetValue={item.targetValue}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* My Stats Tab */}
          {activeTab === 'mystats' && (
            <motion.div
              key="mystats"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {stats ? (
                <UserStatsCard stats={stats} rank={userRank > 0 ? userRank : undefined} />
              ) : (
                <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-gray-600 mb-2">No stats yet</p>
                  <p className="text-sm text-gray-500">Start scanning heritage sites to earn points!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </MobileFrame>
  );
}
