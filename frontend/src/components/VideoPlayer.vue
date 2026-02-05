<template>
  <div class="video-player-wrapper">
    <div class="video-container" ref="videoContainer">
      <video
        ref="videoElement"
        class="video-element"
        :src="videoUrl"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @play="isPlaying = true"
        @pause="isPlaying = false"
        @ended="onEnded"
        @click="togglePlay"
      >
        您的浏览器不支持视频播放
      </video>

      <div class="video-controls" :class="{ 'visible': showControls || !isPlaying }">
        <div class="progress-bar" @click="seek">
          <div class="progress-buffered"></div>
          <div class="progress-played" :style="{ width: progressPercent + '%' }"></div>
          <div class="progress-handle" :style="{ left: progressPercent + '%' }"></div>
        </div>

        <div class="controls-bottom">
          <div class="controls-left">
            <a-button 
              type="text" 
              :icon="h(isPlaying ? PauseCircleOutlined : PlayCircleOutlined)"
              @click="togglePlay"
              class="control-btn"
            />
            <span class="time-display">{{ currentTimeText }} / {{ durationText }}</span>
          </div>

          <div class="controls-right">
            <a-dropdown :trigger="['click']">
              <a-button type="text" class="control-btn">
                {{ playbackRate }}x
              </a-button>
              <template #overlay>
                <a-menu @click="changePlaybackRate">
                  <a-menu-item key="0.5">0.5x</a-menu-item>
                  <a-menu-item key="0.75">0.75x</a-menu-item>
                  <a-menu-item key="1">1x 正常</a-menu-item>
                  <a-menu-item key="1.25">1.25x</a-menu-item>
                  <a-menu-item key="1.5">1.5x</a-menu-item>
                  <a-menu-item key="2">2x</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>

            <a-button 
              type="text" 
              :icon="h(isMuted ? SoundOutlined : SoundFilled)"
              @click="toggleMute"
              class="control-btn"
            />

            <a-button 
              type="text" 
              :icon="h(isFullscreen ? FullscreenExitOutlined : FullscreenOutlined)"
              @click="toggleFullscreen"
              class="control-btn"
            />
          </div>
        </div>
      </div>

      <div v-if="!isPlaying && !isEnded" class="play-overlay" @click="togglePlay">
        <PlayCircleOutlined class="play-icon" />
      </div>

      <div v-if="isEnded" class="ended-overlay">
        <div class="ended-content">
          <CheckCircleOutlined class="completed-icon" />
          <h3>课程已完成</h3>
          <div class="ended-actions">
            <a-button type="primary" @click="replay">
              <RedoOutlined /> 重新播放
            </a-button>
            <a-button v-if="hasNextLesson" @click="$emit('next-lesson')">
              下一课时 <ArrowRightOutlined />
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { h, ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  SoundOutlined,
  SoundFilled,
  FullscreenOutlined,
  FullscreenExitOutlined,
  CheckCircleOutlined,
  RedoOutlined,
  ArrowRightOutlined
} from '@ant-design/icons-vue'

interface Props {
  videoUrl: string
  startPosition?: number
  hasNextLesson?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  startPosition: 0,
  hasNextLesson: false
})

const emit = defineEmits<{
  'progress': [time: number, duration: number]
  'completed': []
  'next-lesson': []
}>()

