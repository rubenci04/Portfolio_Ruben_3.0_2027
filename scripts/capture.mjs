import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
for(const [name,width,height] of [['mobile-375',375,812],['tablet-768',768,1024],['desktop-1440',1440,900],['wide-1920',1920,1080]]) {
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.goto(process.env.QA_URL || 'http://127.0.0.1:5174/',{waitUntil:'networkidle'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}));});
 await page.screenshot({path:`docs/screenshots/${name}-hero.png`,animations:'disabled'});
 for(const [part,selector] of [['featured','.featured-projects'],['previous','.previous-projects'],['skills','#skills'],['about','#about'],['contact','#contact']])await page.locator(selector).screenshot({path:`docs/screenshots/${name}-${part}.png`,animations:'disabled',style:'.site-header, .skip-link { visibility: hidden !important; }'});
 await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`docs/screenshots/${name}.png`,fullPage:true,animations:'disabled'});
 results.push({name,errors,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].every(i=>i.naturalWidth>0),cards:document.querySelectorAll('.project-card').length,portrait:{fit:getComputedStyle(document.querySelector('#about img')).objectFit,width:document.querySelector('#about img').clientWidth,height:document.querySelector('#about img').clientHeight}}))});await page.close();
}
await fs.writeFile('docs/evidence/visual-qa.json',JSON.stringify(results,null,2));console.log(results);await browser.close();
