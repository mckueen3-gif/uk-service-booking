const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:3099/book/cmo0edn7o000vcsuh1yxgdxxp?serviceId=cmo0edn8g000wcsuh5jy3vd8t', { waitUntil: 'networkidle' });
    console.log('Page loaded');
    
    // Fill in Step 1
    await page.fill('input[name="customerName"]', 'Test User');
    await page.fill('input[name="customerPhone"]', '07123456789');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="vehicleReg"]', 'AB12 CDE');
    
    // Check if the "Next" button is present and click it
    const nextButton = await page.locator('button', { hasText: '立即預定' }).or(page.locator('button', { hasText: 'Next' })).first();
    await nextButton.click();
    console.log('Clicked Next -> going to Step 2');
    
    // Wait for Step 2 to appear
    await page.waitForTimeout(2000);
    
    // See if there are slot buttons
    const html = await page.content();
    if (html.includes('No available slots') || html.includes('無法獲取可用時段') || html.includes('Internal Server Error')) {
      console.log('Error found or No slots available in Step 2!');
    } else {
      console.log('slots might be available!');
    }

    // Capture console logs from browser
    page.on('console', msg => console.log('Browser log:', msg.text()));
    
    // Try to find a time slot button
    const slotCount = await page.locator('.slot-button, button.bg-accent').count();
    console.log('Found slots count:', slotCount);
    
  } catch (error) {
    console.error('Playwright error:', error);
  } finally {
    await browser.close();
  }
})();
