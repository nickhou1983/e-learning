import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CourseDetail, Lesson, Note, LessonProgress, Enrollment } from '@/types'
import * as api from '@/utils/api'

export const useLearningStore = defineStore('learning', () => {
  // 状态
  const currentCourse = ref<CourseDetail | null>(null)
  const currentLesson = ref<Lesson | null>(null)
  const enrollment = ref<Enrollment | null>(null)
  const notes = ref<Note[]>([])
  const lessonProgress = ref<Record<number, LessonProgress>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const isLessonCompleted = computed(() => {
    if (!currentLesson.value || !enrollment.value) return false
    return enrollment.value.completedLessons.includes(currentLesson.value.id)
  })

  const currentLessonProgress = computed(() => {
    if (!currentLesson.value) return null
    return lessonProgress.value[currentLesson.value.id] || null
  })

  const courseProgress = computed(() => {
    return enrollment.value?.progress || 0
  })

  // 加载课程详情
  const loadCourseDetail = async (courseId: number) => {
    loading.value = true
    error.value = null

    try {
      const [courseRes, lessonsRes, enrollmentRes] = await Promise.all([
        api.getCourseDetail(courseId),
        api.getCourseLessons(courseId),
        api.getEnrollment(courseId)
      ])

      if (courseRes.success && courseRes.data) {
        currentCourse.value = {
          ...courseRes.data,
          lessons: lessonsRes.success && lessonsRes.data ? lessonsRes.data : []
        }
      } else {
        error.value = courseRes.message || '加载课程失败'
      }

      if (enrollmentRes.success && enrollmentRes.data) {
        enrollment.value = enrollmentRes.data
      }
    } catch (err: any) {
      error.value = err.message || '加载课程详情失败'
      console.error('加载课程详情错误:', err)
    } finally {
      loading.value = false
    }
  }

  // 加载课时详情
  const loadLessonDetail = async (courseId: number, lessonId: number) => {
    loading.value = true
    error.value = null

    try {
      const res = await api.getLessonDetail(courseId, lessonId)
      if (res.success && res.data) {
        currentLesson.value = res.data
        
        // 初始化进度
        if (!lessonProgress.value[lessonId]) {
          lessonProgress.value[lessonId] = {
            lessonId,
            completed: false,
            watchedDuration: 0,
            lastPosition: 0
          }
        }
      } else {
        error.value = res.message || '加载课时失败'
      }
    } catch (err: any) {
      error.value = err.message || '加载课时详情失败'
      console.error('加载课时详情错误:', err)
    } finally {
      loading.value = false
    }
  }

  // 更新学习进度
  const updateLessonProgress = async (
    courseId: number,
    lessonId: number,
    progress: Partial<LessonProgress>
  ) => {
    const current = lessonProgress.value[lessonId] || {
      lessonId,
      completed: false,
      watchedDuration: 0,
      lastPosition: 0
    }

    const updated = { ...current, ...progress }
    lessonProgress.value[lessonId] = updated

    // 发送到服务器
    try {
      await api.updateProgress(courseId, lessonId, updated)
    } catch (err) {
      console.error('更新进度失败:', err)
    }
  }

  // 完成课时
  const markLessonComplete = async (courseId: number, lessonId: number) => {
    try {
      const res = await api.completeLesson(courseId, lessonId)
      if (res.success && enrollment.value) {
        // 更新本地状态
        if (!enrollment.value.completedLessons.includes(lessonId)) {
          enrollment.value.completedLessons.push(lessonId)
        }
        
        // 更新课程进度
        if (currentCourse.value) {
          const totalLessons = currentCourse.value.lessons.length
          const completedCount = enrollment.value.completedLessons.length
          enrollment.value.progress = Math.round((completedCount / totalLessons) * 100)
        }

        // 更新课时进度
        if (lessonProgress.value[lessonId]) {
          lessonProgress.value[lessonId].completed = true
        }
      }
      return res.success
    } catch (err) {
      console.error('标记完成失败:', err)
      return false
    }
  }

  // 加载笔记
  const loadNotes = async (courseId: number, lessonId?: number) => {
    try {
      const res = await api.getNotes(courseId, lessonId)
      if (res.success && res.data) {
        notes.value = res.data
      }
    } catch (err) {
      console.error('加载笔记失败:', err)
    }
  }

  // 保存笔记
  const saveNewNote = async (
    courseId: number,
    lessonId: number,
    content: string,
    timestamp?: number
  ) => {
    try {
      const res = await api.saveNote(courseId, lessonId, content, timestamp)
      if (res.success && res.data) {
        notes.value.push(res.data)
        return true
      }
      return false
    } catch (err) {
      console.error('保存笔记失败:', err)
      return false
    }
  }

  // 更新笔记
  const updateExistingNote = async (noteId: number, content: string) => {
    try {
      const res = await api.updateNote(noteId, content)
      if (res.success && res.data) {
        const index = notes.value.findIndex(n => n.id === noteId)
        if (index !== -1) {
          notes.value[index] = res.data
        }
        return true
      }
      return false
    } catch (err) {
      console.error('更新笔记失败:', err)
      return false
    }
  }

  // 删除笔记
  const deleteExistingNote = async (noteId: number) => {
    try {
      const res = await api.deleteNote(noteId)
      if (res.success) {
        notes.value = notes.value.filter(n => n.id !== noteId)
        return true
      }
      return false
    } catch (err) {
      console.error('删除笔记失败:', err)
      return false
    }
  }

  // 切换到下一课时
  const goToNextLesson = () => {
    if (!currentCourse.value || !currentLesson.value) return null
    
    const currentIndex = currentCourse.value.lessons.findIndex(
      l => l.id === currentLesson.value!.id
    )
    
    if (currentIndex >= 0 && currentIndex < currentCourse.value.lessons.length - 1) {
      return currentCourse.value.lessons[currentIndex + 1]
    }
    
    return null
  }

  // 切换到上一课时
  const goToPreviousLesson = () => {
    if (!currentCourse.value || !currentLesson.value) return null
    
    const currentIndex = currentCourse.value.lessons.findIndex(
      l => l.id === currentLesson.value!.id
    )
    
    if (currentIndex > 0) {
      return currentCourse.value.lessons[currentIndex - 1]
    }
    
    return null
  }

  // 重置状态
  const reset = () => {
    currentCourse.value = null
    currentLesson.value = null
    enrollment.value = null
    notes.value = []
    lessonProgress.value = {}
    loading.value = false
    error.value = null
  }

  return {
    // 状态
    currentCourse,
    currentLesson,
    enrollment,
    notes,
    lessonProgress,
    loading,
    error,
    
    // 计算属性
    isLessonCompleted,
    currentLessonProgress,
    courseProgress,
    
    // 方法
    loadCourseDetail,
    loadLessonDetail,
    updateLessonProgress,
    markLessonComplete,
    loadNotes,
    saveNewNote,
    updateExistingNote,
    deleteExistingNote,
    goToNextLesson,
    goToPreviousLesson,
    reset
  }
})
