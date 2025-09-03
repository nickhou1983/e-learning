<template>
  <div class="course-tabs">
    <a-tabs 
      v-model:activeKey="activeTab" 
      size="large"
      @change="handleTabChange"
    >
      <a-tab-pane key="description" tab="课程介绍">
        <CourseDescription :course="course" />
      </a-tab-pane>
      
      <a-tab-pane key="curriculum" tab="课程大纲">
        <CourseCurriculum :curriculum="course.curriculum || []" />
      </a-tab-pane>
      
      <a-tab-pane key="reviews" tab="学员评价">
        <CourseReviews :reviews="course.reviews || []" :rating="course.rating" />
      </a-tab-pane>
      
      <a-tab-pane key="instructor" tab="讲师介绍">
        <InstructorInfo :course="course" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Course } from '@/types'
import CourseDescription from './CourseDescription.vue'
import CourseCurriculum from './CourseCurriculum.vue'
import CourseReviews from './CourseReviews.vue'
import InstructorInfo from './InstructorInfo.vue'

interface Props {
  course: Course
  activeTab: string
}

interface Emits {
  (e: 'tab-change', tab: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeTab = ref(props.activeTab)

const handleTabChange = (tab: string) => {
  emit('tab-change', tab)
}

// Watch for external tab changes
watch(() => props.activeTab, (newTab) => {
  activeTab.value = newTab
})
</script>

<style scoped>
.course-tabs {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.course-tabs :deep(.ant-tabs-nav) {
  margin: 0;
  padding: 0 32px;
}

.course-tabs :deep(.ant-tabs-tab) {
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 500;
}

.course-tabs :deep(.ant-tabs-content-holder) {
  padding: 0;
}

.course-tabs :deep(.ant-tabs-tabpane) {
  padding: 32px;
}

@media (max-width: 768px) {
  .course-tabs :deep(.ant-tabs-nav) {
    padding: 0 16px;
  }

  .course-tabs :deep(.ant-tabs-tab) {
    padding: 12px 16px;
    font-size: 14px;
  }

  .course-tabs :deep(.ant-tabs-tabpane) {
    padding: 20px 16px;
  }
}
</style>