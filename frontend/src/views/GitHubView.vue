<template>
  <div class="github-page">
    <div class="github-container">
      <div class="github-header">
        <h1>GitHub Integration</h1>
        <p class="subtitle">Connect with GitHub to view your repositories and issues</p>
      </div>

      <!-- GitHub Authentication Section -->
      <div v-if="!isAuthenticated" class="auth-section">
        <div class="signin-card">
          <div class="signin-icon">
            <svg height="32" width="32" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </div>
          <h2><span>signin</span></h2>
          <p>Sign in with your GitHub account to access your repositories and issues</p>
          
          <div class="signin-form">
            <a-input
              v-model:value="tokenInput"
              type="password"
              placeholder="Enter your GitHub Personal Access Token"
              size="large"
              @keyup.enter="handleSignIn"
            >
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input>
            
            <a-button
              type="primary"
              size="large"
              block
              :loading="loading"
              @click="handleSignIn"
              class="signin-button"
            >
              Sign In
            </a-button>
          </div>

          <div class="token-help">
            <div class="info-box">
              <div class="info-header">
                <svg viewBox="64 64 896 896" width="16" height="16" fill="currentColor">
                  <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path d="M464 336a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z"></path>
                </svg>
                <strong>How to get your GitHub token</strong>
              </div>
              <p>Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token. Select 'repo' and 'user' scopes.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- GitHub Content Section -->
      <div v-else class="content-section">
        <div class="user-info" v-if="user">
          <img :src="user.avatar_url" :alt="user.login" class="avatar" />
          <div class="user-details">
            <h2>{{ user.name || user.login }}</h2>
            <p>@{{ user.login }}</p>
            <a :href="user.html_url" target="_blank" class="profile-link">
              View GitHub Profile →
            </a>
          </div>
          <a-button @click="handleSignOut" danger>Sign Out</a-button>
        </div>

        <a-tabs v-model:activeKey="activeTab" class="github-tabs">
          <!-- Repositories Tab -->
          <a-tab-pane key="repos" tab="List all my repos">
            <div class="tab-content">
              <div v-if="loadingRepos" class="loading">
                <div class="spinner"></div>
                <p>Loading repositories...</p>
              </div>
              
              <div v-else-if="repositories.length === 0" class="empty-state">
                <p>No repositories found</p>
              </div>
              
              <div v-else class="repos-grid">
                <div
                  v-for="repo in repositories"
                  :key="repo.id"
                  class="repo-card"
                >
                  <div class="repo-header">
                    <a :href="repo.html_url" target="_blank" class="repo-name">
                      {{ repo.name }}
                    </a>
                    <span v-if="repo.private" class="private-badge">Private</span>
                  </div>
                  
                  <p v-if="repo.description" class="repo-description">
                    {{ repo.description }}
                  </p>
                  
                  <div class="repo-meta">
                    <span v-if="repo.language" class="language">
                      <span class="language-dot" :style="{ backgroundColor: getLanguageColor(repo.language) }"></span>
                      {{ repo.language }}
                    </span>
                    <span class="stars">
                      ⭐ {{ repo.stargazers_count }}
                    </span>
                    <span class="forks">
                      🔱 {{ repo.forks_count }}
                    </span>
                    <span class="updated">
                      Updated {{ formatDate(repo.updated_at) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>

          <!-- Issues Tab -->
          <a-tab-pane key="issues" tab="显示所有分配给我的Issue">
            <div class="tab-content">
              <div v-if="loadingIssues" class="loading">
                <div class="spinner"></div>
                <p>Loading issues...</p>
              </div>
              
              <div v-else-if="issues.length === 0" class="empty-state">
                <p>No issues assigned to you</p>
              </div>
              
              <div v-else class="issues-list">
                <div
                  v-for="issue in issues"
                  :key="issue.id"
                  class="issue-card"
                >
                  <div class="issue-header">
                    <span :class="['issue-state', issue.state]">
                      {{ issue.state }}
                    </span>
                    <a :href="issue.html_url" target="_blank" class="issue-title">
                      #{{ issue.number }} {{ issue.title }}
                    </a>
                  </div>
                  
                  <p v-if="issue.body" class="issue-body">
                    {{ truncateText(issue.body, 150) }}
                  </p>
                  
                  <div class="issue-meta">
                    <span class="issue-repo">
                      {{ getRepoName(issue.repository_url) }}
                    </span>
                    <span class="issue-date">
                      Updated {{ formatDate(issue.updated_at) }}
                    </span>
                  </div>
                  
                  <div v-if="issue.labels.length > 0" class="issue-labels">
                    <span
                      v-for="label in issue.labels"
                      :key="label.name"
                      class="label"
                      :style="{ backgroundColor: `#${label.color}` }"
                    >
                      {{ label.name }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { LockOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import {
  hasGitHubToken,
  setGitHubToken,
  removeGitHubToken,
  getGitHubUser,
  getUserRepositories,
  getAssignedIssues
} from '@/utils/github'
import type { GitHubRepository, GitHubIssue, GitHubUser } from '@/types/github'

const isAuthenticated = ref(false)
const loading = ref(false)
const loadingRepos = ref(false)
const loadingIssues = ref(false)
const tokenInput = ref('')
const activeTab = ref('repos')

const user = ref<GitHubUser | null>(null)
const repositories = ref<GitHubRepository[]>([])
const issues = ref<GitHubIssue[]>([])

const handleSignIn = async () => {
  if (!tokenInput.value.trim()) {
    message.error('Please enter your GitHub token')
    return
  }

  loading.value = true
  
  try {
    setGitHubToken(tokenInput.value.trim())
    
    // Test the token by fetching user info
    user.value = await getGitHubUser()
    isAuthenticated.value = true
    
    message.success(`Welcome, ${user.value.login}!`)
    
    // Load initial data
    await loadData()
  } catch (error: any) {
    console.error('GitHub authentication failed:', error)
    removeGitHubToken()
    message.error('Authentication failed. Please check your token.')
  } finally {
    loading.value = false
    tokenInput.value = ''
  }
}

const handleSignOut = () => {
  removeGitHubToken()
  isAuthenticated.value = false
  user.value = null
  repositories.value = []
  issues.value = []
  message.success('Signed out successfully')
}

const loadData = async () => {
  await Promise.all([loadRepositories(), loadIssues()])
}

const loadRepositories = async () => {
  loadingRepos.value = true
  try {
    repositories.value = await getUserRepositories()
  } catch (error: any) {
    console.error('Failed to load repositories:', error)
    message.error('Failed to load repositories')
  } finally {
    loadingRepos.value = false
  }
}

const loadIssues = async () => {
  loadingIssues.value = true
  try {
    issues.value = await getAssignedIssues()
  } catch (error: any) {
    console.error('Failed to load issues:', error)
    message.error('Failed to load issues')
  } finally {
    loadingIssues.value = false
  }
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'today'
  if (diffDays === 1) return 'yesterday'
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const getRepoName = (repoUrl: string): string => {
  const parts = repoUrl.split('/')
  return parts.slice(-2).join('/')
}

const getLanguageColor = (language: string): string => {
  const colors: Record<string, string> = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'Go': '#00ADD8',
    'Ruby': '#701516',
    'PHP': '#4F5D95',
    'C++': '#f34b7d',
    'C#': '#178600',
    'Swift': '#ffac45',
    'Kotlin': '#F18E33',
    'Rust': '#dea584',
    'Vue': '#41b883',
    'HTML': '#e34c26',
    'CSS': '#563d7c'
  }
  return colors[language] || '#858585'
}

onMounted(async () => {
  if (hasGitHubToken()) {
    loading.value = true
    try {
      user.value = await getGitHubUser()
      isAuthenticated.value = true
      await loadData()
    } catch (error) {
      console.error('Failed to authenticate with stored token:', error)
      removeGitHubToken()
      message.error('Your GitHub token has expired. Please sign in again.')
    } finally {
      loading.value = false
    }
  }
})
</script>

<style scoped>
.github-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 24px;
}

.github-container {
  max-width: 1200px;
  margin: 0 auto;
}

.github-header {
  text-align: center;
  margin-bottom: 48px;
}

.github-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  font-size: 16px;
}

/* Authentication Section */
.auth-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.signin-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 48px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.signin-icon {
  color: #24292f;
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.signin-card h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.signin-card h2 span {
  color: #1890ff;
}

.signin-card p {
  color: #6b7280;
  margin-bottom: 32px;
}

.signin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.signin-button {
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

.token-help {
  margin-top: 24px;
  text-align: left;
}

.info-box {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  padding: 16px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1890ff;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-box p {
  margin: 0;
  color: #595959;
  font-size: 14px;
  line-height: 1.6;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Content Section */
.content-section {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 32px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.user-details p {
  color: #6b7280;
  margin: 4px 0;
}

.profile-link {
  color: #1890ff;
  text-decoration: none;
  font-size: 14px;
}

.profile-link:hover {
  text-decoration: underline;
}

/* Tabs */
.github-tabs {
  margin-top: 24px;
}

.tab-content {
  padding: 24px 0;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 16px;
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}

/* Repositories Grid */
.repos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
}

.repo-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
  background: #fafafa;
}

.repo-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.repo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.repo-name {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  text-decoration: none;
  flex: 1;
}

.repo-name:hover {
  text-decoration: underline;
}

.private-badge {
  padding: 2px 8px;
  background: #fef3c7;
  color: #92400e;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.repo-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.repo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.language {
  display: flex;
  align-items: center;
  gap: 4px;
}

.language-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Issues List */
.issues-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.issue-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.2s;
  background: #fafafa;
}

.issue-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.issue-state {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.issue-state.open {
  background: #dcfce7;
  color: #166534;
}

.issue-state.closed {
  background: #fee2e2;
  color: #991b1b;
}

.issue-title {
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  text-decoration: none;
  flex: 1;
}

.issue-title:hover {
  text-decoration: underline;
}

.issue-body {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 12px;
  line-height: 1.5;
}

.issue-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
}

.issue-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.label {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

@media (max-width: 768px) {
  .repos-grid {
    grid-template-columns: 1fr;
  }
  
  .signin-card {
    padding: 32px 24px;
  }
}
</style>
