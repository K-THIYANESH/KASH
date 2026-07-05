// src/store/useAppStore.ts — Zustand global state (no paid state management)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  category: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  xpReward: number
  assignees: { id: string; name: string }[]
  dueDate?: string
  estimatedMinutes?: number
}

interface User {
  id: string
  name: string
  email: string
  xp: number
  level: number
}

interface AppState {
  // Timer
  timerSeconds: number
  timerActive: boolean
  timerMode: string
  timerWorkSeconds: number
  setTimerSeconds: (s: number) => void
  setTimerActive: (a: boolean) => void
  setTimerMode: (mode: string, workSecs: number) => void

  // UI
  taskFilter: string
  setTaskFilter: (f: string) => void

  // Optimistic task state
  optimisticCompletions: Set<string>
  addOptimisticCompletion: (taskId: string) => void
  removeOptimisticCompletion: (taskId: string) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      timerSeconds: 25 * 60,
      timerActive: false,
      timerMode: '25/5',
      timerWorkSeconds: 25 * 60,
      setTimerSeconds: (s) => set({ timerSeconds: s }),
      setTimerActive: (a) => set({ timerActive: a }),
      setTimerMode: (mode, workSecs) =>
        set({ timerMode: mode, timerSeconds: workSecs, timerWorkSeconds: workSecs, timerActive: false }),

      taskFilter: 'All',
      setTaskFilter: (f) => set({ taskFilter: f }),

      optimisticCompletions: new Set(),
      addOptimisticCompletion: (taskId) =>
        set((s) => ({ optimisticCompletions: new Set([...s.optimisticCompletions, taskId]) })),
      removeOptimisticCompletion: (taskId) =>
        set((s) => {
          const n = new Set(s.optimisticCompletions)
          n.delete(taskId)
          return { optimisticCompletions: n }
        }),
    }),
    { name: 'kash-store', partialize: (s) => ({ timerMode: s.timerMode, taskFilter: s.taskFilter }) }
  )
)
