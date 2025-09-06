<template>
  <div class="course-curriculum">
    <div class="curriculum-header">
      <h3 class="curriculum-title">
        <UnorderedListOutlined />
        课程大纲
      </h3>
      <div class="curriculum-summary">
        <span>{{ totalChapters }} 个章节</span>
        <span>{{ totalLessons }} 个课时</span>
        <span>总时长 {{ formatTotalDuration() }}</span>
      </div>
    </div>

    <div class="curriculum-content">
      <a-collapse v-model:activeKey="activeKeys" class="curriculum-collapse">
        <a-collapse-panel 
          v-for="(chapter, index) in curriculum" 
          :key="chapter.id" 
          :header="getChapterHeader(chapter, index)"
          class="chapter-panel"
        >
          <template #extra>
            <span class="chapter-meta">
              {{ chapter.lessons.length }} 课时 · {{ formatDuration(chapter.duration) }}
            </span>
          </template>

          <div class="lessons-list">
            <div 
              v-for="(lesson, lessonIndex) in chapter.lessons" 
              :key="lesson.id"
              class="lesson-item"
              :class="{ 'lesson-free': lesson.isFree, 'lesson-completed': lesson.isCompleted }"
            >
              <div class="lesson-number">{{ lessonIndex + 1 }}</div>
              
              <div class="lesson-icon">
                <PlayCircleOutlined v-if="lesson.type === 'video'" class="video-icon" />
                <FileTextOutlined v-else-if="lesson.type === 'text'" class="text-icon" />
                <QuestionCircleOutlined v-else class="quiz-icon" />
              </div>

              <div class="lesson-content">
                <div class="lesson-title">{{ lesson.title }}</div>
                <div class="lesson-meta">
                  <span class="lesson-type">{{ getLessonTypeText(lesson.type) }}</span>
                  <span class="lesson-duration">{{ formatDuration(lesson.duration) }}</span>
                  <span v-if="lesson.isFree" class="lesson-free-badge">免费试看</span>
                </div>
              </div>

              <div class="lesson-status">
                <CheckCircleOutlined v-if="lesson.isCompleted" class="completed-icon" />
                <LockOutlined v-else-if="!lesson.isFree" class="locked-icon" />
                <PlayCircleOutlined v-else class="play-icon" />
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CourseChapter } from '@/types'
import { 
  UnorderedListOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  LockOutlined
} from '@ant-design/icons-vue'

interface Props {
  curriculum: CourseChapter[]
}

const props = defineProps<Props>()

// Initially expand first chapter
const activeKeys = ref<number[]>([1])

const totalChapters = computed(() => props.curriculum.length)
const totalLessons = computed(() => 
  props.curriculum.reduce((total, chapter) => total + chapter.lessons.length, 0)
)

const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }
  return `${mins}分钟`
}

const formatTotalDuration = (): string => {
  const totalMinutes = props.curriculum.reduce((total, chapter) => total + chapter.duration, 0)
  return formatDuration(totalMinutes)
}

const getChapterHeader = (chapter: CourseChapter, index: number): string => {
  return `第${index + 1}章：${chapter.title}`
}

const getLessonTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    'video': '视频',
    'text': '文档',
    'quiz': '测验'
  }
  return typeMap[type] || '课程'
}
</script>

<style scoped>
.course-curriculum {
  max-width: 900px;
}

.curriculum-header {
  margin-bottom: 24px;
}

.curriculum-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.curriculum-summary {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #6b7280;
}

.curriculum-collapse {
  border: none;
  background: transparent;
}

.chapter-panel {
  margin-bottom: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.curriculum-collapse :deep(.ant-collapse-header) {
  padding: 16px 20px;
  background: #f9fafb;
  font-weight: 600;
  color: #1f2937;
}

.curriculum-collapse :deep(.ant-collapse-content) {
  border-top: 1px solid #e5e7eb;
}

.curriculum-collapse :deep(.ant-collapse-content-box) {
  padding: 0;
}

.chapter-meta {
  font-size: 12px;
  color: #6b7280;
  font-weight: normal;
}

.lessons-list {
  background: white;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #f3f4f6;
  transition: background-color 0.2s;
  cursor: pointer;
}

.lesson-item:hover {
  background-color: #f9fafb;
}

.lesson-item:last-child {
  border-bottom: none;
}

.lesson-item.lesson-free {
  border-left: 3px solid #52c41a;
}

.lesson-item.lesson-completed {
  background-color: #f6ffed;
  border-left: 3px solid #52c41a;
}

.lesson-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #f0f0f0;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  flex-shrink: 0;
}

.lesson-icon {
  flex-shrink: 0;
}

.video-icon {
  color: #1890ff;
  font-size: 18px;
}

.text-icon {
  color: #fa8c16;
  font-size: 18px;
}

.quiz-icon {
  color: #722ed1;
  font-size: 18px;
}

.lesson-content {
  flex: 1;
  min-width: 0;
}

.lesson-title {
  font-size: 15px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.4;
}

.lesson-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.lesson-free-badge {
  background: #f6ffed;
  color: #52c41a;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 500;
}

.lesson-status {
  flex-shrink: 0;
}

.completed-icon {
  color: #52c41a;
  font-size: 18px;
}

.locked-icon {
  color: #d9d9d9;
  font-size: 16px;
}

.play-icon {
  color: #1890ff;
  font-size: 16px;
}

@media (max-width: 768px) {
  .curriculum-summary {
    flex-direction: column;
    gap: 8px;
  }

  .curriculum-collapse :deep(.ant-collapse-header) {
    padding: 12px 16px;
    font-size: 14px;
  }

  .lesson-item {
    padding: 12px 16px;
    gap: 12px;
  }

  .lesson-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .chapter-meta {
    display: none;
  }
}

@media (max-width: 480px) {
  .lesson-number {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }

  .lesson-title {
    font-size: 14px;
  }

  .video-icon,
  .text-icon,
  .quiz-icon {
    font-size: 16px;
  }
}
</style>