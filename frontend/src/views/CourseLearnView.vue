<template>
  <div class="course-learn-view">
    <a-spin :spinning="loading" size="large" class="page-spinner">
      <div class="learn-container">
        <!-- 课程侧边栏 -->
        <LessonSidebar
          :course="currentCourse"
          :lessons="currentCourse?.lessons || []"
          :current-lesson-id="currentLesson?.id || null"
          :completed-lessons="enrollment?.completedLessons || []"
          :course-progress="courseProgress"
          @select-lesson="navigateToLesson"
        />

        <!-- 主内容区 -->
        <div class="main-content">
          <div class="content-header">
            <div class="lesson-title">
              <h2>{{ currentLesson?.title }}</h2>
              <a-tag v-if="isLessonCompleted" color="success">
                <CheckCircleOutlined /> 已完成
              </a-tag>
            </div>
            <div class="lesson-nav">
              <a-button 
                @click="goToPrevious"
                :disabled="!hasPreviousLesson"
              >
                <LeftOutlined /> 上一课
              </a-button>
              <a-button 
                type="primary"
                @click="goToNext"
                :disabled="!hasNextLesson"
              >
                下一课 <RightOutlined />
              </a-button>
            </div>
          </div>

          <!-- 视频播放器 -->
          <div v-if="currentLesson?.type === 'video'" class="lesson-video">
            <VideoPlayer
              v-if="currentLesson.videoUrl"
              :video-url="currentLesson.videoUrl"
              :start-position="currentLessonProgress?.lastPosition || 0"
              :has-next-lesson="hasNextLesson"
              @progress="handleVideoProgress"
              @completed="handleLessonComplete"
              @next-lesson="goToNext"
            />
            <a-empty v-else description="视频资源不可用" />
          </div>

          <!-- 文本内容 -->
          <div v-else-if="currentLesson?.type === 'text'" class="lesson-text">
            <div class="text-content" v-html="currentLesson.content"></div>
            <a-button 
              v-if="!isLessonCompleted"
              type="primary" 
              size="large"
              @click="handleLessonComplete"
              class="complete-btn"
            >
              <CheckOutlined /> 标记为已完成
            </a-button>
          </div>

          <!-- 测验内容 -->
          <div v-else-if="currentLesson?.type === 'quiz'" class="lesson-quiz">
            <a-empty description="测验功能开发中..." />
          </div>

          <!-- 课时描述 -->
          <div v-if="currentLesson?.description" class="lesson-description">
            <h3>课时简介</h3>
            <p>{{ currentLesson.description }}</p>
          </div>

          <!-- 笔记面板 -->
          <div class="lesson-notes">
            <NotesPanel
              :notes="notes"
              :current-video-time="currentVideoTime"
              @save="handleSaveNote"
              @update="handleUpdateNote"
              @delete="handleDeleteNote"
            />
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  CheckOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import { useLearningStore } from '@/stores/learning'
import LessonSidebar from '@/components/LessonSidebar.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import NotesPanel from '@/components/NotesPanel.vue'

const route = useRoute()
const router = useRouter()
const learningStore = useLearningStore()

const currentVideoTime = ref(0)
const autoSaveTimer = ref<number | null>(null)

const currentCourse = computed(() => learningStore.currentCourse)
const currentLesson = computed(() => learningStore.currentLesson)
const enrollment = computed(() => learningStore.enrollment)
const notes = computed(() => learningStore.notes)
const loading = computed(() => learningStore.loading)
const isLessonCompleted = computed(() => learningStore.isLessonCompleted)
const currentLessonProgress = computed(() => learningStore.currentLessonProgress)
const courseProgress = computed(() => learningStore.courseProgress)

const hasNextLesson = computed(() => {
  const next = learningStore.goToNextLesson()
  return next !== null
})

const hasPreviousLesson = computed(() => {
  const prev = learningStore.goToPreviousLesson()
  return prev !== null
})

const navigateToLesson = (lessonId: number) => {
  const courseId = route.params.courseId as string
  router.push(`/course/${courseId}/lesson/${lessonId}`)
}

const goToNext = () => {
  const next = learningStore.goToNextLesson()
  if (next) {
    navigateToLesson(next.id)
  }
}

const goToPrevious = () => {
  const prev = learningStore.goToPreviousLesson()
  if (prev) {
    navigateToLesson(prev.id)
  }
}

