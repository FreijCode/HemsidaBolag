import {chromium} from '@playwright/test';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const result={viewports:[],errors:[]};await mkdir('screenshots',{recursive:true});
for(const width of [320,390,768,1440]){
const browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chromium',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
try{const page=await browser.newPage({viewport:{width,height:width===1440?1000:844}});page.on('pageerror',e=>result.errors.push(e.message));await page.goto('file://'+resolve('freijventure-demo.html'));await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
await page.locator('footer').scrollIntoViewIfNeeded();await page.waitForTimeout(700);await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(700);
const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,anchors:[...document.querySelectorAll('a[href^="#"]')].every(a=>document.querySelector(a.getAttribute('href')))}));if(layout.scrollWidth>width||!layout.anchors)throw Error('Layout/anchors '+JSON.stringify(layout));
await page.screenshot({path:`screenshots/${width}.png`,fullPage:true});
await page.locator('#open-demo').focus();await page.keyboard.press('Enter');await page.locator('dialog[open]').waitFor();await page.keyboard.press('Escape');if(!await page.locator('#open-demo').evaluate(e=>e===document.activeElement))throw Error('Focus');
await page.locator('#motion-toggle').click();if(await page.locator('#motion-toggle').getAttribute('aria-pressed')!=='true')throw Error('Pause');await page.emulateMedia({reducedMotion:'reduce'});if(!await page.locator('.rotor').evaluate(e=>getComputedStyle(e).animationName==='none'))throw Error('Reduced motion');
await page.locator('summary').nth(1).focus();await page.keyboard.press('Enter');if(!await page.locator('details').nth(1).evaluate(e=>e.open))throw Error('Accordion keyboard');
await page.locator('[data-filter=studio]').click();if(await page.locator('.project:visible').count()!==1)throw Error('Project filter');await page.locator('[data-filter=all]').click();
await page.locator('[data-project=jord]').focus();await page.keyboard.press('Enter');await page.locator('#project-jord[open]').waitFor();await page.keyboard.press('Escape');if(!await page.locator('[data-project=jord]').evaluate(e=>e===document.activeElement))throw Error('Project focus');
await page.locator('[data-project=atelier]').click();await page.locator('#project-atelier[open]').waitFor();await page.locator('#project-atelier img').evaluate(i=>i.decode());await page.keyboard.press('Escape');
if(!await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)))throw Error('Image load');
result.viewports.push({...layout,projectsKeyboard:true,projectFilter:true,imagesLoaded:true,dialogKeyboard:true,focusRestored:true,motionPause:true,reducedMotion:true});
}finally{await browser.close();}}
if (process.env.SKIP_VIDEO !== '1') {
const b=await chromium.launch({channel:process.env.BROWSER_CHANNEL || 'chromium',args:['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']});
const c=await b.newContext({viewport:{width:1440,height:1000},recordVideo:{dir:'screenshots/video',size:{width:1440,height:1000}}});const p=await c.newPage();await p.goto('file://'+resolve('freijventure-demo.html'));await p.waitForTimeout(2200);await p.locator('#studier').scrollIntoViewIfNeeded();await p.waitForTimeout(1800);await p.locator('.project').nth(1).hover();await p.waitForTimeout(1200);await p.locator('#tjanster').scrollIntoViewIfNeeded();await p.locator('summary').nth(1).click();await p.waitForTimeout(1400);await p.locator('#open-demo').click();await p.waitForTimeout(1500);await p.keyboard.press('Escape');const v=p.video();await c.close();await copyFile(await v.path(),'demo.webm');await b.close();
}
await writeFile('qa-results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));

if (result.errors.length) process.exitCode = 1;
