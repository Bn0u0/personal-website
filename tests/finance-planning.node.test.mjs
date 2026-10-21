import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
const root=path.resolve(import.meta.dirname,'..');
const get=name=>fs.readFileSync(path.join(root,name),'utf8');
const context={window:{}};
vm.runInNewContext(get('data/projects.js'),context);
const projects=context.window.__portfolioProjects;
const index=get('index.html'), page=get('work/finance-planning.html');
test('the canonical catalogue has 9 projects with valid finance metadata',()=>{
 assert.equal(context.window.__portfolioProjectList.length,9);
 const p=projects.finance;
 assert.equal(p.number,'09');assert.equal(p.route,'/work/finance-planning');
 assert.equal(p.liveUrl,'https://money-planning-theta.vercel.app');
 assert.equal(p.sourceUrl,null,'private repository must not be linked as public source');
 assert.equal(p.en.evidence.length,4);assert.equal(p.zh.evidence.length,4);
 assert.equal(p.zh.decisions.length,4);assert.equal(p.en.decisions.length,4);
 assert.ok(p.zh.description.includes('財務獨立'));
 assert.deepEqual(Object.values(projects).map(p=>p.number),['01','02','03','04','05','06','07','08','09']);
});
test('all-projects archive includes the new finance entry without changing curated selection',()=>{
 const main=index.split('<section class="project-archive"')[0];
 assert.equal((main.match(/data-project="finance"/g)||[]).length,0,'curated selected section should remain unchanged');
 assert.equal((index.match(/data-project="finance"/g)||[]).length,1);
 assert.match(index,/data-project="finance"[\s\S]*?Financial Independence Planner/);
 assert.match(index,/09 total/);
 for(const k of ['picnest','quant','grass','doodle','learning','battle','wasteland','pixel'])assert.ok(index.includes('data-project="'+k+'"'));
});
test('dedicated case study provides correct route, accessible content and live external link',()=>{
 assert.match(page,/<body data-project-page="finance">/);
 assert.match(page,/<title>Financial Independence Planner — BN0U0<\/title>/);
 assert.match(page,/<h1 class="case-title">Financial Independence Planner<\/h1>/);
 assert.match(page,/rel="canonical" href="https:\/\/personal-website-eta-navy-67.vercel.app\/work\/finance-planning"/);
 assert.match(page,/href="https:\/\/money-planning-theta.vercel.app" target="_blank" rel="noopener noreferrer"/);
 assert.match(page,/<script src="\/scripts\/project-page.js">/);
 assert.match(page,/class="evidence-grid"/);
 assert.match(page,/class="decision-list"/);
 assert.match(page,/<button class="lang-toggle"/);
});
test('sitemap includes new canonical project URL',()=>{
 const xml=get('sitemap.xml');
 assert.equal((xml.match(/work\/finance-planning/g)||[]).length,1);
 assert.match(xml,/<lastmod>2026-10-21<\/lastmod>/);
});
test('site exposes only the blank demo entrypoint and no editing credentials',()=>{
 assert.ok(!page.includes('?view='));
 assert.ok(!page.includes('&edit='));
 assert.ok(!page.includes('PRIVATE'));
 assert.ok(!page.includes('SUPABASE'));
});
