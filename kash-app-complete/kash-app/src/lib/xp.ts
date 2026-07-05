// src/lib/xp.ts — XP and level system utilities
export const LEVELS = [
  { level: 1, title: 'Beginner', minXP: 0 },
  { level: 2, title: 'Learner', minXP: 200 },
  { level: 3, title: 'Dedicated', minXP: 500 },
  { level: 4, title: 'Consistent', minXP: 1000 },
  { level: 5, title: 'Study Warrior', minXP: 1500 },
  { level: 6, title: 'Elite Achiever', minXP: 2500 },
  { level: 7, title: 'Champion', minXP: 4000 },
  { level: 8, title: 'Master', minXP: 6000 },
  { level: 9, title: 'Grandmaster', minXP: 9000 },
  { level: 10, title: 'Legend', minXP: 13000 },
]

export const XP_REWARDS = {
  TASK_LOW: 10,
  TASK_MEDIUM: 15,
  TASK_HIGH: 25,
  DAILY_COMPLETION: 50,
  STREAK_7: 100,
  STREAK_30: 300,
  STREAK_100: 1000,
}

export function getLevelInfo(xp: number) {
  let current = LEVELS[0]
  let next = LEVELS[1]
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i]
      next = LEVELS[i + 1] ?? LEVELS[LEVELS.length - 1]
    }
  }
  const progress = next.minXP > current.minXP
    ? Math.min(100, Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100))
    : 100
  return { current, next, progress, xp }
}

export function getXPForTask(priority: string): number {
  if (priority === 'HIGH') return XP_REWARDS.TASK_HIGH
  if (priority === 'MEDIUM') return XP_REWARDS.TASK_MEDIUM
  return XP_REWARDS.TASK_LOW
}
