import axios, { type AxiosResponse } from 'axios'
import type { LoginCredentials, RegisterData, User, Course, ApiResponse, CourseDetail, Lesson, Enrollment, Note, LessonProgress } from '@/types'

// Mock data flag - set to true to use mock data during development
const USE_MOCK_DATA = true

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 辅助函数：确保返回 ApiResponse 格式
function ensureApiResponse<T>(data: any): ApiResponse<T> {
  if (data && typeof data === 'object' && 'success' in data) {
    return data as ApiResponse<T>
  }
  
  return {
    success: true,
    data: data,
    message: '操作成功'
  } as ApiResponse<T>
}

// 认证相关 API
export const login = async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
  try {
    const response = await api.post('/auth/login', credentials)
    return ensureApiResponse<{ token: string; user: User }>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '登录失败'
    }
  }
}

export const register = async (data: RegisterData): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post('/auth/register', data)
    return ensureApiResponse<User>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '注册失败'
    }
  }
}

export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await api.post('/auth/logout')
    return ensureApiResponse(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '退出失败'
    }
  }
}

export const getCurrentUser = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get('/auth/me')
    return ensureApiResponse<User>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取用户信息失败'
    }
  }
}

// 课程相关 API
export const getCourses = async (params?: {
  category?: number
  difficulty?: string
  search?: string
  page?: number
  limit?: number
}): Promise<ApiResponse<{ courses: Course[]; total: number }>> => {
  try {
    const response = await api.get('/courses', { params })
    return ensureApiResponse<{ courses: Course[]; total: number }>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取课程列表失败'
    }
  }
}

export const getCourse = async (id: number): Promise<ApiResponse<Course>> => {
  try {
    const response = await api.get(`/courses/${id}`)
    return ensureApiResponse<Course>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取课程详情失败'
    }
  }
}

// ============= Mock Data =============
// Mock data for development and testing

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const mockLessons: Record<number, Lesson[]> = {
  1: [
    {
      id: 1,
      title: 'Vue.js 3 介绍与环境搭建',
      description: '本课时将介绍Vue.js 3的新特性，并指导大家搭建开发环境。',
      courseId: 1,
      orderIndex: 1,
      duration: 900, // 15 minutes
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Sample video URL
      type: 'video'
    },
    {
      id: 2,
      title: 'Vue 3 组合式API基础',
      description: '深入了解Vue 3的组合式API，包括setup函数、ref和reactive等核心概念。',
      courseId: 1,
      orderIndex: 2,
      duration: 1200,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      type: 'video'
    },
    {
      id: 3,
      title: '响应式系统原理',
      description: '理解Vue 3响应式系统的工作原理，掌握ref、reactive、computed等API的使用。',
      courseId: 1,
      orderIndex: 3,
      duration: 1500,
      content: `
        <h2>Vue 3 响应式系统原理</h2>
        
        <h3>1. 响应式基础</h3>
        <p>Vue 3 的响应式系统基于 Proxy 实现，相比 Vue 2 的 Object.defineProperty 有更好的性能和更完整的功能。</p>
        
        <h3>2. ref vs reactive</h3>
        <ul>
          <li><strong>ref</strong>: 用于基本类型数据，通过 .value 访问</li>
          <li><strong>reactive</strong>: 用于对象类型数据，直接访问属性</li>
        </ul>
        
        <h3>3. 示例代码</h3>
        <pre><code>import { ref, reactive, computed } from 'vue'

const count = ref(0)
const user = reactive({
  name: 'John',
  age: 30
})

const doubleCount = computed(() => count.value * 2)
</code></pre>
        
        <h3>4. 最佳实践</h3>
        <p>使用 ref 处理基本类型，使用 reactive 处理复杂对象。避免解构 reactive 对象，以保持响应性。</p>
      `,
      type: 'text'
    },
    {
      id: 4,
      title: '生命周期钩子',
      description: '学习Vue 3组合式API中的生命周期钩子函数。',
      courseId: 1,
      orderIndex: 4,
      duration: 1080,
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      type: 'video'
    }
  ]
}

const mockCourses: Record<number, CourseDetail> = {
  1: {
    id: 1,
    title: 'Vue.js 3 完整教程',
    description: '从零开始学习Vue.js 3，掌握现代前端开发技能。本课程涵盖Vue 3的所有核心特性，包括组合式API、响应式系统、路由管理等。',
    categoryId: 1,
    difficulty: 'intermediate',
    duration: 14400, // 4 hours
    lessonCount: 24,
    rating: 4.8,
    enrolledCount: 1580,
    thumbnail: '/images/courses/frontend.jpg',
    instructorId: 1,
    createdAt: '2024-01-15T08:00:00Z',
    lessons: mockLessons[1] || []
  }
}

const mockEnrollments: Record<number, Enrollment> = {
  1: {
    id: 1,
    userId: 1,
    courseId: 1,
    progress: 25,
    completedLessons: [1],
    enrolledAt: '2024-02-01T10:00:00Z',
    lastAccessedAt: '2024-02-05T14:30:00Z'
  }
}

