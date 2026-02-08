import { Achievement, Badge } from './types';

// All available achievements in the system
export const ACHIEVEMENTS: Achievement[] = [
  // Explorer Achievements
  {
    id: 'first_steps',
    title: 'First Steps',
    description: 'Complete your first heritage site scan',
    icon: '🎯',
    category: 'explorer',
    rarity: 'common',
    points: 50,
    criteria: {
      type: 'scan_count',
      target: 1,
    },
  },
  {
    id: 'site_explorer',
    title: 'Site Explorer',
    description: 'Scan 10 different heritage sites',
    icon: '🗺️',
    category: 'explorer',
    rarity: 'common',
    points: 100,
    criteria: {
      type: 'scan_count',
      target: 10,
    },
  },
  {
    id: 'heritage_hunter',
    title: 'Heritage Hunter',
    description: 'Scan 50 heritage sites',
    icon: '🏛️',
    category: 'explorer',
    rarity: 'rare',
    points: 250,
    criteria: {
      type: 'scan_count',
      target: 50,
    },
  },
  {
    id: 'master_guardian',
    title: 'Master Guardian',
    description: 'Scan 100 heritage sites',
    icon: '👑',
    category: 'explorer',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'scan_count',
      target: 100,
    },
  },

  // Contributor Achievements
  {
    id: 'data_contributor',
    title: 'Data Contributor',
    description: 'Submit your first detailed analysis',
    icon: '📊',
    category: 'contributor',
    rarity: 'common',
    points: 75,
    criteria: {
      type: 'report_count',
      target: 1,
    },
  },
  {
    id: 'quality_reporter',
    title: 'Quality Reporter',
    description: 'Submit 10 detailed reports',
    icon: '📝',
    category: 'contributor',
    rarity: 'rare',
    points: 200,
    criteria: {
      type: 'report_count',
      target: 10,
    },
  },
  {
    id: 'conservation_champion',
    title: 'Conservation Champion',
    description: 'Submit 50 conservation reports',
    icon: '🌟',
    category: 'contributor',
    rarity: 'epic',
    points: 400,
    criteria: {
      type: 'report_count',
      target: 50,
    },
  },

  // Streak Achievements
  {
    id: 'week_warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day scanning streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    points: 150,
    criteria: {
      type: 'streak',
      target: 7,
    },
  },
  {
    id: 'month_master',
    title: 'Month Master',
    description: 'Maintain a 30-day scanning streak',
    icon: '⚡',
    category: 'streak',
    rarity: 'epic',
    points: 350,
    criteria: {
      type: 'streak',
      target: 30,
    },
  },
  {
    id: 'dedication_legend',
    title: 'Dedication Legend',
    description: 'Maintain a 100-day scanning streak',
    icon: '💎',
    category: 'streak',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'streak',
      target: 100,
    },
  },

  // Special Achievements
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Scan a site before 7 AM',
    icon: '🌅',
    category: 'special',
    rarity: 'rare',
    points: 100,
    criteria: {
      type: 'time_based',
      condition: 'Scan before 7 AM',
    },
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Scan a site after 10 PM',
    icon: '🦉',
    category: 'special',
    rarity: 'rare',
    points: 100,
    criteria: {
      type: 'time_based',
      condition: 'Scan after 10 PM',
    },
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Scan 5 sites on weekends',
    icon: '🎉',
    category: 'special',
    rarity: 'common',
    points: 75,
    criteria: {
      type: 'custom',
      condition: 'Scan 5 sites on Saturday or Sunday',
    },
  },

  // Social Achievements
  {
    id: 'top_ten',
    title: 'Top Ten',
    description: 'Reach the top 10 on the leaderboard',
    icon: '🏆',
    category: 'social',
    rarity: 'epic',
    points: 300,
    criteria: {
      type: 'rank',
      target: 10,
    },
  },
  {
    id: 'podium_finish',
    title: 'Podium Finish',
    description: 'Reach the top 3 on the leaderboard',
    icon: '🥇',
    category: 'social',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'rank',
      target: 3,
    },
  },
  {
    id: 'rising_star',
    title: 'Rising Star',
    description: 'Reach level 5',
    icon: '⭐',
    category: 'social',
    rarity: 'rare',
    points: 150,
    criteria: {
      type: 'custom',
      condition: 'Reach level 5',
    },
  },
  {
    id: 'heritage_hero',
    title: 'Heritage Hero',
    description: 'Reach level 10',
    icon: '🦸',
    category: 'social',
    rarity: 'epic',
    points: 300,
    criteria: {
      type: 'custom',
      condition: 'Reach level 10',
    },
  },
  {
    id: 'legendary_guardian',
    title: 'Legendary Guardian',
    description: 'Reach level 20',
    icon: '👑',
    category: 'social',
    rarity: 'legendary',
    points: 500,
    criteria: {
      type: 'custom',
      condition: 'Reach level 20',
    },
  },
];

