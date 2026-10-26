import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const output=[];
for(const url of ['https://esteticars-monteros.vercel.app/','https://donenriqueweb.netlify.app/','https://traidoresno.vercel.app/']) {
 const page=await browser.newPage();
 try {await page.goto(url,{waitUntil:'networkidle',timeout:25000});await page.waitForFunction(()=>!document.body.innerText.trim().startsWith('Cargando'),{},{timeout:10000}).catch(()=>{});output.push({url,...await page.evaluate(()=>({title:document.title,headings:[...document.querySelectorAll('h1,h2,h3')].map(e=>({level:e.tagName,text:e.textContent})),links:[...document.querySelectorAll('a')].map(e=>({text:e.textContent,href:e.getAttribute('href')})),images:[...document.images].map(e=>({src:e.currentSrc,alt:e.alt,loading:e.loading,width:e.naturalWidth})),text:document.body.innerText.slice(0,18000),resources:performance.getEntriesByType('resource').map(e=>({name:e.name,bytes:e.transferSize,duration:e.duration})),vue:!!document.querySelector('#app')?.__vue_app__,react:[...document.querySelectorAll('*')].some(e=>Object.keys(e).some(k=>k.startsWith('__reactFiber')))}))});} catch(e) {output.push({url,error:e.message});} await page.close();
}
await fs.writeFile('docs/evidence/rendered-audit.json',JSON.stringify(output,null,2));console.log(output.map(x=>({url:x.url,title:x.title,react:x.react,vue:x.vue,error:x.error})));
await browser.close();
