const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({headless: true});
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://127.0.0.1:1111');
  
  // Wait for load
  await page.waitForTimeout(1000);
  
  // Scroll to feature wrapper
  await page.evaluate(() => {
    document.getElementById('features-scroll-wrapper').scrollIntoView();
  });
  await page.waitForTimeout(500);

  // Scroll down a bit
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  
  // Check layout
  const layout = await page.evaluate(() => {
    const track = document.getElementById('features-track');
    const cards = document.querySelectorAll('.lp-feature-card');
    const header = document.querySelector('.lp-features-header');
    
    return {
      trackDisplay: window.getComputedStyle(track).display,
      trackWidth: track.scrollWidth,
      trackRect: track.getBoundingClientRect(),
      headerRect: header.getBoundingClientRect(),
      card0Rect: cards[0].getBoundingClientRect(),
      card1Style: cards[0].getAttribute('style'),
      card2Style: cards[1].getAttribute('style'),
      gsapActive: !!window.gsap,
    };
  });

  console.log(JSON.stringify(layout, null, 2));
  await page.screenshot({ path: 'features_layout.png' });
  await browser.close();
})();
