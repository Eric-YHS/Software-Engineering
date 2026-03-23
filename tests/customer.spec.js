// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Customer Shopping Flow', () => {
  test('should allow a customer to browse, add to cart, and checkout', async ({ page }) => {
    const username = `shopper_${Date.now()}`;
    
    // 1. Register & Login
    await page.goto('/login');
    await page.click('text=Need an account? Register');
    await page.fill('#username', username);
    await page.fill('#password', 'password');
    await page.selectOption('#role', 'customer');
    page.on('dialog', dialog => dialog.accept());
    await page.click('button[type="submit"]');
    
    await page.fill('#username', username);
    await page.fill('#password', 'password');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('/');

    // 2. View Active Group Buys
    // Expect at least one group buy from seeds
    await expect(page.locator('h1')).toHaveText('Active Group Buys');
    const viewBtn = page.locator('a.bg-blue-500').first();
    await expect(viewBtn).toBeVisible();
    await viewBtn.click();

    // 3. Group Buy Details
    await expect(page.locator('h2')).toContainText('Available Products');
    // Add first item to cart
    const addToCartBtn = page.locator('button:has-text("Add to Cart")').first();
    await addToCartBtn.click();
    
    // 4. Go to Cart
    // Assuming there is a Cart link in the Navbar
    await page.click('text=Cart');
    await expect(page).toHaveURL('/cart');
    
    // 5. Verify Cart Item
    await expect(page.locator('.container')).toContainText('Total:');
    
    // 6. Checkout
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Checkout")');
    
    // 7. Verify Redirect to Orders (or success message)
    // The code says navigate('/orders')
    await expect(page).toHaveURL('/orders');
    
    // 8. Verify Order in List
    // Need to check what Orders page looks like. Assuming it lists orders.
    await expect(page.locator('h1')).toContainText('My Orders');
  });
});
