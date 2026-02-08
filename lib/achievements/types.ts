// Achievement and Reward System Type Definitions

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type AchievementCategory = 
  | 'explorer'
  | 'contributor'
  | 'streak'
  | 'special'
  | 'social';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or icon name
  category: AchievementCategory;
  rarity: AchievementRarity;
  points: number;
  criteria: {
    type: 'scan_count' | 'report_count' | 'streak' | 'time_based' | 'rank' | 'custom';
    target?: number; // Target value for count-based achievements
    condition?: string; // Custom condition description
  };
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: Date;
  progress?: number; // For partially completed achievements
}

export interface UserStats {
  userId: string;
  userName?: string;
  userEmail?: string;
  points: number;
  level: number;
  totalScans: number;
  totalReports: number;
  achievementsUnlocked: string[]; // Array of achievement IDs
  currentStreak: number;
  longestStreak: number;
  lastScanDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  featuredBadge?: string; // Selected badge to display
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  rarity: AchievementRarity;
  description: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  points: number;
  reason: string;
  timestamp: Date;
  relatedAchievementId?: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userEmail?: string;
  points: number;
  level: number;
  rank: number;
  achievementCount: number;
  featuredBadge?: Badge;
  totalScans: number;
}

export interface AchievementProgress {
  achievement: Achievement;
  isUnlocked: boolean;
  progress: number; // 0-100 percentage
  currentValue: number;
  targetValue: number;
}

// User action types for achievement checking
export type UserAction = 
  | { type: 'scan_completed'; siteId: string; timestamp: Date }
  | { type: 'report_submitted'; reportId: string; timestamp: Date }
  | { type: 'streak_updated'; streakCount: number }
  | { type: 'rank_achieved'; rank: number };
