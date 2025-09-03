<template>
  <div class="catalog-page">
    <div class="page-header">
      <h1>课程目录</h1>
      <p>发现适合您的课程</p>
    </div>

    <div class="search-filters">
      <div class="search-section">
        <a-input-search
          v-model:value="searchQuery"
          placeholder="搜索课程..."
          size="large"
          @search="handleSearch"
          style="max-width: 400px;"
        />
      </div>

      <div class="filter-section">
        <a-select
          v-model:value="selectedCategory"
          placeholder="选择分类"
          style="width: 160px; margin-right: 16px;"
          @change="handleCategoryChange"
        >
          <a-select-option value="">全部分类</a-select-option>
          <a-select-option value="frontend">前端开发</a-select-option>
          <a-select-option value="backend">后端开发</a-select-option>
          <a-select-option value="mobile">移动开发</a-select-option>
          <a-select-option value="data">数据科学</a-select-option>
          <a-select-option value="design">设计</a-select-option>
        </a-select>

        <a-select
          v-model:value="selectedLevel"
          placeholder="难度等级"
          style="width: 120px; margin-right: 16px;"
          @change="handleLevelChange"
        >
          <a-select-option value="">全部等级</a-select-option>
          <a-select-option value="beginner">初级</a-select-option>
          <a-select-option value="intermediate">中级</a-select-option>
          <a-select-option value="advanced">高级</a-select-option>
        </a-select>

        <a-select
          v-model:value="sortBy"
          placeholder="排序方式"
          style="width: 140px;"
          @change="handleSortChange"
        >
          <a-select-option value="newest">最新发布</a-select-option>
          <a-select-option value="popular">最受欢迎</a-select-option>
          <a-select-option value="rating">评分最高</a-select-option>
          <a-select-option value="price">价格从低到高</a-select-option>
        </a-select>
      </div>
    </div>

    <div class="course-list">
      <div v-for="course in filteredCourses" :key="course.id" class="course-item">
        <div class="course-thumbnail">
          <img :src="course.thumbnail" :alt="course.title" />
          <div class="course-level">{{ course.levelText }}</div>
        </div>
        
        <div class="course-info">
          <div class="course-header">
            <h3>{{ course.title }}</h3>
            <div class="course-price">
              <span v-if="course.price > 0" class="price">¥{{ course.price }}</span>
              <span v-else class="free">免费</span>
            </div>
          </div>
          
          <p class="course-description">{{ course.description }}</p>
          
          <div class="course-meta">
            <span class="instructor">
              <UserOutlined />
              {{ course.instructor }}
            </span>
            <span class="duration">
              <ClockCircleOutlined />
              {{ course.duration }}
            </span>
            <span class="students">
              <TeamOutlined />
              {{ course.students }}人已学
            </span>
            <span class="rating">
              <StarFilled />
              {{ course.rating }}
            </span>
          </div>
          
          <div class="course-tags">
            <a-tag v-for="tag in course.tags" :key="tag" color="blue">
              {{ tag }}
            </a-tag>
          </div>
        </div>
        
        <div class="course-actions">
          <a-button 
            type="primary" 
            size="large"
            @click="enrollCourse(course.id)"
            :loading="enrollingCourses.includes(course.id)"
          >
            {{ course.enrolled ? '已报名' : '立即报名' }}
          </a-button>
          <a-button 
            type="default" 
            size="large"
            @click="viewCourseDetail(course.id)"
          >
            查看详情
          </a-button>
        </div>
      </div>
    </div>

    <div class="pagination-wrapper">
      <a-pagination
        v-model:current="currentPage"
        :total="totalCourses"
        :page-size="pageSize"
        show-size-changer
        show-quick-jumper
        :show-total="(total: number, range: [number, number]) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`"
        @change="handlePageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  UserOutlined, 
  ClockCircleOutlined, 
  TeamOutlined, 
  StarFilled 
} from '@ant-design/icons-vue'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedLevel = ref('')
const sortBy = ref('newest')
const currentPage = ref(1)
const pageSize = ref(10)
const enrollingCourses = ref<number[]>([])

