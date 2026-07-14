/**
 * 新手引导系统
 *
 * 首次进入游戏时弹出逐步教程，引导玩家了解基本 UI 和操作。
 * 用 localStorage 标记已完成引导，不会再次出现。
 * 可随时在帮助菜单中重新触发。
 */

const TUTORIAL_KEY = "city_life_tutorial_done";

/** 当前教程对应的剧本ID（null = classic） */
var _currentTutorialScenarioId = null;

/** 获取当前剧本专属的 localStorage key */
function _tutorialKey(id) {
  var sid = id !== undefined ? id : _currentTutorialScenarioId;
  return sid ? TUTORIAL_KEY + "_" + sid : TUTORIAL_KEY;
}

/** 检查当前剧本教程是否已完成 */
function isTutorialDone() {
  try {
    if (localStorage.getItem(_tutorialKey()) === "1") return true;
    // 兼容旧key：经典模式下若已完成旧key也算完成
    if (
      !_currentTutorialScenarioId ||
      _currentTutorialScenarioId === "classic"
    ) {
      return localStorage.getItem(TUTORIAL_KEY) === "1";
    }
    return false;
  } catch (e) {
    return false;
  }
}

/** 标记当前剧本教程完成 */
function markTutorialDone() {
  try {
    localStorage.setItem(_tutorialKey(), "1");
    // 兼容：经典模式同时标记旧key
    if (
      !_currentTutorialScenarioId ||
      _currentTutorialScenarioId === "classic"
    ) {
      localStorage.setItem(TUTORIAL_KEY, "1");
    }
  } catch (e) {
    /* 静默 */
  }
}

/** 重置当前剧本教程（允许重新触发） */
function resetTutorial() {
  try {
    localStorage.removeItem(_tutorialKey());
    localStorage.removeItem(TUTORIAL_KEY);
  } catch (e) {
    /* 静默 */
  }
}

/**
 * 启动新手引导 — v4.0 剧本感知重写
 *
 * 每个剧本有独立的 localStorage key 和专属引导步骤。
 * 参考：BitLife即时代入 / Papers Please第一天压力 / Stardew Valley目标锚点
 */
function startTutorial() {
  // 检测当前剧本
  try {
    var st =
      typeof StateManager !== "undefined" ? StateManager.getState() : null;
    var sid =
      st && st.flags && st.flags._currentScenario
        ? st.flags._currentScenario
        : "classic";
    _currentTutorialScenarioId = sid;
  } catch (e) {
    _currentTutorialScenarioId = "classic";
  }

  if (isTutorialDone()) return;

  // 选择剧本专属步骤（找不到则回退到经典模式）
  var steps =
    SCENARIO_TUTORIAL_STEPS[_currentTutorialScenarioId] ||
    SCENARIO_TUTORIAL_STEPS["classic"];
  showTutorialStep(steps, 0);
}

