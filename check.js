import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  console.log("Navigating to login...");
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

  // fill in the form so it doesn't fail HTML5 required validation!
  await page.type('#email', 'admin@agriledger.com');
  await page.type('#password', 'password');

  console.log("Clicking login...");
  await page.click('button[type="submit"]');

  console.log("Waiting a bit...");
  await new Promise(r => setTimeout(r, 2000));

  console.log("Current URL:", page.url());
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  console.log("Body length:", bodyHTML.length);
  
  if (bodyHTML.length < 500) {
     console.log("Body seems empty! " + bodyHTML);
  }

  await browser.close();
})();
