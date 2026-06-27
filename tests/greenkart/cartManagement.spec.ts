// spec: specs/greenkart.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Cart Management', () => {
  
  test('2.1 Adjust quantity before adding to cart', async ({ page }) => {
    // 1. Navigate to https://rahulshettyacademy.com/seleniumPractise
    await page.goto('https://rahulshettyacademy.com/seleniumPractise');
    
    // Locate Brocolli product and verify default quantity is 1
    const broccolliQuantity = page.locator('text=Brocolli - 1 Kg').locator('../../..').locator('input[type="text"]');
    await expect(broccolliQuantity).toHaveValue('1');
    
    // 3. Click the + button twice to increase quantity to 3
    await page.getByRole('link', { name: '+' }).first().click();
    await page.getByRole('link', { name: '+' }).first().click();
    
    // 4. Verify quantity field displays 3
    await expect(broccolliQuantity).toHaveValue('3');
    
    // 5. Click - button once to decrease to 2
    await page.getByRole('link', { name: '–' }).first().click();
    
    // 6. Verify quantity field displays 2
    await expect(broccolliQuantity).toHaveValue('2');
  });

  test('2.2 Add product to cart with custom quantity', async ({ page }) => {
    // 1. Navigate to home page
    await page.goto('https://rahulshettyacademy.com/seleniumPractise');
    
    // Quantity should already be at 1, increment to 2
    await page.getByRole('link', { name: '+' }).first().click();
    
    // 4. Click ADD TO CART button
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    
    // 5. Verify cart header updates to 'Items: 1' and 'Price: 240'
    await expect(page.locator('table tr:has-text("Items")').locator('strong')).toContainText('1');
    await expect(page.locator('table tr:has-text("Price")').locator('strong')).toContainText('240');
    
    // 6. Verify calculation: 2 units × ₹120 = ₹240
    const itemCount = await page.locator('table tr:has-text("Items") strong').textContent();
    const totalPrice = await page.locator('table tr:has-text("Price") strong').textContent();
    expect(parseInt(itemCount || '0')).toBe(1); // 1 product type
    expect(parseInt(totalPrice || '0')).toBe(240); // 2 × 120
  });

  test('2.3 View cart contents via popup', async ({ page }) => {
    // 1. Add product to cart
    await page.goto('https://rahulshettyacademy.com/seleniumPractise');
    await page.getByRole('link', { name: '+' }).first().click();
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    
    // 2. Click Cart icon/link in header
    await page.getByRole('link', { name: 'Cart' }).click();
    
    // 3. Verify cart popup appears
    const cartPopup = page.locator('div').filter({ has: page.locator('text=PROCEED TO CHECKOUT') });
    await expect(cartPopup).toBeVisible();
    
    // 4. Verify product details: name, unit price, quantity, total
    await expect(page.locator('text=Brocolli - 1 Kg')).toBeVisible();
    await expect(page.locator('text=₹ 120')).toBeVisible();
    await expect(page.locator('text=Nos.')).toBeVisible();
    await expect(page.locator('text=₹ 240').nth(1)).toBeVisible();
    
    // 5. Verify remove button (×) is visible
    await expect(page.getByRole('link', { name: '×' })).toBeVisible();
    
    // 6. Verify PROCEED TO CHECKOUT button is displayed
    await expect(page.getByRole('button', { name: 'PROCEED TO CHECKOUT' })).toBeVisible();
  });

  test('2.4 Remove product from cart', async ({ page }) => {
    // 1. Add product to cart
    await page.goto('https://rahulshettyacademy.com/seleniumPractise');
    await page.getByRole('link', { name: '+' }).first().click();
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    
    // Verify product is in cart
    const itemsBefore = await page.locator('table tr:has-text("Items") strong').textContent();
    expect(parseInt(itemsBefore || '0')).toBe(1);
    
    // 2. Click Cart icon to open popup
    await page.getByRole('link', { name: 'Cart' }).click();
    
    // 3. Click remove button (×)
    await page.getByRole('link', { name: '×' }).click();
    
    // 4. Verify product is removed
    await expect(page.locator('text=You cart is empty!')).toBeVisible();
    
    // 5. Verify cart updates to 'Items: 0' and 'Price: 0'
    await expect(page.locator('table tr:has-text("Items")').locator('strong')).toContainText('0');
    await expect(page.locator('table tr:has-text("Price")').locator('strong')).toContainText('0');
  });

  test('2.5 Add multiple different products to cart', async ({ page }) => {
    // 1. Navigate to home page
    await page.goto('https://rahulshettyacademy.com/seleniumPractise');
    
    // 2. Add Brocolli (qty 2) to cart
    await page.getByRole('link', { name: '+' }).first().click();
    await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
    
    // 3. Verify first product added - Items: 1, Price: 240
    await expect(page.locator('table tr:has-text("Items")').locator('strong')).toContainText('1');
    await expect(page.locator('table tr:has-text("Price")').locator('strong')).toContainText('240');
    
    // 4. Add Tomato (qty 1) to cart
    // Tomato is the 6th ADD TO CART button (after Brocolli, Cauliflower, Cucumber, Beetroot, Carrot)
    await page.getByRole('button', { name: 'ADD TO CART' }).nth(5).click();
    
    // 5. Verify cart shows multiple items
    const itemCountAfter = await page.locator('table tr:has-text("Items") strong').textContent();
    const totalAfter = await page.locator('table tr:has-text("Price") strong').textContent();
    
    expect(parseInt(itemCountAfter || '0')).toBe(2); // Two product types
    expect(parseInt(totalAfter || '0')).toBe(256); // (2×120) + (1×16) = 256
    
    // 6. Verify cart contents via popup
    await page.getByRole('link', { name: 'Cart' }).click();
    
    // Verify both products are in cart
    const cartItems = page.locator('li').filter({ has: page.locator('p:has-text("Kg")') });
    expect(await cartItems.count()).toBeGreaterThanOrEqual(2);
    
    // Verify Brocolli is in cart
    await expect(page.locator('text=Brocolli - 1 Kg')).toBeVisible();
    
    // Verify Tomato is in cart
    await expect(page.locator('text=Tomato - 1 Kg')).toBeVisible();
  });
});
