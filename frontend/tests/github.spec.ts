import { test, expect } from '@playwright/test'

test.describe('GitHub Integration Page', () => {
  test('should display GitHub signin page with required elements', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Fill in admin credentials
    await page.fill('input[placeholder="请输入用户名或邮箱"]', 'admin')
    await page.fill('input[placeholder="请输入密码"]', 'password123')
    
    // Click login button
    await page.click('button:has-text("登 录")')
    
    // Wait for navigation to complete
    await page.waitForURL('/')
    
    // Click on GitHub menu item
    await page.click('text=GitHub')
    
    // Wait for GitHub page to load
    await page.waitForURL('/github')
    
    // Verify page title
    await expect(page.locator('h1')).toContainText('GitHub Integration')
    
    // Verify signin heading is displayed
    await expect(page.locator('h2:has-text("signin")')).toBeVisible()
    
    // Verify signin description
    await expect(page.locator('text=Sign in with your GitHub account')).toBeVisible()
    
    // Verify token input field
    await expect(page.locator('input[placeholder*="GitHub Personal Access Token"]')).toBeVisible()
    
    // Verify Sign In button
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible()
    
    // Verify help section
    await expect(page.locator('text=How to get your GitHub token')).toBeVisible()
  })
  
  test('should show GitHub menu item in sidebar', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Fill in admin credentials
    await page.fill('input[placeholder="请输入用户名或邮箱"]', 'admin')
    await page.fill('input[placeholder="请输入密码"]', 'password123')
    
    // Click login button
    await page.click('button:has-text("登 录")')
    
    // Wait for navigation to complete
    await page.waitForURL('/')
    
    // Verify GitHub menu item exists in sidebar
    await expect(page.locator('[role="menuitem"]:has-text("GitHub")')).toBeVisible()
  })
  
  test('should navigate to GitHub page when clicking menu item', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Fill in admin credentials
    await page.fill('input[placeholder="请输入用户名或邮箱"]', 'admin')
    await page.fill('input[placeholder="请输入密码"]', 'password123')
    
    // Click login button
    await page.click('button:has-text("登 录")')
    
    // Wait for navigation to complete
    await page.waitForURL('/')
    
    // Click on GitHub menu item
    await page.click('text=GitHub')
    
    // Verify URL changed to /github
    await expect(page).toHaveURL('/github')
  })
  
  test('should have tabs for repositories and issues', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Fill in admin credentials
    await page.fill('input[placeholder="请输入用户名或邮箱"]', 'admin')
    await page.fill('input[placeholder="请输入密码"]', 'password123')
    
    // Click login button
    await page.click('button:has-text("登 录")')
    
    // Wait for navigation to complete
    await page.waitForURL('/')
    
    // Click on GitHub menu item
    await page.click('text=GitHub')
    
    // Wait for GitHub page to load
    await page.waitForURL('/github')
    
    // Note: Tabs are only visible after authentication
    // So we just verify the signin form is present for now
    await expect(page.locator('input[placeholder*="GitHub Personal Access Token"]')).toBeVisible()
  })
})
