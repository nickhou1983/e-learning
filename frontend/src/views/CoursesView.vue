<template>
  <div class="courses-page">
    <div class="page-header">
      <h1>我的课程</h1>
      <p>管理您已注册的课程</p>
    </div>

    <div class="course-tabs">
      <a-tabs v-model:activeKey="activeTab" size="large">
        <a-tab-pane key="active" tab="进行中">
          <div class="course-grid">
            <div v-for="course in activeCourses" :key="course.id" class="course-card">
              <div class="course-image">
                <img :src="course.thumbnail" :alt="course.title" @error="handleImageError" />
                <div class="progress-overlay">
                  <a-progress 
                    type="circle" 
                    :percent="course.progress" 
                    :size="60"
                    :stroke-color="'#1890ff'"
                  />
                </div>
              </div>
              <div class="course-content">
                <h3>{{ course.title }}</h3>
                <p>{{ course.instructor }}</p>
                <div class="course-meta">
                  <span>已完成 {{ course.progress }}%</span>
                  <span>{{ course.lessons }} 节课</span>
                </div>
                <a-button type="primary" block @click="continueCourse(course.id)">
                  继续学习
                </a-button>
              </div>
            </div>
          </div>
        </a-tab-pane>

        <a-tab-pane key="completed" tab="已完成">
          <div class="course-grid">
            <div v-for="course in completedCourses" :key="course.id" class="course-card">
              <div class="course-image">
                <img :src="course.thumbnail" :alt="course.title" @error="handleImageError" />
                <div class="completed-badge">
                  <CheckCircleFilled style="color: #52c41a; font-size: 24px;" />
                </div>
              </div>
              <div class="course-content">
                <h3>{{ course.title }}</h3>
                <p>{{ course.instructor }}</p>
                <div class="course-meta">
                  <span>已完成</span>
                  <span>获得证书</span>
                </div>
                <a-button block @click="reviewCourse(course.id)">
                  复习课程
                </a-button>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircleFilled } from '@ant-design/icons-vue'
import { handleImageError } from '@/utils/image'

const router = useRouter()
const activeTab = ref('active')

// 模拟数据
const activeCourses = ref([
  {
    id: 1,
    title: 'Vue.js 3 完整教程',
    instructor: '张老师',
    progress: 65,
    lessons: 24,
    thumbnail: '/images/courses/frontend.jpg'
  },
  {
    id: 2,
    title: 'TypeScript 从入门到精通',
    instructor: '李老师',
    progress: 45,
    lessons: 18,
    thumbnail: '/images/courses/typescript.jpg'
  },
  {
    id: 3,
    title: 'React 高级开发实战',
    instructor: '王老师',
    progress: 30,
    lessons: 32,
    thumbnail: '/images/courses/frontend.jpg'
  }
])

const completedCourses = ref([
  {
    id: 4,
    title: 'JavaScript 基础',
    instructor: '赵老师',
    progress: 100,
    lessons: 20,
    thumbnail: '/images/courses/javascript.jpg'
  },
  {
    id: 5,
    title: 'CSS 进阶技巧',
    instructor: '周老师',
    progress: 100,
    lessons: 16,
    thumbnail: '/images/courses/css.jpg'
  }
])

const continueCourse = (courseId: number) => {
  // 找到课程的第一个课时或最后学习的课时
  // 这里简化处理，直接跳转到第一课时（假设lessonId为1）
  router.push(`/course/${courseId}/lesson/1`)
}

const reviewCourse = (courseId: number) => {
  // 复习课程，跳转到第一课时
  router.push(`/course/${courseId}/lesson/1`)
}
</script>

<style scoped>
.courses-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.course-tabs {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.course-card {
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
  background: white;
}

.course-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.course-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.course-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.progress-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  padding: 8px;
}

.completed-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-content {
  padding: 20px;
}

.course-content h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1f2937;
}

.course-content p {
  color: #6b7280;
  margin: 0 0 12px 0;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
}
</style>
