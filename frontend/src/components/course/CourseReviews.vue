<template>
  <div class="course-reviews">
    <div class="reviews-header">
      <h3 class="reviews-title">
        <StarOutlined />
        学员评价
      </h3>
      
      <div class="rating-summary">
        <div class="overall-rating">
          <div class="rating-score">{{ rating }}</div>
          <div class="rating-stars">
            <a-rate :value="rating" :disabled="true" :allow-half="true" />
          </div>
          <div class="rating-count">基于 {{ reviews.length }} 条评价</div>
        </div>

        <div class="rating-distribution">
          <div v-for="star in [5, 4, 3, 2, 1]" :key="star" class="distribution-item">
            <span class="star-label">{{ star }} 星</span>
            <div class="progress-bar">
              <div 
                class="progress-fill" 
                :style="{ width: `${getRatingPercentage(star)}%` }"
              ></div>
            </div>
            <span class="percentage">{{ getRatingPercentage(star) }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="reviews-list">
      <div v-if="reviews.length === 0" class="no-reviews">
        <a-empty description="暂无评价" />
      </div>

      <div v-else>
        <div v-for="review in displayedReviews" :key="review.id" class="review-item">
          <div class="review-avatar">
            <a-avatar :src="review.userAvatar" :size="48">
              {{ review.userName.charAt(0) }}
            </a-avatar>
          </div>

          <div class="review-content">
            <div class="review-header">
              <div class="reviewer-info">
                <span class="reviewer-name">{{ review.userName }}</span>
                <span class="review-date">{{ formatDate(review.createdAt) }}</span>
              </div>
              <a-rate :value="review.rating" :disabled="true" class="review-rating" />
            </div>

            <p class="review-comment">{{ review.comment }}</p>

            <div class="review-actions">
              <a-button type="text" size="small">
                <LikeOutlined />
                有用
              </a-button>
              <a-button type="text" size="small">
                <MessageOutlined />
                回复
              </a-button>
            </div>
          </div>
        </div>

        <div v-if="reviews.length > displayCount" class="load-more">
          <a-button @click="loadMore" :loading="loadingMore">
            查看更多评价
          </a-button>
        </div>
      </div>
    </div>

    <!-- Write Review Section -->
    <div class="write-review">
      <a-divider />
      <h4>写下您的评价</h4>
      <a-form layout="vertical" @finish="submitReview">
        <a-form-item label="评分" name="rating">
          <a-rate v-model:value="newReview.rating" />
        </a-form-item>
        
        <a-form-item label="评价内容" name="comment">
          <a-textarea 
            v-model:value="newReview.comment"
            :rows="4"
            placeholder="分享您的学习体验..."
            :maxlength="500"
            show-count
          />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="submitting">
            提交评价
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { CourseReview } from '@/types'
import { 
  StarOutlined,
  LikeOutlined,
  MessageOutlined
} from '@ant-design/icons-vue'

interface Props {
  reviews: CourseReview[]
  rating: number
}

const props = defineProps<Props>()

const displayCount = ref(5)
const loadingMore = ref(false)
const submitting = ref(false)

const newReview = ref({
  rating: 5,
  comment: ''
})

const displayedReviews = computed(() => 
  props.reviews.slice(0, displayCount.value)
)

const getRatingPercentage = (star: number): number => {
  if (props.reviews.length === 0) return 0
  
  const count = props.reviews.filter(review => review.rating === star).length
  return Math.round((count / props.reviews.length) * 100)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadMore = () => {
  loadingMore.value = true
  
  setTimeout(() => {
    displayCount.value += 5
    loadingMore.value = false
  }, 500)
}

const submitReview = async () => {
  if (!newReview.value.comment.trim()) {
    message.error('请填写评价内容')
    return
  }

  submitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    message.success('评价提交成功！')
    newReview.value = { rating: 5, comment: '' }
  } catch (error) {
    message.error('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.course-reviews {
  max-width: 800px;
}

.reviews-header {
  margin-bottom: 32px;
}

.reviews-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.rating-summary {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
}

.overall-rating {
  text-align: center;
  padding: 24px;
  background: #fafafa;
  border-radius: 8px;
}

.rating-score {
  font-size: 48px;
  font-weight: 700;
  color: #faad14;
  line-height: 1;
}

.rating-stars {
  margin: 8px 0;
}

.rating-count {
  font-size: 14px;
  color: #6b7280;
}

.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}

.distribution-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.star-label {
  width: 40px;
  font-size: 14px;
  color: #6b7280;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #faad14;
  transition: width 0.3s ease;
}

.percentage {
  width: 40px;
  text-align: right;
  font-size: 12px;
  color: #6b7280;
}

.reviews-list {
  margin-bottom: 40px;
}

.review-item {
  display: flex;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.review-item:last-child {
  border-bottom: none;
}

.review-avatar {
  flex-shrink: 0;
}

.review-content {
  flex: 1;
  min-width: 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.reviewer-name {
  font-weight: 600;
  color: #1f2937;
}

.review-date {
  font-size: 12px;
  color: #6b7280;
}

.review-rating {
  font-size: 14px;
}

.review-comment {
  color: #4b5563;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.review-actions {
  display: flex;
  gap: 8px;
}

.load-more {
  text-align: center;
  margin-top: 24px;
}

.write-review {
  background: #fafafa;
  padding: 24px;
  border-radius: 8px;
}

.write-review h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.no-reviews {
  text-align: center;
  padding: 40px 0;
}

@media (max-width: 768px) {
  .rating-summary {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .overall-rating {
    padding: 20px;
  }

  .rating-score {
    font-size: 36px;
  }

  .review-header {
    flex-direction: column;
    gap: 8px;
  }

  .review-item {
    padding: 16px 0;
  }

  .write-review {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .review-item {
    flex-direction: column;
    gap: 12px;
  }

  .distribution-item {
    gap: 8px;
  }

  .star-label {
    width: 35px;
    font-size: 12px;
  }

  .percentage {
    width: 35px;
  }
}
</style>