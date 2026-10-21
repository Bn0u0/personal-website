import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
const sleep=t=>new Promise(r=>setTimeout(r,t));
const root=process.env.APP_URL||'http://127.0.0.1:4179/';
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
if(!existsSync(chrome))throw Error('Chrome not found');
const dir=mkdtempSync(join(tmpdir(),'bn0u0-finance-'));
const port=9348,processChrome=spawn(chrome,['--headless=new','--no-first-run','--no-default-browser-check','--disable-gpu','--disable-extensions','--remote-allow-origins=*','--remote-debugging-port='+port,'--window-size=390,844','--user-data-dir='+dir,'about:blank'],{stdio:'ignore',windowsHide:true});
let socket;let seq=0;const pending=new Map();
try{
 let page;
 for(let i=0;i<80;i++){try{page=(await (await fetch('http://127.0.0.1:'+port+'/json')).json()).find(x=>x.type==='page');if(page?.webSocketDebuggerUrl)break}catch{}await sleep(150)}
 if(!page?.webSocketDebuggerUrl)throw Error('Chrome DevTools unavailable');
 socket=new WebSocket(page.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject});
 socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){const {resolve,reject}=pending.get(m.id);pending.delete(m.id);m.error?reject(Error(JSON.stringify(m.error))):resolve(m.result)}};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));setTimeout(()=>{if(pending.has(id)){pending.delete(id);reject(Error('Timeout '+method))}},15000)});
 const run=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result?.value};
 const until=async condition=>{for(let i=0;i<100;i++){const v=await run(condition);if(v)return v;await sleep(100)}throw Error('Condition not met: '+condition)};
 await call('Page.enable');await call('Runtime.enable');
 await call('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await call('Page.navigate',{url:root});
 await until("!!document.querySelector('.work-more')");
 await run("document.querySelector('[data-entry-lang=en]')?.click();true");
 await sleep(650);
 const counts=await run("({main:document.querySelectorAll('#work .project-item').length,all:document.querySelectorAll('.project-archive .project-item').length,finance:document.querySelectorAll('.project-archive .project-item[data-project=finance]').length})");
 if(counts.all!==9||counts.finance!==1||counts.main!==7)throw Error('Project index mismatch '+JSON.stringify(counts));
 console.log('PASS mobile project counts',counts);
 await run("document.querySelector('.work-more').click();true");
 await until("document.querySelector('.project-archive')?.classList.contains('is-open')");
 await run("document.querySelector('.project-archive .project-item[data-project=finance] .project-row').click();true");
 await until("document.querySelector('.project-detail')?.classList.contains('is-open')");
 const details=await run("({title:document.querySelector('.project-detail__title')?.textContent,route:location.pathname,number:document.querySelector('.detail-number')?.textContent,live:[...document.querySelectorAll('.detail-actions a')].find(a=>a.href.includes('money-planning-theta'))?.href,proofs:document.querySelectorAll('.detail-evidence-grid .evidence-card').length,source:!!document.querySelector('.detail-actions a[href*=github]')})");
 if(details.title!=='Financial Independence Planner'||details.number!=='09'||details.route!=='/work/finance-planning'||details.live!=='https://money-planning-theta.vercel.app/'||details.proofs!==4||details.source)throw Error('Project detail failed '+JSON.stringify(details));
 console.log('PASS project detail, evidence and live link',details);
 await call('Page.navigate',{url:root+'work/finance-planning.html'});
 await until("document.querySelectorAll('.evidence-grid .evidence-card').length===4");
 const standalone=await run("({title:document.title,h1:document.querySelector('h1')?.textContent,action:document.querySelector('.case-actions a')?.href})");
 if(standalone.h1!=='Financial Independence Planner'||standalone.action!=='https://money-planning-theta.vercel.app/')throw Error('Standalone page failed '+JSON.stringify(standalone));
 await run("document.querySelector('.lang-toggle').click();true");
 const zh=await until("document.querySelector('.case-description')?.textContent.includes('財務獨立')");
 console.log('PASS standalone bilingual case',zh,standalone);
 console.log('FINANCE_BROWSER_PASS');
}finally{
 try{socket?.close()}catch{}
 processChrome.kill();
 await sleep(300);
 try{rmSync(dir,{force:true,recursive:true,maxRetries:3,retryDelay:150})}catch{}
}