const handleVideoProgress = (time: number, duration: number) => {
  currentVideoTime.value = time
  
  const courseId = parseInt(route.params.courseId as string)
  const lessonId = parseInt(route.params.lessonId as string)
  
  // 自动保存进度：延迟1秒后保存，避免频繁请求
  if (autoSaveTimer.value) {
    clearTimeout(autoSaveTimer.value)
  }
  
  autoSaveTimer.value = window.setTimeout(() => {
    learningStore.updateLessonProgress(courseId, lessonId, {
      lastPosition: time,
      watchedDuration: time
    })
  }, 1000)
}

const handleLessonComplete = async () => {
  const courseId = parseInt(route.params.courseId as string)
  const lessonId = parseInt(route.params.lessonId as string)
  
  const success = await learningStore.markLessonComplete(courseId, lessonId)
  if (success) {
    message.success('恭喜，课时已完成！')
    
    // 如果还有下一课时，询问是否继续
    if (hasNextLesson.value) {
      setTimeout(() => {
        const next = learningStore.goToNextLesson()
        if (next) {
          message.info('正在加载下一课时...')
          navigateToLesson(next.id)
        }
      }, 1000)
    }
  } else {
    message.error('标记完成失败，请重试')
  }
}

const handleSaveNote = async (content: string, timestamp?: number) => {
  const courseId = parseInt(route.params.courseId as string)
  const lessonId = parseInt(route.params.lessonId as string)
  
  const success = await learningStore.saveNewNote(courseId, lessonId, content, timestamp)
  if (success) {
    message.success('笔记保存成功')
  } else {
    message.error('笔记保存失败')
  }
}

const handleUpdateNote = async (noteId: number, content: string) => {
  const success = await learningStore.updateExistingNote(noteId, content)
  if (success) {
    message.success('笔记更新成功')
  } else {
    message.error('笔记更新失败')
  }
}

const handleDeleteNote = async (noteId: number) => {
  const success = await learningStore.deleteExistingNote(noteId)
  if (success) {
    message.success('笔记已删除')
  } else {
    message.error('删除笔记失败')
  }
}

const loadCourseAndLesson = async () => {
  const courseId = parseInt(route.params.courseId as string)
  const lessonId = parseInt(route.params.lessonId as string)

  // 加载课程信息（如果还没加载）
  if (!currentCourse.value || currentCourse.value.id !== courseId) {
    await learningStore.loadCourseDetail(courseId)
  }

  // 加载课时详情
  await learningStore.loadLessonDetail(courseId, lessonId)
  
  // 加载笔记
  await learningStore.loadNotes(courseId, lessonId)
}

onMounted(() => {
  loadCourseAndLesson()
})

watch(() => [route.params.courseId, route.params.lessonId], () => {
  if (route.name === 'course-learn') {
    loadCourseAndLesson()
  }
})
</script>

<style scoped>
.course-learn-view {
  height: calc(100vh - 64px);
  background: #f5f5f5;
}

.page-spinner {
  height: 100%;
}

.learn-container {
  height: 100%;
  display: flex;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: #fff;
}

.content-header {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.lesson-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lesson-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.lesson-nav {
  display: flex;
  gap: 8px;
}

.lesson-video {
  background: #000;
}

.lesson-text {
  padding: 32px 24px;
}

.text-content {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 16px;
  color: #374151;
}

.text-content :deep(h1),
.text-content :deep(h2),
.text-content :deep(h3) {
  margin-top: 24px;
  margin-bottom: 16px;
  color: #1f2937;
}

.text-content :deep(p) {
  margin-bottom: 16px;
}

.text-content :deep(ul),
.text-content :deep(ol) {
  margin-bottom: 16px;
  padding-left: 24px;
}

.text-content :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}

.text-content :deep(pre) {
  background: #1f2937;
  color: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.complete-btn {
  display: block;
  margin: 32px auto 0;
}

.lesson-quiz {
  padding: 32px 24px;
  text-align: center;
}

.lesson-description {
  padding: 24px;
  background: #f9fafb;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.lesson-description h3 {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.lesson-description p {
  margin: 0;
  line-height: 1.6;
  color: #6b7280;
}

.lesson-notes {
  padding: 24px;
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: transparent;
}

.main-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .course-learn-view {
    height: auto;
  }

  .learn-container {
    flex-direction: column;
    height: auto;
  }

  .content-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    position: static;
  }

  .lesson-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .lesson-title h2 {
    font-size: 20px;
  }

  .lesson-nav {
    width: 100%;
  }

  .lesson-nav button {
    flex: 1;
  }

  .text-content {
    padding: 0;
  }
}
</style>
