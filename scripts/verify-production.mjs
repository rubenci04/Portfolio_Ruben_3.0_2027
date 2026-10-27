import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const base=process.env.CHECK_URL || 'http://127.0.0.1:4173/';
const publicUrl = (process.env.EXPECTED_SITE_URL || 'https://portfoliorubenalbarracin.netlify.app').replace(/\/$/, '') + '/';
const browser=await chromium.launch({channel:'chrome',headless:true});const results=[];
try {
 for(const [name,width,height] of [['mobile',375,812],['tablet',768,1024],['desktop',1440,900],['wide',1920,1080]]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const response=await page.goto(base,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'index, follow');
  if (process.env.EXPECTED_COMMIT) assert.equal(await page.locator('meta[name=build-revision]').getAttribute('content'),process.env.EXPECTED_COMMIT);
  assert.ok(!/noindex/i.test(response.headers()['x-robots-tag'] || ''));
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),publicUrl);
  assert.equal(await page.locator('#catalog .project-card').count(),16);
  await page.getByRole('button',{name:'Explorar planeta Android',exact:true}).click();await page.getByRole('button',{name:'Ver Android',exact:true}).click();assert.equal(await page.locator('#catalog .project-card').count(),2);
  assert.equal(await page.getByRole('heading',{name:'OstoAppAR',exact:true}).count(),1);
  await page.getByRole('button',{name:'Ver ficha de OstoAppAR'}).click();assert.equal(await page.getByRole('dialog').isVisible(),true);await page.keyboard.press('Escape');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.deepEqual(errors,[]);results.push({name,status:response.status(),errors,robots:'index, follow',catalog:16,androidFilter:2,dialog:true});await page.close();
 }
 const page=await browser.newPage({javaScriptEnabled:false});await page.goto(base);assert.equal(await page.locator('#catalog .project-card').count(),16);await page.close();
 const headers=await fetch(new URL('_headers',base)).then(r=>r.text());const sitemap=await fetch(new URL('sitemap.xml',base)).then(r=>r.text());
 if(base.includes('127.0.0.1')) assert.equal(headers.includes('noindex'),false);
 assert.ok(sitemap.includes(publicUrl));
 await fs.writeFile(process.env.CHECK_OUTPUT || 'docs/evidence/s04-production-check.json',JSON.stringify({base,expectedCommit:process.env.EXPECTED_COMMIT || null,results,noJsCatalog:16},null,2));console.log(results);
} finally {await browser.close();}
