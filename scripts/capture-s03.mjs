import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const dir='docs/screenshots/s03';await fs.mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for(const [name,width,height] of [['mobile-375',375,812],['tablet-768',768,1024],['desktop-1440',1440,900],['wide-1920',1920,1080]]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(process.env.QA_URL || 'http://127.0.0.1:5174/',{waitUntil:'networkidle'});
  await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}));});
  await page.screenshot({path:`${dir}/${name}-hero.png`,animations:'disabled'});
  for(const [part,selector] of [['universe','.universe'],['featured','.featured-projects'],['catalog','#catalog'],['skills','#skills'],['about','#about'],['contact','#contact']])await page.locator(selector).screenshot({path:`${dir}/${name}-${part}.png`,animations:'disabled',style:'.site-header,.skip-link {visibility:hidden!important}'});
  await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`${dir}/${name}-full.png`,fullPage:true,animations:'disabled'});
  await page.getByRole('button',{name:'Explorar planeta Godot',exact:true}).click();await page.getByRole('button',{name:'Acercar escena'}).click();await page.locator('.universe').screenshot({path:`${dir}/${name}-planet-zoom.png`,animations:'disabled',style:'.site-header {visibility:hidden!important}'});await page.getByRole('button',{name:'Cerrar planeta'}).click();
  await page.getByRole('button',{name:'Iniciar recorrido de proyectos'}).click();await page.locator('.universe').screenshot({path:`${dir}/${name}-rocket-tour.png`,animations:'disabled',style:'.site-header {visibility:hidden!important}'});await page.getByRole('button',{name:'Detener recorrido'}).click();
  await page.getByRole('group',{name:'Filtrar catálogo'}).getByRole('button',{name:/^Android/}).click();await page.locator('#catalog').screenshot({path:`${dir}/${name}-android.png`,animations:'disabled',style:'.site-header {visibility:hidden!important}'});
  await page.getByRole('button',{name:'Ver ficha de OstoAppAR'}).click();await page.getByRole('dialog').screenshot({path:`${dir}/${name}-android-detail.png`,animations:'disabled'});await page.keyboard.press('Escape');
  results.push({name,errors,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,images:[...document.images].every(i=>i.naturalWidth>0),featured:document.querySelectorAll('.featured-card').length,androidCards:document.querySelectorAll('#catalog .project-card').length,videoCount:document.querySelectorAll('video').length}))});await page.close();
 }
 await fs.writeFile('docs/evidence/s03-visual-qa.json',JSON.stringify(results,null,2));console.log(results);
} finally {await browser.close();}
