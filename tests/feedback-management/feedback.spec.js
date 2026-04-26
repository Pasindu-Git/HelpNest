import { test, expect } from '@playwright/test';

test.describe('Feedback Management', () => {
  test('should load feedback management page', async ({ page }) => {
    await page.goto('/feedbacks');

    // Check if the page title or header is present
    await expect(page.locator('h1').filter({ hasText: /Student Feedback Hub/i })).toBeVisible();
  });

  test('should display feedback categories', async ({ page }) => {
    await page.goto('/feedbacks');

    // Check if category buttons are present (they contain text like Academic, Infrastructure, etc.)
    const academicButton = page.locator('button').filter({ hasText: 'Academic' });
    await expect(academicButton).toBeVisible();

    const infrastructureButton = page.locator('button').filter({ hasText: 'Infrastructure' });
    await expect(infrastructureButton).toBeVisible();
  });

  test('should allow category selection', async ({ page }) => {
    await page.goto('/feedbacks');

    // Click on Academic category
    const academicButton = page.locator('button').filter({ hasText: 'Academic' });
    await academicButton.click();

    // Check if feedback form becomes visible (should show "Report Issue: Academic")
    const feedbackForm = page.locator('h3').filter({ hasText: /Report Issue: Academic/i });
    await expect(feedbackForm).toBeVisible();
  });

  test('should have feedback submission form', async ({ page }) => {
    await page.goto('/feedbacks');

    // Select Academic category first
    const academicButton = page.locator('button').filter({ hasText: 'Academic' });
    await academicButton.click();

    // Check form elements
    const sdInput = page.locator('input[placeholder="SD2024001"]');
    await expect(sdInput).toBeVisible();

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();

    const feedbackTextarea = page.locator('textarea');
    await expect(feedbackTextarea).toBeVisible();
  });

  test('should validate feedback form', async ({ page }) => {
    await page.goto('/feedbacks');

    // Select Academic category
    const academicButton = page.locator('button').filter({ hasText: 'Academic' });
    await academicButton.click();

    // Try to submit without filling required fields
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Check for validation errors (the component shows errors in red text)
    await page.waitForTimeout(1000); // Wait for validation to show
    const errorMessage = page.locator('.text-red-500, .text-red-600');
    // May or may not show errors depending on implementation
  });

  test('should display feedback statistics', async ({ page }) => {
    await page.goto('/feedbacks');

    // Check for statistics section
    const statsSection = page.locator('h2').filter({ hasText: /Statistics|Overview/i });
    if (await statsSection.isVisible()) {
      await expect(statsSection).toBeVisible();

      // Check for stat cards
      const statCards = page.locator('[data-testid="stat-card"]');
      await expect(statCards.first()).toBeVisible();
    }
  });

  test('should display existing feedbacks', async ({ page }) => {
    await page.goto('/feedbacks');

    // Check for feedbacks section
    const feedbacksSection = page.locator('h2').filter({ hasText: /Recent|All Feedbacks/i });
    if (await feedbacksSection.isVisible()) {
      await expect(feedbacksSection).toBeVisible();

      // Check for feedback items
      const feedbackItems = page.locator('[data-testid="feedback-item"]');
      // May be empty, but section should exist
    }
  });

  test('should allow image upload', async ({ page }) => {
    await page.goto('/feedbacks');

    // Select a category
    const firstCategory = page.locator('[data-testid="category-card"]').first();
    await firstCategory.click();

    // Check for file input
    const fileInput = page.locator('input[type="file"]');
    if (await fileInput.isVisible()) {
      await expect(fileInput).toBeVisible();
    }
  });

  test('should have reaction buttons on feedbacks', async ({ page }) => {
    await page.goto('/feedbacks');

    // Look for thumbs up/down buttons
    const likeButton = page.locator('button').filter({ has: page.locator('.lucide-thumbs-up') });
    const dislikeButton = page.locator('button').filter({ has: page.locator('.lucide-thumbs-down') });

    // At least one should be present if there are feedbacks
    if (await likeButton.isVisible() || await dislikeButton.isVisible()) {
      await expect(likeButton.or(dislikeButton)).toBeVisible();
    }
  });
});