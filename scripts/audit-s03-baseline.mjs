import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const url='https://effortless-piroshki-a3c8f9.netlify.app/';
const response=await fetch(url,{signal:AbortSignal.timeout(20000)});const html=await response.text();
const local=await fs.readFile('dist/index.html','utf8');
const browser=await chromium.launch({channel:'chrome',headless:true});
try {const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});await page.goto(url,{waitUntil:'networkidle'});await page.screenshot({path:'docs/screenshots/s03-public-baseline.png'});const dom=await page.evaluate(()=>({title:document.title,h1:document.querySelector('h1')?.textContent,projects:[...document.querySelectorAll('[data-project]')].map(e=>({id:e.dataset.project,title:e.querySelector('h3')?.textContent})),canvas:document.querySelectorAll('canvas').length,stars:document.querySelectorAll('.stars').length}));const summary={url,status:response.status,headers:Object.fromEntries(response.headers),publicAssets:html.match(/\/assets\/[^"\s<>]+\.(js|css)/g),localAssets:local.match(/\/assets\/[^"\s<>]+\.(js|css)/g),dom};await fs.writeFile('docs/evidence/s03-public-baseline.json',JSON.stringify(summary,null,2));console.log(summary);}finally{await browser.close();}
