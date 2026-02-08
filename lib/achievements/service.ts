import { ACHIEVEMENTS, calculateLevel, POINTS_CONFIG } from './config';
import {
  getUserStats,
  updateUserStats,
  unlockAchievement,
  addPointsTransaction,
  updateStreak,
  initializeUserStats,
} from './firestore';
import { Achievement, UserAction, AchievementProgress } from './types';

// Check and unlock achievements based on user action
export async function checkAndUnlockAchievements(
  userId: string,
  action: UserAction
): Promise<Achievement[]> {
  const stats = await getUserStats(userId);
  
  if (!stats) {
    console.error('User stats not found');
    return [];
  }
  
  const newlyUnlocked: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (stats.achievementsUnlocked.includes(achievement.id)) {
      continue;
    }
    
    let shouldUnlock = false;
    
    // Check criteria based on achievement type
    switch (achievement.criteria.type) {
      case 'scan_count':
        if (action.type === 'scan_completed' && stats.totalScans >= (achievement.criteria.target || 0)) {
          shouldUnlock = true;
        }
        break;
        
      case 'report_count':
        if (action.type === 'report_submitted' && stats.totalReports >= (achievement.criteria.target || 0)) {
          shouldUnlock = true;
        }
        break;
        
      case 'streak':
        if (action.type === 'streak_updated' && action.streakCount >= (achievement.criteria.target || 0)) {
          shouldUnlock = true;
        }
        break;
        
      case 'rank':
        if (action.type === 'rank_achieved' && action.rank <= (achievement.criteria.target || 0)) {
          shouldUnlock = true;
        }
        break;
        
      case 'time_based':
        if (action.type === 'scan_completed') {
          const hour = action.timestamp.getHours();
          
          // Early Bird: before 7 AM
          if (achievement.id === 'early_bird' && hour < 7) {
            shouldUnlock = true;
          }
          
          // Night Owl: after 10 PM
          if (achievement.id === 'night_owl' && hour >= 22) {
            shouldUnlock = true;
          }
        }
        break;
        
      case 'custom':
        // Handle custom achievements based on level
        if (achievement.id === 'rising_star' && stats.level >= 5) {
          shouldUnlock = true;
        }
        if (achievement.id === 'heritage_hero' && stats.level >= 10) {
          shouldUnlock = true;
        }
        if (achievement.id === 'legendary_guardian' && stats.level >= 20) {
          shouldUnlock = true;
        }
        break;
    }
    
    if (shouldUnlock) {
      await unlockAchievement(userId, achievement.id);
      await awardPoints(userId, achievement.points, `Achievement unlocked: ${achievement.title}`, achievement.id);
      newlyUnlocked.push(achievement);
    }
  }
  
  return newlyUnlocked;
}

// Award points to a user
export async function awardPoints(
  userId: string,
  points: number,
  reason: string,
  relatedAchievementId?: string
): Promise<void> {
  const stats = await getUserStats(userId);
  
  if (!stats) {
    console.error('User stats not found');
    return;
  }
  
  const newPoints = stats.points + points;
  const newLevel = calculateLevel(newPoints);
  
  await updateUserStats(userId, {
    points: newPoints,
    level: newLevel,
  });
  
  await addPointsTransaction(userId, points, reason, relatedAchievementId);
  
  // Check if leveling up unlocked any achievements
  if (newLevel > stats.level) {
    await checkAndUnlockAchievements(userId, {
      type: 'scan_completed',
      siteId: 'level_up',
      timestamp: new Date(),
    });
  }
}

// Handle scan completion
export async function handleScanCompleted(
  userId: string,
  siteId: string
): Promise<{ points: number; newAchievements: Achievement[]; streakBonus: number }> {
  // Initialize stats if they don't exist
  let stats = await getUserStats(userId);
  if (!stats) {
    stats = await initializeUserStats(userId);
  }
  
  // Update scan count
  await updateUserStats(userId, {
    totalScans: stats.totalScans + 1,
  });
  
  // Update streak and get bonus
  const { newStreak, bonusPoints } = await updateStreak(userId);
  
  // Award base points for scan
  const basePoints = POINTS_CONFIG.SCAN_SITE;
  await awardPoints(userId, basePoints, 'Heritage site scan');
  
  // Award streak bonus if applicable
  if (bonusPoints > 0) {
    await awardPoints(userId, bonusPoints, `${newStreak}-day streak bonus`);
  }
  
  // Check for newly unlocked achievements
  const newAchievements = await checkAndUnlockAchievements(userId, {
    type: 'scan_completed',
    siteId,
    timestamp: new Date(),
  });
  
  // Check streak achievements
  const streakAchievements = await checkAndUnlockAchievements(userId, {
    type: 'streak_updated',
    streakCount: newStreak,
  });
  
  return {
    points: basePoints + bonusPoints,
    newAchievements: [...newAchievements, ...streakAchievements],
    streakBonus: bonusPoints,
  };
}

// Handle report submission
export async function handleReportSubmitted(
  userId: string,
  reportId: string
): Promise<{ points: number; newAchievements: Achievement[] }> {
  const stats = await getUserStats(userId);
  
  if (!stats) {
    console.error('User stats not found');
    return { points: 0, newAchievements: [] };
  }
  
  // Update report count
  await updateUserStats(userId, {
    totalReports: stats.totalReports + 1,
  });
  
  // Award points for detailed report
  const points = POINTS_CONFIG.DETAILED_REPORT;
  await awardPoints(userId, points, 'Detailed conservation report');
  
  // Check for newly unlocked achievements
  const newAchievements = await checkAndUnlockAchievements(userId, {
    type: 'report_submitted',
    reportId,
    timestamp: new Date(),
  });
  
  return { points, newAchievements };
}

// Get achievement progress for a user
export async function getAchievementProgress(userId: string): Promise<AchievementProgress[]> {
  const stats = await getUserStats(userId);
  
  if (!stats) {
    return [];
  }
  
  return ACHIEVEMENTS.map(achievement => {
    const isUnlocked = stats.achievementsUnlocked.includes(achievement.id);
    
    let currentValue = 0;
    let targetValue = achievement.criteria.target || 1;
    
    switch (achievement.criteria.type) {
      case 'scan_count':
        currentValue = stats.totalScans;
        break;
      case 'report_count':
        currentValue = stats.totalReports;
        break;
      case 'streak':
        currentValue = stats.currentStreak;
        break;
      default:
        currentValue = isUnlocked ? 1 : 0;
        targetValue = 1;
    }
    
    const progress = isUnlocked ? 100 : Math.min(100, (currentValue / targetValue) * 100);
    
    return {
      achievement,
      isUnlocked,
      progress,
      currentValue,
      targetValue,
    };
  });
}