const videoElement = ref<HTMLVideoElement | null>(null)
const videoContainer = ref<HTMLDivElement | null>(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const showControls = ref(false)
const playbackRate = ref(1)
const isMuted = ref(false)
const isFullscreen = ref(false)
const isEnded = ref(false)
const lastProgressTime = ref(0)
let controlsTimeout: number | null = null

const progressPercent = computed(() => {
  if (duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

const currentTimeText = computed(() => formatTime(currentTime.value))
const durationText = computed(() => formatTime(duration.value))

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const togglePlay = () => {
  if (!videoElement.value) return
  
  if (isEnded.value) {
    replay()
    return
  }

  if (isPlaying.value) {
    videoElement.value.pause()
  } else {
    videoElement.value.play()
  }
}

const seek = (event: MouseEvent) => {
  if (!videoElement.value || !videoContainer.value) return
  
  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  videoElement.value.currentTime = percent * duration.value
}

const changePlaybackRate = ({ key }: { key: string }) => {
  if (!videoElement.value) return
  const rate = parseFloat(key)
  videoElement.value.playbackRate = rate
  playbackRate.value = rate
}

const toggleMute = () => {
  if (!videoElement.value) return
  videoElement.value.muted = !videoElement.value.muted
  isMuted.value = videoElement.value.muted
}

const toggleFullscreen = async () => {
  if (!videoContainer.value) return

  if (!isFullscreen.value) {
    if (videoContainer.value.requestFullscreen) {
      await videoContainer.value.requestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    }
  }
}

const replay = () => {
  if (!videoElement.value) return
  isEnded.value = false
  videoElement.value.currentTime = 0
  videoElement.value.play()
}

const onLoadedMetadata = () => {
  if (!videoElement.value) return
  duration.value = videoElement.value.duration
  
  // 恢复上次播放位置
  if (props.startPosition > 0) {
    videoElement.value.currentTime = props.startPosition
  }
}

const onTimeUpdate = () => {
  if (!videoElement.value) return
  currentTime.value = videoElement.value.currentTime
  
  // 每5秒发送一次进度更新，避免重复发送
  const currentSecond = Math.floor(currentTime.value)
  if (currentSecond > 0 && currentSecond % 5 === 0 && currentSecond !== lastProgressTime.value) {
    lastProgressTime.value = currentSecond
    emit('progress', currentTime.value, duration.value)
  }
}

const onEnded = () => {
  isEnded.value = true
  emit('completed')
}

const handleMouseMove = () => {
  showControls.value = true
  
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
  
  controlsTimeout = window.setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  if (videoContainer.value) {
    videoContainer.value.addEventListener('mousemove', handleMouseMove)
  }
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeUnmount(() => {
  if (videoContainer.value) {
    videoContainer.value.removeEventListener('mousemove', handleMouseMove)
  }
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  
  if (controlsTimeout) {
    clearTimeout(controlsTimeout)
  }
})

watch(() => props.videoUrl, () => {
  isEnded.value = false
  currentTime.value = 0
  lastProgressTime.value = 0
})
</script>

<style scoped>
.video-player-wrapper {
  width: 100%;
  background: #000;
}

.video-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background: #000;
  overflow: hidden;
}

.video-element {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.video-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20px 16px 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.video-controls.visible {
  opacity: 1;
}

.progress-bar {
  position: relative;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  margin-bottom: 12px;
  border-radius: 2px;
}

.progress-bar:hover {
  height: 6px;
}

.progress-played {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: #1890ff;
  border-radius: 2px;
}

.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #fff;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s;
}

.progress-bar:hover .progress-handle {
  opacity: 1;
}

.controls-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.controls-left,
.controls-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.control-btn {
  color: #fff !important;
  font-size: 20px;
}

.control-btn:hover {
  color: #1890ff !important;
}

.time-display {
  color: #fff;
  font-size: 14px;
  user-select: none;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.play-icon {
  font-size: 80px;
  color: #fff;
  transition: transform 0.2s;
}

.play-overlay:hover .play-icon {
  transform: scale(1.1);
  color: #1890ff;
}

.ended-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
}

.ended-content {
  text-align: center;
  color: #fff;
}

.completed-icon {
  font-size: 64px;
  color: #52c41a;
  margin-bottom: 16px;
}

.ended-content h3 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 24px;
}

.ended-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* 全屏样式 */
.video-container:fullscreen {
  padding-bottom: 0;
}

.video-container:fullscreen .video-element {
  height: 100vh;
}

@media (max-width: 768px) {
  .control-btn {
    font-size: 18px;
  }

  .time-display {
    font-size: 12px;
  }

  .play-icon {
    font-size: 60px;
  }

  .ended-content h3 {
    font-size: 20px;
  }

  .ended-actions {
    flex-direction: column;
    width: 200px;
  }
}
</style>
