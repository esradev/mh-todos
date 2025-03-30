import { useState, useMemo } from 'react'
import { View, Text } from 'react-native'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Repeat
} from 'lucide-react-native'

type SortOption =
  | 'priority'
  | 'dueDate'
  | 'alphabetical'
  | 'createdAt'
  | 'estimatedTime'

type Project = {
  id: number
  name: string
  color: string
  description: string
  isFavorite: boolean
}

type Priority = 'low' | 'medium' | 'high'
type RecurrencePattern =
  | 'none'
  | 'daily'
  | 'weekdays'
  | 'weekly'
  | 'monthly'
  | 'custom'

type SubTask = {
  id: number
  text: string
  completed: boolean
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

const Todos = () => {
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
  const [searchQuery, setSearchQuery] = useState('')
  const [activeProjectFilter, setActiveProjectFilter] = useState<number | null>(
    null
  )
  const [sortOption, setSortOption] = useState<SortOption>('priority')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filterOptions, setFilterOptions] = useState({
    showCompleted: true,
    priorities: ['low', 'medium', 'high'],
    projects: null,
    dueDateRange: 'all',
    favorites: false
  })

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

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString()
  }

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

  const toggleExpand = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, isExpanded: !todo.isExpanded } : todo
      )
    )
  }

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
          <View className='divide-y divide-border'>
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

                          {/* Due Date (if exists) */}
                          {todo.dueDate && (
                            <View className='flex items-center mt-1 text-xs text-muted-foreground'>
                              <Calendar className='h-3 w-3 mr-1' />
                              <Text>{formatDate(todo.dueDate)}</Text>
                            </View>
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
                    <View className='mt-2'>
                      <Text className='text-sm text-gray-500'>
                        {todo.description}
                      </Text>
                      <View className='flex-row items-center mt-2'>
                        <Badge
                          className={`${
                            todo.completed
                              ? 'bg-gray-200'
                              : getPriorityColor(todo.priority)
                          }`}>
                          {todo.priority.charAt(0).toUpperCase() +
                            todo.priority.slice(1)}
                        </Badge>
                        {todo.dueDate && (
                          <Badge className='ml-2 bg-blue-100 text-blue-800'>
                            <Calendar size={16} color='#1E3A8A' />{' '}
                            {formatDate(todo.dueDate)}
                          </Badge>
                        )}
                        {todo.projectId && (
                          <Badge
                            className='ml-2'
                            style={{
                              backgroundColor: getProjectColor(todo.projectId)
                            }}>
                            <Star size={16} color='#FBBF24' />{' '}
                            {getProject(todo.projectId)?.name}
                          </Badge>
                        )}
                      </View>
                      <View className='flex-row items-center mt-2'>
                        {todo.subTasks.length > 0 && (
                          <Badge className='bg-gray-200 text-gray-500'>
                            {
                              todo.subTasks.filter(subTask => subTask.completed)
                                .length
                            }{' '}
                            / {todo.subTasks.length} Subtasks
                          </Badge>
                        )}
                        {todo.estimatedMinutes && (
                          <Badge className='ml-2 bg-yellow-100 text-yellow-800'>
                            <Repeat size={16} color='#FBBF24' />{' '}
                            {todo.estimatedMinutes} min
                          </Badge>
                        )}
                        {todo.timeSpentMinutes > 0 && (
                          <Badge className='ml-2 bg-green-100 text-green-800'>
                            <Repeat size={16} color='#4CAF50' />{' '}
                            {todo.timeSpentMinutes} min spent
                          </Badge>
                        )}
                        {todo.isFavorite && (
                          <Badge className='ml-2 bg-red-100 text-red-800'>
                            <Star size={16} color='#FBBF24' /> Favorite
                          </Badge>
                        )}
                        {todo.recurrence && (
                          <Badge className='ml-2 bg-purple-100 text-purple-800'>
                            <Repeat size={16} color='#6B21A8' /> Recurs:{' '}
                            {todo.recurrence}
                          </Badge>
                        )}
                        {todo.lastCompleted && (
                          <Badge className='ml-2 bg-gray-100 text-gray-800'>
                            Last completed: {formatDate(todo.lastCompleted)}
                          </Badge>
                        )}
                      </View>
                      {todo.subTasks.length > 0 && (
                        <View className='mt-2'>
                          {todo.subTasks.map(subTask => (
                            <View
                              key={subTask.id}
                              className='flex-row items-center'>
                              <Button
                                variant='ghost'
                                size='icon'
                                onPress={() => toggleTodo(subTask.id)}>
                                {subTask.completed ? (
                                  <CheckCircle color='#4CAF50' />
                                ) : (
                                  <Circle color='#FF5722' />
                                )}
                              </Button>
                              <Text className='ml-2 text-sm'>
                                {subTask.text}
                              </Text>
                            </View>
                          ))}
                        </View>
                      )}
                      {todo.labels.length > 0 && (
                        <View className='mt-2'>
                          {todo.labels.map(label => (
                            <Badge
                              key={label}
                              className='mr-2 bg-gray-200 text-gray-500'>
                              {label}
                            </Badge>
                          ))}
                        </View>
                      )}
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