// Rarity color mapping for UI
export const RARITY_COLORS = {
  common: {
    bg: 'rgba(156, 163, 175, 0.1)',
    border: 'rgba(156, 163, 175, 0.3)',
    text: '#6B7280',
    gradient: 'linear-gradient(135deg, #9CA3AF 0%, #6B7280 100%)',
  },
  rare: {
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    text: '#3B82F6',
    gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
  },
  epic: {
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
    text: '#A855F7',
    gradient: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
  },
  legendary: {
    bg: 'rgba(234, 179, 8, 0.1)',
    border: 'rgba(234, 179, 8, 0.3)',
    text: '#EAB308',
    gradient: 'linear-gradient(135deg, #FCD34D 0%, #EAB308 100%)',
  },
};

// Category display names and icons
export const CATEGORY_INFO = {
  explorer: { name: 'Explorer', icon: '🗺️', color: '#10B981' },
  contributor: { name: 'Contributor', icon: '📊', color: '#3B82F6' },
  streak: { name: 'Streak', icon: '🔥', color: '#EF4444' },
  special: { name: 'Special', icon: '✨', color: '#A855F7' },
  social: { name: 'Social', icon: '👥', color: '#F59E0B' },
};

// Level thresholds and requirements
export const LEVEL_THRESHOLDS = [
  { level: 1, minPoints: 0, maxPoints: 100 },
  { level: 2, minPoints: 100, maxPoints: 250 },
  { level: 3, minPoints: 250, maxPoints: 500 },
  { level: 4, minPoints: 500, maxPoints: 1000 },
  { level: 5, minPoints: 1000, maxPoints: 1500 },
  { level: 6, minPoints: 1500, maxPoints: 2250 },
  { level: 7, minPoints: 2250, maxPoints: 3375 },
  { level: 8, minPoints: 3375, maxPoints: 5062 },
  { level: 9, minPoints: 5062, maxPoints: 7593 },
  { level: 10, minPoints: 7593, maxPoints: 11389 },
  // Continues with exponential growth: maxPoints = previous * 1.5
];

// Calculate level from points
export function calculateLevel(points: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].minPoints) {
      return LEVEL_THRESHOLDS[i].level;
    }
  }
  
  // For levels beyond predefined thresholds, use exponential formula
  let level = 10;
  let threshold = 11389;
  
  while (points >= threshold) {
    level++;
    threshold = Math.floor(threshold * 1.5);
  }
  
  return level;
}

// Calculate points needed for next level
export function getNextLevelPoints(currentPoints: number): { current: number; next: number; progress: number } {
  const currentLevel = calculateLevel(currentPoints);
  
  // Find current level threshold
  let currentThreshold = 0;
  let nextThreshold = 100;
  
  if (currentLevel <= LEVEL_THRESHOLDS.length) {
    const levelData = LEVEL_THRESHOLDS[currentLevel - 1];
    currentThreshold = levelData.minPoints;
    nextThreshold = levelData.maxPoints;
  } else {
    // Calculate for higher levels
    currentThreshold = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].maxPoints;
    for (let i = LEVEL_THRESHOLDS.length; i < currentLevel; i++) {
      currentThreshold = Math.floor(currentThreshold * 1.5);
    }
    nextThreshold = Math.floor(currentThreshold * 1.5);
  }
  
  const progress = ((currentPoints - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  
  return {
    current: currentThreshold,
    next: nextThreshold,
    progress: Math.min(100, Math.max(0, progress)),
  };
}

// Points awarded for different actions
export const POINTS_CONFIG = {
  SCAN_SITE: 50,
  DETAILED_REPORT: 100,
  DAILY_BONUS: 25,
  STREAK_BONUS_PER_DAY: 10,
  ACHIEVEMENT_UNLOCK: 0, // Points come from achievement itself
};
