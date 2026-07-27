const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
(async () => {
  const tmpDir = 'D:/Claude Code+DeepSeekV4/.chrome-mc-test';
  if (fs.existsSync(tmpDir)) fs.rmSync(tmpDir, { recursive: true });
  fs.mkdirSync(tmpDir, { recursive: true });
  
  const browser = await puppeteer.launch({ 
    headless: 'new', 
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    userDataDir: tmpDir
  });
  const page = await browser.newPage();
  const errors = [];
  const logs = [];
  page.on('console', msg => { logs.push('[' + msg.type() + '] ' + msg.text()); });
  page.on('pageerror', err => errors.push(err.message));
  
  await page.goto('file:///D:/Claude%20Code+DeepSeekV4/city-life-story/dist/index.html', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForTimeout(3000);
  
  await page.evaluate(() => {
    if (typeof startNewGame === 'function') startNewGame();
  });
  await page.waitForTimeout(2000);
  
  const mcResult = await page.evaluate(() => {
    if (typeof mc !== 'undefined' && mc.run) {
      mc.run(100);
      return mc.report();
    }
    return 'MC not available';
  });
  
  const stateInfo = await page.evaluate(() => {
    if (typeof StateManager !== 'undefined') {
      const st = StateManager.getState();
      return {
        day: st.player ? st.player.day : null,
        cash: st.resources ? st.resources.cash : null,
        phase: st.player ? st.player.phase : null,
        gameOver: st.gameOver
      };
    }
    return 'StateManager not available';
  });
  
  console.log('=== State Info ===');
  console.log(JSON.stringify(stateInfo, null, 2));
  console.log('=== MC Result ===');
  console.log(JSON.stringify(mcResult, null, 2));
  console.log('=== Console Errors: ' + errors.length + ' ===');
  errors.slice(0, 15).forEach(e => console.log('  -', e));
  console.log('=== Console Logs (last 15) ===');
  logs.slice(-15).forEach(l => console.log('  ', l));
  
  await browser.close();
})();