// ====== 沙盒/经典模式 经典步骤（v3.0 原版） ======
// 保留在此供 SCENARIO_TUTORIAL_STEPS["classic"] 引用
var _CLASSIC_STEPS = [
  {
    title: "🏙️ 你来到这座城市",
    body: `
        <p style="color:var(--text-muted);font-size:11px;margin-bottom:6px;">——初来乍到，举目无亲。</p>
        <p style="line-height:1.85;font-size:13px;color:var(--text-primary);">
          你背着一个蛇皮袋从绿皮火车上走下来。<br>
          站台的风夹着煤灰，眼睛发酸。
        </p>
        <p style="line-height:1.85;font-size:13px;margin-top:10px;">
          口袋里：<strong style="color:var(--accent);">¥300</strong>（东拼西凑的路费）<br>
          没有债，但也几乎身无分文。
        </p>
        <p style="line-height:1.7;font-size:12px;color:var(--text-secondary);margin-top:10px;">
          这座城市不认识你。<br>
          没有背景，没有人脉，没有学历。<br>
          <strong>先活下去，再说其他的。</strong>
        </p>
        <p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:8px;margin-top:10px;">
          💡 每天行动力有限，怎么用——决定你能成为谁。
        </p>
      `,
    highlight: null,
    waitForClick: null,
  },
  {
    title: "📊 左侧是你的状态面板",
    body: `
        <p><strong>5维属性</strong>：体质 · 智力 · 敏捷 · 心智 · 魅力 — 影响工作效率和事件结果</p>
        <p><strong>5项需求</strong>：饥饱 · 疲劳 · 卫生 · 心情 · 健康 — 低于30触发危险提示</p>
        <p style="color:var(--text-muted);font-size:11px;margin-top:4px;">💡 顶部常驻状态条实时显示全部10项数据</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👆 点击左侧 <strong>状态面板</strong> 任意位置继续</p>
      `,
    highlight: "#sidebar",
    waitForClick: "#sidebar",
  },
  {
    title: "🏘️ 你在城中村，这是你的起点",
    body: `
        <p>每个地点有不同的 <strong>工作机会</strong> 和 <strong>商品价格</strong></p>
        <p>这里是你的主战场：<strong>点击行动卡片</strong>工作赚钱，或前往其他地点</p>
        <p style="color:var(--text-muted);font-size:11px;margin-top:4px;">💡 行动力用完后当天结束，明天重置继续</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👆 点击下方 <strong>行动区</strong> 任意位置继续</p>
      `,
    highlight: "#content-area",
    waitForClick: "#content-area",
  },
  {
    title: "🗑️ 试试第一次赚钱",
    body: `
        <p>找到 <strong>「废品回收」</strong> 卡片，点击它开始第一次工作</p>
        <p style="color:var(--text-secondary);font-size:11px;">每次行动消耗行动力，耗尽后当天结束</p>
        <p style="color:var(--accent);font-size:11px;margin-top:4px;">💡 前15天废品回收有新人加成+¥5，第一桶金就靠它</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👆 直接点击高亮处的 <strong>废品回收</strong> 卡片继续</p>
      `,
    highlight: '[data-action-id="waste_recycling"]',
    waitForClick: '[data-action-id="waste_recycling"]',
    hint: "找不到？废品回收是街头的入门工作，应该在行动卡片列表里。",
  },
  {
    title: "🍚 吃饱了才有力气干活",
    body: `
        <p>赚到钱后，点 <strong>「吃顿饭」</strong> 补充饥饱和精力</p>
        <p style="color:var(--accent);font-size:11px;">💡 新人福利：前10天吃饭只要¥5（正常¥10）</p>
        <p style="color:var(--text-secondary);font-size:11px;margin-top:4px;">饥饿低于30会拖累工作效率，及时补充</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👆 直接点击高亮处的 <strong>吃顿饭</strong> 卡片继续</p>
      `,
    highlight: '[data-action-id="eat"]',
    waitForClick: '[data-action-id="eat"]',
    hint: "吃顿饭通常和废品回收一样在行动卡片列表里。",
  },
  {
    title: "🗺️ 查看地图探索城市",
    body: `
        <p>点击顶部 <strong>「🗺️ 城市」</strong> 标签，查看城市全景地图</p>
        <p>地图显示所有地点、旅行方式（步行/地铁/打车）和当前位置</p>
        <p style="color:var(--accent);font-size:11px;margin-top:4px;">💡 最快差价路线：批发市场进货 → 商业区卖出赚差价</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👆 直接点击顶部 <strong>🗺️ 地图</strong> 标签继续</p>
      `,
    highlight: '[data-tab="city"]',
    waitForClick: '[data-tab="city"]',
  },
  // 步骤7：找住处（引导玩家用地图导航到城中村租床）
  {
    title: "🛏️ 找住处，别露宿街头",
    body: `
        <p style="font-size:12px;line-height:1.7;margin-bottom:8px;">
          露宿街头每天 <strong style="color:var(--danger);">损耗健康</strong>、拉低心情。<br>
          <strong>租个床位</strong>是今天最值得花的钱。
        </p>
        <div style="background:rgba(74,158,92,0.08);border:1px solid rgba(74,158,92,0.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;padding:3px 0;">🏘️ 合租床位 ¥30/天 — 最便宜的起步选择</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🏠 单间出租 ¥80/天 — 攒够钱后再升级</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">💤 入住后每晚自动恢复疲劳和健康</div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);">用地图导航到城中村，找「出租屋」行动入住。</p>
        <p style="color:var(--success);font-size:12px;margin-top:8px;">👆 点击顶部 <strong>🗺️ 地图</strong> 标签，去找住处吧</p>
      `,
    highlight: '[data-tab="city"]',
    waitForClick: '[data-tab="city"]',
  },
  // 步骤8：出发！（收尾引导，放在最后）
  {
    title: "🎯 出发！——你的城市闯关开始了",
    body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:8px;">🎯 今天先完成这3件事：</p>
        <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:8px;padding:10px 12px;margin-bottom:12px;">
          <div style="font-size:12px;padding:3px 0;">💵 废品回收，赚到¥100</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🍚 吃顿饭，别让饥饿拖累效率</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🛏️ 在城中村租个床位过夜</div>
        </div>
        <p style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;">
          💡 行动页顶部「🎯 当前目标」卡片会一直告诉你<strong>现在该做什么</strong>，随时看。
        </p>
        <p style="font-size:11px;color:var(--text-secondary);">
          🗺️ 关键地点：城中村（出租/入住）· 批发市场（进货）· 商业区（卖货）· 培训中心（学技能）· 科技园（应聘职场）
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:8px;">这座城市里，肯拼的人终究能混出来。加油！🏆</p>
      `,
    highlight: null,
    waitForClick: null,
  },
];

// ====== 所有剧本的专属新手引导步骤 v4.0 ======
// 设计参考：BitLife即时钩子 / Papers Please第一天压力任务 / Stardew Valley目标锚定
// 每个剧本：开场钩子→你的处境→你的优势→今天的行动→3天目标→出发
var SCENARIO_TUTORIAL_STEPS = {
  // ── 经典：城市务工者 ──────────────────────────────────────────────
  classic: _CLASSIC_STEPS,

  // ── 下岗再就业者 ──────────────────────────────────────────────────
  laid_off: [
    {
      title: "🏭 十五年，一纸通知",
      body: `
        <p style="color:var(--text-muted);font-size:11px;margin-bottom:6px;">——你不是第一个，也不会是最后一个。</p>
        <p style="line-height:1.85;font-size:13px;">
          工厂大门关了。手里是 <strong style="color:var(--accent);">¥8,000</strong> 遣散费，<br>
          还有一屁股银行贷款 <strong style="color:var(--danger);">¥3,000</strong>。
        </p>
        <p style="line-height:1.7;font-size:12px;margin-top:10px;">
          38岁，干了十五年，这座城市不认识你了。<br>
          但你不认命。<strong>你的手艺不会说谎。</strong>
        </p>
        <p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:8px;margin-top:10px;">
          💡 你的体质是别人两倍，修理/焊接技能打了底。这不是结束，是新的起点。
        </p>
      `,
      highlight: null,
      waitForClick: null,
    },
    {
      title: "💪 你的底牌——不是学历，是手艺",
      body: `
        <p><strong>左侧状态面板</strong>显示你的当前属性：</p>
        <div style="background:rgba(102,126,234,0.08);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;">
          <div>🔩 <strong>修理技能 Lv.25</strong> — 家电/机械修理高薪</div>
          <div style="margin-top:4px;">⚡ <strong>电工技能 Lv.20</strong> — 电路施工，需求大</div>
          <div style="margin-top:4px;">🔥 <strong>焊接技能 Lv.25</strong> — 工厂外包、装修收入</div>
          <div style="margin-top:4px;">💪 <strong>体质 45</strong> — 体力活效率最高</div>
        </div>
        <p style="color:var(--success);font-size:12px;">👉 请点击左侧 <strong>状态面板</strong> 确认你的当前状态</p>
      `,
      highlight: "#sidebar",
      waitForClick: "#sidebar",
    },
    {
      title: "⚠️ 时间就是钱——你的月度压力",
      body: `
        <p style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">算一笔账：</p>
        <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:8px 12px;font-size:12px;">
          <div>🏠 房租 ≈ ¥600/月</div>
          <div style="margin-top:3px;">🍚 吃饭 ≈ ¥300/月</div>
          <div style="margin-top:3px;">📱 贷款利息 ¥3,000 每天滚</div>
        </div>
        <p style="font-size:12px;margin-top:8px;">
          遣散费撑 <strong style="color:var(--danger);">约1个月</strong>。<br>
          1个月内必须找到稳定收入来源。
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👉 点击下方 <strong>行动区</strong> 继续</p>
      `,
      highlight: "#content-area",
      waitForClick: "#content-area",
    },
    {
      title: "🗺️ 你能做什么——找到出路",
      body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);">适合你的收入来源：</p>
        <div style="font-size:12px;padding:6px 0;">
          <div>🔨 <strong>体力搬运/建筑工地</strong> — 来钱快，不挑人</div>
          <div style="margin-top:4px;">🔩 <strong>家电维修接单</strong> — 技能变现，口碑积累</div>
          <div style="margin-top:4px;">📦 <strong>摆摊</strong> — 灵活，无门槛</div>
          <div style="margin-top:4px;">🛵 <strong>跑外卖/顺风车</strong> — 多劳多得，弹性大</div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:6px;">先去 🗺️ 地图看看——工厂区/批发市场/商业区都有机会。</p>
        <p style="color:var(--success);font-size:12px;">👉 点击顶部 <strong>🗺️ 地图</strong> 标签看看</p>
      `,
      highlight: '[data-tab="city"]',
      waitForClick: '[data-tab="city"]',
    },
    {
      title: "🎯 3天目标——先活着，再转型",
      body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);margin-bottom:8px;">接下来3天的任务：</p>
        <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;padding:3px 0;">💰 今天：找到第一笔收入（体力活或技能接单）</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🏠 明天：确认住所稳定（不能露宿）</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">📋 第3天：制定转型方向（摆摊/自营/跳槽）</div>
        </div>
        <p style="font-size:11px;color:var(--text-secondary);">
          🏆 长期目标：用双手磨出来的本事，在这座城市再立一次脚。
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">加油！你在工厂熬了十五年都熬过来了。🔥</p>
      `,
      highlight: null,
      waitForClick: null,
    },
  ],

  // ── 小镇做题家 ────────────────────────────────────────────────────
  small_town_grinder: [
    {
      title: "📚 全村第一个大学生",
      body: `
        <p style="color:var(--text-muted);font-size:11px;margin-bottom:6px;">——但这座城市里，本科文凭只是入场券。</p>
        <p style="line-height:1.85;font-size:13px;">
          你拖着行李箱来到这里，手机里还有父亲的消息：<br>
          <em style="color:var(--text-muted);">「到了吗？好好干。」</em>
        </p>
        <p style="line-height:1.7;font-size:12px;margin-top:10px;">
          现金 <strong style="color:var(--accent);">¥3,000</strong>，欠款 <strong style="color:var(--danger);">¥20,000</strong>。<br>
          智力42，差3点就能进科技园。<br>
          <strong>压力最大的不是钱，是——不能让他们失望。</strong>
        </p>
        <p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:8px;margin-top:10px;">
          💡 你有本科学历 + 英语基础 + 较高智力。对的方向上，这些都是加速器。
        </p>
      `,
      highlight: null,
      waitForClick: null,
    },
    {
      title: "🧠 你的资本——头脑比体力值钱",
      body: `
        <p>左侧面板显示你的当前属性：</p>
        <div style="background:rgba(102,126,234,0.08);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;">
          <div>🎓 <strong>本科学历</strong> — 很多职位的最低门槛</div>
          <div style="margin-top:4px;">🧠 <strong>智力 42</strong> — 再提升 3 点进入互联网职场（门槛45）</div>
          <div style="margin-top:4px;">🌐 <strong>英语 Lv.18</strong> — 外资/互联网优势</div>
          <div style="margin-top:4px;">💻 <strong>编程 Lv.10</strong> — IT路径基础已打好</div>
        </div>
        <p style="color:var(--success);font-size:12px;">👉 点击左侧 <strong>状态面板</strong> 看你的完整属性</p>
      `,
      highlight: "#sidebar",
      waitForClick: "#sidebar",
    },
    {
      title: "⏰ 债务在跑，你也要跑",
      body: `
        <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:8px 12px;font-size:12px;margin-bottom:8px;">
          <div>💸 欠款 ¥20,000，利息每天滚</div>
          <div style="margin-top:3px;">🏠 还没有住处（今天必须找到落脚点）</div>
          <div style="margin-top:3px;">🍚 现金只有 ¥3,000，顶多撑1个月</div>
        </div>
        <p style="font-size:12px;"><strong>最快路径：</strong> 今天去培训中心提升智力→ 达到45→ 进科技园→ 月薪稳定收入→ 还债</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👉 点击下方 <strong>行动区</strong> 继续</p>
      `,
      highlight: "#content-area",
      waitForClick: "#content-area",
    },
    {
      title: "🗺️ 你的起点在科技园",
      body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);">离互联网职场只差一步：</p>
        <div style="font-size:12px;padding:4px 0;">
          <div>📖 <strong>培训中心</strong> — 学课程提升智力到45（当前42）</div>
          <div style="margin-top:4px;">🏢 <strong>科技园</strong> — 智力45后可应聘入职（你已经在这里了）</div>
          <div style="margin-top:4px;">📦 <strong>批发市场</strong> — 倒卖差价快速积累资金</div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:6px;">先看地图，规划今天要去哪儿。</p>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>🗺️ 地图</strong> 标签</p>
      `,
      highlight: '[data-tab="city"]',
      waitForClick: '[data-tab="city"]',
    },
    {
      title: "🎯 3天目标——从学生到打工人",
      body: `
        <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;padding:3px 0;">📖 今天：学习/接小活，把智力推到45</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🏢 明天：去科技园投简历，拿到第一份职场工作</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">💰 第3天：稳定收入，开始还债计划</div>
        </div>
        <p style="font-size:11px;color:var(--text-secondary);">
          🏆 弧线：数据录入 → IT初级 → 晋升 → 还清学贷 → 让老家人骄傲
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">你是全村的希望。别辜负他们。📚</p>
      `,
      highlight: null,
      waitForClick: null,
    },
  ],

  // ── 外来打工者 ────────────────────────────────────────────────────
  foreign_worker: [
    {
      title: "🌏 离家千里，为了那点工资差价",
      body: `
        <p style="color:var(--text-muted);font-size:11px;margin-bottom:6px;">——这里的日薪，够妈妈买一个月的菜。</p>
        <p style="line-height:1.85;font-size:13px;">
          宿舍的铁架床吱呀作响。<br>
          现金只有 <strong style="color:var(--danger);">¥500</strong>，还欠了 <strong style="color:var(--danger);">¥10,000</strong> 来这里的路费。
        </p>
        <p style="line-height:1.7;font-size:12px;margin-top:10px;">
          语言不通，但手脚勤快。<br>
          工厂流水线——你唯一认识的路。<br>
          <strong>撑过去，就能汇钱回家。</strong>
        </p>
        <p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:8px;margin-top:10px;">
          💡 体力30，焊接Lv.8——先从流水线开始，积累够钱再转型。
        </p>
      `,
      highlight: null,
      waitForClick: null,
    },
    {
      title: "💪 你的生存武器——身板和韧性",
      body: `
        <div style="background:rgba(102,126,234,0.08);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;">
          <div>💪 <strong>体质 30</strong> — 流水线、搬运、工地</div>
          <div style="margin-top:4px;">🔥 <strong>焊接 Lv.8</strong> — 慢慢提升，将来能接外包</div>
          <div style="margin-top:4px;">🌐 <strong>英语 Lv.15</strong> — 比同类语言障碍少一点</div>
          <div style="margin-top:4px;">🧠 <strong>韧性</strong> — 你跨国来了，说明你不怕苦</div>
        </div>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>状态面板</strong> 看你的完整属性</p>
      `,
      highlight: "#sidebar",
      waitForClick: "#sidebar",
    },
    {
      title: "⚠️ ¥500 只够撑3天，要快",
      body: `
        <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:8px 12px;font-size:12px;margin-bottom:8px;">
          <div>🍚 吃饭 ¥10/天，三餐保证</div>
          <div style="margin-top:3px;">🛏️ 宿舍 ¥15/天（工厂提供可能更便宜）</div>
          <div style="margin-top:3px;">💸 路费借款 ¥10,000 日息 0.3%</div>
        </div>
        <p style="font-size:12px;"><strong>今天就要开工</strong>，流水线或建筑体力活是最快的钱。</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👉 点击下方 <strong>行动区</strong> 找工作</p>
      `,
      highlight: "#content-area",
      waitForClick: "#content-area",
    },
    {
      title: "🗺️ 工厂区就是你的根据地",
      body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);">你在工厂区，周边有：</p>
        <div style="font-size:12px;padding:4px 0;">
          <div>🏭 <strong>流水线工作</strong> — 日薪¥120-180，稳定</div>
          <div style="margin-top:4px;">🔨 <strong>建筑体力活</strong> — 不稳定但日薪更高</div>
          <div style="margin-top:4px;">🌙 <strong>夜间加班</strong> — 额外收入，工厂最常见</div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:6px;">等攒到 ¥3000+，可以开始考虑转去批发/零售。</p>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>🗺️ 地图</strong> 看城市布局</p>
      `,
      highlight: '[data-tab="city"]',
      waitForClick: '[data-tab="city"]',
    },
    {
      title: "🎯 3天目标——先存钱，再汇款",
      body: `
        <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;padding:3px 0;">⚙️ 今天：流水线打卡，赚到今天的饭钱+房钱</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">💰 3天内：积累 ¥500，偿还路费第一笔</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🌙 第一个月：攒到能汇回家的数目</div>
        </div>
        <p style="font-size:11px;color:var(--text-secondary);">
          🏆 弧线：流水线 → 技能外包 → 存钱 → 带着本事回家
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">妈妈在等你的汇款。坚持住。🌏</p>
      `,
      highlight: null,
      waitForClick: null,
    },
  ],

  // ── 二代创业者 ────────────────────────────────────────────────────
  second_gen: [
    {
      title: "💎 有钱，但不知道怎么用",
      body: `
        <p style="color:var(--text-muted);font-size:11px;margin-bottom:6px;">——钱和能力，是两回事。</p>
        <p style="line-height:1.85;font-size:13px;">
          银行卡里有 <strong style="color:var(--success);">¥150,000</strong>。<br>
          父亲把卡推过来说：「去做你想做的事。」
        </p>
        <p style="line-height:1.7;font-size:12px;margin-top:10px;">
          你心跳加速，但更多的是心虚。<br>
          你不知道从哪里开始。<br>
          <strong>¥150,000 烧完了，你还有什么？</strong>
        </p>
        <p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:8px;margin-top:10px;">
          ⚠️ 陷阱：钱很容易花出去，但技能和人脉是你的真正资产。
        </p>
      `,
      highlight: null,
      waitForClick: null,
    },
    {
      title: "💎 你的起点——钱多，但技能几乎为零",
      body: `
        <div style="background:rgba(102,126,234,0.08);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;">
          <div>💰 <strong>现金 ¥50,000 + 存款 ¥100,000</strong> — 巨大优势</div>
          <div style="margin-top:4px;">😰 <strong>技能几乎全是 0</strong> — 不懂怎么做生意</div>
          <div style="margin-top:4px;">🏠 <strong>单间已有</strong> — 生活无压力</div>
          <div style="margin-top:4px;">👁️ <strong>你在商业区</strong> — 靠近市场机会</div>
        </div>
        <p style="font-size:11px;color:var(--danger);">❌ 不要今天就去注册公司！先学，先看，再做。</p>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>状态面板</strong> 看你的属性</p>
      `,
      highlight: "#sidebar",
      waitForClick: "#sidebar",
    },
    {
      title: "📊 ¥150,000 能撑多久？",
      body: `
        <div style="background:rgba(234,179,8,0.08);border:1px solid rgba(234,179,8,0.3);border-radius:8px;padding:8px 12px;font-size:12px;margin-bottom:8px;">
          <div>📋 科技创业：每月燃烧率 ¥3-8万，6个月见分晓</div>
          <div style="margin-top:3px;">🏪 消费/零售：每月成本 ¥1-3万，回报慢但稳</div>
          <div style="margin-top:3px;">📈 盲目投资：随时亏完</div>
        </div>
        <p style="font-size:12px;"><strong>钱是工具，不是方向。</strong>先确定方向，再动钱。</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👉 点击下方 <strong>行动区</strong> 探索你能做的事</p>
      `,
      highlight: "#content-area",
      waitForClick: "#content-area",
    },
    {
      title: "🗺️ 你在商业区——观察，再出手",
      body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);">先去看看这些地方：</p>
        <div style="font-size:12px;padding:4px 0;">
          <div>🏢 <strong>科技园</strong> — 了解初创公司生态</div>
          <div style="margin-top:4px;">📦 <strong>批发市场</strong> — 了解贸易/进货</div>
          <div style="margin-top:4px;">🎓 <strong>培训中心</strong> — 学管理/销售/会计技能</div>
          <div style="margin-top:4px;">🏪 <strong>商业区</strong> — 观察哪些生意门庭若市</div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:6px;">第一周的任务是：学，不是花。</p>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>🗺️ 地图</strong> 规划今天的路线</p>
      `,
      highlight: '[data-tab="city"]',
      waitForClick: '[data-tab="city"]',
    },
    {
      title: "🎯 3天目标——定方向，不乱花",
      body: `
        <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;padding:3px 0;">🔍 今天：走访市场，找3个你感兴趣的方向</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">📚 明天：去培训中心学一项核心技能</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🎯 第3天：锁定方向（科技/消费/金融），制定预算</div>
        </div>
        <p style="font-size:11px;color:var(--text-secondary);">
          🏆 弧线：有钱但无能 → 学技能+找人脉 → 真正创业 → 证明给父亲看
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">有钱不是优势，把钱变成能力才是。💎</p>
      `,
      highlight: null,
      waitForClick: null,
    },
  ],

  // ── 中年危机职场人 ────────────────────────────────────────────────
  midlife_crisis: [
    {
      title: "👔 35岁，被裁那天",
      body: `
        <p style="color:var(--text-muted);font-size:11px;margin-bottom:6px;">——你不觉得委屈，你只觉得怕。</p>
        <p style="line-height:1.85;font-size:13px;">
          你抱着纸箱走出写字楼。<br>
          存款 <strong style="color:var(--success);">¥80,000</strong>，但房贷 <strong style="color:var(--danger);">¥50,000</strong> 还压着。
        </p>
        <p style="line-height:1.7;font-size:12px;margin-top:10px;">
          孩子的补习费，老婆的期待，父母的养老。<br>
          <strong>你不能停，也不能倒。</strong>
        </p>
        <p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:8px;margin-top:10px;">
          💡 但你有的，比大多数人多——编程30、管理25、销售15，六年经验。
        </p>
      `,
      highlight: null,
      waitForClick: null,
    },
    {
      title: "🃏 你的底牌——经验是最贵的资产",
      body: `
        <div style="background:rgba(102,126,234,0.08);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;">
          <div>💻 <strong>编程 Lv.30</strong> — 可接外包，月入 ¥8,000-25,000</div>
          <div style="margin-top:4px;">🧑‍💼 <strong>管理 Lv.25</strong> — 中层管理岗的天然优势</div>
          <div style="margin-top:4px;">📢 <strong>销售 Lv.15</strong> — 创业最需要的技能</div>
          <div style="margin-top:4px;">📊 <strong>会计 Lv.10</strong> — 自己会算账，创业不被坑</div>
        </div>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>状态面板</strong> 看完整属性</p>
      `,
      highlight: "#sidebar",
      waitForClick: "#sidebar",
    },
    {
      title: "⏰ 你每月必须赚多少？",
      body: `
        <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:8px 12px;font-size:12px;margin-bottom:8px;">
          <div>🏠 房贷月供 ≈ ¥3,000+</div>
          <div style="margin-top:3px;">👨‍👩‍👧 孩子补习/生活 ≈ ¥2,000</div>
          <div style="margin-top:3px;">🍚 家庭日常 ≈ ¥2,000</div>
          <div style="margin-top:3px;font-weight:600;color:var(--danger);">→ 每月至少需要 ¥8,000</div>
        </div>
        <p style="font-size:12px;">存款 ¥80,000 可以撑 <strong>约10个月</strong>。你有时间，但不多。</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👉 点击 <strong>行动区</strong> 看你现在能做什么</p>
      `,
      highlight: "#content-area",
      waitForClick: "#content-area",
    },
    {
      title: "🗺️ 你在科技园——机会就在这里",
      body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);">三条路，选一条：</p>
        <div style="font-size:12px;padding:4px 0;">
          <div>📩 <strong>投简历降薪求职</strong> — 先有收入，小公司也行</div>
          <div style="margin-top:4px;">💻 <strong>接编程/管理外包</strong> — 用技能直接赚钱，最快</div>
          <div style="margin-top:4px;">🚀 <strong>拿存款创业</strong> — 高风险高回报，慎重</div>
        </div>
        <p style="font-size:11px;color:var(--text-muted);margin-top:6px;">建议先去事业发展Tab看看职业路径，想好方向。</p>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>🗺️ 地图</strong> 熟悉城市布局</p>
      `,
      highlight: '[data-tab="city"]',
      waitForClick: '[data-tab="city"]',
    },
    {
      title: "🎯 3天目标——算清楚，再出手",
      body: `
        <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;padding:3px 0;">📋 今天：算清家庭月开销，确定最低收入线</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">💼 明天：发出第一份简历，或接第一单外包</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🎯 第3天：锁定路线（打工/创业/自由职业）</div>
        </div>
        <p style="font-size:11px;color:var(--text-secondary);">
          🏆 弧线：被裁 → 用经验接单/再就业 → 稳住家庭 → 中年逆袭
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">六年磨的刀，不会白磨。你比年轻人有一样东西：经历。👔</p>
      `,
      highlight: null,
      waitForClick: null,
    },
  ],

  // ── 应届毕业生 ────────────────────────────────────────────────────
  fresh_grad: [
    {
      title: "🎓 第一次靠自己",
      body: `
        <p style="color:var(--text-muted);font-size:11px;margin-bottom:6px;">——没有人再托底了。</p>
        <p style="line-height:1.85;font-size:13px;">
          毕业典礼第二天，你坐上了来这里的火车。<br>
          现金 <strong style="color:var(--accent);">¥2,000</strong>，债务 <strong style="color:var(--danger);">¥23,000</strong>。
        </p>
        <p style="line-height:1.7;font-size:12px;margin-top:10px;">
          你年轻，有学历，有想法。<br>
          但你没有经验，没有人脉，不知道自己能做什么。<br>
          <strong>这就是进入社会的第一天。</strong>
        </p>
        <p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:8px;margin-top:10px;">
          💡 年轻是最大的资产——你有时间可以试错。但先要活下去。
        </p>
      `,
      highlight: null,
      waitForClick: null,
    },
    {
      title: "🌱 你的资本——年轻 + 学历 + 潜力",
      body: `
        <div style="background:rgba(102,126,234,0.08);border-radius:8px;padding:8px 12px;margin:8px 0;font-size:12px;">
          <div>🎓 <strong>本科学历</strong> — 应聘门槛已过</div>
          <div style="margin-top:4px;">🧠 <strong>智力 32</strong> — 还差13点进职场（门槛45，学习能提升）</div>
          <div style="margin-top:4px;">💻 <strong>编程 Lv.15</strong> — IT初级岗的基础</div>
          <div style="margin-top:4px;">🌐 <strong>英语 Lv.20</strong> — 外资/互联网优势</div>
        </div>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>状态面板</strong> 看你的完整数据</p>
      `,
      highlight: "#sidebar",
      waitForClick: "#sidebar",
    },
    {
      title: "⚠️ ¥2,000 只够撑半个月",
      body: `
        <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:8px;padding:8px 12px;font-size:12px;margin-bottom:8px;">
          <div>🍚 吃饭 ≈ ¥10/天</div>
          <div style="margin-top:3px;">🏠 还没有住处，必须尽快找</div>
          <div style="margin-top:3px;">💸 债务 ¥23,000 每天产生利息</div>
        </div>
        <p style="font-size:12px;"><strong>今天优先级：</strong> ① 找住处 ② 找收入来源 ③ 别一次性花光钱</p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">👉 点击下方 <strong>行动区</strong> 看今天能做什么</p>
      `,
      highlight: "#content-area",
      waitForClick: "#content-area",
    },
    {
      title: "🗺️ 你在学校附近——离职场很近",
      body: `
        <p style="font-size:12px;font-weight:600;color:var(--accent);">新手最适合的路线：</p>
        <div style="font-size:12px;padding:4px 0;">
          <div>📖 <strong>培训中心</strong> — 学习提升智力/技能</div>
          <div style="margin-top:4px;">🏢 <strong>科技园</strong> — 达到条件后投简历入职</div>
          <div style="margin-top:4px;">🌃 <strong>副业</strong> — 接单、外包、打零工补收入</div>
          <div style="margin-top:4px;">🏚️ <strong>城中村</strong> — 先租最便宜的床位</div>
        </div>
        <p style="color:var(--success);font-size:12px;">👉 点击 <strong>🗺️ 地图</strong> 规划你的起步路线</p>
      `,
      highlight: '[data-tab="city"]',
      waitForClick: '[data-tab="city"]',
    },
    {
      title: "🎯 3天目标——从学生到打工人",
      body: `
        <div style="background:rgba(102,126,234,0.08);border:1px solid rgba(102,126,234,0.2);border-radius:8px;padding:10px 12px;margin-bottom:10px;">
          <div style="font-size:12px;padding:3px 0;">🏠 今天：在城中村找到住处（床位¥15/天起）</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">💰 明天：接第一单小活/去培训中心提升</div>
          <div style="font-size:12px;padding:3px 0;border-top:1px solid rgba(255,255,255,0.05);">🏢 第3天：达到入职条件，找第一份正式工作</div>
        </div>
        <p style="font-size:11px;color:var(--text-secondary);">
          🏆 弧线：应届生 → 职场新人 → 晋升 → 还清助学贷款 → 在这座城市立足
        </p>
        <p style="color:var(--success);font-size:12px;margin-top:6px;">你才22岁，错了还能重来。但要快。🎓</p>
      `,
      highlight: null,
      waitForClick: null,
    },
  ],
};

/** 逐步展示引导 — v5.0 两阶段流程
 *
 *  有 waitForClick 的步骤 = 两阶段：
 *    Phase 1: 弹窗说明 + "好的，我知道了" 按钮
 *    Phase 2: 关闭弹窗 → 高亮目标 → 玩家必须点击目标才能继续
 *
 *  无 waitForClick 的步骤（首尾介绍/纯信息）= 传统单弹窗
 */
function showTutorialStep(steps, index) {
  cleanupHighlight();
  _clearWaitForClickListeners();
  _removeSkipHint();

  if (index >= steps.length) {
    cleanupHighlight();
    markTutorialDone();
    StateManager.addMessage(
      "✅ 新手引导完成！点击 ❓ 帮助按钮可随时回顾。",
      "success",
    );
    return;
  }

  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;
  _currentTutorialSteps = steps;
  _currentTutorialIndex = index;

  // ===== 两阶段流程：有 waitForClick 的步骤 =====
  // Phase 1: 弹窗说明 → "好的，我知道了"
  // Phase 2: 关闭弹窗 → 高亮目标 → 等待玩家点击目标
  if (step.waitForClick) {
    const buttons = [];

    // 上一步（只要不是第一步）
    if (index > 0) {
      buttons.push({
        text: "← 上一步",
        cls: "",
        callback: () => {
          showTutorialStep(steps, index - 1);
        },
      });
    }

    buttons.push({
      text: "跳过引导",
      cls: "",
      callback: () => {
        _confirmSkip(steps);
      },
    });

    buttons.push({
      text: "好的，我知道了 👆",
      cls: "btn-primary",
      callback: () => {
        // 弹窗关闭后进入 Phase 2：高亮目标 + 等待点击
        setTimeout(() => {
          if (step.highlight) {
            highlightElement(step.highlight);
          }
          _attachWaitForClick(step.waitForClick, steps, index, step.hint);
          _showSkipHint(steps, index);
        }, 150);
      },
    });

    showModal({
      title: `${index + 1}/${steps.length} ${step.title}`,
      body: step.body,
      buttons,
    });

    setTimeout(() => {
      const overlay = document.querySelector(".modal-overlay");
      if (overlay) {
        overlay.classList.add("tutorial-overlay");
        const box = overlay.querySelector(".modal-box");
        if (box) box.classList.add("tutorial-box");
      }
    }, 10);
    return;
  }

  // ===== 传统单弹窗流程：无 waitForClick 的步骤 =====
  if (step.highlight) {
    highlightElement(step.highlight);
  }

  const buttons = [];
  if (isFirst) {
    buttons.push({
      text: "跳过引导",
      cls: "",
      callback: () => {
        _confirmSkip(steps);
      },
    });
    buttons.push({
      text: "开始引导 →",
      cls: "btn-primary",
      callback: () => {
        showTutorialStep(steps, index + 1);
      },
    });
  } else if (isLast) {
    buttons.push({
      text: "🎯 开始游戏！",
      cls: "btn-primary",
      callback: () => {
        cleanupHighlight();
        markTutorialDone();
        StateManager.addMessage(
          "✅ 新手引导完成！点击 ❓ 帮助按钮可随时回顾。",
          "success",
        );
      },
    });
  } else {
    buttons.push({
      text: "← 上一步",
      cls: "",
      callback: () => {
        showTutorialStep(steps, index - 1);
      },
    });
    buttons.push({
      text: "下一步 →",
      cls: "btn-primary",
      callback: () => {
        showTutorialStep(steps, index + 1);
      },
    });
  }

  showModal({
    title: `${index + 1}/${steps.length} ${step.title}`,
    body: step.body,
    buttons,
  });

  setTimeout(() => {
    const overlay = document.querySelector(".modal-overlay");
    if (overlay) {
      overlay.classList.add("tutorial-overlay");
      const box = overlay.querySelector(".modal-box");
      if (box) box.classList.add("tutorial-box");
    }
  }, 10);
}

/** v3.0 新增：等待玩家点击目标元素才推进 */
var _currentTutorialSteps = null;
var _currentTutorialIndex = 0;
var _waitForClickListeners = []; // 记录所有监听以便清理

function _attachWaitForClick(selector, steps, index, hint) {
  // 等待 DOM 渲染完成（renderAll 是同步的，但保险起见用 setTimeout）
  setTimeout(() => {
    const targets = document.querySelectorAll(selector);
    if (targets.length === 0) {
      // 目标不在 DOM 中（例如行动卡片还没渲染），5 秒后重试一次
      console.warn("[tutorial] 目标未找到:", selector, "5 秒后重试");
      setTimeout(() => _attachWaitForClick(selector, steps, index, hint), 5000);
      return;
    }
    targets.forEach((target) => {
      const handler = function (e) {
        // 阻止冒泡，避免触发原 handler 之前先推进引导
        // 实际上我们让原 handler 继续执行，引导推进是异步的
        e.stopPropagation();
        // 移除所有监听
        _clearWaitForClickListeners();
        cleanupHighlight();
        _removeSkipHint(); // v5.0: 关闭跳过浮标
        // 关闭当前 tutorial modal（如果有）
        const overlay = document.querySelector(".tutorial-overlay");
        if (overlay) {
          try {
            overlay.parentNode.removeChild(overlay);
          } catch (err) {}
        }
        // 推进下一步
        setTimeout(() => {
          showTutorialStep(steps, index + 1);
        }, 100);
      };
      // 使用 capture 阶段，确保在原 handler 之前捕获
      target.addEventListener("click", handler, { capture: true, once: true });
      _waitForClickListeners.push({ target, handler });
    });
  }, 100);
}

/** Phase 2 浮动"跳过此步"按钮 — 防止玩家卡住 */
function _showSkipHint(steps, index) {
  _removeSkipHint();
  var hint = document.createElement("div");
  hint.id = "tutorial-skip-hint";
  hint.textContent = "❓ 找不到目标？点击跳过此步 →";
  hint.style.cssText =
    "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);" +
    "z-index:1001;background:var(--bg-secondary,#2a2a3a);" +
    "border:1px solid var(--border,#444);border-radius:8px;" +
    "padding:8px 16px;font-size:12px;color:var(--text-secondary,#aaa);" +
    "cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.4);" +
    "transition:opacity 0.2s;";
  hint.addEventListener("click", function () {
    _removeSkipHint();
    _clearWaitForClickListeners();
    cleanupHighlight();
    showTutorialStep(steps, index + 1);
  });
  document.body.appendChild(hint);
}

function _removeSkipHint() {
  var existing = document.getElementById("tutorial-skip-hint");
  if (existing) existing.remove();
}

function _clearWaitForClickListeners() {
  _waitForClickListeners.forEach(({ target, handler }) => {
    try {
      target.removeEventListener("click", handler, { capture: true });
    } catch (e) {}
  });
  _waitForClickListeners = [];
}

/** v3.0 新增：跳过引导二次确认 */
function _confirmSkip(steps) {
  showModal({
    title: "确定跳过引导？",
    body: `
      <p>跳过后将不再自动出现新手引导。</p>
      <p style="color:var(--text-secondary);font-size:12px;">💡 你可以随时点击右上角 <strong>❓ 帮助</strong> 按钮回顾。</p>
    `,
    buttons: [
      {
        text: "继续引导",
        cls: "btn-primary",
        callback: () => {
          // 重新显示当前步骤
          if (_currentTutorialSteps) {
            showTutorialStep(_currentTutorialSteps, _currentTutorialIndex);
          }
        },
      },
      {
        text: "确认跳过",
        cls: "",
        callback: () => {
          cleanupHighlight();
          _clearWaitForClickListeners();
          markTutorialDone();
          StateManager.addMessage(
            "💡 已跳过新手引导。点击 ❓ 帮助按钮可随时查看。",
            "info",
          );
        },
      },
    ],
  });
}

/** 高亮页面元素 — v3.0 增强：让高亮框本身可点击穿透 */
function highlightElement(selector) {
  cleanupHighlight();
  const el = document.querySelector(selector);
  if (!el) return;

  const hl = document.createElement("div");
  hl.className = "tutorial-highlight";
  hl.id = "tutorial-highlight";

  const rect = el.getBoundingClientRect();
  hl.style.cssText = `
    position: fixed;
    top: ${rect.top - 6}px;
    left: ${rect.left - 6}px;
    width: ${rect.width + 12}px;
    height: ${rect.height + 12}px;
    border: 3px solid var(--accent);
    border-radius: 10px;
    pointer-events: none;
    z-index: 999;
    box-shadow: 0 0 25px rgba(102,126,234,0.5), inset 0 0 25px rgba(102,126,234,0.08);
    animation: tutorial-pulse 1.5s ease-in-out infinite;
  `;
  document.body.appendChild(hl);

  // 监听窗口大小变化，重新定位高亮框
  if (!window._tutorialResizeHandler) {
    window._tutorialResizeHandler = () => {
      const cur = document.getElementById("tutorial-highlight");
      if (cur) {
        const targetEl = document.querySelector(selector);
        if (targetEl) {
          const r = targetEl.getBoundingClientRect();
          cur.style.top = r.top - 6 + "px";
          cur.style.left = r.left - 6 + "px";
          cur.style.width = r.width + 12 + "px";
          cur.style.height = r.height + 12 + "px";
        }
      }
    };
    window.addEventListener("resize", window._tutorialResizeHandler);
  }
}

/** 清除高亮 — v5.0 增强：同时移除 resize 监听 + 跳过浮标 */
function cleanupHighlight() {
  const existing = document.getElementById("tutorial-highlight");
  if (existing) existing.remove();
  // 同时清除其他可能的残留
  document.querySelectorAll(".tutorial-highlight").forEach((e) => e.remove());
  // 清理 resize 监听
  if (window._tutorialResizeHandler) {
    window.removeEventListener("resize", window._tutorialResizeHandler);
    window._tutorialResizeHandler = null;
  }
  // v5.0: 清理跳过浮标
  _removeSkipHint();
}

// ====== 动态教程提示系统 ======
/**
 * 基于游戏状态触发的一次性情境提示。
 * 存储于 state.flags._hint_<id>，每条只触发一次。
 * 参考《Stardew Valley》的新手引导理念：在玩家自然遇到问题时给出实用建议。
 */

var DYNAMIC_HINTS = [
  // ===== 早期生存提示 =====
  {
    id: "first_hundred",
    trigger: function (st) {
      return (st.resources.cash || 0) >= 100 && !st.flags._hint_first_hundred;
    },
    message:
      "💡 提示：攒到100元了！建议去🏦银行存钱，存款有利息，还能抵御突发支出。",
  },
  {
    id: "first_low_cash",
    trigger: function (st) {
      return (
        (st.resources.cash || 0) < 80 &&
        st.player.day > 5 &&
        !st.flags._hint_first_low_cash
      );
    },
    message:
      "💡 提示：现金不多了！废品回收是最稳定的收入，城中村和工厂区都能做，不挑天气。",
  },
  {
    id: "first_earn_500",
    trigger: function (st) {
      return (
        (st.resources.totalEarned || 0) >= 500 && !st.flags._hint_first_earn_500
      );
    },
    message: "🎉 恭喜你！总收入突破500元！你已经找到了赚钱的门路，继续加油！",
  },
  {
    id: "first_earn_1000",
    trigger: function (st) {
      return (
        (st.resources.totalEarned || 0) >= 1000 &&
        !st.flags._hint_first_earn_1000
      );
    },
    message: "🎉 里程碑！总收入突破1000元！你在这座城市站稳了脚跟。",
  },
  {
    id: "first_injury",
    trigger: function (st) {
      return st.status && st.status.health < 70 && !st.flags._hint_first_injury;
    },
    message:
      "💡 提示：健康在下降！去🏥医院看病，也可以考虑买意外保险，防止突发大额医疗支出。",
  },
  {
    id: "first_sick",
    trigger: function (st) {
      return (
        st.status &&
        st.status.illnesses &&
        st.status.illnesses.length > 0 &&
        !st.flags._hint_first_sick
      );
    },
    message:
      "🤒 你生病了！生病期间工作效率会降低，快去🏥医院治疗，或者在家休息几天。",
  },
  {
    id: "first_fatigue_high",
    trigger: function (st) {
      return (
        st.needs && st.needs.fatigue >= 75 && !st.flags._hint_first_fatigue_high
      );
    },
    message:
      "💡 提示：疲劳过高！工作效率会降低。升级住所能加快每晚恢复速度，花¥500就能搬到单间。",
  },
  {
    id: "first_happy_low",
    trigger: function (st) {
      return (
        st.needs &&
        st.needs.happiness < 25 &&
        st.player.day > 3 &&
        !st.flags._hint_first_happy_low
      );
    },
    message:
      "💡 提示：心情低落！去公园散步、找NPC聊天，或者喝杯奶茶都能改善心情，心情好干活效率更高。",
  },
  {
    id: "first_hungry",
    trigger: function (st) {
      return st.needs && st.needs.hunger < 30 && !st.flags._hint_first_hungry;
    },
    message: "🍚 肚子饿了！去吃点东西吧，不吃饭会影响健康和工作效率。",
  },
  {
    id: "day10_tip",
    trigger: function (st) {
      return st.player.day >= 10 && !st.flags._hint_day10_tip;
    },
    message:
      "💡 提示：第10天了！如果手头有¥500，可以在城中村租个单间，改善睡眠质量，每晚多恢复疲劳。",
  },
  {
    id: "first_repay_ready",
    trigger: function (st) {
      var debt = st.resources.villageDebt || 0;
      return (
        debt > 0 &&
        (st.resources.cash || 0) >= debt &&
        !st.flags._hint_first_repay_ready
      );
    },
    message:
      "💡 提示：现金够还村长的债了！日息0.3%每天都在涨，尽快还清能省不少利息。",
  },
  {
    id: "first_debt_paid",
    trigger: function (st) {
      return (
        !st.resources.villageDebt &&
        !st.resources.debt &&
        (st.resources.totalEarned || 0) >= 5500 &&
        !st.flags._hint_first_debt_paid
      );
    },
    message: "🎉 无债一身轻！你还清了所有债务，终于可以自由地为自己赚钱了！",
  },

  // ===== 中期发展提示 =====
  {
    id: "first_5000",
    trigger: function (st) {
      return (
        (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 5000 &&
        !st.flags._hint_first_5000
      );
    },
    message:
      "💡 提示：资产超5000元！可以去🎓培训中心学技能考证书，智力≥45后还能去科技园应聘职场。",
  },
  {
    id: "first_trade_tip",
    trigger: function (st) {
      return (
        st.trade &&
        (st.trade.totalProfit || 0) >= 200 &&
        !st.flags._hint_first_trade_tip
      );
    },
    message:
      "💡 提示：交易赚了200元！去📦批发市场可以租仓库增加库存量，更多商品→更大利润空间。",
  },
  {
    id: "first_trade_profit_1000",
    trigger: function (st) {
      return (
        st.trade &&
        (st.trade.totalProfit || 0) >= 1000 &&
        !st.flags._hint_first_trade_profit_1000
      );
    },
    message: "💰 交易大师！你的累计交易利润突破1000元！倒买倒卖是一门好生意。",
  },
  {
    id: "first_intel_tip",
    trigger: function (st) {
      return st.player.intelligence >= 35 && !st.flags._hint_first_intel_tip;
    },
    message:
      "💡 提示：智力达到35！培训中心的课程学得更快了，再提升到45就能应聘互联网职场。或者累计打工200天+总收入¥5000也能凭经验入场。",
  },
  {
    id: "first_trade_margin",
    trigger: function (st) {
      return (
        st.player.day >= 15 &&
        st.trade &&
        st.flags._visitedWholesaleMarket &&
        st.flags._visitedCommercialDist &&
        !st.flags._hint_trade_margin
      );
    },
    message:
      "💰 批发市场的价格比商业区低30-50%！在批发市场进货再到商业区卖出，利润可观。试试看？",
  },
  {
    id: "first_skill_30",
    trigger: function (st) {
      var skills = st.skills || {};
      var reached30 = false;
      for (var k in skills) {
        if (skills[k] && skills[k].level >= 30) {
          reached30 = true;
          break;
        }
      }
      return reached30 && !st.flags._hint_first_skill_30;
    },
    message:
      "🎓 技能突破！某项技能达到30级！可以去培训中心选择专业发展方向，解锁更强力的天赋。",
  },
  {
    id: "first_npc_tip",
    trigger: function (st) {
      var rels = st.relationships || {};
      var met = Object.values(rels).filter(function (r) {
        return r && r.met;
      }).length;
      return met >= 1 && !st.flags._hint_first_npc_tip;
    },
    message:
      "💡 提示：认识了NPC！多送礼提升好感度，高好感NPC会推荐高薪工作（收入翻倍+），还能解锁特殊任务和折扣。",
  },
  {
    id: "first_npc_50_affinity",
    trigger: function (st) {
      var rels = st.relationships || {};
      var high = Object.values(rels).filter(function (r) {
        return r && r.affinity >= 50;
      }).length;
      return high >= 1 && !st.flags._hint_first_npc_50_affinity;
    },
    message:
      "❤️ 好感度50+解锁特殊任务和推荐工作！高好感NPC推荐的工作收入比普通工作高100-200%。",
  },
  {
    id: "first_skill_cert",
    trigger: function (st) {
      var certs = st.certs || {};
      var hasCert = false;
      for (var c in certs) {
        if (certs[c]) {
          hasCert = true;
          break;
        }
      }
      return hasCert && !st.flags._hint_first_skill_cert;
    },
    message: "📜 你考到了第一张证书！证书能提升求职竞争力和收入。",
  },
  {
    id: "first_equipment_tip",
    trigger: function (st) {
      return (
        st.player.day >= 5 &&
        (st.resources.cash || 0) >= 100 &&
        st.inventory &&
        Object.keys(st.inventory.equipment || {}).length === 0 &&
        !st.flags._hint_first_equipment
      );
    },
    message:
      "💡 提示：你可以买一些装备！城中村的杂货店有劳保手套、解放鞋等，能减少疲劳和受伤风险。",
  },
  {
    id: "corporate_access_hint",
    trigger: function (st) {
      return (
        st.player.day >= 15 &&
        st.player.phase === "street" &&
        (st.resources.cash || 0) >= 3000 &&
        st.player.intelligence >= 40 &&
        !st.flags._hint_corporate_access
      );
    },
    message:
      "🏢 你的智力和存款都够了！去科技园（techPark）看看，那里有正经的互联网公司工作机会，薪资远超街头零活。",
  },
  {
    id: "day30_dream_tip",
    trigger: function (st) {
      return (
        st.player.day >= 30 &&
        !st.flags._dreamId &&
        !st.flags._hint_day30_dream_tip
      );
    },
    message:
      "💡 提示：在城市打拼一个月了！去公园或城中村可以「确立人生目标」，设定梦想让努力更有方向感。",
  },

  // ===== v3.1 中期里程碑提示（填补 Day 30-90 空心） =====
  {
    id: "day45_skill_tip",
    trigger: function (st) {
      return st.player.day >= 45 && !st.flags._hint_day45_skill_tip;
    },
    message:
      "💡 提示：进城快一个半月了！去培训中心学个技能或考个证书，能让收入迈上新台阶。",
  },
  {
    id: "day60_career_tip",
    trigger: function (st) {
      return (
        st.player.day >= 60 &&
        st.career &&
        st.career.currentJob &&
        !st.flags._hint_day60_career_tip
      );
    },
    message:
      "💡 提示：入职两个月了！关注一下业绩和倦怠，业绩好可以争取晋升，倦怠太高记得休息。",
  },
  {
    id: "day90_review_tip",
    trigger: function (st) {
      return (
        st.player.day >= 90 &&
        st.career &&
        st.career.currentJob &&
        (st.career.currentJob.workDays || 0) >= 30 &&
        !st.flags._hint_day90_review_tip
      );
    },
    message:
      "💡 提示：入职满三个月试用期了！正式员工薪资恢复100%，可以考虑规划下一步——跳槽、考证还是攒钱买房？",
  },

  // ===== 职场阶段提示 =====
  {
    id: "corporate_ready_tip",
    trigger: function (st) {
      return (
        st.player.day >= 60 &&
        st.player.intelligence >= 40 &&
        st.player.phase === "street" &&
        !st.flags._hint_corporate_ready_tip
      );
    },
    message:
      "🏢 智力已达40，在城市打拼60天了！你已具备进入互联网职场的条件。去培训中心可以申请入职，开始新的人生阶段。",
  },
  {
    id: "first_corp_day",
    trigger: function (st) {
      return (
        st.player.phase === "corporate" &&
        st.player.day >= 1 &&
        !st.flags._hint_first_corp_day
      );
    },
    message:
      "🎉 欢迎来到互联网大厂！从今往后，你的战场从街头转移到了写字楼。KPI、加班、晋升——准备好了吗？",
  },
  {
    id: "first_corp_kpi_a",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.lastPerfRating === "A" &&
        !st.flags._hint_first_corp_kpi_a
      );
    },
    message: "🌟 第一次拿到A绩效！老板对你刮目相看，晋升之路打开了。",
  },
  {
    id: "first_corp_promo",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.rank === "P6" &&
        !st.flags._hint_first_corp_promo
      );
    },
    message: "🎉 恭喜晋升P6！你不再是新人了，开始承担更多责任吧。",
  },
  {
    id: "first_corp_promo_p7",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.rank === "P7" &&
        !st.flags._hint_first_corp_promo_p7
      );
    },
    message: "🏆 P7了！分水岭已过，你现在是团队骨干，开始带人、做项目了。",
  },
  {
    id: "first_corp_team",
    trigger: function (st) {
      return (
        st.corporate &&
        (st.corporate.teamSize || 0) >= 2 &&
        !st.flags._hint_first_corp_team
      );
    },
    message:
      "👥 你开始带团队了！管理是一门新学问：如何分配任务、激励下属、向上汇报。",
  },
  {
    id: "first_corp_stock",
    trigger: function (st) {
      return (
        st.investment &&
        st.investment.stockHoldings &&
        st.investment.stockHoldings.length > 0 &&
        !st.flags._hint_first_corp_stock
      );
    },
    message: "📈 你开始投资股票了！钱生钱的游戏开始了，但要注意风险。",
  },
  {
    id: "first_corp_overtime",
    trigger: function (st) {
      return (
        st.needs &&
        st.needs.fatigue >= 90 &&
        st.player.phase === "corporate" &&
        !st.flags._hint_first_corp_overtime
      );
    },
    message: "😴 疲劳爆表！你在公司拼得太狠了。记得：发量是革命的本钱。",
  },
  {
    id: "first_corp_dignity_low",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.dignity < 30 &&
        !st.flags._hint_first_corp_dignity_low
      );
    },
    message:
      "⚠️ 尊严告急！被PUA太多次了。去公园放松、找朋友倾诉，或者考虑跳槽。",
  },
  {
    id: "first_corp_risk_high",
    trigger: function (st) {
      return (
        st.corporate &&
        st.corporate.risk >= 50 &&
        !st.flags._hint_first_corp_risk_high
      );
    },
    message: "💣 风险值过高！你埋的雷快爆发了。建议排查风险，否则可能被开除。",
  },

  // ===== 节日与特殊事件 =====
  {
    id: "festival_job_tip",
    trigger: function (st) {
      return (
        typeof getCurrentFestival === "function" &&
        getCurrentFestival(st.player.day) !== null &&
        !st.flags._hint_festival_job_tip
      );
    },
    message:
      "🎉 节日来了！节日期间各地点会出现限定临时工作（收入比平时高），在行动页找找看！还有NPC会说节日专属的话。",
  },
  {
    id: "reputation_earned_tip",
    trigger: function (st) {
      return (
        typeof getHistoryModifiers === "function" &&
        getHistoryModifiers(st).reputationLabel !== null &&
        !st.flags._hint_reputation_earned_tip
      );
    },
    message:
      "🏅 你的道德选择已经积累成一种声誉！侧边栏会显示你的「声誉徽章」，正直的行为会带来持续的收入加成。",
  },
  {
    id: "investment_first_tip",
    trigger: function (st) {
      return (
        (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 20000 &&
        !(st.investment && (st.investment.stockHoldings || []).length > 0) &&
        !st.flags._hint_investment_first_tip
      );
    },
    message:
      "💰 你已经攒下2万块！是时候考虑投资了。行动页「投资中心」可以购买股票、比特币、贵金属，让钱为你打工！",
  },
  {
    id: "first_company_fate",
    trigger: function (st) {
      return (
        st.enterpriseFate &&
        st.enterpriseFate.fateEventHistory &&
        st.enterpriseFate.fateEventHistory.length > 0 &&
        !st.flags._hint_first_company_fate
      );
    },
    message:
      "🏭 公司命运事件发生了！你所在的公司正在经历变化，关注新闻，把握机会。",
  },
  {
    id: "first_insider_rumor",
    trigger: function (st) {
      return (
        st.insiderTrading &&
        st.insiderTrading.activeRumor &&
        !st.flags._hint_first_insider_rumor
      );
    },
    message:
      "👂 你听到了一条风声！某家公司可能有大事发生。去多渠道验证可信度，再决定是否投资。",
  },
  {
    id: "first_skill_tree",
    trigger: function (st) {
      return (
        st.skillBranches &&
        Object.keys(st.skillBranches).length > 0 &&
        !st.flags._hint_first_skill_tree
      );
    },
    message:
      "🌳 你选择了技能发展方向！天赋树系统已激活，激活天赋节点能获得永久加成。",
  },

  // ===== 剧本专属早期提示（v4.0） =====

  // ── 下岗再就业 专属 ──
  {
    id: "laid_off_repair_skill",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "laid_off" &&
        st.player.day <= 5 &&
        !st.flags._hint_laid_off_repair_skill
      );
    },
    message:
      "🔩 你的修理技能Lv.25是你最大的资产！行动页找「修理家电」「维修接单」，比废品回收收入高得多。",
  },
  {
    id: "laid_off_age_anxiety",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "laid_off" &&
        st.player.day === 7 &&
        !st.flags._hint_laid_off_age_anxiety
      );
    },
    message:
      "📋 一周了！38岁求职有年龄门槛，但技工岗/自营生意不挑年龄。体力活累但来钱快，副业摆摊也是出路。",
  },
  {
    id: "laid_off_transition",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "laid_off" &&
        (st.resources.cash || 0) + (st.resources.bankBalance || 0) >= 15000 &&
        !st.flags._hint_laid_off_transition
      );
    },
    message:
      "🔄 手里有钱了！现在可以考虑转型：① 技工外包（修理接单副业），② 摆摊小生意，③ 考个证书提升竞争力。",
  },

  // ── 小镇做题家 专属 ──
  {
    id: "grinder_intel_gate",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "small_town_grinder" &&
        st.player.intelligence >= 40 &&
        st.player.intelligence < 45 &&
        !st.flags._hint_grinder_intel_gate
      );
    },
    message:
      "🧠 智力接近门槛了！还差几点就能进科技园（需要45）。培训中心「上课」最快提升，每次+1~2点。",
  },
  {
    id: "grinder_debt_pressure",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "small_town_grinder" &&
        st.player.day === 10 &&
        !st.flags._hint_grinder_debt_pressure
      );
    },
    message:
      "💸 十天了，债务利息一直在跑。你的核心优势是智力，找到职场工作才是还债最快路径。去科技园吧！",
  },
  {
    id: "grinder_family_hope",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "small_town_grinder" &&
        (st.resources.totalEarned || 0) >= 3000 &&
        !st.flags._hint_grinder_family_hope
      );
    },
    message:
      "🏆 你已经赚到3000元了！你是全村的第一个，这条路是对的。继续提升技能，让学历真正发挥价值。",
  },

  // ── 外来打工者 专属 ──
  {
    id: "foreign_worker_save_goal",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "foreign_worker" &&
        st.player.day === 3 &&
        !st.flags._hint_foreign_worker_save_goal
      );
    },
    message:
      "🌏 第3天！给家里打个算盘：每月省下多少钱才够汇款？工厂+夜班组合，月收入能到¥3500-5000。",
  },
  {
    id: "foreign_worker_language",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "foreign_worker" &&
        st.player.day === 7 &&
        !st.flags._hint_foreign_worker_language
      );
    },
    message:
      "💬 一周了！语言是你最大的障碍。培训中心有语言课，学会后很多事情都更方便，还能找到更好的活。",
  },
  {
    id: "foreign_worker_skill_up",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "foreign_worker" &&
        st.skills &&
        st.skills.welding &&
        st.skills.welding.level >= 15 &&
        !st.flags._hint_foreign_worker_skill_up
      );
    },
    message:
      "🔥 焊接技能提升了！Lv.20后可以承接工厂外包单子，比流水线收入高。你的手艺，是在哪儿都能吃饭的本事。",
  },

  // ── 二代创业者 专属 ──
  {
    id: "second_gen_dont_rush",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "second_gen" &&
        st.player.day === 1 &&
        !st.flags._hint_second_gen_dont_rush
      );
    },
    message:
      "⚠️ 重要：今天不要去注册公司！¥150,000 看起来多，但科技创业烧钱极快。先用3-5天弄清楚你要干什么。",
  },
  {
    id: "second_gen_learn_first",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "second_gen" &&
        st.player.day === 5 &&
        !st.flags._hint_second_gen_learn_first
      );
    },
    message:
      "📚 五天了！你最缺的不是钱，是技能。去培训中心学销售/管理/会计，至少要懂一样，才知道怎么花钱。",
  },
  {
    id: "second_gen_find_direction",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "second_gen" &&
        (st.resources.cash || 0) < 40000 &&
        !st.flags._secondGenStartupRegistered &&
        !st.flags._hint_second_gen_find_direction
      );
    },
    message:
      "💰 钱开始减少了！如果还没定方向，现在要开始认真考虑了。事业发展Tab里可以了解各个职业路径，找到你的方向。",
  },

  // ── 中年危机职场人 专属 ──
  {
    id: "midlife_use_experience",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "midlife_crisis" &&
        st.player.day === 1 &&
        !st.flags._hint_midlife_use_experience
      );
    },
    message:
      "👔 你有编程Lv.30+管理Lv.25+销售Lv.15！这些技能可以直接接外包单子——不用等入职，今天就能开始赚钱。",
  },
  {
    id: "midlife_financial_pressure",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "midlife_crisis" &&
        st.player.day === 7 &&
        !st.flags._hint_midlife_financial_pressure
      );
    },
    message:
      "📋 一周了！算一下：存款¥80,000，每月需要至少¥8,000，只够撑10个月。你的目标：1个月内找到稳定收入。",
  },
  {
    id: "midlife_startup_warning",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "midlife_crisis" &&
        st.flags._decidedToStartup &&
        !st.flags._hint_midlife_startup_warning
      );
    },
    message:
      "⚠️ 决定创业了！好。但家庭开销不能断。建议先用技能接单维持基本收入，再慢慢建立创业基础——不要一口气All in。",
  },

  // ── 应届毕业生 专属 ──
  {
    id: "fresh_grad_first_step",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "fresh_grad" &&
        st.player.day === 1 &&
        !st.flags._hint_fresh_grad_first_step
      );
    },
    message:
      "🎓 第一天！优先顺序：① 找到住处（城中村床位¥15/天） ② 去学习提升智力到45 ③ 找到第一份有收入的事。别乱花¥2,000。",
  },
  {
    id: "fresh_grad_intel_goal",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "fresh_grad" &&
        st.player.intelligence >= 38 &&
        st.player.phase === "street" &&
        !st.flags._hint_fresh_grad_intel_goal
      );
    },
    message:
      "🧠 智力快到门槛了！还差几点就能进科技园（需要45）。你有编程基础，进去之后晋升很快，不要放弃！",
  },
  {
    id: "fresh_grad_first_salary",
    trigger: function (st) {
      return (
        st.flags._isScenarioMode &&
        st.flags._currentScenario === "fresh_grad" &&
        (st.resources.totalEarned || 0) >= 4500 &&
        !st.flags._hint_fresh_grad_first_salary
      );
    },
    message:
      "💰 第一个月的钱来了！建议：¥1000存银行、¥500投自己（学技能）、¥300开始偿债。养成习惯，这辈子都用得到。",
  },
];

/** 每日检查动态提示，触发后标记防重复 */
function checkDynamicHints(state) {
  for (var i = 0; i < DYNAMIC_HINTS.length; i++) {
    var hint = DYNAMIC_HINTS[i];
    try {
      if (hint.trigger(state)) {
        state.flags["_hint_" + hint.id] = true;
        StateManager.addMessage(hint.message, "hint");
      }
    } catch (e) {
      /* 防止单条hint出错影响全局 */
    }
  }
}

// 全局挂载
if (typeof window !== "undefined") {
  Object.assign(window, {
    startTutorial,
    isTutorialDone,
    markTutorialDone,
    resetTutorial,
    showTutorialStep,
    highlightElement,
    cleanupHighlight,
    TUTORIAL_KEY,
    DYNAMIC_HINTS,
    checkDynamicHints,
    SCENARIO_TUTORIAL_STEPS,
  });
}
