import { useState, useEffect } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  getUserStats,
  getUserAchievements,
  getLeaderboard,
  getPointsHistory,
} from '@/lib/achievements/firestore';
import {
  getAchievementProgress,
  handleScanCompleted,
  handleReportSubmitted,
} from '@/lib/achievements/service';
import {
  UserStats,
  UnlockedAchievement,
  LeaderboardEntry,
  PointsTransaction,
  AchievementProgress,
  Achievement,
} from '@/lib/achievements/types';

// Hook to get and subscribe to user stats
export function useUserStats(userId: string | undefined) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setStats(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Set up real-time listener
    const userStatsRef = doc(db, 'userStats', userId);
    const unsubscribe = onSnapshot(
      userStatsRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setStats({
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            lastScanDate: data.lastScanDate?.toDate(),
          } as UserStats);
        } else {
          setStats(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to user stats:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { stats, loading, error };
}

// Hook to get user's unlocked achievements
export function useAchievements(userId: string | undefined) {
  const [achievements, setAchievements] = useState<UnlockedAchievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAchievements([]);
      setLoading(false);
      return;
    }

    getUserAchievements(userId).then((data) => {
      setAchievements(data);
      setLoading(false);
    });
  }, [userId]);

  return { achievements, loading };
}

// Hook to get achievement progress
export function useAchievementProgress(userId: string | undefined) {
  const [progress, setProgress] = useState<AchievementProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setProgress([]);
      setLoading(false);
      return;
    }

    getAchievementProgress(userId).then((data) => {
      setProgress(data);
      setLoading(false);
    });
  }, [userId]);

  const refresh = async () => {
    if (!userId) return;
    setLoading(true);
    const data = await getAchievementProgress(userId);
    setProgress(data);
    setLoading(false);
  };

  return { progress, loading, refresh };
}

// Hook to get leaderboard
export function useLeaderboard(limitCount: number = 50) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard(limitCount).then((data) => {
      setLeaderboard(data);
      setLoading(false);
    });
  }, [limitCount]);

  const refresh = async () => {
    setLoading(true);
    const data = await getLeaderboard(limitCount);
    setLeaderboard(data);
    setLoading(false);
  };

  return { leaderboard, loading, refresh };
}

// Hook to get points history
export function usePointsHistory(userId: string | undefined, limitCount: number = 20) {
  const [history, setHistory] = useState<PointsTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      setLoading(false);
      return;
    }

    getPointsHistory(userId, limitCount).then((data) => {
      setHistory(data);
      setLoading(false);
    });
  }, [userId, limitCount]);

  return { history, loading };
}

// Hook for handling scan completion
export function useScanCompletion() {
  const [processing, setProcessing] = useState(false);

  const completeScan = async (userId: string, siteId: string) => {
    setProcessing(true);
    try {
      const result = await handleScanCompleted(userId, siteId);
      return result;
    } catch (error) {
      console.error('Error completing scan:', error);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return { completeScan, processing };
}

// Hook for handling report submission
export function useReportSubmission() {
  const [processing, setProcessing] = useState(false);

  const submitReport = async (userId: string, reportId: string) => {
    setProcessing(true);
    try {
      const result = await handleReportSubmitted(userId, reportId);
      return result;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  return { submitReport, processing };
}
