// prisma/seed.js — Seeds the two KA-SH users + achievements + default data
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding KA-SH database...')

  // Create users
  const hashedPw = await bcrypt.hash('kash2025', 12)

  const thiyanesh = await prisma.user.upsert({
    where: { email: 'thiyanesh@kash.app' },
    update: {},
    create: {
      name: 'Thiyanesh K',
      email: 'thiyanesh@kash.app',
      password: hashedPw,
      xp: 1240,
      level: 4,
      settings: {
        create: { dailyGoal: 6 }
      },
      streaks: {
        create: { currentStreak: 18, longestStreak: 22, totalDays: 18 }
      }
    }
  })

  const kavibala = await prisma.user.upsert({
    where: { email: 'kavibala@kash.app' },
    update: {},
    create: {
      name: 'Kavibala J',
      email: 'kavibala@kash.app',
      password: hashedPw,
      xp: 1580,
      level: 5,
      settings: {
        create: { dailyGoal: 8 }
      },
      streaks: {
        create: { currentStreak: 18, longestStreak: 22, totalDays: 18 }
      }
    }
  })

  // Seed achievements
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
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: {},
      create: a
    })
  }

  // Seed some sample tasks
  const tasks = [
    { title: 'Complete DSA problems (LeetCode)', description: 'Solve 3 medium problems', priority: 'HIGH', category: 'CODING', xpReward: 20 },
    { title: 'Read Chapter 5 — DBMS', description: 'Focus on normalization', priority: 'MEDIUM', category: 'STUDY', xpReward: 10 },
    { title: 'Morning workout', description: '30 min cardio + stretch', priority: 'LOW', category: 'FITNESS', xpReward: 10 },
    { title: 'Read "Atomic Habits" Ch 8', description: 'Notes + summary', priority: 'LOW', category: 'READING', xpReward: 10 },
    { title: 'Review ML notes', description: 'CNN architectures', priority: 'MEDIUM', category: 'STUDY', xpReward: 10 },
  ]

  for (const task of tasks) {
    const created = await prisma.task.create({
      data: { ...task, creatorId: thiyanesh.id }
    })
    // Assign to both
    await prisma.taskAssignee.createMany({
      data: [
        { taskId: created.id, userId: thiyanesh.id },
        { taskId: created.id, userId: kavibala.id },
      ],
      skipDuplicates: true
    })
  }

  // Seed memories
  await prisma.memory.createMany({
    data: [
      { content: 'Thiyanesh & Kavibala hit their first 7-day streak! 🎉 Both completed every task.', type: 'MILESTONE', authorId: thiyanesh.id },
      { content: 'Finished our first joint coding sprint — built the RAKTA AI prototype together.', type: 'NOTE', authorId: kavibala.id },
      { content: 'Consistency checkpoint: 50 tasks completed combined! Half-century unlocked.', type: 'ACHIEVEMENT', authorId: thiyanesh.id },
    ]
  })

  // Seed appreciations
  await prisma.appreciation.createMany({
    data: [
      { message: "Kavi, you've been absolutely consistent this week. Your dedication is inspiring! 💜", senderId: thiyanesh.id, receiverId: kavibala.id },
      { message: "Thiya, the way you stayed focused during our streak is incredible. You push me to be better! 🔥", senderId: kavibala.id, receiverId: thiyanesh.id },
    ]
  })

  console.log('✅ Seed complete!')
  console.log(`   Thiyanesh: thiyanesh@kash.app / kash2025`)
  console.log(`   Kavibala:  kavibala@kash.app  / kash2025`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
