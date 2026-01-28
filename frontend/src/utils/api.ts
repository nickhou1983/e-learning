import axios, { type AxiosResponse } from 'axios'
import type { 
  LoginCredentials, 
  RegisterData, 
  User, 
  Course, 
  ApiResponse,
  DashboardData,
  UserStatistics,
  ContinueLearningCourse,
  RecommendedCourse,
  MonthlyProgress
} from '@/types'

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

// 首页/仪表板相关 API
export const getDashboardData = async (): Promise<ApiResponse<DashboardData>> => {
  try {
    const response = await api.get('/dashboard')
    return ensureApiResponse<DashboardData>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取仪表板数据失败'
    }
  }
}

export const getUserStatistics = async (): Promise<ApiResponse<UserStatistics>> => {
  try {
    const response = await api.get('/dashboard/statistics')
    return ensureApiResponse<UserStatistics>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取用户统计数据失败'
    }
  }
}

export const getContinueLearningCourses = async (): Promise<ApiResponse<ContinueLearningCourse[]>> => {
  try {
    const response = await api.get('/dashboard/continue-learning')
    return ensureApiResponse<ContinueLearningCourse[]>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取继续学习课程失败'
    }
  }
}

export const getRecommendedCourses = async (): Promise<ApiResponse<RecommendedCourse[]>> => {
  try {
    const response = await api.get('/dashboard/recommended')
    return ensureApiResponse<RecommendedCourse[]>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取推荐课程失败'
    }
  }
}

export const getMonthlyProgress = async (): Promise<ApiResponse<MonthlyProgress>> => {
  try {
    const response = await api.get('/dashboard/monthly-progress')
    return ensureApiResponse<MonthlyProgress>(response)
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || '获取月度进度失败'
    }
  }
}

// 导出 axios 实例以供其他模块使用
export default api
