<template>
  <div class="course-detail-page">
    <a-spin :spinning="loading" size="large">
      <div v-if="course" class="course-detail-content">
        <!-- Course Header -->
        <CourseHeader 
          :course="course"
          :is-enrolled="isEnrolled"
          :enrolling="enrolling"
          @enroll="handleEnroll"
        />

        <!-- Course Tabs -->
        <CourseTabs 
          :course="course"
          :active-tab="activeTab"
          @tab-change="handleTabChange"
        />
      </div>

      <div v-else-if="!loading" class="course-not-found">
        <a-result
          status="404"
          title="课程未找到"
          sub-title="抱歉，您访问的课程不存在或已被删除"
        >
          <template #extra>
            <a-button type="primary" @click="$router.push('/catalog')">
              返回课程目录
            </a-button>
          </template>
        </a-result>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { useCourseStore } from '@/stores/course'
import CourseHeader from '@/components/course/CourseHeader.vue'
import CourseTabs from '@/components/course/CourseTabs.vue'

const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

// Reactive data
const activeTab = ref('description')

// Computed properties
const course = computed(() => courseStore.currentCourse)
const loading = computed(() => courseStore.loading)
const enrolling = computed(() => courseStore.enrolling)
const isEnrolled = computed(() => courseStore.isEnrolled)

// Methods
const handleTabChange = (tab: string) => {
  activeTab.value = tab
}

const handleEnroll = async () => {
  if (!course.value) return

  const success = await courseStore.enrollCourse(course.value.id)
  if (success) {
    message.success('报名成功！')
  } else {
    message.error('报名失败，请稍后重试')
  }
}

// Lifecycle
onMounted(async () => {
  const courseId = Number(route.params.id)
  if (isNaN(courseId)) {
    router.push('/catalog')
    return
  }

  const courseDetail = await courseStore.fetchCourseDetail(courseId)
  if (!courseDetail) {
    // Course not found, component will show 404 result
  }
})
</script>

<style scoped>
.course-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.course-detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.course-not-found {
  padding: 50px 0;
}

@media (max-width: 768px) {
  .course-detail-content {
    padding: 0 12px;
  }
}
</style>