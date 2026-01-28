export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  department: string
  position: string
  avatar?: string
  roleId: number
  createdAt: string
}

export interface LoginCredentials {
  username: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  department: string
  position: string
}

export interface Course {
  id: number
  title: string
  description: string
  categoryId: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  lessons: number
  rating: number
  enrolledCount: number
  thumbnail?: string
  instructorId: number
  createdAt: string
}

export interface Lesson {
  id: number
  title: string
  description: string
  courseId: number
  orderIndex: number
  duration: number
  videoUrl?: string
  content?: string
  type: 'video' | 'text' | 'quiz'
}

export interface Enrollment {
  id: number
  userId: number
  courseId: number
  progress: number
  completedLessons: number[]
  enrolledAt: string
  lastAccessedAt?: string
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Dashboard/Homepage related types
export interface UserStatistics {
  completedCourses: number
  inProgressCourses: number
  studyTimeHours: number
  certificates: number
}

export interface ContinueLearningCourse {
  id: number
  title: string
  instructor: string
  progress: number
  thumbnail: string
}

export interface RecommendedCourse {
  id: number
  title: string
  description: string
  rating: number
  students: number
  thumbnail: string
}

export interface MonthlyProgress {
  targetHours: number
  completedHours: number
  remainingHours: number
  progressPercentage: number
}

export interface DashboardData {
  statistics: UserStatistics
  continueLearning: ContinueLearningCourse[]
  recommended: RecommendedCourse[]
  monthlyProgress: MonthlyProgress
}
