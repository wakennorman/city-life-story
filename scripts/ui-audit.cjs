/**
 * 浏览器端交互审计器 —— 补上项目验证栈的盲区
 *
 * 【为什么需要它】
 *   check:js  验语法（1177 文件）      —— node vm，无 DOM
 *   check:events 验数值 + 冒烟          —— node vm，无 DOM
 *   test:unit 验端口                   —— node vm，无 DOM
 * 三层门禁全绿，却**从来没有人点过一个按钮**。
 * 所以「点击调休没反应」「点击晋升条件没反应」这类问题
 * 可以在所有门禁亮绿灯的情况下长期存活。
 *
 * 【它做什么】
 *   1. 用 Edge 打开真实游戏，boot 到主界面
 *   2. 把存档设成一份**固定的中期基线**（在职 25 天 / AP 充足 / 有倦怠）
 *   3. 切到指定 Tab，枚举内容区里每一个带 onclick 的元素
 *   4. 每次点击前**重置回基线**（保证每个按钮独立公平试跑）
 *   5. 点击 → 对比 {消息条数, 关键状态, 弹窗数, 内容区 HTML}
 *   6. 判定：
 *        OK      状态变了 / 弹窗开了   → 正常
 *        GATED   只多了一条消息，状态没变 → 有反馈但被门槛挡住（UX 问题：门槛不透明）
 *        SILENT  什么都没发生              → 真·死按钮（BUG）
 *   7. 额外检查：消息日志是否在当前视口内可见（不可见 = 玩家看不到反馈）
 *
 * 用法: node scripts/ui-audit.cjs [tab]     默认 career
 *   前置: 需先起静态服务 → python -m http.server 8899
 */
const puppeteer = require('puppeteer');
const { EDGE, attachErrorSink, boot, dismissModals } = require('./_boot.cjs');

const URL = process.env.AUDIT_URL || 'http://127.0.0.1:8899/src/index.html';
const TAB = process.argv[2] || 'career';
const SUBTAB = process.argv[3] || 'career_jobs';

// ── 基线存档：中期在职状态，门槛都该满足 ──────────────────────
const BASE_PATCH = `(function () {
  var s = StateManager.getState();
  s.player.day = 40;
  s.player.actionPoints = 20;
  s.player.maxActionPoints = 20;
  s.player.physique = 40; s.player.intelligence = 40; s.player.agility = 40;
  s.player.charm = 40; s.player.mental = 40;
  s.resources.cash = 50000;
  s.resources.totalEarned = 50000;
  if (s.needs) { s.needs.happiness = 50; s.needs.hunger = 60; s.needs.energy = 70; }
  if (s.status) { s.status.health = 90; s.status.fatigue = 30; }
  s.career = s.career || {};
  s.career.history = s.career.history || [];
  s.career.currentJob = {
    path: 'logistics', levelId: 'log_sorter', levelName: '仓储分拣工',
    salary: 4500, workDays: 25, performance: 50, startDay: 15,
    _lastBreakDay: -999, _lastPaidLeaveDay: 0, _lastJobhopDay: -999
  };
  // 职业资本：career_dev.js 的 ensureCareerCapital 写在 state.careerCapital（顶层）。
  // 注意别写成 state.career.capital —— 那是 core/domain_c_linkage_r4xx 的私有存储，
  // 写错位置会让「跳槽机会」因 clientLeads 判定失败而整段不渲染，测不到按钮。
  s.careerCapital = s.careerCapital || {};
  s.careerCapital.burnout = 40;
  s.careerCapital.industryResources = 30;
  s.careerCapital.clientLeads = 20;
  s.careerCapital.reputation = 35;
  // 同事网络：职场社交面板只在有同事数据时渲染
  if (typeof ensureSocialNetworkState === 'function') ensureSocialNetworkState(s);
  if (s.skills) { s.skills.management = 40; s.skills.coding = 30; s.skills.cooking = 30; s.skills.medicine = 20; }
  if (typeof renderAll === 'function') renderAll();
  return true;
})()`;

// 事业 tab 子页（render_infra.js 的 renderCareerTab 读的是 state._careerTabSubTab）
const SUBTAB_PATCH = (id) => `(function () {
  var s = StateManager.getState();
  s._careerTabSubTab = ${JSON.stringify(id)};
  if (typeof renderAll === 'function') renderAll();
  return s._careerTabSubTab;
})()`;

