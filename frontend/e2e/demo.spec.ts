import { test, expect } from '@playwright/test';

/**
 * Frontend demo recording - captures key app interactions.
 * Run with: npm run demo:record
 *
 * Prerequisites:
 * 1. Start the frontend: npm run dev
 * 2. Ensure API is running (local or set VITE_API_BASE_URL for deployed API)
 */
test.describe('Frontend Demo', () => {
  test('full app flow - catalog, cart, admin', async ({ page }) => {
    // --- 1. Home / Catalog ---
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    // Wait for products to load or show empty state
    await expect(
      page.locator('h1:has-text("Product Catalog")').or(page.locator('text=No Products Found'))
    ).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1200);

    // Try to add a product to cart (if any exist)
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      await page.waitForTimeout(800);
      // Add another if available
      const secondBtn = page.locator('button:has-text("Add to Cart")').nth(1);
      if (await secondBtn.isVisible()) {
        await secondBtn.click();
        await page.waitForTimeout(600);
      }
    }
    await page.waitForTimeout(800);

    // --- 2. Open filter sidebar (desktop shows filters, mobile uses toggle) ---
    const filterBtn = page.locator('button:has-text("Filters")');
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(800);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(500);
    }
    await page.waitForTimeout(600);

    // --- 3. Sort dropdown ---
    const sortBtn = page.getByRole('button', { name: /Sort By/i });
    if (await sortBtn.isVisible()) {
      await sortBtn.click();
      await page.waitForTimeout(500);
      const priceOption = page.getByRole('menuitem', { name: 'Price: Low to High' });
      if (await priceOption.isVisible()) {
        await priceOption.click();
      }
      await page.waitForTimeout(1000);
    }

    // --- 4. Cart ---
    await page.getByRole('button', { name: /Cart/i }).click();
    await page.waitForTimeout(1200);

    const cartEmpty = page.locator('text=Your cart is empty');
    if (await cartEmpty.isVisible()) {
      await page.getByRole('button', { name: /Continue Shopping/i }).click();
      await page.waitForTimeout(800);
    } else {
      // Adjust quantity if we have items
      const plusBtn = page.locator('button').filter({ has: page.locator('svg') }).first();
      if (await plusBtn.isVisible()) {
        await plusBtn.click();
        await page.waitForTimeout(600);
      }
      await page.getByRole('button', { name: /Continue Shopping/i }).click();
      await page.waitForTimeout(800);
    }

    // --- 5. Admin ---
    await page.getByRole('button', { name: /Admin/i }).click();
    await page.waitForTimeout(1500);

    // Check if we're on login or already logged in
    const loginForm = page.locator('form').filter({ has: page.locator('input[type="password"]') });
    const createSuperuserBtn = page.locator('button:has-text("Create Random Superuser")');

    if (await loginForm.isVisible()) {
      // Create superuser first
      if (await createSuperuserBtn.isVisible()) {
        await createSuperuserBtn.click();
        await page.waitForTimeout(2500); // API call
      }

      // Login (form should be pre-filled after signup, or user enters manually)
      const usernameInput = page.locator('input[type="text"]').first();
      const passwordInput = page.locator('input[type="password"]');
      if (await usernameInput.isVisible() && await passwordInput.isVisible()) {
        const username = await usernameInput.inputValue();
        const password = await passwordInput.inputValue();
        if (username && password) {
          await page.getByRole('button', { name: /Login/i }).click();
          await page.waitForTimeout(2000);
        }
      }
    }

    // If we're on admin dashboard (logged in)
    const dashboardTitle = page.locator('h1:has-text("Admin Dashboard")');
    if (await dashboardTitle.isVisible()) {
      await page.waitForTimeout(1500);
      // Scroll to show create product form
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.waitForTimeout(800);
      // Logout
      await page.getByRole('button', { name: /Logout/i }).click();
      await page.waitForTimeout(800);
    }

    // --- 6. Back to Home ---
    await page.getByRole('button', { name: /Back to Catalog/i }).click();
    await page.waitForTimeout(1000);
  });
});
