import { useState, useMemo, useEffect, useRef } from 'react'
import { View, Text } from 'react-native'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Repeat,
  Clock,
  AlignLeft,
  CheckCheck,
  Tag,
  Edit,
  Trash2,
  StarOff,
  Zap
} from 'lucide-react-native'

import {
  Todo,
  Project,
  Priority,
  SortOption,
  Page,
  Habit,
  SubTask,
  RecurrencePattern,
  FilterOptions
} from '@/types'

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: 'Learn React',
      description:
        'Complete the React tutorial and documentation. Focus on hooks, context API, and performance optimization techniques.',
      completed: true,
      priority: 'medium',
      labels: ['learning', 'coding', 'frontend'],
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      isExpanded: false,
      projectId: 3, // Learning project
      estimatedMinutes: 120,
      timeSpentMinutes: 90,
      isFavorite: true,
      recurrence: 'weekly',
      lastCompleted: new Date(Date.now() - 86400000 * 7), // 7 days ago
      subTasks: [
        { id: 101, text: 'Study Hooks', completed: true },
        { id: 102, text: 'Practice with Context API', completed: true },
        { id: 103, text: 'Learn about memoization', completed: false }
      ],
      createdAt: new Date(Date.now() - 86400000 * 14) // 14 days ago
    },
    {
      id: 2,
      text: 'Build a todo app',
      description:
        'Create a mobile-friendly todo app with React and Tailwind. Implement features like task categories, priorities, and due dates.',
      completed: false,
      priority: 'high',
      labels: ['project', 'coding', 'ui/ux'],
      dueDate: new Date(Date.now() + 172800000), // day after tomorrow
      isExpanded: false,
      projectId: 2, // Work project
      estimatedMinutes: 180,
      timeSpentMinutes: 45,
      isFavorite: false,
      recurrence: 'none',
      lastCompleted: null,
      subTasks: [
        { id: 201, text: 'Design UI', completed: true },
        { id: 202, text: 'Implement core functionality', completed: false },
        { id: 203, text: 'Add advanced features', completed: false }
      ],
      createdAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
    },
    {
      id: 3,
      text: 'Deploy to production',
      description:
        'Deploy the finished app to Vercel. Set up CI/CD pipeline and ensure everything works in production environment.',
      completed: false,
      priority: 'low',
      labels: ['devops', 'deployment'],
      dueDate: null,
      isExpanded: false,
      projectId: 2, // Work project
      estimatedMinutes: 60,
      timeSpentMinutes: 0,
      isFavorite: false,
      recurrence: 'none',
      lastCompleted: null,
      subTasks: [],
      createdAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
    },
    {
      id: 4,
      text: 'Grocery shopping',
      description: 'Buy fruits, vegetables, and other essentials for the week.',
      completed: false,
      priority: 'medium',
      labels: ['errands', 'shopping'],
      dueDate: new Date(Date.now() + 86400000), // tomorrow
      isExpanded: false,
      projectId: 1, // Personal project
      estimatedMinutes: 45,
      timeSpentMinutes: 0,
      isFavorite: false,
      recurrence: 'weekly',
      lastCompleted: new Date(Date.now() - 86400000 * 6), // 6 days ago
      subTasks: [
        { id: 401, text: 'Fruits and vegetables', completed: false },
        { id: 402, text: 'Dairy products', completed: false },
        { id: 403, text: 'Bread and cereals', completed: false }
      ],
      createdAt: new Date(Date.now() - 86400000 * 30) // 30 days ago
    },
    {
      id: 5,
      text: 'Daily meditation',
      description:
        'Practice mindfulness meditation for mental clarity and stress reduction.',
      completed: false,
      priority: 'medium',
      labels: ['health', 'wellbeing'],
      dueDate: new Date(Date.now()), // today
      isExpanded: false,
      projectId: 1, // Personal project
      estimatedMinutes: 15,
      timeSpentMinutes: 0,
      isFavorite: true,
      recurrence: 'daily',
      lastCompleted: new Date(Date.now() - 86400000), // yesterday
      subTasks: [],
      createdAt: new Date(Date.now() - 86400000 * 60) // 60 days ago
    }
  ])

  // Navigation state
  const [currentPage, setCurrentPage] = useState<Page>('home')

  // Projects state
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'Personal',
      color: '#4f46e5', // indigo
      description: 'Personal tasks and errands',
      isFavorite: true
    },
    {
      id: 2,
      name: 'Work',
      color: '#0891b2', // cyan
      description: 'Work-related tasks and deadlines',
      isFavorite: true
    },
    {
      id: 3,
      name: 'Learning',
      color: '#16a34a', // green
      description: 'Educational goals and courses',
      isFavorite: false
    }
  ])

  // Project filter
  const [activeProjectFilter, setActiveProjectFilter] = useState<number | null>(
    null
  )

  // Project form state
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectColor, setNewProjectColor] = useState('#4f46e5')
  const [newProjectDescription, setNewProjectDescription] = useState('')

  // Settings state
  const [darkMode, setDarkMode] = useState(false)
  const [compactMode, setCompactMode] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(true)
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [showCompletedTasks, setShowCompletedTasks] = useState(false)

  // Habits state
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      name: 'Morning Exercise',
      description: '30 minutes of cardio or strength training',
      frequency: 5, // 5 days per week
      streak: 3,
      completedDates: [
        new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] // 3 days ago
      ],
      color: '#ef4444', // red
      icon: 'Dumbbell',
      createdAt: new Date(Date.now() - 86400000 * 10) // 10 days ago
    },
    {
      id: 2,
      name: 'Read 30 minutes',
      description: 'Read books or articles to expand knowledge',
      frequency: 7, // every day
      streak: 7,
      completedDates: [
        new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], // 2 days ago
        new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], // 3 days ago
        new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0], // 4 days ago
        new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0], // 5 days ago
        new Date(Date.now() - 86400000 * 6).toISOString().split('T')[0], // 6 days ago
        new Date(Date.now() - 86400000 * 7).toISOString().split('T')[0] // 7 days ago
      ],
      color: '#3b82f6', // blue
      icon: 'BookOpen',
      createdAt: new Date(Date.now() - 86400000 * 14) // 14 days ago
    },
    {
      id: 3,
      name: 'Drink 8 glasses of water',
      description: 'Stay hydrated throughout the day',
      frequency: 7, // every day
      streak: 2,
      completedDates: [
        new Date(Date.now() - 86400000).toISOString().split('T')[0], // yesterday
        new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] // 2 days ago
      ],
      color: '#0ea5e9', // sky blue
      icon: 'Droplets',
      createdAt: new Date(Date.now() - 86400000 * 5) // 5 days ago
    }
  ])

  // New habit state
  const [isHabitFormOpen, setIsHabitFormOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [newHabitName, setNewHabitName] = useState('')
  const [newHabitDescription, setNewHabitDescription] = useState('')
  const [newHabitFrequency, setNewHabitFrequency] = useState(7)
  const [newHabitColor, setNewHabitColor] = useState('#3b82f6')
  // Add new state for habit icon
  const [newHabitIcon, setNewHabitIcon] = useState('Zap')

  // Add state for date selection
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  // Todo form state
  const [newTodo, setNewTodo] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newPriority, setNewPriority] = useState<Priority>('medium')
  const [newLabels, setNewLabels] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newProjectId, setNewProjectId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [newEstimatedMinutes, setNewEstimatedMinutes] = useState<string>('')
  const [newRecurrence, setNewRecurrence] = useState<RecurrencePattern>('none')
  const [newSubTasks, setNewSubTasks] = useState<SubTask[]>([])
  const [newSubTaskText, setNewSubTaskText] = useState('')

  // Sort and filter state
  const [sortOption, setSortOption] = useState<SortOption>('dueDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    showCompleted: false,
    priorities: ['low', 'medium', 'high'],
    projects: null,
    dueDateRange: 'all',
    favorites: false
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Delete confirmation state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
  const [habitToDelete, setHabitToDelete] = useState<number | null>(null)

  // Notification state
  const [notifications, setNotifications] = useState<
    {
      id: number
      message: string
      type: 'info' | 'success' | 'warning'
      read: boolean
    }[]
  >([
    {
      id: 1,
      message: 'You have 3 tasks due today',
      type: 'warning',
      read: false
    },
    {
      id: 2,
      message: "Task 'Learn React' completed",
      type: 'success',
      read: false
    },
    {
      id: 3,
      message: 'New feature: Habit tracking is now available!',
      type: 'info',
      read: false
    }
  ])
  const [showNotificationsPopover, setShowNotificationsPopover] =
    useState(false)

  // Refs to maintain focus
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLTextAreaElement>(null)
  const labelsInputRef = useRef<HTMLInputElement>(null)
  const dueDateInputRef = useRef<HTMLInputElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Apply dark mode
  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add('dark')
  //   } else {
  //     document.documentElement.classList.remove('dark')
  //   }
  // }, [darkMode])

  // Check for recurring tasks and due dates
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]

    // Check for recurring tasks that need to be reset
    todos.forEach(todo => {
      if (todo.recurrence !== 'none' && todo.completed && todo.lastCompleted) {
        const lastCompletedDate = new Date(todo.lastCompleted)
          .toISOString()
          .split('T')[0]
        let shouldReset = false

        switch (todo.recurrence) {
          case 'daily':
            shouldReset = lastCompletedDate !== today
            break
          case 'weekdays':
            const currentDay = new Date().getDay()
            shouldReset =
              lastCompletedDate !== today && currentDay >= 1 && currentDay <= 5
            break
          case 'weekly':
            const lastCompletedDay = new Date(todo.lastCompleted)
            const daysSinceCompletion = Math.floor(
              (Date.now() - lastCompletedDay.getTime()) / (1000 * 60 * 60 * 24)
            )
            shouldReset = daysSinceCompletion >= 7
            break
          case 'monthly':
            const lastCompletedMonth = new Date(todo.lastCompleted).getMonth()
            const currentMonth = new Date().getMonth()
            shouldReset = lastCompletedMonth !== currentMonth
            break
        }

        if (shouldReset) {
          setTodos(prevTodos =>
            prevTodos.map(t =>
              t.id === todo.id
                ? {
                    ...t,
                    completed: false,
                    subTasks: t.subTasks.map(st => ({
                      ...st,
                      completed: false
                    }))
                  }
                : t
            )
          )

          if (enableNotifications) {
            addNotification(
              `Recurring task "${todo.text}" is ready for today`,
              'info'
            )
          }
        }
      }
    })

    // Check for due tasks
    const dueTasks = todos.filter(
      todo =>
        !todo.completed &&
        todo.dueDate &&
        new Date(todo.dueDate).toISOString().split('T')[0] === today
    )

    if (dueTasks.length > 0 && enableNotifications) {
      const taskCount = dueTasks.length
      addNotification(
        `You have ${taskCount} task${taskCount > 1 ? 's' : ''} due today`,
        'warning'
      )
    }
  }, []) // Run once on component mount

  // Add notification function
  const addNotification = (
    message: string,
    type: 'info' | 'success' | 'warning'
  ) => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }

  // Mark notification as read
  const markNotificationAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Todo functions
  const addTodo = () => {
    if (newTodo.trim() === '') return

    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      description: newDescription,
      completed: false,
      priority: newPriority,
      labels: newLabels
        .split(',')
        .map(label => label.trim())
        .filter(label => label !== ''),
      dueDate: newDueDate ? new Date(newDueDate) : null,
      isExpanded: false,
      projectId: newProjectId ? Number.parseInt(newProjectId) : null,
      estimatedMinutes: newEstimatedMinutes
        ? Number.parseInt(newEstimatedMinutes)
        : null,
      timeSpentMinutes: 0,
      isFavorite: false,
      recurrence: newRecurrence,
      lastCompleted: null,
      subTasks: newSubTasks,
      createdAt: new Date()
    }

    setTodos([...todos, todo])
    addNotification(`Task "${newTodo}" added`, 'success')
    resetForm()
  }

  const resetForm = () => {
    setNewTodo('')
    setNewDescription('')
    setNewPriority('medium')
    setNewLabels('')
    setNewDueDate('')
    setNewProjectId(null)
    setNewEstimatedMinutes('')
    setNewRecurrence('none')
    setNewSubTasks([])
    setNewSubTaskText('')
    setIsSheetOpen(false)
    setEditingTodo(null)
  }

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          const newCompletedState = !todo.completed

          // If completing a recurring task, update lastCompleted
          if (newCompletedState && todo.recurrence !== 'none') {
            addNotification(`Task "${todo.text}" completed`, 'success')
            return {
              ...todo,
              completed: newCompletedState,
              lastCompleted: new Date()
            }
          }

          return { ...todo, completed: newCompletedState }
        }
        return todo
      })
    )
  }

  const toggleSubTask = (todoId: number, subTaskId: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === todoId
          ? {
              ...todo,
              subTasks: todo.subTasks.map(subTask =>
                subTask.id === subTaskId
                  ? { ...subTask, completed: !subTask.completed }
                  : subTask
              )
            }
          : todo
      )
    )
  }

  const addSubTask = () => {
    if (newSubTaskText.trim() === '') return

    const newSubTask: SubTask = {
      id: Date.now(),
      text: newSubTaskText,
      completed: false
    }

    setNewSubTasks([...newSubTasks, newSubTask])
    setNewSubTaskText('')
  }

  const removeSubTask = (id: number) => {
    setNewSubTasks(newSubTasks.filter(subTask => subTask.id !== id))
  }

  const confirmDeleteTodo = (id: number) => {
    if (confirmDelete) {
      setTodoToDelete(id)
      setDeleteDialogOpen(true)
    } else {
      deleteTodo(id)
    }
  }

  const deleteTodo = (id?: number) => {
    const idToDelete = id !== undefined ? id : todoToDelete
    if (idToDelete === null) return

    const todoToRemove = todos.find(todo => todo.id === idToDelete)
    if (todoToRemove) {
      addNotification(`Task "${todoToRemove.text}" deleted`, 'info')
    }

    setTodos(todos.filter(todo => todo.id !== idToDelete))
    setDeleteDialogOpen(false)
    setTodoToDelete(null)
  }

  const toggleExpand = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, isExpanded: !todo.isExpanded } : todo
      )
    )
  }

  const toggleFavoriteTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, isFavorite: !todo.isFavorite } : todo
      )
    )
  }

  const startEdit = (todo: Todo) => {
    setEditingTodo(todo)
    setNewTodo(todo.text)
    setNewDescription(todo.description)
    setNewPriority(todo.priority)
    setNewLabels(todo.labels.join(', '))
    setNewDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '')
    setNewProjectId(todo.projectId !== null ? todo.projectId.toString() : null)
    setNewEstimatedMinutes(
      todo.estimatedMinutes !== null ? todo.estimatedMinutes.toString() : ''
    )
    setNewRecurrence(todo.recurrence)
    setNewSubTasks([...todo.subTasks])
    setIsSheetOpen(true)
  }

  const saveEdit = () => {
    if (!editingTodo) return

    setTodos(
      todos.map(todo =>
        todo.id === editingTodo.id
          ? {
              ...todo,
              text: newTodo,
              description: newDescription,
              priority: newPriority,
              labels: newLabels
                .split(',')
                .map(label => label.trim())
                .filter(label => label !== ''),
              dueDate: newDueDate ? new Date(newDueDate) : null,
              projectId: newProjectId ? Number.parseInt(newProjectId) : null,
              estimatedMinutes: newEstimatedMinutes
                ? Number.parseInt(newEstimatedMinutes)
                : null,
              recurrence: newRecurrence,
              subTasks: newSubTasks
            }
          : todo
      )
    )

    addNotification(`Task "${newTodo}" updated`, 'success')
    resetForm()
  }

  // Project functions
  const addProject = () => {
    if (newProjectName.trim() === '') return

    const project: Project = {
      id: Date.now(),
      name: newProjectName,
      color: newProjectColor,
      description: newProjectDescription,
      isFavorite: false
    }

    setProjects([...projects, project])
    addNotification(`Project "${newProjectName}" created`, 'success')
    resetProjectForm()
  }

  const resetProjectForm = () => {
    setNewProjectName('')
    setNewProjectColor('#4f46e5')
    setNewProjectDescription('')
    setIsProjectFormOpen(false)
    setEditingProject(null)
  }

  const startEditProject = (project: Project) => {
    setEditingProject(project)
    setNewProjectName(project.name)
    setNewProjectColor(project.color)
    setNewProjectDescription(project.description)
    setIsProjectFormOpen(true)
  }

  const saveEditProject = () => {
    if (!editingProject) return

    setProjects(
      projects.map(project =>
        project.id === editingProject.id
          ? {
              ...project,
              name: newProjectName,
              color: newProjectColor,
              description: newProjectDescription
            }
          : project
      )
    )

    addNotification(`Project "${newProjectName}" updated`, 'success')
    resetProjectForm()
  }

  const toggleFavoriteProject = (id: number) => {
    setProjects(
      projects.map(project =>
        project.id === id
          ? { ...project, isFavorite: !project.isFavorite }
          : project
      )
    )
  }

  const confirmDeleteProject = (id: number) => {
    if (confirmDelete) {
      setProjectToDelete(id)
      setDeleteDialogOpen(true)
    } else {
      deleteProject(id)
    }
  }

  const deleteProject = (id?: number) => {
    const idToDelete = id !== undefined ? id : projectToDelete
    if (idToDelete === null) return

    const projectToRemove = projects.find(project => project.id === idToDelete)
    if (projectToRemove) {
      addNotification(`Project "${projectToRemove.name}" deleted`, 'info')
    }

    // Remove project
    setProjects(projects.filter(project => project.id !== idToDelete))

    // Update todos that were in this project
    setTodos(
      todos.map(todo =>
        todo.projectId === idToDelete ? { ...todo, projectId: null } : todo
      )
    )

    // Reset filter if we're deleting the filtered project
    if (activeProjectFilter === idToDelete) {
      setActiveProjectFilter(null)
    }

    setDeleteDialogOpen(false)
    setProjectToDelete(null)
  }

  // Habit functions
  const addHabit = () => {
    if (newHabitName.trim() === '') return

    const habit: Habit = {
      id: Date.now(),
      name: newHabitName,
      description: newHabitDescription,
      frequency: newHabitFrequency,
      streak: 0,
      completedDates: [],
      color: newHabitColor,
      icon: newHabitIcon,
      createdAt: new Date()
    }

    setHabits([...habits, habit])
    addNotification(`Habit "${newHabitName}" created`, 'success')
    resetHabitForm()
  }

  const resetHabitForm = () => {
    setNewHabitName('')
    setNewHabitDescription('')
    setNewHabitFrequency(7)
    setNewHabitColor('#3b82f6')
    setNewHabitIcon('Zap')
    setIsHabitFormOpen(false)
    setEditingHabit(null)
  }

  const startEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
    setNewHabitName(habit.name)
    setNewHabitDescription(habit.description)
    setNewHabitFrequency(habit.frequency)
    setNewHabitColor(habit.color)
    setNewHabitIcon(habit.icon)
    setIsHabitFormOpen(true)
  }

  const saveEditHabit = () => {
    if (!editingHabit) return

    setHabits(
      habits.map(habit =>
        habit.id === editingHabit.id
          ? {
              ...habit,
              name: newHabitName,
              description: newHabitDescription,
              frequency: newHabitFrequency,
              color: newHabitColor,
              icon: newHabitIcon
            }
          : habit
      )
    )

    addNotification(`Habit "${newHabitName}" updated`, 'success')
    resetHabitForm()
  }

  const confirmDeleteHabit = (id: number) => {
    if (confirmDelete) {
      setHabitToDelete(id)
      setDeleteDialogOpen(true)
    } else {
      deleteHabit(id)
    }
  }

  const deleteHabit = (id?: number) => {
    const idToDelete = id !== undefined ? id : habitToDelete
    if (idToDelete === null) return

    const habitToRemove = habits.find(habit => habit.id === idToDelete)
    if (habitToRemove) {
      addNotification(`Habit "${habitToRemove.name}" deleted`, 'info')
    }

    setHabits(habits.filter(habit => habit.id !== idToDelete))
    setDeleteDialogOpen(false)
    setHabitToDelete(null)
  }

  const toggleHabitCompletion = (id: number) => {
    const today = new Date().toISOString().split('T')[0]

    setHabits(
      habits.map(habit => {
        if (habit.id === id) {
          const isAlreadyCompleted = habit.completedDates.includes(today)
          let newCompletedDates = [...habit.completedDates]
          let newStreak = habit.streak

          if (isAlreadyCompleted) {
            // Remove today from completed dates
            newCompletedDates = newCompletedDates.filter(date => date !== today)
            newStreak = Math.max(0, newStreak - 1)
          } else {
            // Add today to completed dates
            newCompletedDates.push(today)

            // Check if yesterday was completed to maintain streak
            const yesterday = new Date(Date.now() - 86400000)
              .toISOString()
              .split('T')[0]
            const isYesterdayCompleted =
              habit.completedDates.includes(yesterday)

            if (isYesterdayCompleted || habit.streak === 0) {
              newStreak = habit.streak + 1
            }
          }

          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak
          }
        }
        return habit
      })
    )
  }

  // Add function to toggle habit completion for a specific date
  const toggleHabitCompletionForDate = (id: number, date: string) => {
    setHabits(
      habits.map(habit => {
        if (habit.id === id) {
          const isAlreadyCompleted = habit.completedDates.includes(date)
          let newCompletedDates = [...habit.completedDates]
          let newStreak = habit.streak

          if (isAlreadyCompleted) {
            // Remove date from completed dates
            newCompletedDates = newCompletedDates.filter(d => d !== date)

            // Recalculate streak if needed
            if (date === new Date().toISOString().split('T')[0]) {
              // If we're removing today's completion, we need to recalculate the streak
              const yesterday = new Date(Date.now() - 86400000)
                .toISOString()
                .split('T')[0]
              if (newCompletedDates.includes(yesterday)) {
                // Count consecutive days before today
                let consecutiveDays = 0
                let checkDate = yesterday

                while (newCompletedDates.includes(checkDate)) {
                  consecutiveDays++
                  const prevDate = new Date(
                    new Date(checkDate).getTime() - 86400000
                  )
                  checkDate = prevDate.toISOString().split('T')[0]
                }

                newStreak = consecutiveDays
              } else {
                newStreak = 0
              }
            }
          } else {
            // Add date to completed dates
            newCompletedDates.push(date)

            // Update streak if it's today's date
            if (date === new Date().toISOString().split('T')[0]) {
              const yesterday = new Date(Date.now() - 86400000)
                .toISOString()
                .split('T')[0]
              if (newCompletedDates.includes(yesterday) || habit.streak === 0) {
                newStreak = habit.streak + 1
              }
            }
          }

          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak
          }
        }
        return habit
      })
    )
  }

  // Add a function to get the icon component
  const getHabitIcon = (iconName: string) => {
    const icons: Record<string, React.ElementType> = {
      Zap,
      Clock,
      Calendar,
      CheckCircle
    }

    const IconComponent = icons[iconName] || Zap
    return <IconComponent className='h-5 w-5' />
  }

  // Helper functions
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/20 text-destructive hover:bg-destructive/30'
      case 'medium':
        return 'bg-warning/20 text-warning hover:bg-warning/30'
      case 'low':
        return 'bg-success/20 text-success hover:bg-success/30'
      default:
        return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    }
  }

  const getPriorityTextColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-500'
      case 'medium':
        return 'text-yellow-500'
      case 'low':
        return 'text-green-500'
      default:
        return 'text-muted-foreground'
    }
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
  }

  // Get the todo being deleted
  const todoBeingDeleted =
    todoToDelete !== null ? todos.find(todo => todo.id === todoToDelete) : null

  // Get the project being
  const projectBeingDeleted =
    projectToDelete !== null
      ? projects.find(project => project.id === projectToDelete)
      : null

  // Get the habit being deleted
  const habitBeingDeleted =
    habitToDelete !== null
      ? habits.find(habit => habit.id === habitToDelete)
      : null

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    // First apply search filter if search is active
    let filtered = todos

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        todo =>
          todo.text.toLowerCase().includes(query) ||
          todo.description.toLowerCase().includes(query) ||
          todo.labels.some(label => label.toLowerCase().includes(query))
      )
    }

    // Then apply project filter if active
    if (activeProjectFilter !== null) {
      filtered = filtered.filter(todo => todo.projectId === activeProjectFilter)
    }

    // Apply additional filters
    filtered = filtered.filter(todo => {
      // Filter by completion status
      if (!filterOptions.showCompleted && todo.completed) {
        return false
      }

      // Filter by priority
      if (!filterOptions.priorities.includes(todo.priority)) {
        return false
      }

      // Filter by project
      if (
        filterOptions.projects !== null &&
        todo.projectId !== null &&
        !filterOptions.projects.includes(todo.projectId)
      ) {
        return false
      }

      // Filter by due date range
      if (filterOptions.dueDateRange !== 'all' && todo.dueDate) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const dueDate = new Date(todo.dueDate)
        dueDate.setHours(0, 0, 0, 0)

        switch (filterOptions.dueDateRange) {
          case 'today':
            if (dueDate.getTime() !== today.getTime()) return false
            break
          case 'week':
            const nextWeek = new Date(today)
            nextWeek.setDate(today.getDate() + 7)
            if (dueDate < today || dueDate > nextWeek) return false
            break
          case 'month':
            const nextMonth = new Date(today)
            nextMonth.setMonth(today.getMonth() + 1)
            if (dueDate < today || dueDate > nextMonth) return false
            break
          case 'overdue':
            if (dueDate >= today) return false
            break
        }
      }

      // Filter by favorites
      if (filterOptions.favorites && !todo.isFavorite) {
        return false
      }

      return true
    })

    // Sort the filtered todos
    return filtered.sort((a, b) => {
      let comparison = 0

      switch (sortOption) {
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
          break
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) comparison = 0
          else if (!a.dueDate) comparison = 1
          else if (!b.dueDate) comparison = -1
          else
            comparison =
              new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          break
        case 'alphabetical':
          comparison = a.text.localeCompare(b.text)
          break
        case 'createdAt':
          comparison = a.createdAt.getTime() - b.createdAt.getTime()
          break
        case 'estimatedTime':
          const aTime = a.estimatedMinutes || 0
          const bTime = b.estimatedMinutes || 0
          comparison = aTime - bTime
          break
      }

      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [
    todos,
    activeProjectFilter,
    sortOption,
    sortDirection,
    filterOptions,
    searchQuery
  ])

  // Get project by ID
  const getProject = (id: number | null) => {
    if (id === null) return null
    return projects.find(project => project.id === id) || null
  }

  // Get project color
  const getProjectColor = (id: number | null) => {
    const project = getProject(id)
    return project ? project.color : '#94a3b8' // Default slate color
  }

  // Pomodoro state
  const [pomodoroMode, setPomodoroMode] = useState<
    'work' | 'shortBreak' | 'longBreak'
  >('work')
  const [pomodoroMinutes, setPomodoroMinutes] = useState(25)
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null)
  const [showPomodoroNotification, setShowPomodoroNotification] =
    useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

  // Pomodoro settings
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)
  const [pomodoroSound, setPomodoroSound] = useState(true)

  // Add formatTime helper function
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Add startPomodoro function
  const startPomodoro = (todoId?: number) => {
    setIsRunning(true)
    if (todoId) {
      setActiveTodoId(todoId)
    }
  }

  // Add pausePomodoro function
  const pausePomodoro = () => {
    setIsRunning(false)
  }

  // Add resetPomodoro function
  const resetPomodoro = () => {
    setIsRunning(false)
    if (pomodoroMode === 'work') {
      setPomodoroMinutes(workDuration)
    } else if (pomodoroMode === 'shortBreak') {
      setPomodoroMinutes(shortBreakDuration)
    } else {
      setPomodoroMinutes(longBreakDuration)
    }
    setPomodoroSeconds(0)
  }

  // Add skipPomodoro function
  const skipPomodoro = () => {
    if (pomodoroMode === 'work') {
      // Completed a work session
      if ((completedSessions + 1) % sessionsBeforeLongBreak === 0) {
        // Time for a long break
        setPomodoroMode('longBreak')
        setPomodoroMinutes(longBreakDuration)
      } else {
        // Time for a short break
        setPomodoroMode('shortBreak')
        setPomodoroMinutes(shortBreakDuration)
      }

      // Update completed sessions and track time for the active todo
      setCompletedSessions(completedSessions + 1)
      if (activeTodoId) {
        setTodos(
          todos.map(todo =>
            todo.id === activeTodoId
              ? {
                  ...todo,
                  timeSpentMinutes: todo.timeSpentMinutes + workDuration
                }
              : todo
          )
        )
      }

      setNotificationMessage('Work session completed! Take a break.')
    } else {
      // Break is over, back to work
      setPomodoroMode('work')
      setPomodoroMinutes(workDuration)
      setActiveTodoId(null)
      setNotificationMessage('Break is over! Time to work.')
    }

    setPomodoroSeconds(0)
    setIsRunning(false)
    setShowPomodoroNotification(true)

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setShowPomodoroNotification(false)
    }, 3000)
  }

  // Add useEffect for the timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        if (pomodoroSeconds === 0) {
          if (pomodoroMinutes === 0) {
            // Timer is complete
            clearInterval(interval as NodeJS.Timeout)
            skipPomodoro()
            if (pomodoroSound) {
              // Play sound (would implement with actual audio in a real app)
              try {
                const audio = new Audio('/notification.mp3')
                audio.play()
              } catch (error) {
                console.error('Could not play notification sound')
              }
            }
          } else {
            // Decrement minutes, reset seconds
            setPomodoroMinutes(pomodoroMinutes - 1)
            setPomodoroSeconds(59)
          }
        } else {
          // Decrement seconds
          setPomodoroSeconds(pomodoroSeconds - 1)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [
    isRunning,
    pomodoroMinutes,
    pomodoroSeconds,
    pomodoroMode,
    completedSessions,
    activeTodoId,
    todos,
    workDuration,
    shortBreakDuration,
    longBreakDuration,
    sessionsBeforeLongBreak,
    pomodoroSound
  ])

  // Initialize timer values when mode changes
  useEffect(() => {
    if (pomodoroMode === 'work') {
      setPomodoroMinutes(workDuration)
    } else if (pomodoroMode === 'shortBreak') {
      setPomodoroMinutes(shortBreakDuration)
    } else {
      setPomodoroMinutes(longBreakDuration)
    }
    setPomodoroSeconds(0)
  }, [pomodoroMode, workDuration, shortBreakDuration, longBreakDuration])

  // Analytics data
  const analyticsData = useMemo(() => {
    // Task completion rate
    const totalTasks = todos.length
    const completedTasks = todos.filter(todo => todo.completed).length
    const completionRate =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Time tracking
    const totalEstimatedTime = todos.reduce(
      (sum, todo) => sum + (todo.estimatedMinutes || 0),
      0
    )
    const totalTimeSpent = todos.reduce(
      (sum, todo) => sum + todo.timeSpentMinutes,
      0
    )
    const timeEfficiency =
      totalEstimatedTime > 0 ? (totalTimeSpent / totalEstimatedTime) * 100 : 0

    // Project distribution
    const projectDistribution = projects.map(project => {
      const projectTodos = todos.filter(todo => todo.projectId === project.id)
      return {
        id: project.id,
        name: project.name,
        color: project.color,
        count: projectTodos.length,
        completed: projectTodos.filter(todo => todo.completed).length,
        timeSpent: projectTodos.reduce(
          (sum, todo) => sum + todo.timeSpentMinutes,
          0
        )
      }
    })

    // Priority distribution
    const priorityDistribution = {
      high: todos.filter(todo => todo.priority === 'high').length,
      medium: todos.filter(todo => todo.priority === 'medium').length,
      low: todos.filter(todo => todo.priority === 'low').length
    }

    // Habits completion
    const habitsCompletionRate = habits.map(habit => {
      const today = new Date().toISOString().split('T')[0]
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split('T')[0]
      })

      const completedInLast7Days = last7Days.filter(date =>
        habit.completedDates.includes(date)
      ).length
      const completionRate = (completedInLast7Days / habit.frequency) * 100

      return {
        id: habit.id,
        name: habit.name,
        color: habit.color,
        streak: habit.streak,
        completionRate,
        isCompletedToday: habit.completedDates.includes(today)
      }
    })

    return {
      completionRate,
      timeEfficiency,
      projectDistribution,
      priorityDistribution,
      habitsCompletionRate,
      totalTasks,
      completedTasks,
      totalEstimatedTime,
      totalTimeSpent
    }
  }, [todos, projects, habits])

  // Render the current page
  // const renderPage = () => {
  //   switch (currentPage) {
  //     case "home":
  //       return renderHomePage()
  //     case "projects":
  //       return renderProjectsPage()
  //     case "settings":
  //       return renderSettingsPage()
  //     case "pomodoro":
  //       return renderPomodoroPage()
  //     case "analytics":
  //       return renderAnalyticsPage()
  //     case "habits":
  //       return renderHabitsPage()
  //     default:
  //       return renderHomePage()
  //   }
  // }

  return (
    <Card className='m-4 p-0' variant='outline' size='lg'>
      <View className='p-0'>
        {/* not todos result */}
        {filteredAndSortedTodos.length === 0 ? (
          <View className='p-6 text-center text-muted-foreground'>
            {searchQuery
              ? 'No tasks match your search'
              : activeProjectFilter
                ? 'No tasks in this project. Add one above!'
                : 'No tasks yet. Add one above!'}
          </View>
        ) : (
          <View className='Viewide-y Viewide-border'>
            {filteredAndSortedTodos.map(todo => (
              <View key={todo.id} className={`transition-all duration-200`}>
                <View
                  className={`flex p-4 rounded-lg ${todo.isExpanded ? 'bg-gray-100' : ''}`}>
                  <View className='flex-row items-center justify-between'>
                    <View className='flex-row items-center'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='flex-shrink-0'
                        onPress={() => toggleTodo(todo.id)}>
                        {todo.completed ? (
                          <CheckCircle className='h-5 w-5' color='#4CAF50' />
                        ) : (
                          <Circle className='h-5 w-5' color='#FF5722' />
                        )}
                      </Button>
                      <View className='flex-1'>
                        <View className='flex-row items-center'>
                          <Text
                            className={`ml-2 font-medium text-lg ${
                              todo.completed ? 'line-through text-gray-400' : ''
                            }`}>
                            {todo.text}
                          </Text>
                          {/* Priority Badge */}
                          <Badge
                            variant='outline'
                            className={`ml-2 rounded-lg ${getPriorityColor(todo.priority)}`}>
                            <Text>{todo.priority}</Text>
                          </Badge>
                          {/* Project indicator (if not filtered) */}
                          {!activeProjectFilter && todo.projectId && (
                            <View
                              className='ml-2 w-2 h-2 rounded-full'
                              style={{
                                backgroundColor: getProjectColor(todo.projectId)
                              }}></View>
                          )}
                        </View>
                      </View>
                      <Button
                        variant='ghost'
                        size='icon'
                        onPress={() => toggleExpand(todo.id)}>
                        {todo.isExpanded ? (
                          <ChevronUp color='black' />
                        ) : (
                          <ChevronDown color='gray' />
                        )}
                      </Button>
                    </View>
                  </View>

                  {/* Todo Deatials */}
                  {todo.isExpanded && (
                    <View className='px-2 pb-4'>
                      <View className='rounded-lg overflow-hidden'>
                        {/* Description Card */}
                        {todo.description && (
                          <Card size='sm' className='my-4' variant='outline'>
                            <Text className='text-sm font-medium text-foreground mb-2 flex items-center'>
                              <AlignLeft
                                color='black'
                                className='h-4 w-4 mr-2'
                              />
                              Description
                            </Text>
                            <Text className='text-sm text-foreground leading-relaxed'>
                              {todo.description}
                            </Text>
                          </Card>
                        )}

                        {/* Subtasks */}
                        {todo.subTasks.length > 0 && (
                          <View className='bg-background rounded-lg p-4 mb-4 shadow-sm border'>
                            <Text className='text-sm font-medium text-foreground mb-2 flex items-center'>
                              <CheckCheck className='h-4 w-4 mr-2 text-muted-foreground' />
                              Subtasks
                            </Text>
                            <View className='space-y-2'>
                              {todo.subTasks.map(subTask => (
                                <View
                                  key={subTask.id}
                                  className='flex items-center'>
                                  <Checkbox
                                    checked={subTask.completed}
                                    onCheckedChange={() =>
                                      toggleSubTask(todo.id, subTask.id)
                                    }
                                    className='mr-2'
                                  />
                                  <Text
                                    className={
                                      subTask.completed
                                        ? 'line-through text-muted-foreground'
                                        : 'text-foreground'
                                    }>
                                    {subTask.text}
                                  </Text>
                                </View>
                              ))}
                              <View className='mt-3 text-xs text-muted-foreground'>
                                <Text>
                                  {
                                    todo.subTasks.filter(st => st.completed)
                                      .length
                                  }{' '}
                                  of {todo.subTasks.length} completed
                                </Text>
                              </View>
                            </View>
                          </View>
                        )}

                        {/* Details Grid */}
                        <View className='grid grid-cols-2 gap-3 mb-4'>
                          {/* Priority Badge */}
                          <Card
                            size='sm'
                            variant='outline'
                            className='p-3 flex flex-row items-center align-middle'>
                            <Text className='text-xs font-medium mr-2 mb-1'>
                              Priority
                            </Text>
                            <View className='text-sm flex items-center'>
                              <Text
                                className={`text-sm ${getPriorityTextColor(
                                  todo.priority
                                )}`}>
                                {todo.priority}
                              </Text>
                            </View>
                          </Card>

                          {/* Project or Due Date Card */}
                          <Card
                            size='sm'
                            variant='outline'
                            className='p-3 flex flex-row'>
                            <Text className='text-xs font-medium mr-2 mb-1'>
                              {todo.projectId ? 'Project' : 'Due Date'}
                            </Text>
                            <View className='text-sm flex items-center'>
                              {todo.projectId ? (
                                <Text
                                  className='text-sm'
                                  style={{
                                    color: getProjectColor(todo.projectId)
                                  }}>
                                  {getProject(todo.projectId)?.name}
                                </Text>
                              ) : (
                                formatDate(todo.dueDate)
                              )}
                            </View>
                          </Card>
                        </View>

                        {/* Recurrence Info */}
                        {todo.recurrence !== 'none' && (
                          <View className='bg-background rounded-lg p-3 mb-4 shadow-sm border'>
                            <Text className='text-xs font-medium text-muted-foreground mb-1'>
                              Recurrence
                            </Text>
                            <View className='text-sm text-foreground flex items-center'>
                              <Repeat className='h-3.5 w-3.5 mr-1.5 text-muted-foreground' />
                              {todo.recurrence === 'daily'
                                ? 'Daily'
                                : todo.recurrence === 'weekdays'
                                  ? 'Weekdays'
                                  : todo.recurrence === 'weekly'
                                    ? 'Weekly'
                                    : todo.recurrence === 'monthly'
                                      ? 'Monthly'
                                      : 'Custom'}

                              {todo.lastCompleted && (
                                <Text className='ml-2 text-xs text-muted-foreground'>
                                  Last completed:{' '}
                                  {formatDate(todo.lastCompleted)}
                                </Text>
                              )}
                            </View>
                          </View>
                        )}

                        {/* Labels */}
                        {todo.labels.length > 0 && (
                          <View className='bg-background rounded-lg p-4 mb-4 shadow-sm border'>
                            <Text className='text-sm font-medium text-foreground mb-2 flex items-center'>
                              <Tag className='h-4 w-4 mr-2 text-muted-foreground' />
                              Labels
                            </Text>
                            <View className='flex flex-wrap gap-1.5'>
                              {todo.labels.map((label, index) => (
                                <Badge
                                  key={index}
                                  variant='outline'
                                  className='text-xs'>
                                  {label}
                                </Badge>
                              ))}
                            </View>
                          </View>
                        )}

                        {/* Time Tracking */}
                        {(todo.estimatedMinutes ||
                          todo.timeSpentMinutes > 0) && (
                          <View className='bg-background rounded-lg p-4 mb-4 shadow-sm border'>
                            <Text className='text-sm font-medium text-foreground mb-2 flex items-center'>
                              <Clock className='h-4 w-4 mr-2 text-muted-foreground' />
                              Time Tracking
                            </Text>
                            <View className='flex items-center justify-between'>
                              <View>
                                <Text className='text-sm text-muted-foreground'>
                                  {todo.timeSpentMinutes} min spent
                                  {todo.estimatedMinutes
                                    ? ` / ${todo.estimatedMinutes} min estimated`
                                    : ''}
                                </Text>
                              </View>
                              <Button
                                variant='outline'
                                size='sm'
                                onClick={() => {
                                  setCurrentPage('pomodoro')
                                  startPomodoro(todo.id)
                                  setPomodoroMode('work')
                                  setPomodoroMinutes(workDuration)
                                  setPomodoroSeconds(0)
                                }}>
                                Start Timer
                              </Button>
                            </View>
                            {todo.estimatedMinutes && (
                              <View className='mt-2 h-2 bg-muted rounded-full overflow-hidden'>
                                <View
                                  className='h-full bg-primary transition-all'
                                  style={{
                                    width: `${Math.min((todo.timeSpentMinutes / todo.estimatedMinutes) * 100, 100)}%`
                                  }}></View>
                              </View>
                            )}
                          </View>
                        )}

                        {/* Action Buttons */}
                        <View className='flex space-x-2'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => toggleFavoriteTodo(todo.id)}
                            className='flex-1 flex items-center justify-center'>
                            {todo.isFavorite ? (
                              <>
                                <StarOff className='h-4 w-4 mr-2' />
                                Unfavorite
                              </>
                            ) : (
                              <>
                                <Star className='h-4 w-4 mr-2' />
                                Favorite
                              </>
                            )}
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => startEdit(todo)}
                            className='flex-1 flex items-center justify-center'>
                            <Edit className='h-4 w-4 mr-2' />
                            Edit
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => confirmDeleteTodo(todo.id)}
                            className='flex-1 flex items-center justify-center'>
                            <Trash2 className='h-4 w-4 mr-2' />
                            Delete
                          </Button>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      {/* card fotter */}
      <View className='flex-row justify-between items-center p-4'>
        <Text className='text-gray-500'>
          {todos.filter(todo => !todo.completed).length} items left
        </Text>
        <Text className='text-gray-500'>
          {todos.filter(todo => todo.completed).length} completed
        </Text>
      </View>
    </Card>
  )
}

export default Todos
