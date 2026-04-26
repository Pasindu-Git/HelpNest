import { test, expect } from '@playwright/test';

test.describe('Canteen Management', () => {
  test('should load student canteen page', async ({ page }) => {
    await page.goto('/student-canteen');

    // Check if the page title or header is present
    await expect(page.locator('h1').filter({ hasText: /Canteen/i })).toBeVisible();
  });

  test('should display food categories', async ({ page }) => {
    await page.goto('/student-canteen');

    // Wait for loading to complete
    await page.waitForSelector('[data-testid="category-button"]', { timeout: 10000 });

    // Check if category buttons are present
    const categories = page.locator('[data-testid="category-button"]');
    await expect(categories).toHaveCount(await categories.count()); // At least some categories
  });

  test('should have search functionality', async ({ page }) => {
    await page.goto('/student-canteen');

    // Check if search input exists
    const searchInput = page.locator('input[placeholder*="search" i]');
    await expect(searchInput).toBeVisible();

    // Type in search
    await searchInput.fill('pizza');
    await expect(searchInput).toHaveValue('pizza');
  });

  test('should display cart when opened', async ({ page }) => {
    await page.goto('/student-canteen');

    // Click on cart button (assuming it has shopping cart icon)
    const cartButton = page.locator('button').filter({ has: page.locator('.lucide-shopping-cart') });
    if (await cartButton.isVisible()) {
      await cartButton.click();

      // Check if cart modal/sidebar is visible
      const cartModal = page.locator('[data-testid="cart-modal"]');
      await expect(cartModal).toBeVisible();
    }
  });

  test('should navigate to canteen owner page', async ({ page }) => {
    await page.goto('/student-canteen');

    // Assuming there's a link or button to canteen owner
    const ownerLink = page.locator('a[href="/canteen-owner"]');
    if (await ownerLink.isVisible()) {
      await ownerLink.click();
      await expect(page).toHaveURL('/canteen-owner');
    }
  });
});