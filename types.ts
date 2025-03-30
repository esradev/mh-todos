type Priority = 'low' | 'medium' | 'high'
type RecurrencePattern =
  | 'none'
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'monthly'
  | 'custom'

type Project = {
  id: number
  name: string
  color: string
  description: string
  isFavorite: boolean
}

type Todo = {
  id: number
  text: string
  description: string
  completed: boolean
  priority: Priority
  labels: string[]
  dueDate: Date | null
  isExpanded: boolean
  projectId: number | null
  estimatedMinutes: number | null
  timeSpentMinutes: number
  isFavorite: boolean
  recurrence: RecurrencePattern
  lastCompleted: Date | null
  subTasks: SubTask[]
  createdAt: Date
}

type SubTask = {
  id: number
  text: string
  completed: boolean
}

type Habit = {
  id: number
  name: string
  description: string
  frequency: number // days per week
  streak: number
  completedDates: string[] // ISO date strings
  color: string
  icon: string // Add icon field
  createdAt: Date
}

// App pages
type Page =
  | 'home'
  | 'projects'
  | 'settings'
  | 'pomodoro'
  | 'analytics'
  | 'habits'

// Sort options
type SortOption =
  | 'priority'
  | 'dueDate'
  | 'alphabetical'
  | 'createdAt'
  | 'estimatedTime'

// Filter options
type FilterOptions = {
  showCompleted: boolean
  priorities: Priority[]
  projects: number[] | null
  dueDateRange: 'all' | 'today' | 'week' | 'month' | 'overdue'
  favorites: boolean
}

export type {
  Todo,
  Project,
  Priority,
  RecurrencePattern,
  SubTask,
  SortOption,
  FilterOptions,
  Habit,
  Page
}
