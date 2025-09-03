<template>
  <div class="instructor-info">
    <div class="instructor-profile">
      <div class="instructor-avatar">
        <a-avatar :src="course.instructorAvatar" :size="80">
          {{ course.instructor?.charAt(0) }}
        </a-avatar>
      </div>

      <div class="instructor-details">
        <h3 class="instructor-name">{{ course.instructor }}</h3>
        <p class="instructor-title">资深前端开发工程师</p>
        <p class="instructor-bio">{{ course.instructorBio }}</p>

        <div class="instructor-stats">
          <div class="stat-item">
            <BookOutlined />
            <span>{{ instructorCourses }} 门课程</span>
          </div>
          <div class="stat-item">
            <UserOutlined />
            <span>{{ instructorStudents }} 名学员</span>
          </div>
          <div class="stat-item">
            <StarOutlined />
            <span>{{ instructorRating }} 平均评分</span>
          </div>
          <div class="stat-item">
            <TrophyOutlined />
            <span>{{ instructorExperience }} 年经验</span>
          </div>
        </div>

        <div class="instructor-actions">
          <a-button type="primary" ghost>
            <PlusOutlined />
            关注讲师
          </a-button>
          <a-button type="default">
            <MessageOutlined />
            发送消息
          </a-button>
        </div>
      </div>
    </div>

    <a-divider />

    <div class="instructor-achievements">
      <h4 class="section-title">
        <TrophyOutlined />
        专业成就
      </h4>
      <div class="achievements-grid">
        <div class="achievement-item">
          <div class="achievement-icon">
            <CrownOutlined />
          </div>
          <div class="achievement-content">
            <div class="achievement-title">金牌讲师</div>
            <div class="achievement-desc">平台认证的优秀讲师</div>
          </div>
        </div>

        <div class="achievement-item">
          <div class="achievement-icon">
            <FireOutlined />
          </div>
          <div class="achievement-content">
            <div class="achievement-title">热门课程</div>
            <div class="achievement-desc">多门课程获得学员好评</div>
          </div>
        </div>

        <div class="achievement-item">
          <div class="achievement-icon">
            <RocketOutlined />
          </div>
          <div class="achievement-content">
            <div class="achievement-title">行业专家</div>
            <div class="achievement-desc">在前端领域有丰富经验</div>
          </div>
        </div>

        <div class="achievement-item">
          <div class="achievement-icon">
            <HeartOutlined />
          </div>
          <div class="achievement-content">
            <div class="achievement-title">学员喜爱</div>
            <div class="achievement-desc">深受学员喜爱和认可</div>
          </div>
        </div>
      </div>
    </div>

    <a-divider />

    <div class="instructor-courses">
      <h4 class="section-title">
        <BookOutlined />
        讲师的其他课程
      </h4>
      <div class="other-courses">
        <div v-for="otherCourse in otherCourses" :key="otherCourse.id" class="other-course-item">
          <div class="course-thumbnail">
            <img :src="otherCourse.thumbnail" :alt="otherCourse.title" />
          </div>
          <div class="course-info">
            <h5 class="course-title">{{ otherCourse.title }}</h5>
            <div class="course-meta">
              <span class="course-rating">
                <StarFilled />
                {{ otherCourse.rating }}
              </span>
              <span class="course-students">{{ otherCourse.students }} 人学习</span>
            </div>
            <div class="course-price">
              <span v-if="otherCourse.price > 0">¥{{ otherCourse.price }}</span>
              <span v-else class="free">免费</span>
            </div>
          </div>
          <div class="course-action">
            <a-button type="primary" size="small" @click="viewCourse(otherCourse.id)">
              查看课程
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Course } from '@/types'
import { 
  BookOutlined,
  UserOutlined,
  StarOutlined,
  TrophyOutlined,
  PlusOutlined,
  MessageOutlined,
  CrownOutlined,
  FireOutlined,
  RocketOutlined,
  HeartOutlined,
  StarFilled
} from '@ant-design/icons-vue'

interface Props {
  course: Course
}

defineProps<Props>()

const router = useRouter()

// Mock instructor data
const instructorCourses = ref(8)
const instructorStudents = ref(12567)
const instructorRating = ref(4.9)
const instructorExperience = ref(8)

// Mock other courses by this instructor
const otherCourses = ref([
  {
    id: 11,
    title: 'JavaScript 高级编程',
    thumbnail: 'https://via.placeholder.com/120x80/f7df1e/000000?text=JS',
    rating: 4.7,
    students: 2345,
    price: 199
  },
  {
    id: 12,
    title: 'TypeScript 从入门到精通',
    thumbnail: 'https://via.placeholder.com/120x80/3178c6/ffffff?text=TS',
    rating: 4.8,
    students: 1876,
    price: 299
  },
  {
    id: 13,
    title: '前端工程化实战',
    thumbnail: 'https://via.placeholder.com/120x80/42b883/ffffff?text=Build',
    rating: 4.6,
    students: 987,
    price: 0
  }
])

const viewCourse = (courseId: number) => {
  router.push(`/course/${courseId}`)
}
</script>

<style scoped>
.instructor-info {
  max-width: 800px;
}

.instructor-profile {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.instructor-avatar {
  flex-shrink: 0;
}

.instructor-details {
  flex: 1;
}

.instructor-name {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.instructor-title {
  font-size: 16px;
  color: #1890ff;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.instructor-bio {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.instructor-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
}

.instructor-actions {
  display: flex;
  gap: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.achievement-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #1890ff;
  background: #e6f4ff;
  flex-shrink: 0;
}

.achievement-content {
  flex: 1;
}

.achievement-title {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.achievement-desc {
  font-size: 12px;
  color: #6b7280;
}

.other-courses {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.other-course-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

.other-course-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.course-thumbnail {
  width: 120px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-info {
  flex: 1;
  min-width: 0;
}

.course-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #6b7280;
}

.course-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #faad14;
}

.course-price {
  font-size: 16px;
  font-weight: 600;
  color: #f56a00;
}

.course-price .free {
  color: #52c41a;
}

.course-action {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .instructor-profile {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }

  .instructor-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .instructor-actions {
    justify-content: center;
  }

  .achievements-grid {
    grid-template-columns: 1fr;
  }

  .other-course-item {
    flex-direction: column;
    text-align: center;
  }

  .course-thumbnail {
    width: 200px;
    height: 133px;
  }

  .course-meta {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .instructor-stats {
    grid-template-columns: 1fr;
  }

  .instructor-actions {
    flex-direction: column;
  }

  .achievement-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .course-thumbnail {
    width: 100%;
    max-width: 300px;
  }
}
</style>