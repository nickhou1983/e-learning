<template>
  <div class="course-header">
    <div class="course-header-content">
      <div class="course-image">
        <img :src="course.thumbnail" :alt="course.title" />
        <div class="course-level-badge">{{ course.level }}</div>
      </div>

      <div class="course-info">
        <div class="course-title-section">
          <h1 class="course-title">{{ course.title }}</h1>
          <div class="course-rating">
            <a-rate 
              :value="course.rating" 
              :disabled="true" 
              :allow-half="true" 
              style="font-size: 16px;"
            />
            <span class="rating-text">({{ course.rating }}) {{ course.enrolledCount }} 条评价</span>
          </div>
        </div>

        <div class="course-meta">
          <div class="meta-item">
            <UserOutlined />
            <span>{{ course.instructor }}</span>
          </div>
          <div class="meta-item">
            <ClockCircleOutlined />
            <span>{{ formatDuration(course.duration) }}</span>
          </div>
          <div class="meta-item">
            <BookOutlined />
            <span>{{ course.lessons }} 个课时</span>
          </div>
          <div class="meta-item">
            <TrophyOutlined />
            <span>{{ course.level }}</span>
          </div>
        </div>

        <p class="course-description">{{ course.description }}</p>

        <div class="course-tags">
          <a-tag v-for="tag in course.tags" :key="tag" color="blue">
            {{ tag }}
          </a-tag>
        </div>
      </div>

      <div class="course-enrollment">
        <div class="price-section">
          <div v-if="course.price && course.price > 0" class="price">
            <span class="price-currency">¥</span>
            <span class="price-amount">{{ course.price }}</span>
          </div>
          <div v-else class="price-free">免费</div>
        </div>

        <a-button 
          type="primary" 
          size="large" 
          class="enroll-button"
          :loading="enrolling"
          :disabled="isEnrolled"
          @click="handleEnroll"
        >
          {{ isEnrolled ? '已报名' : '立即报名' }}
        </a-button>

        <div class="enrollment-info">
          <div class="info-item">
            <TeamOutlined />
            <span>{{ course.enrolledCount }} 人已报名</span>
          </div>
          <div class="info-item">
            <CalendarOutlined />
            <span>随时开始学习</span>
          </div>
          <div class="info-item">
            <AppstoreOutlined />
            <span>终身访问</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '@/types'
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  BookOutlined, 
  TrophyOutlined,
  TeamOutlined,
  CalendarOutlined,
  AppstoreOutlined
} from '@ant-design/icons-vue'

interface Props {
  course: Course
  isEnrolled: boolean
  enrolling: boolean
}

interface Emits {
  (e: 'enroll'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }
  return `${mins}分钟`
}

const handleEnroll = () => {
  emit('enroll')
}
</script>

<style scoped>
.course-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 40px 0;
  margin-bottom: 32px;
}

.course-header-content {
  display: grid;
  grid-template-columns: 300px 1fr 280px;
  gap: 40px;
  align-items: start;
}

.course-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.course-image img {
  width: 100%;
  height: auto;
  display: block;
}

.course-level-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.course-info {
  padding: 8px 0;
}

.course-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.3;
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.rating-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
}

.course-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.course-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 20px 0;
  color: rgba(255, 255, 255, 0.9);
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.course-enrollment {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
}

.price-section {
  margin-bottom: 20px;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price-currency {
  font-size: 20px;
  font-weight: 600;
}

.price-amount {
  font-size: 36px;
  font-weight: 700;
}

.price-free {
  font-size: 28px;
  font-weight: 700;
  color: #52c41a;
}

.enroll-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.enrollment-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* Mobile responsive */
@media (max-width: 1024px) {
  .course-header-content {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }

  .course-image {
    max-width: 400px;
    margin: 0 auto;
  }

  .course-enrollment {
    max-width: 400px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .course-header {
    padding: 24px 0;
  }

  .course-title {
    font-size: 24px;
  }

  .course-meta {
    justify-content: center;
    gap: 16px;
  }

  .price-amount {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .course-title {
    font-size: 20px;
  }

  .course-meta {
    flex-direction: column;
    gap: 8px;
  }

  .enrollment-info {
    gap: 6px;
  }
}
</style>