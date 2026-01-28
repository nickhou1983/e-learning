<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1 class="page-title">欢迎回来，{{ userStore.userName }}！</h1>
      <p class="page-subtitle">继续您的学习之旅</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <a-spin size="large" tip="加载中..." />
    </div>

    <!-- Error State -->
    <a-alert
      v-else-if="error"
      type="error"
      :message="error"
      show-icon
      closable
      @close="error = null"
      style="margin-bottom: 24px"
    />

    <!-- Dashboard Content -->
    <template v-else>
      <a-row :gutter="[24, 24]">
        <!-- 学习统计 -->
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon completed">
                <BookOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.completedCourses }}</div>
                <div class="stat-label">已完成课程</div>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon progress">
                <ClockCircleOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.inProgressCourses }}</div>
                <div class="stat-label">进行中课程</div>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon time">
                <FieldTimeOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.studyTimeHours }}h</div>
                <div class="stat-label">学习时长</div>
              </div>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :lg="6">
          <a-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon certificates">
                <TrophyOutlined />
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.certificates }}</div>
                <div class="stat-label">获得证书</div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[24, 24]" style="margin-top: 24px">
        <!-- 继续学习 -->
        <a-col :xs="24" :lg="16">
          <a-card title="继续学习" class="continue-learning">
            <template v-if="continueLearningCourses.length > 0">
              <div class="course-list">
                <div class="course-item" v-for="course in continueLearningCourses" :key="course.id">
                  <div class="course-thumbnail">
                    <img :src="course.thumbnail" :alt="course.title" @error="handleImageError" />
                  </div>
                  <div class="course-info">
                    <h3 class="course-title">{{ course.title }}</h3>
                    <p class="course-instructor">{{ course.instructor }}</p>
                    <div class="course-progress">
                      <a-progress :percent="course.progress" :show-info="false" />
                      <span class="progress-text">{{ course.progress }}% 完成</span>
                    </div>
                  </div>
                  <div class="course-action">
                    <a-button type="primary" @click="continueCourse(course.id)">
                      继续学习
                    </a-button>
                  </div>
                </div>
              </div>
            </template>
            <a-empty v-else description="暂无进行中的课程" />
          </a-card>
        </a-col>

        <!-- 学习进度 -->
        <a-col :xs="24" :lg="8">
          <a-card title="本月学习进度" class="progress-card">
            <div class="progress-summary">
              <div class="progress-circle">
                <a-progress
                  type="circle"
                  :percent="monthlyProgress.progressPercentage"
                  :size="120"
                  :stroke-color="{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }"
                />
              </div>
              <div class="progress-details">
                <div class="progress-item">
                  <span class="label">本月目标</span>
                  <span class="value">{{ monthlyProgress.targetHours }} 小时</span>
                </div>
                <div class="progress-item">
                  <span class="label">已完成</span>
                  <span class="value">{{ monthlyProgress.completedHours }} 小时</span>
                </div>
                <div class="progress-item">
                  <span class="label">剩余</span>
                  <span class="value">{{ monthlyProgress.remainingHours }} 小时</span>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 推荐课程 -->
      <a-row style="margin-top: 24px">
        <a-col :span="24">
          <a-card title="推荐课程" class="recommended-courses">
            <template v-if="recommendedCourses.length > 0">
              <div class="course-grid">
                <div class="course-card" v-for="course in recommendedCourses" :key="course.id">
                  <div class="course-image">
                    <img :src="course.thumbnail" :alt="course.title" @error="handleImageError" />
                  </div>
                  <div class="course-content">
                    <h4 class="course-title">{{ course.title }}</h4>
                    <p class="course-description">{{ course.description }}</p>
                    <div class="course-meta">
                      <span class="rating">
                        <StarFilled />
                        {{ course.rating }}
                      </span>
                      <span class="students">{{ course.students }} 学员</span>
                    </div>
                    <a-button type="primary" block @click="enrollCourse(course.id)">
                      开始学习
                    </a-button>
                  </div>
                </div>
              </div>
            </template>
            <a-empty v-else description="暂无推荐课程" />
          </a-card>
        </a-col>
      </a-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  BookOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
  TrophyOutlined,
  StarFilled
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'
import { handleImageError } from '@/utils/image'
import {
  getDashboardData,
  getUserStatistics,
  getContinueLearningCourses,
  getRecommendedCourses,
  getMonthlyProgress
} from '@/utils/api'
import type {
  UserStatistics,
  ContinueLearningCourse,
  RecommendedCourse,
  MonthlyProgress
} from '@/types'

const router = useRouter()
const userStore = useUserStore()

// 状态管理
const loading = ref(false)
const error = ref<string | null>(null)

// 数据状态
const statistics = ref<UserStatistics>({
  completedCourses: 0,
  inProgressCourses: 0,
  studyTimeHours: 0,
  certificates: 0
})

