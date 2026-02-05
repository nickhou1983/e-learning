import axios, { type AxiosResponse } from 'axios'
import type { LoginCredentials, RegisterData, User, Course, ApiResponse, CourseDetail, Lesson, Enrollment, Note, LessonProgress } from '@/types'

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

// 学习相关 API
export const getCourseDetail = async (courseId: number): Promise<ApiResponse<CourseDetail>> => {
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
