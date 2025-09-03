<template>
  <div class="course-description">
    <!-- What you'll learn section -->
    <section class="section">
      <h3 class="section-title">
        <BookOutlined />
        您将学到什么
      </h3>
      <div class="learning-objectives">
        <div v-for="(objective, index) in course.whatYouWillLearn" :key="index" class="objective-item">
          <CheckCircleOutlined class="check-icon" />
          <span>{{ objective }}</span>
        </div>
      </div>
    </section>

    <!-- Course description -->
    <section class="section">
      <h3 class="section-title">
        <FileTextOutlined />
        课程详情
      </h3>
      <div class="description-content">
        <p>{{ course.description }}</p>
      </div>
    </section>

    <!-- Prerequisites -->
    <section v-if="course.prerequisites && course.prerequisites.length > 0" class="section">
      <h3 class="section-title">
        <ExclamationCircleOutlined />
        学习要求
      </h3>
      <div class="prerequisites">
        <div v-for="(prerequisite, index) in course.prerequisites" :key="index" class="prerequisite-item">
          <RightOutlined class="arrow-icon" />
          <span>{{ prerequisite }}</span>
        </div>
      </div>
    </section>

    <!-- Course stats -->
    <section class="section">
      <h3 class="section-title">
        <BarChartOutlined />
        课程统计
      </h3>
      <div class="course-stats">
        <div class="stat-item">
          <div class="stat-value">{{ course.lessons }}</div>
          <div class="stat-label">课时数量</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ formatDuration(course.duration) }}</div>
          <div class="stat-label">总时长</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ course.enrolledCount }}</div>
          <div class="stat-label">学员数量</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ course.rating }}</div>
          <div class="stat-label">课程评分</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { Course } from '@/types'
import { 
  BookOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  BarChartOutlined
} from '@ant-design/icons-vue'

interface Props {
  course: Course
}

defineProps<Props>()

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }
  return `${mins}分钟`
}
</script>

<style scoped>
.course-description {
  max-width: 800px;
}

.section {
  margin-bottom: 40px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.learning-objectives {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 16px;
}

.objective-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8fffe;
  border: 1px solid #e6fffa;
  border-radius: 8px;
}

.check-icon {
  color: #52c41a;
  font-size: 16px;
  margin-top: 2px;
  flex-shrink: 0;
}

.objective-item span {
  color: #1f2937;
  line-height: 1.5;
}

.description-content {
  font-size: 16px;
  line-height: 1.7;
  color: #4b5563;
}

.prerequisites {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.prerequisite-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fef3cd;
  border: 1px solid #fadb14;
  border-radius: 6px;
}

.arrow-icon {
  color: #fa8c16;
  font-size: 12px;
  flex-shrink: 0;
}

.prerequisite-item span {
  color: #1f2937;
}

.course-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 24px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .learning-objectives {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .objective-item {
    padding: 12px;
  }

  .section-title {
    font-size: 18px;
  }

  .course-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .stat-item {
    padding: 16px;
  }

  .stat-value {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .course-stats {
    grid-template-columns: 1fr;
  }
}
</style>