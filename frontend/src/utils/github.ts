import axios from 'axios'
import type { GitHubRepository, GitHubIssue, GitHubUser } from '@/types/github'

const GITHUB_API_BASE = 'https://api.github.com'

// GitHub API client
const githubApi = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
})

// Add token to requests if available
githubApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('github_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Get current authenticated GitHub user
 */
export const getGitHubUser = async (): Promise<GitHubUser> => {
  const response = await githubApi.get<GitHubUser>('/user')
  return response.data
}

/**
 * Get all repositories for the authenticated user
 */
export const getUserRepositories = async (): Promise<GitHubRepository[]> => {
  const response = await githubApi.get<GitHubRepository[]>('/user/repos', {
    params: {
      sort: 'updated',
      per_page: 100
    }
  })
  return response.data
}

/**
 * Get all issues assigned to the authenticated user
 */
export const getAssignedIssues = async (): Promise<GitHubIssue[]> => {
  const response = await githubApi.get<GitHubIssue[]>('/issues', {
    params: {
      filter: 'assigned',
      state: 'all',
      sort: 'updated',
      per_page: 100
    }
  })
  return response.data
}

/**
 * Get repositories for a specific user
 */
export const getRepositoriesForUser = async (username: string): Promise<GitHubRepository[]> => {
  const response = await githubApi.get<GitHubRepository[]>(`/users/${username}/repos`, {
    params: {
      sort: 'updated',
      per_page: 100
    }
  })
  return response.data
}

/**
 * Check if user has a valid GitHub token
 */
export const hasGitHubToken = (): boolean => {
  return !!localStorage.getItem('github_token')
}

/**
 * Set GitHub token
 */
export const setGitHubToken = (token: string): void => {
  localStorage.setItem('github_token', token)
}

/**
 * Remove GitHub token
 */
export const removeGitHubToken = (): void => {
  localStorage.removeItem('github_token')
}

export default githubApi
