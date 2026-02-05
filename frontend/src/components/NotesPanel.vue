<template>
  <div class="notes-panel">
    <div class="notes-header">
      <h4>
        <EditOutlined /> 学习笔记
      </h4>
      <a-button 
        type="primary" 
        size="small"
        @click="showNoteEditor = true"
      >
        <PlusOutlined /> 新建笔记
      </a-button>
    </div>

    <div class="notes-list">
      <a-empty v-if="notes.length === 0" description="暂无笔记，开始记录吧！" />
      
      <div v-for="note in notes" :key="note.id" class="note-item">
        <div class="note-header">
          <span class="note-time">
            <ClockCircleOutlined />
            {{ formatNoteTime(note) }}
          </span>
          <div class="note-actions">
            <a-button 
              type="text" 
              size="small"
              :icon="h(EditOutlined)"
              @click="editNote(note)"
            />
            <a-popconfirm
              title="确定删除这条笔记吗？"
              ok-text="确定"
              cancel-text="取消"
              @confirm="deleteNote(note.id)"
            >
              <a-button 
                type="text" 
                size="small"
                danger
                :icon="h(DeleteOutlined)"
              />
            </a-popconfirm>
          </div>
        </div>
        <div class="note-content">{{ note.content }}</div>
        <div class="note-footer">
          <span class="note-date">{{ formatDate(note.createdAt) }}</span>
        </div>
      </div>
    </div>

    <a-modal
      v-model:open="showNoteEditor"
      :title="editingNote ? '编辑笔记' : '新建笔记'"
      @ok="saveNote"
      @cancel="cancelEdit"
      width="600px"
    >
      <a-textarea
        v-model:value="noteContent"
        placeholder="在此输入笔记内容..."
        :rows="6"
        :maxlength="500"
        show-count
      />
      <div v-if="currentVideoTime" class="note-timestamp">
        <ClockCircleOutlined />
        视频时间点: {{ formatVideoTime(currentVideoTime) }}
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed } from 'vue'
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  ClockCircleOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import type { Note } from '@/types'

interface Props {
  notes: Note[]
  currentVideoTime?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentVideoTime: 0,
  loading: false
})

const emit = defineEmits<{
  'save': [content: string, timestamp?: number]
  'update': [noteId: number, content: string]
  'delete': [noteId: number]
}>()

const showNoteEditor = ref(false)
const noteContent = ref('')
const editingNote = ref<Note | null>(null)

const editNote = (note: Note) => {
  editingNote.value = note
  noteContent.value = note.content
  showNoteEditor.value = true
}

const saveNote = async () => {
  if (!noteContent.value.trim()) {
    message.warning('笔记内容不能为空')
    return
  }

  if (editingNote.value) {
    emit('update', editingNote.value.id, noteContent.value)
  } else {
    emit('save', noteContent.value, props.currentVideoTime)
  }

  cancelEdit()
}

const cancelEdit = () => {
  showNoteEditor.value = false
  noteContent.value = ''
  editingNote.value = null
}

const deleteNote = (noteId: number) => {
  emit('delete', noteId)
}

const formatNoteTime = (note: Note) => {
  if (note.timestamp !== undefined) {
    return formatVideoTime(note.timestamp)
  }
  return '文档笔记'
}

const formatVideoTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}
</script>

<style scoped>
.notes-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.notes-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notes-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.notes-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.note-item {
  background: #f9fafb;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.note-item:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.note-time {
  font-size: 12px;
  color: #1890ff;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.note-actions {
  display: flex;
  gap: 4px;
}

.note-content {
  font-size: 14px;
  color: #1f2937;
  line-height: 1.6;
  margin-bottom: 8px;
  white-space: pre-wrap;
  word-break: break-word;
}

.note-footer {
  display: flex;
  justify-content: flex-end;
}

.note-date {
  font-size: 12px;
  color: #9ca3af;
}

.note-timestamp {
  margin-top: 12px;
  padding: 8px 12px;
  background: #e6f4ff;
  border-radius: 4px;
  font-size: 13px;
  color: #1890ff;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 滚动条样式 */
.notes-list::-webkit-scrollbar {
  width: 6px;
}

.notes-list::-webkit-scrollbar-track {
  background: transparent;
}

.notes-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.notes-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .notes-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .notes-header h4 {
    justify-content: center;
  }
}
</style>
