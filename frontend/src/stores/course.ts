import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Course, CourseChapter, CourseReview } from '@/types'

export const useCourseStore = defineStore('course', () => {
  // State
  const currentCourse = ref<Course | null>(null)
  const courses = ref<Course[]>([])
  const loading = ref(false)
  const enrolling = ref(false)

  // Getters
  const isEnrolled = computed(() => {
    // This would normally check against user's enrollments
    return currentCourse.value?.enrolledCount ? true : false
  })

  // Actions
  const fetchCourseDetail = async (courseId: number): Promise<Course | null> => {
    loading.value = true
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const courseDetail = mockCourseData.find(c => c.id === courseId)
      if (courseDetail) {
        currentCourse.value = courseDetail
        return courseDetail
      }
      return null
    } catch (error) {
      console.error('Failed to fetch course detail:', error)
      return null
    } finally {
      loading.value = false
    }
  }

  const enrollCourse = async (courseId: number): Promise<boolean> => {
    enrolling.value = true
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (currentCourse.value && currentCourse.value.id === courseId) {
        currentCourse.value.enrolledCount += 1
      }
      return true
    } catch (error) {
      console.error('Failed to enroll course:', error)
      return false
    } finally {
      enrolling.value = false
    }
  }

  const clearCurrentCourse = () => {
    currentCourse.value = null
  }

  return {
    // State
    currentCourse,
    courses,
    loading,
    enrolling,
    // Getters
    isEnrolled,
    // Actions
    fetchCourseDetail,
    enrollCourse,
    clearCurrentCourse
  }
})

// Mock course data for development
const mockCourseData: Course[] = [
  {
    id: 1,
    title: 'Vue.js 3 完整教程',
    description: '从零开始学习Vue.js 3，包含Composition API、TypeScript集成等最新特性。本课程将带你深入了解Vue 3的核心概念，包括响应式系统、组件开发、状态管理等。',
    categoryId: 1,
    difficulty: 'intermediate',
    duration: 1200, // 20 hours in minutes
    lessons: 45,
    rating: 4.8,
    enrolledCount: 1234,
    thumbnail: 'https://via.placeholder.com/400x225/1890ff/ffffff?text=Vue.js+3',
    instructorId: 1,
    instructor: '张老师',
    instructorAvatar: 'https://via.placeholder.com/80x80/1890ff/ffffff?text=Z',
    instructorBio: '资深前端开发工程师，拥有8年Vue.js开发经验，曾在多家知名互联网公司担任技术负责人。',
    price: 299,
    level: '中级',
    createdAt: '2024-01-15',
    whatYouWillLearn: [
      '掌握Vue.js 3核心概念和特性',
      '学会使用Composition API进行组件开发',
      '理解Vue 3的响应式系统原理',
      '掌握TypeScript在Vue项目中的应用',
      '学会构建复杂的单页应用',
      '掌握Vue Router和Pinia状态管理'
    ],
    prerequisites: [
      '具备HTML、CSS、JavaScript基础',
      '了解ES6+语法',
      '有基础的编程经验'
    ],
    tags: ['Vue.js', 'JavaScript', 'TypeScript', 'Frontend'],
    curriculum: [
      {
        id: 1,
        title: '第一章：Vue.js 3 入门',
        duration: 180,
        lessons: [
          { id: 1, title: '什么是Vue.js？', duration: 15, type: 'video', isFree: true },
          { id: 2, title: '开发环境搭建', duration: 20, type: 'video', isFree: true },
          { id: 3, title: '第一个Vue应用', duration: 25, type: 'video', isFree: false },
          { id: 4, title: '模板语法基础', duration: 30, type: 'video', isFree: false }
        ]
      },
      {
        id: 2,
        title: '第二章：响应式基础',
        duration: 240,
        lessons: [
          { id: 5, title: 'ref和reactive', duration: 35, type: 'video', isFree: false },
          { id: 6, title: '计算属性', duration: 30, type: 'video', isFree: false },
          { id: 7, title: '侦听器', duration: 25, type: 'video', isFree: false },
          { id: 8, title: '响应式原理', duration: 40, type: 'video', isFree: false }
        ]
      },
      {
        id: 3,
        title: '第三章：组件开发',
        duration: 360,
        lessons: [
          { id: 9, title: '组件基础', duration: 30, type: 'video', isFree: false },
          { id: 10, title: 'Props和事件', duration: 35, type: 'video', isFree: false },
          { id: 11, title: '插槽', duration: 40, type: 'video', isFree: false },
          { id: 12, title: '组件通信', duration: 45, type: 'video', isFree: false },
          { id: 13, title: '动态组件', duration: 30, type: 'video', isFree: false }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        userId: 1,
        userName: '李同学',
        userAvatar: 'https://via.placeholder.com/40x40/52c41a/ffffff?text=L',
        rating: 5,
        comment: '课程内容非常全面，老师讲解清晰，实战项目很有价值。推荐给想学Vue 3的同学！',
        createdAt: '2024-02-15'
      },
      {
        id: 2,
        userId: 2,
        userName: '王同学',
        userAvatar: 'https://via.placeholder.com/40x40/1890ff/ffffff?text=W',
        rating: 5,
        comment: '从Vue 2迁移到Vue 3，这个课程帮了我很大忙。Composition API讲解得很透彻。',
        createdAt: '2024-02-10'
      },
      {
        id: 3,
        userId: 3,
        userName: '赵同学',
        userAvatar: 'https://via.placeholder.com/40x40/faad14/ffffff?text=Z',
        rating: 4,
        comment: '整体不错，就是有些地方希望能再详细一些。不过作为入门课程已经很好了。',
        createdAt: '2024-02-08'
      }
    ]
  },
  {
    id: 2,
    title: 'React 高级开发实战',
    description: '深入学习React高级概念，包含Hook、Context、性能优化等内容',
    categoryId: 1,
    difficulty: 'advanced',
    duration: 1500,
    lessons: 38,
    rating: 4.9,
    enrolledCount: 892,
    thumbnail: 'https://via.placeholder.com/400x225/61dafb/000000?text=React',
    instructorId: 2,
    instructor: '李老师',
    instructorAvatar: 'https://via.placeholder.com/80x80/61dafb/000000?text=L',
    instructorBio: 'React专家，10年前端开发经验，开源项目贡献者。',
    price: 399,
    level: '高级',
    createdAt: '2024-01-10',
    whatYouWillLearn: [
      '掌握React Hook高级用法',
      '学会性能优化技巧',
      '理解React内部机制',
      '构建复杂的React应用'
    ],
    prerequisites: [
      '熟悉React基础',
      '掌握JavaScript ES6+',
      '有项目开发经验'
    ],
    tags: ['React', 'JavaScript', 'Redux'],
    curriculum: [],
    reviews: []
  }
]