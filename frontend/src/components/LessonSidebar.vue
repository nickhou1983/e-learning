<template>
  <div class="lesson-sidebar" :class="{ 'collapsed': collapsed }">
    <div class="sidebar-header">
      <h3 v-if="!collapsed">课程目录</h3>
      <a-button 
        type="text" 
        :icon="collapsed ? h(MenuUnfoldOutlined) : h(MenuFoldOutlined)"
        @click="toggleCollapse"
        class="collapse-btn"
      />
    </div>

    <div v-if="!collapsed" class="course-info">
      <h4>{{ course?.title }}</h4>
      <div class="progress-info">
        <a-progress 
          :percent="courseProgress" 
          :show-info="false"
          stroke-color="#1890ff"
        />
        <span class="progress-text">已完成 {{ courseProgress }}%</span>
      </div>
    </div>

    <div class="lessons-list">
      <div 
        v-for="(lesson, index) in lessons" 
        :key="lesson.id"
        class="lesson-item"
        :class="{ 
          'active': currentLessonId === lesson.id,
          'completed': isLessonCompleted(lesson.id),
          'collapsed': collapsed
        }"
        @click="$emit('select-lesson', lesson.id)"
      >
        <div class="lesson-number">
          <CheckCircleFilled v-if="isLessonCompleted(lesson.id)" class="completed-icon" />
          <span v-else>{{ index + 1 }}</span>
        </div>
        <div v-if="!collapsed" class="lesson-info">
          <div class="lesson-title">{{ lesson.title }}</div>
          <div class="lesson-meta">
            <span class="lesson-type">
              <VideoCameraOutlined v-if="lesson.type === 'video'" />
              <FileTextOutlined v-else-if="lesson.type === 'text'" />
              <FileMarkdownOutlined v-else />
              {{ getLessonTypeText(lesson.type) }}
            </span>
            <span class="lesson-duration">{{ formatDuration(lesson.duration) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, computed, ref } from 'vue'
import { 
  MenuFoldOutlined, 
  MenuUnfoldOutlined,
  CheckCircleFilled,
  VideoCameraOutlined,
  FileTextOutlined,
  FileMarkdownOutlined
} from '@ant-design/icons-vue'
import type { CourseDetail, Lesson } from '@/types'

interface Props {
  course: CourseDetail | null
  lessons: Lesson[]
  currentLessonId: number | null
  completedLessons: number[]
  courseProgress: number
}

const props = defineProps<Props>()
defineEmits<{
  'select-lesson': [lessonId: number]
}>()

const collapsed = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const isLessonCompleted = (lessonId: number) => {
  return props.completedLessons.includes(lessonId)
}

const getLessonTypeText = (type: string) => {
  const types: Record<string, string> = {
    video: '视频',
    text: '文档',
    quiz: '测验'
  }
  return types[type] || '未知'
}

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.lesson-sidebar {
  height: 100%;
  background: #fff;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  width: 320px;
}

.lesson-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.collapse-btn {
  color: #6b7280;
}

.course-info {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.course-info h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.progress-info {
  margin-top: 8px;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
  display: block;
}

.lessons-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.lesson-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.lesson-item:hover {
  background: #f9fafb;
}

.lesson-item.active {
  background: #e6f4ff;
  border-left-color: #1890ff;
}

.lesson-item.completed .lesson-number {
  color: #52c41a;
}

.lesson-item.collapsed {
  justify-content: center;
  padding: 12px 8px;
}

.lesson-number {
  min-width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f0f0f0;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  margin-right: 12px;
}

.lesson-item.collapsed .lesson-number {
  margin-right: 0;
}

.completed-icon {
  font-size: 20px;
  color: #52c41a;
}

.lesson-info {
  flex: 1;
  min-width: 0;
}

.lesson-title {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.lesson-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.lesson-type {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 滚动条样式 */
.lessons-list::-webkit-scrollbar {
  width: 6px;
}

.lessons-list::-webkit-scrollbar-track {
  background: transparent;
}

.lessons-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.lessons-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .lesson-sidebar {
    width: 100%;
    max-height: 300px;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }

  .lesson-sidebar.collapsed {
    max-height: 60px;
  }
}
</style>
