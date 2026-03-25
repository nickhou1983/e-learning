<template>
  <div class="downloads-page">
    <div class="page-header">
      <h1>我的下载</h1>
      <p>管理您下载的课程资料</p>
    </div>

    <div class="downloads-content">
      <a-empty v-if="downloads.length === 0" description="暂无下载内容">
        <template #image>
          <DownloadOutlined style="font-size: 48px; color: #d9d9d9;" />
        </template>
        <a-button type="primary" @click="$router.push('/catalog')">浏览课程</a-button>
      </a-empty>

      <div v-else class="downloads-list">
        <div v-for="item in downloads" :key="item.id" class="download-item">
          <div class="download-icon">
            <FileOutlined style="font-size: 24px; color: #1890ff;" />
          </div>
          <div class="download-info">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
            <span class="download-meta">{{ item.size }} · {{ item.date }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DownloadOutlined, FileOutlined } from '@ant-design/icons-vue'

interface DownloadItem {
  id: string
  name: string
  description: string
  size: string
  date: string
}

const downloads = ref<DownloadItem[]>([])
</script>

<style scoped>
.downloads-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-header p {
  color: #666;
  font-size: 14px;
}

.downloads-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.download-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.download-info h3 {
  margin: 0 0 4px;
  font-size: 15px;
}

.download-info p {
  margin: 0 0 4px;
  color: #666;
  font-size: 13px;
}

.download-meta {
  color: #999;
  font-size: 12px;
}
</style>
