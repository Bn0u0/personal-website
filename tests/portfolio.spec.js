const {test,expect}=require('@playwright/test');
const AxeBuilder=require('@axe-core/playwright').default;

async function enter(page){
  await page.goto('/');
  const gate=page.locator('.entry-gate');
  if(await gate.count()){
    await page.locator('[data-entry-lang="en"]').click();
    await expect(gate).toHaveCount(0,{timeout:5000});
  }
}

test('home → PicNest journey → back stays coherent',async({page})=>{
  await enter(page);
  await expect(page.locator('.hero__title')).toContainText('things in my head');
  await page.locator('.project-item[data-project="picnest"] .project-row').first().click();
  await expect(page).toHaveURL(/\/work\/picnest$/);
  await expect(page.locator('.project-detail')).toHaveClass(/is-open/);
  await expect(page.locator('.detail-journey')).toBeVisible();
  await expect(page.locator('.detail-journey-step')).toHaveCount(6);
  await expect(page.locator('.detail-evidence-section')).toBeVisible();
  await expect(page.locator('.detail-evidence-grid .evidence-card')).toHaveCount(9);
  await expect(page.locator('.decision-trace li')).toHaveCount(4);
  await page.locator('.project-detail__close').click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('.project-detail')).not.toHaveClass(/is-open/);
});

test('lab lens exposes system view without blocking content',async({page})=>{
  await enter(page);
  await page.keyboard.press('l');
  await expect(page.locator('.lab-lens')).toHaveAttribute('aria-hidden','false');
  await expect(page.locator('[data-lab="viewport"]')).toContainText('×');
  await page.keyboard.press('l');
  await expect(page.locator('.lab-lens')).toHaveAttribute('aria-hidden','true');
});

test('home has no serious or critical axe violations',async({page})=>{
  await enter(page);
  const results=await new AxeBuilder({page}).analyze();
  const blocking=results.violations.filter(v=>v.impact==='serious'||v.impact==='critical');
  expect(blocking,blocking.map(v=>`${v.id}: ${v.help}`).join('\n')).toEqual([]);
});

test('standalone PicNest case renders journey and grounded evidence',async({page})=>{
  await page.goto('/work/picnest.html');
  await expect(page).toHaveTitle(/PicNest 2\.0/);
  await expect(page.locator('h1')).toHaveText('PicNest 2.0');
  await expect(page.locator('.journey-step')).toHaveCount(6);
  await expect(page.locator('.journey-reflection__copy')).toContainText('reliability');
  await expect(page.locator('.evidence-grid .evidence-card')).toHaveCount(9);
  await expect(page.locator('.decision-list li')).toHaveCount(4);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',/\/work\/picnest$/);
});