// ── 快照：状态指纹 + 消息 + 弹窗 + 内容区 ────────────────────
const SNAPSHOT = `(function () {
  var s = StateManager.getState();
  var log = s.messageLog || [];
  var ca = document.getElementById('content-area');
  var lc = document.getElementById('message-log');
  var lcRect = lc ? lc.getBoundingClientRect() : null;
  return {
    logLen: log.length,
    lastMsg: log.length ? String(log[log.length - 1].text) : '',
    lastType: log.length ? String(log[log.length - 1].type) : '',
    ap: s.player.actionPoints,
    day: s.player.day,
    cash: s.resources.cash,
    burnout: s.career && s.career.capital ? s.career.capital.burnout : null,
    leads: s.career && s.career.capital ? s.career.capital.clientLeads : null,
    rep: s.career && s.career.capital ? s.career.capital.reputation : null,
    perf: s.career && s.career.currentJob ? s.career.currentJob.performance : null,
    workDays: s.career && s.career.currentJob ? s.career.currentJob.workDays : null,
    jobLevel: s.career && s.career.currentJob ? s.career.currentJob.levelName : null,
    hp: s.status ? s.status.health : null,
    mood: s.needs ? s.needs.happiness : null,
    modalCount: document.querySelectorAll('.modal-overlay').length,
    modalCalls: window.__mdCount || 0,
    htmlLen: ca ? ca.innerHTML.length : 0,
    logVisible: lcRect ? (lcRect.top < window.innerHeight && lcRect.bottom > 0) : false,
    logTop: lcRect ? Math.round(lcRect.top) : null,
    logH: lcRect ? Math.round(lcRect.height) : null,
    viewportH: window.innerHeight,
  };
})()`;

