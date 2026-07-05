import { prisma } from './prisma'

export async function updateStreak(userId: string) {
  // Get user's timezone (default to Asia/Kolkata)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { timezone: true }
  })
  const timezone = user?.timezone || 'Asia/Kolkata'

  // Get current date string in user's timezone (YYYY-MM-DD format)
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: timezone })
  const today = new Date(todayStr)

  // Find user's streak record
  let streak = await prisma.streak.findUnique({
    where: { userId }
  })

  if (!streak) {
    // Initialize streak if it doesn't exist
    await prisma.streak.create({
      data: {
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActiveDate: today,
        totalDays: 1
      }
    })
    return
  }

  const lastActive = streak.lastActiveDate
  if (!lastActive) {
    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(streak.longestStreak, 1),
        lastActiveDate: today,
        totalDays: { increment: 1 }
      }
    })
    return
  }

  const lastActiveStr = lastActive.toLocaleDateString('en-CA', { timeZone: timezone })
  
  if (lastActiveStr === todayStr) {
    // Already active today, streak is maintained
    return
  }

  // Check if last active was yesterday
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toLocaleDateString('en-CA', { timeZone: timezone })

  if (lastActiveStr === yesterdayStr) {
    // Consecutive day! Increment current streak
    const newStreak = streak.currentStreak + 1
    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(streak.longestStreak, newStreak),
        lastActiveDate: today,
        totalDays: { increment: 1 }
      }
    })
  } else {
    // Streak was broken, start a new one
    await prisma.streak.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(streak.longestStreak, 1),
        lastActiveDate: today,
        totalDays: { increment: 1 }
      }
    })
  }
}
