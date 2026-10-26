import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 await page.goto('https://bar-app-web.onrender.com/',{waitUntil:'networkidle',timeout:45000});
 await page.locator('input[type=password]').waitFor();
 await page.evaluate(()=>document.fonts.ready);
 await page.screenshot({path:'src/assets/cards_images/bar-gestion-login.png',animations:'disabled'});
 await fs.writeFile('docs/evidence/bar-app.json',JSON.stringify({url:page.url(),title:await page.title(),capture:'Public login page. No authentication or private data accessed.',stackSource:'https://github.com/rubenci04/bar_app_web/blob/main/requirements.txt',featuresSource:'https://github.com/rubenci04/bar_app_web/blob/main/docs/UI_PHASE1_CHANGES.md'},null,2));
 console.log({url:page.url(),title:await page.title()});
} finally { await browser.close(); }