const sigOf = (s) => [s.ap, s.cash, s.burnout, s.leads, s.rep, s.perf, s.workDays, s.jobLevel, s.hp, s.mood].join('|');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: 'new',
    protocolTimeout: 25000,
    args: ['--no-sandbox', '--disable-background-timer-throttling',
           '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const errs = attachErrorSink(page);
  // 关键：headless 下 confirm()/alert() 会挂起主线程 → 必须自动应答，
  // 否则会把「确认对话框」误判成「页面卡死（HANG）」。
  page.on('dialog', async (d) => {
    try { await d.accept(); } catch (e) { /* 已被关闭 */ }
  });

  console.log('加载 ' + URL);
  const b = await boot(page, URL);
  console.log('boot:', JSON.stringify(b));
  if (b.mainH <= 0) { console.log('★ boot 未展开布局，退出'); await browser.close(); process.exit(1); }

  // 埋点：统计 showModal 真实调用次数。
  // 为什么不用轮询 .modal-overlay：弹窗可能在两次采样之间被开-关，
  // 也可能因「已有弹窗则静默丢弃」而不出现——计数才能区分这两种情况。
  await page.evaluate(() => {
    window.__mdCount = 0;
    window.__mdDrop = 0;
    const orig = window.showModal;
    window.showModal = function () {
      const before = document.querySelectorAll('.modal-overlay').length;
      window.__mdCount++;
      const r = orig.apply(this, arguments);
      if (document.querySelectorAll('.modal-overlay').length === before) window.__mdDrop++;
      return r;
    };
  });

  // 关掉可能弹出的引导/弹窗（boot 里已清过一轮，这里兜底）
  await dismissModals(page);

  // ── 打基线 + 切 tab ─────────────────────────────────────
  await page.evaluate(BASE_PATCH);
  await page.evaluate((sub) => {
    var s = StateManager.getState();
    s._careerTabSubTab = sub;
    s._careerSubTab = sub;
    if (typeof switchTab === 'function') switchTab('career');
  }, SUBTAB);
  await page.evaluate((t) => { if (typeof switchTab === 'function') switchTab(t); }, TAB);
  await new Promise((r) => setTimeout(r, 1200));
  const baseJson = await page.evaluate(() => JSON.stringify(StateManager.getState()));

  // ── 枚举内容区可点元素 ──────────────────────────────────
  // 必须覆盖三种接线方式，漏任何一种都会把「有按钮的 tab」误报成「一个按钮都没有」：
  //   (a) 内联 onclick="fn()"   → onclick **属性**
  //   (b) el.onclick = fn       → 只有 onclick **属性对象**，没有 attribute
  //   (c) el.addEventListener('click', fn)  → 属性/attribute 都没有
  //       行动 tab 的 .action-card 全走 (c)，由 action_sort.js 约定：可点即带 .interactive
  const ENUM = `(function () {
    var ca = document.getElementById('content-area');
    if (!ca) return { list: [], staticCards: 0 };
    var sel = 'button, .btn, [role=button], [onclick], .interactive, .action-card, a[href]';
    var list = [...ca.querySelectorAll(sel)].map(function (el, i) {
      var cs = getComputedStyle(el);
      var r = el.getBoundingClientRect();
      var rf = el.querySelector('.req-fail');
      return {
        idx: i,
        tag: el.tagName,
        cls: String(el.className || '').slice(0, 34),
        text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 40),
        ocAttr: el.getAttribute('onclick') || '',
        hasProp: typeof el.onclick === 'function',
        wire: el.classList.contains('interactive') ? 'interactive' : '',
        reqFail: rf ? (rf.textContent || '').trim().slice(0, 40) : '',
        visible: cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0,
        disabled: el.disabled === true || el.classList.contains('disabled'),
      };
    }).filter(function (t) { return t.visible && !t.disabled; });
    // 静态卡：有 .action-card 但没 .interactive —— 按约定是「不可交互」，若视觉上仍像按钮就是问题
    var staticCards = [...ca.querySelectorAll('.action-card')].filter(function (e) {
      return !e.classList.contains('interactive');
    }).length;
    return { list: list, staticCards: staticCards };
  })()`;
  const enumRes = await page.evaluate(ENUM);
  const targets = enumRes.list;
  const nowire = targets.filter((t) => !t.ocAttr && !t.hasProp && !t.wire).length;

  console.log('\n=== Tab「' + TAB + '」内容区可点元素：' + targets.length + ' 个（未接线 ' + nowire +
    ' / 静态卡 .action-card 无 .interactive：' + enumRes.staticCards + '）===');

  const results = [];
  let idx = 0;
  for (const t of targets) {
    idx++;
    process.stdout.write('\n[' + idx + '/' + targets.length + '] 「' + t.text + '」 ' +
      (t.ocAttr ? t.ocAttr.slice(0, 55) : (t.hasProp ? 'onclick=fn(属性)' : '★无任何接线')) + '\n  → ');
    // 重置基线
    await page.evaluate((bj) => {
      StateManager._state = JSON.parse(bj);
      if (typeof renderAll === 'function') renderAll();
    }, baseJson);
    await page.evaluate((args) => {
      if (typeof switchTab === 'function') switchTab(args.tab);
      var s = StateManager.getState();
      s._careerTabSubTab = args.sub;
      s._careerSubTab = args.sub;
      if (typeof renderAll === 'function') renderAll();
    }, { tab: TAB, sub: SUBTAB });
    await new Promise((r) => setTimeout(r, 350));

    const before = await page.evaluate(SNAPSHOT);
    errs.length = 0;

    // 真实点击：按索引取元素（renderAll 从同一份基线渲染，索引稳定）
    let clicked = false;
    try {
      clicked = await page.evaluate((i) => {
        const ca = document.getElementById('content-area');
        if (!ca) return false;
        const el = [...ca.querySelectorAll('button, .btn, [role=button], [onclick], .interactive, .action-card, a[href]')][i];
        if (!el) return false;
        el.click();
        return true;
      }, t.idx);
      await new Promise((r) => setTimeout(r, 600));
    } catch (e) {
      // 主线程被卡死 ⇒ 死循环
      console.log('★ HANG —— 点击后浏览器主线程无响应（' + String(e.message).slice(0, 60) + '）');
      results.push({ ...t, verdict: 'HANG', msg: '', msgType: '', errs: ['主线程卡死：' + String(e.message).slice(0, 80)] });
      // 页面已死，后面测不了
      console.log('\n★ 页面主线程卡死，剩余 ' + (targets.length - idx) + ' 个目标无法继续。');
      break;
    }

    const after = await page.evaluate(SNAPSHOT);
    const errsNow = [...new Set(errs)];

    let verdict;
    if (!clicked) verdict = 'NOTFOUND';
    else if (errsNow.length) verdict = 'ERROR';
    else if (sigOf(before) !== sigOf(after)) verdict = 'OK';
    else if (after.modalCalls > before.modalCalls) verdict = 'MODAL';
    else if (after.logLen > before.logLen) verdict = 'GATED';
    else if (after.htmlLen !== before.htmlLen) verdict = 'RERENDER';
    else verdict = 'SILENT';

    console.log(verdict + (after.logLen > before.logLen ? '  [' + after.lastType + '] ' + after.lastMsg.slice(0, 60) : ''));

    results.push({ ...t, verdict, msg: after.lastMsg, msgType: after.lastType, errs: errsNow });

    // 清理弹窗，避免污染下一轮
    if (after.modalCount > 0) await dismissModals(page);
  }

  // ── 报告 ────────────────────────────────────────────────
  const byV = {};
  results.forEach((r) => { (byV[r.verdict] = byV[r.verdict] || []).push(r); });
  console.log('\n判定分布: ' + Object.entries(byV).map(([k, v]) => k + '=' + v.length).join('  '));

  const order = ['HANG', 'ERROR', 'SILENT', 'NOTFOUND', 'GATED', 'MODAL', 'RERENDER', 'OK'];
  for (const v of order) {
    const list = byV[v]; if (!list) continue;
    console.log('\n──── ' + v + ' (' + list.length + ') ────');
    list.forEach((r) => {
      console.log('  「' + r.text + '」');
      console.log('     ' + (r.ocAttr ? 'onclick=' + r.ocAttr.slice(0, 90) : (r.hasProp ? 'onclick=属性句柄' : '★ 未接线')));
      if (r.msg) console.log('     反馈: [' + r.msgType + '] ' + r.msg.slice(0, 70));
      r.errs.forEach((e) => console.log('     ★ ' + e));
    });
  }

  const snap = await page.evaluate(SNAPSHOT);
  console.log('\n=== 消息日志可见性 ===');
  console.log('  日志 top=' + snap.logTop + 'px  高=' + snap.logH + 'px  视口高=' + snap.viewportH +
    ' → ' + (snap.logVisible ? '可见' : '★ 在视口外/零高（玩家看不到反馈）'));

  console.log('\n=== 全局错误 (' + new Set(errs).size + ') ===');
  [...new Set(errs)].slice(0, 10).forEach((e) => console.log('  ' + e));

  await browser.close();
})();