const continueLearningCourses = ref<ContinueLearningCourse[]>([])
const recommendedCourses = ref<RecommendedCourse[]>([])
const monthlyProgress = ref<MonthlyProgress>({
  targetHours: 0,
  completedHours: 0,
  remainingHours: 0,
  progressPercentage: 0
})

// 加载仪表板数据
const loadDashboardData = async () => {
  loading.value = true
  error.value = null

  try {
    // 尝试获取完整的仪表板数据
    const dashboardResponse = await getDashboardData()
    
    if (dashboardResponse.success && dashboardResponse.data) {
      // 如果后端支持一次性获取所有数据
      statistics.value = dashboardResponse.data.statistics
      continueLearningCourses.value = dashboardResponse.data.continueLearning
      recommendedCourses.value = dashboardResponse.data.recommended
      monthlyProgress.value = dashboardResponse.data.monthlyProgress
    } else {
      // 否则分别获取各部分数据
      await loadDataSeparately()
    }
  } catch (err) {
    // 如果完整接口不可用，尝试分别加载
    await loadDataSeparately()
  } finally {
    loading.value = false
  }
}

// 分别加载各部分数据
const loadDataSeparately = async () => {
  try {
    const [statsRes, continueRes, recommendedRes, progressRes] = await Promise.all([
      getUserStatistics(),
      getContinueLearningCourses(),
      getRecommendedCourses(),
      getMonthlyProgress()
    ])

    if (statsRes.success && statsRes.data) {
      statistics.value = statsRes.data
    }

    if (continueRes.success && continueRes.data) {
      continueLearningCourses.value = continueRes.data
    }

    if (recommendedRes.success && recommendedRes.data) {
      recommendedCourses.value = recommendedRes.data
    }

    if (progressRes.success && progressRes.data) {
      monthlyProgress.value = progressRes.data
    }
  } catch (err: any) {
    console.error('加载数据失败:', err)
    error.value = '加载仪表板数据失败，请刷新页面重试'
    // 使用模拟数据作为后备方案
    loadMockData()
  }
}

// 加载模拟数据（用于开发和后备）
const loadMockData = () => {
  statistics.value = {
    completedCourses: 12,
    inProgressCourses: 3,
    studyTimeHours: 45,
    certificates: 8
  }

  continueLearningCourses.value = [
    {
      id: 1,
      title: 'Vue.js 3 完整教程',
      instructor: '张老师',
      progress: 65,
      thumbnail: '/images/courses/frontend-small.jpg'
    },
    {
      id: 2,
      title: 'TypeScript 从入门到精通',
      instructor: '李老师',
      progress: 45,
      thumbnail: '/images/courses/typescript-small.jpg'
    },
    {
      id: 3,
      title: 'React 高级开发实战',
      instructor: '王老师',
      progress: 30,
      thumbnail: '/images/courses/frontend-small.jpg'
    }
  ]

  recommendedCourses.value = [
    {
      id: 4,
      title: 'Node.js 后端开发',
      description: '学习使用 Node.js 构建高性能的后端应用',
      rating: 4.8,
      students: 1250,
      thumbnail: '/images/courses/backend.jpg'
    },
    {
      id: 5,
      title: 'Python 数据分析',
      description: '掌握 Python 数据分析的核心技术和工具',
      rating: 4.6,
      students: 890,
      thumbnail: '/images/courses/data.jpg'
    },
    {
      id: 6,
      title: 'UI/UX 设计基础',
      description: '学习现代 UI/UX 设计原理和实践',
      rating: 4.7,
      students: 650,
      thumbnail: '/images/courses/design.jpg'
    }
  ]

  monthlyProgress.value = {
    targetHours: 20,
    completedHours: 15,
    remainingHours: 5,
    progressPercentage: 75
  }
}

// 继续学习课程
const continueCourse = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

// 注册课程
const enrollCourse = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

// 组件挂载时加载数据
onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.dashboard-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.completed {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.stat-icon.progress {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.stat-icon.time {
  background: linear-gradient(135deg, #722ed1, #9254de);
}

.stat-icon.certificates {
  background: linear-gradient(135deg, #fa8c16, #ffa940);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.continue-learning {
  height: 100%;
}

.course-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.2s;
}

.course-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.course-thumbnail img {
  width: 80px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.course-info {
  flex: 1;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1f2937;
}

.course-instructor {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.course-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
}

.progress-card {
  height: 100%;
}

.progress-summary {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.progress-details {
  width: 100%;
}

.progress-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.progress-item:last-child {
  border-bottom: none;
}

.progress-item .label {
  color: #6b7280;
}

.progress-item .value {
  font-weight: 600;
  color: #1f2937;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.course-card {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.course-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.course-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.course-content {
  padding: 16px;
}

.course-card .course-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.course-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  font-size: 14px;
}

.rating {
  color: #fa8c16;
  display: flex;
  align-items: center;
  gap: 4px;
}

.students {
  color: #6b7280;
}

@media (max-width: 768px) {
  .course-item {
    flex-direction: column;
    text-align: center;
  }
  
  .course-progress {
    justify-content: center;
  }
  
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
