import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserStats, UnlockedAchievement, PointsTransaction } from './types';

// Initialize user stats when they first sign up
export async function initializeUserStats(userId: string, userEmail?: string): Promise<UserStats> {
  const userStatsRef = doc(db, 'userStats', userId);
  
  // Check if stats already exist
  const existingStats = await getDoc(userStatsRef);
  if (existingStats.exists()) {
    return existingStats.data() as UserStats;
  }
  
  const initialStats: UserStats = {
    userId,
    points: 0,
    level: 1,
    totalScans: 0,
    totalReports: 0,
    achievementsUnlocked: [],
    currentStreak: 0,
    longestStreak: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  await setDoc(userStatsRef, {
    ...initialStats,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return initialStats;
}

// Get user stats
export async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    const userStatsRef = doc(db, 'userStats', userId);
    const statsDoc = await getDoc(userStatsRef);
    
    if (!statsDoc.exists()) {
      return null;
    }
    
    const data = statsDoc.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
      lastScanDate: data.lastScanDate?.toDate(),
    } as UserStats;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return null;
  }
}

// Update user stats
export async function updateUserStats(
  userId: string,
  updates: Partial<UserStats>
): Promise<void> {
  const userStatsRef = doc(db, 'userStats', userId);
  
  await updateDoc(userStatsRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Unlock an achievement for a user
export async function unlockAchievement(
  userId: string,
  achievementId: string
): Promise<void> {
  const achievementRef = doc(db, 'userStats', userId, 'achievements', achievementId);
  
  await setDoc(achievementRef, {
    achievementId,
    unlockedAt: serverTimestamp(),
  });
  
  // Also update the main stats document
  const userStatsRef = doc(db, 'userStats', userId);
  const stats = await getDoc(userStatsRef);
  
  if (stats.exists()) {
    const currentAchievements = stats.data().achievementsUnlocked || [];
    if (!currentAchievements.includes(achievementId)) {
      await updateDoc(userStatsRef, {
        achievementsUnlocked: [...currentAchievements, achievementId],
        updatedAt: serverTimestamp(),
      });
    }
  }
}

// Get user's unlocked achievements
export async function getUserAchievements(userId: string): Promise<UnlockedAchievement[]> {
  try {
    const achievementsRef = collection(db, 'userStats', userId, 'achievements');
    const achievementsSnap = await getDocs(achievementsRef);
    
    return achievementsSnap.docs.map(doc => {
      const data = doc.data();
      return {
        achievementId: data.achievementId,
        unlockedAt: data.unlockedAt?.toDate() || new Date(),
        progress: data.progress,
      };
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    return [];
  }
}

// Add points transaction
export async function addPointsTransaction(
  userId: string,
  points: number,
  reason: string,
  relatedAchievementId?: string
): Promise<void> {
  const transactionsRef = collection(db, 'userStats', userId, 'pointsHistory');
  
  await addDoc(transactionsRef, {
    userId,
    points,
    reason,
    relatedAchievementId,
    timestamp: serverTimestamp(),
  });
}

// Get user's points history
export async function getPointsHistory(
  userId: string,
  limitCount: number = 20
): Promise<PointsTransaction[]> {
  try {
    const transactionsRef = collection(db, 'userStats', userId, 'pointsHistory');
    const q = query(transactionsRef, orderBy('timestamp', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        points: data.points,
        reason: data.reason,
        timestamp: data.timestamp?.toDate() || new Date(),
        relatedAchievementId: data.relatedAchievementId,
      };
    });
  } catch (error) {
    console.error('Error fetching points history:', error);
    return [];
  }
}

// Get leaderboard
export async function getLeaderboard(limitCount: number = 50) {
  try {
    const statsRef = collection(db, 'userStats');
    const q = query(statsRef, orderBy('points', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        userId: doc.id,
        userName: data.userName || 'Anonymous',
        userEmail: data.userEmail,
        points: data.points || 0,
        level: data.level || 1,
        rank: index + 1,
        achievementCount: (data.achievementsUnlocked || []).length,
        totalScans: data.totalScans || 0,
        featuredBadge: data.featuredBadge,
      };
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// Update streak
export async function updateStreak(userId: string): Promise<{ newStreak: number; bonusPoints: number }> {
  const stats = await getUserStats(userId);
  
  if (!stats) {
    throw new Error('User stats not found');
  }
  
  const now = new Date();
  const lastScan = stats.lastScanDate;
  
  let newStreak = 1;
  let bonusPoints = 0;
  
  if (lastScan) {
    const daysSinceLastScan = Math.floor(
      (now.getTime() - lastScan.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLastScan === 0) {
      // Same day, no streak change
      newStreak = stats.currentStreak;
    } else if (daysSinceLastScan === 1) {
      // Consecutive day, increment streak
      newStreak = stats.currentStreak + 1;
      bonusPoints = 10 * newStreak; // Bonus increases with streak
    } else {
      // Streak broken, reset to 1
      newStreak = 1;
    }
  }
  
  const longestStreak = Math.max(stats.longestStreak, newStreak);
  
  await updateUserStats(userId, {
    currentStreak: newStreak,
    longestStreak,
    lastScanDate: now,
  });
  
  return { newStreak, bonusPoints };
}