// 模拟课程数据
const courses = ref([
  {
    id: 1,
    title: 'Vue.js 3 完整教程',
    description: '从零开始学习Vue.js 3，包含Composition API、TypeScript集成等最新特性',
    instructor: '张老师',
    category: 'frontend',
    level: 'intermediate',
    levelText: '中级',
    duration: '20小时',
    price: 299,
    rating: 4.8,
    students: 1234,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/200x120/1890ff/ffffff?text=Vue.js',
    tags: ['Vue.js', 'JavaScript', 'TypeScript']
  },
  {
    id: 2,
    title: 'React 高级开发实战',
    description: '深入学习React高级概念，包含Hook、Context、性能优化等内容',
    instructor: '李老师',
    category: 'frontend',
    level: 'advanced',
    levelText: '高级',
    duration: '25小时',
    price: 399,
    rating: 4.9,
    students: 892,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/200x120/61dafb/000000?text=React',
    tags: ['React', 'JavaScript', 'Redux']
  },
  {
    id: 3,
    title: 'Node.js 后端开发',
    description: '使用Node.js构建现代化的后端服务，包含Express、数据库集成等',
    instructor: '王老师',
    category: 'backend',
    level: 'intermediate',
    levelText: '中级',
    duration: '30小时',
    price: 0,
    rating: 4.7,
    students: 567,
    enrolled: true,
    thumbnail: 'https://via.placeholder.com/200x120/339933/ffffff?text=Node.js',
    tags: ['Node.js', 'Express', 'MongoDB']
  },
  {
    id: 4,
    title: 'Python 数据分析',
    description: '使用Python进行数据分析，掌握pandas、numpy、matplotlib等工具',
    instructor: '赵老师',
    category: 'data',
    level: 'beginner',
    levelText: '初级',
    duration: '18小时',
    price: 199,
    rating: 4.6,
    students: 2145,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/200x120/3776ab/ffffff?text=Python',
    tags: ['Python', 'Pandas', 'NumPy']
  },
  {
    id: 5,
    title: 'UI/UX 设计基础',
    description: '学习现代化的UI/UX设计原则，使用Figma进行设计实践',
    instructor: '周老师',
    category: 'design',
    level: 'beginner',
    levelText: '初级',
    duration: '15小时',
    price: 159,
    rating: 4.5,
    students: 789,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/200x120/f24e1e/ffffff?text=Design',
    tags: ['UI', 'UX', 'Figma']
  },
  {
    id: 6,
    title: 'Flutter 移动开发',
    description: '使用Flutter构建跨平台移动应用，从基础到高级特性',
    instructor: '孙老师',
    category: 'mobile',
    level: 'intermediate',
    levelText: '中级',
    duration: '22小时',
    price: 349,
    rating: 4.8,
    students: 456,
    enrolled: false,
    thumbnail: 'https://via.placeholder.com/200x120/02569b/ffffff?text=Flutter',
    tags: ['Flutter', 'Dart', 'Mobile']
  }
])

// 计算属性
const filteredCourses = computed(() => {
  let filtered = courses.value

  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered.filter(course => 
      course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 分类过滤
  if (selectedCategory.value) {
    filtered = filtered.filter(course => course.category === selectedCategory.value)
  }

  // 等级过滤
  if (selectedLevel.value) {
    filtered = filtered.filter(course => course.level === selectedLevel.value)
  }

  // 排序
  switch (sortBy.value) {
    case 'popular':
      filtered.sort((a, b) => b.students - a.students)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'price':
      filtered.sort((a, b) => a.price - b.price)
      break
    default: // newest
      filtered.sort((a, b) => b.id - a.id)
  }

  return filtered
})

const totalCourses = computed(() => filteredCourses.value.length)

// 方法
const handleSearch = (value: string) => {
  searchQuery.value = value
  currentPage.value = 1
}

const handleCategoryChange = () => {
  currentPage.value = 1
}

const handleLevelChange = () => {
  currentPage.value = 1
}

const handleSortChange = () => {
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
}

const enrollCourse = async (courseId: number) => {
  enrollingCourses.value.push(courseId)
  
  // 模拟API调用
  setTimeout(() => {
    const course = courses.value.find(c => c.id === courseId)
    if (course) {
      course.enrolled = true
      course.students += 1
    }
    enrollingCourses.value = enrollingCourses.value.filter(id => id !== courseId)
  }, 1000)
}

const viewCourseDetail = (courseId: number) => {
  router.push(`/course/${courseId}`)
}

onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.catalog-page {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.page-header p {
  color: #6b7280;
  margin: 0;
}

.search-filters {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.search-section {
  margin-bottom: 16px;
}

.filter-section {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.course-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.course-item {
  display: flex;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.course-item:hover {
  background-color: #fafafa;
}

.course-item:last-child {
  border-bottom: none;
}

.course-thumbnail {
  position: relative;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 24px;
  flex-shrink: 0;
}

.course-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-level {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.course-info {
  flex: 1;
  margin-right: 24px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.course-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.3;
}

.course-price .price {
  font-size: 20px;
  font-weight: 600;
  color: #f56a00;
}

.course-price .free {
  font-size: 16px;
  font-weight: 600;
  color: #52c41a;
}

.course-description {
  color: #6b7280;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.course-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #6b7280;
}

.course-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.course-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 120px;
  flex-shrink: 0;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

@media (max-width: 768px) {
  .course-item {
    flex-direction: column;
  }

  .course-thumbnail {
    width: 100%;
    margin-right: 0;
    margin-bottom: 16px;
  }

  .course-info {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .course-actions {
    width: 100%;
    flex-direction: row;
  }

  .filter-section {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section > * {
    width: 100% !important;
    margin-right: 0 !important;
  }
}
</style>
