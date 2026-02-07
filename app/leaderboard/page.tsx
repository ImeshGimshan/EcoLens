"use client";

import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { motion } from "framer-motion";
import { Trophy, Crown, Medal, TrendingUp, Star } from "lucide-react";

export default function LeaderboardPage() {
  const topGuardians = [
    {
      rank: 1,
      name: "EcoWarrior",
      points: 1250,
      badge: "🥇",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      rank: 2,
      name: "GreenGuard",
      points: 980,
      badge: "🥈",
      gradient: "from-gray-300 to-gray-500",
    },
    {
      rank: 3,
      name: "HeritageHero",
      points: 850,
      badge: "🥉",
      gradient: "from-orange-400 to-orange-600",
    },
    {
      rank: 4,
      name: "Guardian4",
      points: 720,
      badge: "🏅",
      gradient: "from-green-400 to-emerald-600",
    },
    {
      rank: 5,
      name: "Guardian5",
      points: 650,
      badge: "🏅",
      gradient: "from-blue-400 to-blue-600",
    },
  ];

  return (
    <MobileFrame>
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative px-6 pt-6 pb-4 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 text-white overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            style={{
              backgroundImage:
                "radial-gradient(circle, white 2px, transparent 2px)",
              backgroundSize: "30px 30px",
              width: "100%",
              height: "100%",
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl shadow-lg"
            >
              🏆
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Leaderboard</h1>
              <p className="text-sm opacity-90 font-medium">Top Guardians</p>
            </div>
          </div>
          <Crown size={28} className="text-white/30" strokeWidth={2} />
        </div>

        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {/* Adjusted padding */}
        {/* Podium - Top 3 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-xl p-6 mb-4"
        >
          <div className="flex items-end justify-center gap-2 mb-4">
            {/* 2nd Place */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex-1 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              >
                🥈
              </motion.div>
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-3 h-24 flex flex-col justify-end">
                <p className="font-bold text-gray-800 text-sm">
                  {topGuardians[1].name}
                </p>
                <p className="text-xs text-gray-600">
                  {topGuardians[1].points} pts
                </p>
              </div>
            </motion.div>

            {/* 1st Place */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex-1 text-center -mt-4"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown
                    size={14}
                    className="text-yellow-800"
                    strokeWidth={3}
                  />
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-20 h-20 mx-auto mb-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-4xl shadow-2xl animate-pulse-glow"
                >
                  🥇
                </motion.div>
              </motion.div>
              <div className="bg-gradient-to-br from-yellow-100 to-orange-200 rounded-xl p-3 h-32 flex flex-col justify-end">
                <p className="font-bold text-gray-800">
                  {topGuardians[0].name}
                </p>
                <p className="text-xs text-gray-600">
                  {topGuardians[0].points} pts
                </p>
              </div>
            </motion.div>

            {/* 3rd Place */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex-1 text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              >
                🥉
              </motion.div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl p-3 h-20 flex flex-col justify-end">
                <p className="font-bold text-gray-800 text-sm">
                  {topGuardians[2].name}
                </p>
                <p className="text-xs text-gray-600">
                  {topGuardians[2].points} pts
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Rankings List */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {topGuardians.slice(3).map((guardian, idx) => (
            <motion.div
              key={guardian.rank}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${guardian.gradient} flex items-center justify-center text-white font-bold text-lg shadow-md`}
                >
                  {guardian.rank}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{guardian.name}</p>
                  <div className="flex items-center gap-1 text-gray-500">
                    <Star
                      size={12}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <p className="text-sm">{guardian.points} points</p>
                  </div>
                </div>
                <TrendingUp
                  size={20}
                  className="text-green-500"
                  strokeWidth={2.5}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Your Rank Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 shadow-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Your Rank</p>
              <p className="text-3xl font-bold">-</p>
            </div>
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Medal size={32} strokeWidth={2.5} />
            </div>
          </div>
          <p className="text-sm opacity-90 mt-3">
            Start scanning to earn points!
          </p>
        </motion.div>
      </main>

      <BottomNav />
    </MobileFrame>
  );
}
