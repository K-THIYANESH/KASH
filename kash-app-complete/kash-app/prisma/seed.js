// prisma/seed.js — Seeds the two KA-SH users + achievements with 0 starting stats and no mock tasks/memories
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 resetting and seeding clean KA-SH database...')

  // 1. Wipe existing data to ensure a completely clean start
  await prisma.taskAssignee.deleteMany()
  await prisma.taskCompletion.deleteMany()
  await prisma.task.deleteMany()
  await prisma.memory.deleteMany()
  await prisma.appreciation.deleteMany()
  await prisma.streak.deleteMany()
  await prisma.userAchievement.deleteMany()
  await prisma.userSettings.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.studySession.deleteMany()
  await prisma.user.deleteMany()
  await prisma.achievement.deleteMany()

  console.log('🧹 Cleaned up existing database records.')

  // 2. Create users with clean (zeroed) starting stats
  const hashedPw = await bcrypt.hash('kash2025', 12)

  const thiyanesh = await prisma.user.create({
    data: {
      name: 'Thiyanesh K',
      email: 'thiyanesh@kash.app',
      password: hashedPw,
      xp: 0,
      level: 1,
      settings: {
        create: { dailyGoal: 6 }
      },
      streaks: {
        create: { currentStreak: 0, longestStreak: 0, totalDays: 0 }
      }
    }
  })

  const kavibala = await prisma.user.create({
    data: {
      name: 'Kavibala J',
      email: 'kavibala@kash.app',
      password: hashedPw,
      xp: 0,
      level: 1,
      settings: {
        create: { dailyGoal: 8 }
      },
      streaks: {
        create: { currentStreak: 0, longestStreak: 0, totalDays: 0 }
      }
    }
  })

  // 3. Seed achievements definitions (required for achievement system to work)
  const achievementData = [
    { key: 'first_task', name: 'First Task', description: 'Completed your very first task', icon: '🎯', xpReward: 50, condition: { type: 'tasks_completed', threshold: 1 } },
    { key: 'ten_tasks', name: 'Ten Down', description: '10 tasks completed', icon: '🔟', xpReward: 100, condition: { type: 'tasks_completed', threshold: 10 } },
    { key: 'century', name: 'Century', description: '100 tasks completed', icon: '💯', xpReward: 500, condition: { type: 'tasks_completed', threshold: 100 } },
    { key: 'week_streak', name: 'Week Warrior', description: '7-day streak achieved', icon: '🔥', xpReward: 100, condition: { type: 'streak', threshold: 7 } },
    { key: 'month_streak', name: 'Monthly Master', description: '30-day streak achieved', icon: '📅', xpReward: 300, condition: { type: 'streak', threshold: 30 } },
    { key: 'partner_power', name: 'Partner Power', description: 'Both completed all tasks in a day', icon: '💑', xpReward: 200, condition: { type: 'partner_sync', threshold: 1 } },
    { key: 'perfect_week', name: 'Perfect Week', description: '100% completion for 7 days', icon: '⭐', xpReward: 200, condition: { type: 'perfect_days', threshold: 7 } },
    { key: 'perfect_month', name: 'Perfect Month', description: '100% for 30 days', icon: '🌟', xpReward: 1000, condition: { type: 'perfect_days', threshold: 30 } },
    { key: 'bookworm', name: 'Bookworm', description: '20 reading tasks done', icon: '📚', xpReward: 150, condition: { type: 'category_tasks', category: 'READING', threshold: 20 } },
    { key: 'code_ninja', name: 'Code Ninja', description: '30 coding tasks done', icon: '💻', xpReward: 200, condition: { type: 'category_tasks', category: 'CODING', threshold: 30 } },
    { key: 'team_kash', name: 'Team KA-SH', description: '50 shared tasks completed', icon: '🤝', xpReward: 300, condition: { type: 'shared_tasks', threshold: 50 } },
    { key: 'legend', name: 'Legend', description: 'Reached Level 10', icon: '👑', xpReward: 1000, condition: { type: 'level', threshold: 10 } },
  ]

  for (const a of achievementData) {
    await prisma.achievement.create({
      data: a
    })
  }

  console.log('✅ Clean seed complete!')
  console.log(`   Thiyanesh: thiyanesh@kash.app / kash2025`)
  console.log(`   Kavibala:  kavibala@kash.app  / kash2025`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
