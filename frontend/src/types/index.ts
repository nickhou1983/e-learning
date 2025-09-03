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
  // Extended fields for course detail
  price?: number
  instructor?: string
  instructorAvatar?: string
  instructorBio?: string
  whatYouWillLearn?: string[]
  prerequisites?: string[]
  curriculum?: CourseChapter[]
  reviews?: CourseReview[]
  tags?: string[]
  level?: string
}

export interface CourseChapter {
  id: number
  title: string
  lessons: CourseChapterLesson[]
  duration: number
}

export interface CourseChapterLesson {
  id: number
  title: string
  duration: number
  type: 'video' | 'text' | 'quiz'
  isCompleted?: boolean
  isFree?: boolean
}

export interface CourseReview {
  id: number
  userId: number
  userName: string
  userAvatar?: string
  rating: number
  comment: string
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
