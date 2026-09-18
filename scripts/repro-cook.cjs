/**
 * 复现用户反馈③：城中村合租床位下，提示框「在家做饭」点击无反应
 * 用法: node scripts/repro-cook.cjs
 */
const puppeteer = require('puppeteer');
const { EDGE, attachErrorSink, boot, dismissModals } = require('./_boot.cjs');
const URL = 'http://127.0.0.1:8899/src/index.html';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: 'new', protocolTimeout: 25000,
    args: ['--no-sandbox', '--disable-background-timer-throttling'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = attachErrorSink(page);
  page.on('dialog', async (d) => { try { await d.accept(); } catch (e) {} });

  const b = await boot(page, URL);
  console.log('boot:', JSON.stringify(b));

  // ── 构造用户场景：城中村合租床位（tier 1） ──
  const setup = await page.evaluate(() => {
    var s = StateManager.getState();
    s.housing.tier = 1;                       // 1 = 合租床位
    s.trade.currentLocation = 'slum';         // 城中村
    s.investment.selfLivePropertyId = null;   // 无自住房
    s.needs.hunger = 5;                       // 饿到临界
    s.player.actionPoints = 100;
    s.resources.cash = 1000;
    if (typeof renderAll === 'function') renderAll();

    var house = (typeof HOUSING_TIERS !== 'undefined' && HOUSING_TIERS[1]) || null;
    var homeAm = typeof getHomeAmenities === 'function' ? getHomeAmenities(s) : [];
    var nearFood = typeof getNearestAmenitiesByType === 'function' ? getNearestAmenitiesByType(s, 'food', 4) : [];
    return {
      housingTier: s.housing.tier,
      houseName: house ? house.name : null,
      canCook: house ? house.canCook : null,
      canBathe: house ? house.canBathe : null,
      canRest: house ? house.canRest : null,
      homeAmenityIds: homeAm.map(function (a) { return a.id + '(' + a.type + ')'; }),
      homeLocKey: typeof getHomeLocationKey === 'function' ? getHomeLocationKey(s) : null,
      nearestFood: nearFood.map(function (n) { return n.amenity.id + ' @' + n.actualLoc + ' hops=' + n.hops; }),
    };
  });
  console.log('\n=== 场景构造 ===');
  console.log(JSON.stringify(setup, null, 2));

  // ── 打开临界提示框，列出按钮状态 ──
  await page.evaluate(() => {
    window.__mdCount = 0;
    var orig = window.showModal;
    window.showModal = function () { window.__mdCount++; return orig.apply(this, arguments); };
    window.__clicked = [];
  });

  const modalInfo = await page.evaluate(() => {
    var s = StateManager.getState();
    if (typeof showCriticalChoiceModal === 'function') showCriticalChoiceModal(s, 'hunger');
    return 'opened';
  });
  await new Promise((r) => setTimeout(r, 500));

  const btnInfo = await page.evaluate(() => {
    var ov = document.querySelector('.modal-overlay');
    if (!ov) return { found: false };
    var btns = [...ov.querySelectorAll('button')];
    return {
      found: true,
      title: (ov.querySelector('h2') || {}).textContent,
      body: (ov.querySelector('.modal-body') || {}).innerText ? (ov.querySelector('.modal-body').innerText || '').replace(/\s+/g, ' ').slice(0, 150) : '',
      buttons: btns.map(function (b, i) {
        return { i: i, text: (b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70),
                 disabled: b.disabled === true, title: b.title || '' };
      }),
    };
  });
  console.log('\n=== 临界提示框 ===');
  console.log(JSON.stringify(btnInfo, null, 2));

  // ── 点击「在家做饭」 ──
  const cookIdx = (btnInfo.buttons || []).findIndex((x) => x.text.indexOf('在家做饭') >= 0);
  console.log('\n=== 定位「在家做饭」按钮 idx=' + cookIdx + ' ===');

  if (cookIdx >= 0) {
    const before = await page.evaluate(() => {
      var s = StateManager.getState();
      return { logLen: (s.messageLog || []).length, modals: document.querySelectorAll('.modal-overlay').length,
               modalTitle: (document.querySelector('.modal-overlay h2') || {}).textContent || '',
               hunger: s.needs.hunger, ap: s.player.actionPoints, cash: s.resources.cash };
    });
    await page.evaluate((i) => {
      var ov = document.querySelector('.modal-overlay');
      var btns = [...ov.querySelectorAll('button')];
      btns[i].click();
    }, cookIdx);
    await new Promise((r) => setTimeout(r, 900));
    const after = await page.evaluate(() => {
      var s = StateManager.getState();
      var log = s.messageLog || [];
      return { logLen: log.length, lastMsg: log.length ? String(log[log.length - 1].text) : '',
               lastType: log.length ? String(log[log.length - 1].type) : '',
               modals: document.querySelectorAll('.modal-overlay').length,
               modalTitle: (document.querySelector('.modal-overlay h2') || {}).textContent || '',
               modalBody: (document.querySelector('.modal-overlay .modal-body') || {}).innerText
                 ? (document.querySelector('.modal-overlay .modal-body').innerText || '').replace(/\s+/g, ' ').slice(0, 200) : '',
               hunger: s.needs.hunger, ap: s.player.actionPoints, cash: s.resources.cash };
    });
    console.log('\n点击前:', JSON.stringify(before));
    console.log('点击后:', JSON.stringify(after));

    if (after.logLen === before.logLen && after.modalTitle === before.modalTitle &&
        after.hunger === before.hunger && after.ap === before.ap && after.cash === before.cash) {
      console.log('\n★★ 判定：完全无反应（无消息 / 弹窗标题未变 / 无状态变化）—— 复现成功');
    } else if (after.modalTitle && after.modalTitle !== before.modalTitle) {
      console.log('\n判定：弹窗已切换 → 「' + before.modalTitle + '」→「' + after.modalTitle + '」✓ 正常');
    } else if (after.modals > before.modals) {
      console.log('\n判定：开了新弹窗 → 「' + after.modalTitle + '」');
    } else if (after.logLen > before.logLen) {
      console.log('\n判定：有消息反馈 → [' + after.lastType + '] ' + after.lastMsg);
    } else {
      console.log('\n判定：状态有变化');
    }
  }

  // 额外：直接调 travelToAmenityAndUse('selfhome_cook') 看内部走向
  await dismissModals(page);
  const direct = await page.evaluate(() => {
    var s = StateManager.getState();
    s.needs.hunger = 5; s.player.actionPoints = 100; s.resources.cash = 1000;
    var logBefore = (s.messageLog || []).length;
    var modBefore = document.querySelectorAll('.modal-overlay').length;
    var threw = null;
    try { travelToAmenityAndUse('selfhome_cook'); } catch (e) { threw = e.name + ': ' + e.message; }
    var log = s.messageLog || [];
    return {
      threw: threw,
      msgAdded: log.length - logBefore,
      lastMsg: log.length ? String(log[log.length - 1].text) : '',
      modalsAdded: document.querySelectorAll('.modal-overlay').length - modBefore,
      modalTitle: (document.querySelector('.modal-overlay h2') || {}).textContent || '',
    };
  });
  console.log('\n=== 直接调用 travelToAmenityAndUse("selfhome_cook") ===');
  console.log(JSON.stringify(direct, null, 2));

  console.log('\n=== 错误 (' + new Set(errs).size + ') ===');
  [...new Set(errs)].slice(0, 10).forEach((e) => console.log('  ' + e));

  await browser.close();
})();