const mockNotes: Note[] = [
  {
    id: 1,
    userId: 1,
    courseId: 1,
    lessonId: 1,
    content: 'Vue 3的性能相比Vue 2有显著提升，主要得益于Proxy的使用和编译优化。',
    timestamp: 450,
    createdAt: '2024-02-05T10:30:00Z'
  },
  {
    id: 2,
    userId: 1,
    courseId: 1,
    lessonId: 2,
    content: 'setup函数是组合式API的入口点，可以返回任何在模板中使用的变量和函数。',
    timestamp: 600,
    createdAt: '2024-02-05T11:15:00Z'
  }
]

// 学习相关 API
export const getCourseDetail = async (courseId: number): Promise<ApiResponse<CourseDetail>> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(300)
    const course = mockCourses[courseId]
    if (course) {
      return { success: true, data: course }
    }
    return { success: false, message: '课程不存在' }
  }
  
  try {
    const response = await api.get(`/courses/${courseId}/detail`)
    return ensureApiResponse<CourseDetail>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取课程详情失败'
    }
  }
}

export const getCourseLessons = async (courseId: number): Promise<ApiResponse<Lesson[]>> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(200)
    const lessons = mockLessons[courseId]
    if (lessons) {
      return { success: true, data: lessons }
    }
    return { success: false, message: '课时列表不存在' }
  }
  
  try {
    const response = await api.get(`/courses/${courseId}/lessons`)
    return ensureApiResponse<Lesson[]>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取课程课时列表失败'
    }
  }
}

export const getLessonDetail = async (courseId: number, lessonId: number): Promise<ApiResponse<Lesson>> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(200)
    const lessons = mockLessons[courseId]
    if (lessons) {
      const lesson = lessons.find(l => l.id === lessonId)
      if (lesson) {
        return { success: true, data: lesson }
      }
    }
    return { success: false, message: '课时不存在' }
  }
  
  try {
    const response = await api.get(`/courses/${courseId}/lessons/${lessonId}`)
    return ensureApiResponse<Lesson>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取课时详情失败'
    }
  }
}

export const getEnrollment = async (courseId: number): Promise<ApiResponse<Enrollment>> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(200)
    const enrollment = mockEnrollments[courseId]
    if (enrollment) {
      return { success: true, data: enrollment }
    }
    return { success: false, message: '未找到学习记录' }
  }
  
  try {
    const response = await api.get(`/courses/${courseId}/enrollment`)
    return ensureApiResponse<Enrollment>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取学习进度失败'
    }
  }
}

export const updateProgress = async (
  courseId: number,
  lessonId: number,
  progress: LessonProgress
): Promise<ApiResponse> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(100)
    console.log('Mock: Update progress', { courseId, lessonId, progress })
    return { success: true, message: '进度已保存' }
  }
  
  try {
    const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/progress`, progress)
    return ensureApiResponse(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '更新学习进度失败'
    }
  }
}

export const completeLesson = async (courseId: number, lessonId: number): Promise<ApiResponse> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(200)
    const enrollment = mockEnrollments[courseId]
    if (enrollment && !enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId)
      const lessons = mockLessons[courseId]
      if (lessons) {
        enrollment.progress = Math.round((enrollment.completedLessons.length / lessons.length) * 100)
      }
    }
    return { success: true, message: '课时已完成' }
  }
  
  try {
    const response = await api.post(`/courses/${courseId}/lessons/${lessonId}/complete`)
    return ensureApiResponse(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '标记完成失败'
    }
  }
}

// 笔记相关 API
export const getNotes = async (courseId: number, lessonId?: number): Promise<ApiResponse<Note[]>> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(200)
    let notes = mockNotes.filter(n => n.courseId === courseId)
    if (lessonId) {
      notes = notes.filter(n => n.lessonId === lessonId)
    }
    return { success: true, data: notes }
  }
  
  try {
    const params = lessonId ? { lessonId } : {}
    const response = await api.get(`/courses/${courseId}/notes`, { params })
    return ensureApiResponse<Note[]>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取笔记失败'
    }
  }
}

export const saveNote = async (
  courseId: number,
  lessonId: number,
  content: string,
  timestamp?: number
): Promise<ApiResponse<Note>> => {
  // Mock data override
  if (USE_MOCK_DATA) {
    await delay(200)
    const newNote: Note = {
      id: mockNotes.length + 1,
      userId: 1,
      courseId,
      lessonId,
      content,
      timestamp,
      createdAt: new Date().toISOString()
    }
    mockNotes.push(newNote)
    return { success: true, data: newNote }
  }
  
  try {
    const response = await api.post(`/courses/${courseId}/notes`, {
      lessonId,
      content,
      timestamp
    })
    return ensureApiResponse<Note>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '保存笔记失败'
    }
  }
}

export const updateNote = async (noteId: number, content: string): Promise<ApiResponse<Note>> => {
  try {
    const response = await api.put(`/notes/${noteId}`, { content })
    return ensureApiResponse<Note>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '更新笔记失败'
    }
  }
}

export const deleteNote = async (noteId: number): Promise<ApiResponse> => {
  try {
    const response = await api.delete(`/notes/${noteId}`)
    return ensureApiResponse(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '删除笔记失败'
    }
  }
}

// 导出 axios 实例以供其他模块使用
export default api

