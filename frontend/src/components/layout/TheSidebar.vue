<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :trigger="null"
    collapsible
    class="sidebar"
    :width="240"
    :collapsed-width="80"
    theme="light"
  >
    <div class="sidebar-content">
      <!-- User Profile Section -->
      <div class="user-profile" v-if="!collapsed">
        <div class="avatar-container">
          <a-avatar :size="80" :src="userStore.user?.avatar || defaultAvatar" />
        </div>
        <div class="user-info">
          <h3>{{ userStore.userName || '未登录用户' }}</h3>
          <p>{{ userStore.user?.department || 'Computer Science' }}</p>
        </div>
      </div>
      <div class="user-profile-collapsed" v-else>
        <a-avatar :size="40" :src="userStore.user?.avatar || defaultAvatar" />
      </div>

      <!-- Menu Items -->
      <div class="menu-container">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          :theme="'light'"
          :inline-collapsed="collapsed"
          @click="handleMenuClick"
        >
          <!-- 基础菜单项 -->
          <a-menu-item 
            v-for="item in basicMenuItems" 
            :key="item.key"
            @click="handleMenuClick({ key: item.key })"
          >
            <AppstoreOutlined v-if="item.icon === 'AppstoreOutlined'" />
            <BookOutlined v-else-if="item.icon === 'BookOutlined'" />
            <TeamOutlined v-else-if="item.icon === 'TeamOutlined'" />
            <BarChartOutlined v-else-if="item.icon === 'BarChartOutlined'" />
            <UserOutlined v-else-if="item.icon === 'UserOutlined'" />
            <FileOutlined v-else-if="item.icon === 'FileOutlined'" />
            <DeleteOutlined v-else-if="item.icon === 'DeleteOutlined'" />
            <GithubOutlined v-else-if="item.icon === 'GithubOutlined'" />
            <span>{{ item.title }}</span>
          </a-menu-item>

          <!-- 设置子菜单 -->
          <a-sub-menu key="settings" :title="'设置'">
            <template #icon>
              <SettingOutlined />
            </template>
            
            <!-- 个人设置 -->
            <a-menu-item key="personal-settings" @click="handleMenuClick({ key: 'personal-settings' })">
              <UserOutlined />
              <span>个人设置</span>
            </a-menu-item>

            <!-- 管理员功能分组 -->
            <a-menu-item-group v-if="isAdmin" title="管理员功能">
              <a-menu-item key="admin-users" @click="handleMenuClick({ key: 'admin-users' })">
                <UserOutlined />
                <span>用户管理</span>
              </a-menu-item>
              <a-menu-item key="admin-courses" @click="handleMenuClick({ key: 'admin-courses' })">
                <BookOutlined />
                <span>课程管理</span>
              </a-menu-item>
              <a-menu-item key="admin-categories" @click="handleMenuClick({ key: 'admin-categories' })">
                <TagsOutlined />
                <span>分类管理</span>
              </a-menu-item>
            </a-menu-item-group>
          </a-sub-menu>
        </a-menu>
      </div>

      <!-- Logout Button -->
      <div class="logout-button" @click="handleLogout">
        <LogoutOutlined />
        <span v-if="!collapsed">退出登录</span>
      </div>
    </div>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AppstoreOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  DeleteOutlined,
  FileOutlined,
  UserOutlined,
  TeamOutlined,
  TagsOutlined,
  BookOutlined,
  GithubOutlined
} from '@ant-design/icons-vue'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const collapsed = ref(false)
const selectedKeys = ref<string[]>(['dashboard'])
const openKeys = ref<string[]>([])
const defaultAvatar = 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'

// 检查用户是否为管理员
const isAdmin = computed(() => {
  return userStore.user?.roleId === 1 // 假设 roleId 1 为管理员
})

