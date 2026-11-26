
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const files={'/':'index.html','/index.html':'index.html','/sw.js':'sw.js','/manifest.webmanifest':'manifest.webmanifest','/icon.svg':'icon.svg'};
const mime={html:'text/html; charset=utf-8',js:'text/javascript',webmanifest:'application/manifest+json',svg:'image/svg+xml'};
async function withApp(fn){
 const server=createServer(async(req,res)=>{const file=files[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404);res.end();return}try{const content=await readFile(new URL('../'+file,import.meta.url));res.writeHead(200,{'Content-Type':mime[file.split('.').at(-1)],'Cache-Control':'no-cache'});res.end(content)}catch{res.writeHead(500);res.end()}});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('dialog',d=>d.accept());
 await page.goto('http://127.0.0.1:'+server.address().port+'/');
 const saved=()=>page.locator('#storageState[data-state="ok"]').waitFor({timeout:20000});
 await saved();await fn(page,context,saved);assert.deepEqual(errors,[]);await context.close()
 }finally{await browser?.close();await new Promise(r=>server.close(r))}
}
test('mobile workflow: model, purchase blocker, costs, documents, report, backup and undo',{timeout:120000},async()=>withApp(async(page,context,saved)=>{
 await page.locator('#settingsOpen').click();await page.locator('#demoRowhouseOpen').click();await page.locator('#settingsDialog').waitFor({state:'hidden'});await saved();assert.match(await page.locator('#projectTitle').innerText(),/Reihenendhaus/);
 await page.locator('[data-tab="docs"]').click();await page.locator('#note').click();await page.locator('#body').fill('Synthetic inspection finding');await page.locator('#findingImpact summary').click();
 await page.locator('#findingGate').selectOption('blocker');await page.locator('#findingCostType').selectOption('repair');await page.locator('#findingLow').fill('1000');await page.locator('#findingHigh').fill('1500');await page.locator('#findingSource').fill('Test estimate');
 await page.locator('#save').click();await saved();assert.match(await page.locator('#entries').innerText(),/Synthetic inspection finding/);
 await page.locator('#decisionDocs').click();assert.match(await page.locator('#decisionGateSummary').innerText(),/1 Kaufblocker/);
 await page.locator('[data-diligence="title"]').selectOption('received');await saved();await page.locator('#applyFindingCosts').click();assert.equal(await page.locator('#dec-renovLow').inputValue(),'1000');
 await page.locator('#decisionSave').click();await saved();await page.locator('#decisionReport').click();assert.match(await page.locator('#reportContent').innerText(),/Synthetic inspection finding/);await page.locator('#reportClose').click();
 await page.locator('[data-tab="plan"]').click();await page.locator('#settingsOpen').click();const [backup]=await Promise.all([page.waitForEvent('download'),page.locator('#export').click()]);const file=await backup.path();await page.locator('#settingsClose').click();await page.locator('[data-tab="docs"]').click();
 await page.locator('#entries [data-delete]').first().click();await saved();await page.locator('#undoDelete').click();await saved();assert.match(await page.locator('#entries').innerText(),/Synthetic inspection finding/);
 await page.locator('#entries [data-delete]').first().click();await saved();await page.locator('#backup').setInputFiles(file);await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('Backup zusammengeführt'));assert.doesNotMatch(await page.locator('#entries').innerText(),/Synthetic inspection finding/);
 await page.locator('[data-tab="plan"]').click();await page.locator('#settingsOpen').click();await page.locator('#integrityOpen').click();assert.match(await page.locator('#integrityResults').innerText(),/0 Zuordnungs-\/Modellfehler/);await page.locator('#integrityClose').click();
}));
test('mobile workflow: photo keeps selected wall and survives offline reload',{timeout:120000},async()=>withApp(async(page,context,saved)=>{
 await page.locator('[data-tab="room"]').click();const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=320;c.height=240;const x=c.getContext('2d');x.fillStyle='#eee';x.fillRect(0,0,320,240);x.fillStyle='#678';x.fillRect(60,40,180,120);return c.toDataURL('image/png').split(',')[1]});
 const chooser=page.waitForEvent('filechooser');await page.locator('#surfaceQuick').click();await (await chooser).setFiles({name:'synthetic.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
 await page.locator('#surfaceImageBox').waitFor({state:'visible'});await page.locator('#surfaceWall').selectOption('2');await page.locator('#surfaceSave').click();await page.waitForFunction(()=>document.getElementById('surfaceError').textContent.includes('Projektion gespeichert'));await saved();assert.equal(await page.locator('#surfaceWall').inputValue(),'2');await page.locator('#surfaceClose').click();
 await page.evaluate(async()=>{await navigator.serviceWorker.ready});await page.waitForFunction(()=>!!navigator.serviceWorker.controller);await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await saved();await page.locator('[data-tab="docs"]').click();assert.match(await page.locator('#entries').innerText(),/Flächenfoto/);await context.setOffline(false);
}));
