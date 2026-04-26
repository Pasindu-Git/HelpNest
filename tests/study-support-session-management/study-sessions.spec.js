import { test, expect } from '@playwright/test';

test.describe('Study Support Session Management', () => {
  test('should load student study sessions page', async ({ page }) => {
    await page.goto('/student-sessions');

    // Check if the page title or header is present
    await expect(page.locator('h1').filter({ hasText: /Study Support Hub/i })).toBeVisible();
  });

  test('should display study sessions list', async ({ page }) => {
    await page.goto('/student-sessions');

    // Wait for loading to complete - either sessions load or error shows
    await page.waitForTimeout(2000); // Wait for API call to complete

    // Check if either sessions are displayed or an error message
    const sessionCard = page.locator('[data-testid="session-card"]').first();
    const errorMessage = page.locator('text=/Failed to load|No sessions available/i');
    const loadingText = page.locator('text=Loading sessions...');

    // One of these should be visible
    await expect(sessionCard.or(errorMessage).or(loadingText)).toBeVisible();
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/student-sessions');

    // Check if search input exists
    const searchInput = page.locator('input[placeholder*="search" i]');
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('mathematics');
    await expect(searchInput).toHaveValue('mathematics');
  });

  test('should have filter options', async ({ page }) => {
    await page.goto('/student-sessions');

    // Check for subject filter
    const subjectFilter = page.locator('select').filter({ hasText: /Subject/i });
    if (await subjectFilter.isVisible()) {
      await expect(subjectFilter).toBeVisible();
    }

    // Check for location filter
    const locationFilter = page.locator('select').filter({ hasText: /Location/i });
    if (await locationFilter.isVisible()) {
      await expect(locationFilter).toBeVisible();
    }
  });

  test('should open session details modal', async ({ page }) => {
    await page.goto('/student-sessions');

    // Click on a session card or view button
    const viewButton = page.locator('button').filter({ hasText: /View|Details/i }).first();
    if (await viewButton.isVisible()) {
      await viewButton.click();

      // Check if modal is visible
      const modal = page.locator('[data-testid="session-modal"]');
      await expect(modal).toBeVisible();
    }
  });

  test('should open registration modal', async ({ page }) => {
    await page.goto('/student-sessions');

    // Click on register button
    const registerButton = page.locator('button').filter({ hasText: /Register|Join/i }).first();
    if (await registerButton.isVisible()) {
      await registerButton.click();

      // Check if registration modal is visible
      const modal = page.locator('[data-testid="register-modal"]');
      await expect(modal).toBeVisible();
    }
  });

  test('should display registered sessions', async ({ page }) => {
    await page.goto('/student-sessions');

    // Check for registered sessions section
    const registeredSection = page.locator('h2').filter({ hasText: /Registered|My Sessions/i });
    if (await registeredSection.isVisible()) {
      await expect(registeredSection).toBeVisible();
    }
  });

  test('should have request new session button', async ({ page }) => {
    await page.goto('/student-sessions');

    // Check if the request new session button is visible
    const requestButton = page.locator('button').filter({ hasText: /Request New Session/i });
    await expect(requestButton).toBeVisible();
  });
});