// 基础菜单项定义（不包括设置）
const basicMenuItems = [
  {
    key: 'dashboard',
    title: '仪表盘',
    icon: 'AppstoreOutlined',
    path: '/'
  },
  {
    key: 'catalog',
    title: '课程目录',
    icon: 'BookOutlined',
    path: '/catalog'
  },
  {
    key: 'courses',
    title: '我的课程',
    icon: 'TeamOutlined',
    path: '/courses'
  },
  {
    key: 'progress',
    title: '学习进度',
    icon: 'BarChartOutlined',
    path: '/progress'
  },
  {
    key: 'github',
    title: 'GitHub',
    icon: 'GithubOutlined',
    path: '/github'
  },
  {
    key: 'profile',
    title: '个人资料',
    icon: 'UserOutlined',
    path: '/profile'
  },
  {
    key: 'downloads',
    title: '资料下载',
    icon: 'FileOutlined',
    path: '/downloads'
  },
  {
    key: 'trash',
    title: '垃圾桶',
    icon: 'DeleteOutlined',
    path: '/trash'
  }
]

// 所有菜单项映射（包括子菜单项）
const allMenuItems = [
  ...basicMenuItems,
  {
    key: 'personal-settings',
    title: '个人设置',
    icon: 'UserOutlined',
    path: '/settings'
  },
  {
    key: 'admin-users',
    title: '用户管理',
    icon: 'UserOutlined',
    path: '/admin/users'
  },
  {
    key: 'admin-courses',
    title: '课程管理',
    icon: 'BookOutlined',
    path: '/admin/courses'
  },
  {
    key: 'admin-categories',
    title: '分类管理',
    icon: 'TagsOutlined',
    path: '/admin/categories'
  }
]

// 根据当前路由设置选中的菜单项
watch(
  () => route.path,
  (newPath) => {
    const menuItem = allMenuItems.find(item => item.path === newPath)
    if (menuItem) {
      selectedKeys.value = [menuItem.key]
      
      // 如果是设置相关的路由，展开设置子菜单
      if (menuItem.key === 'personal-settings' || menuItem.key.startsWith('admin-')) {
        openKeys.value = ['settings']
      }
    }
  },
  { immediate: true }
)

const handleMenuClick = ({ key }: { key: string }) => {
  const menuItem = allMenuItems.find(item => item.key === key)
  if (menuItem) {
    router.push(menuItem.path)
  }
}

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/auth/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

const toggleCollapsed = () => {
  collapsed.value = !collapsed.value
}

// 暴露方法给父组件调用
defineExpose({
  toggleCollapsed
})
</script>

<style scoped>
.sidebar {
  background: #fff;
  border-right: 1px solid #f0f0f0;
  position: relative;
  height: calc(100vh - 64px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.sidebar-content {
  height: calc(100vh - 64px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

/* User Profile Styling */
.user-profile {
  padding: 16px;
  text-align: center;
  margin-bottom: 20px;
}

.avatar-container {
  margin-bottom: 10px;
}

.user-info h3 {
  margin: 10px 0 5px;
  font-size: 18px;
  font-weight: 500;
}

.user-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.user-profile-collapsed {
  display: flex;
  justify-content: center;
  padding: 16px 0;
  margin-bottom: 20px;
}

/* Menu Items Container */
.menu-container {
  flex: 1;
  padding: 0 16px;
}

/* 确保菜单样式正确 */
.menu-container :deep(.ant-menu) {
  border: none;
  background: transparent;
}

.menu-container :deep(.ant-menu-item) {
  border-radius: 8px;
  margin: 4px 0;
  height: auto;
  padding: 12px 16px;
}

.menu-container :deep(.ant-menu-submenu) {
  border-radius: 8px;
  margin: 4px 0;
}

.menu-container :deep(.ant-menu-submenu-title) {
  border-radius: 8px;
  height: auto;
  padding: 12px 16px;
}

.menu-container :deep(.ant-menu-item-group-title) {
  color: #999;
  font-size: 12px;
  padding: 8px 16px 4px;
}

/* Logout Button */
.logout-button {
  margin: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #666;
  transition: all 0.3s;
}

.logout-button:hover {
  background-color: #fff1f0;
  color: #ff4d4f;
}

.logout-button span {
  margin-left: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    z-index: 100;
    left: 0;
    top: 64px;
    height: calc(100vh - 64px);
  }
}
</style>
