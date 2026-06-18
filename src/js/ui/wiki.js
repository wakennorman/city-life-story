/**
 * 游戏百科 (Wiki) 系统
 *
 * 设计参考：
 * - 《文明 VI》Civilopedia：左侧分类树 + 右侧详情，跨条目跳转
 * - 《Stardew Valley》Collection：已发现/未发现状态徽章
 * - 《Terraria》Bestiary：图鉴形式
 *
 * 一站式游戏内查询：地点/工作/商品/装备/技能/证书/NPC/节日/天气/
 * 投资/系统机制/世界叙事/胜利路线，13 个分类
 *
 * 模块对外暴露：
 *   - WIKI_CATEGORIES, _wikiState
 *   - renderWikiTab(state, parent)
 *   - wikiNavigate(catId, entryId)  ← 供其他模块跳转用
 */

// ================================================================
//  模块级状态（保留 Tab 切换之间的导航位置）
// ================================================================
var _wikiState = {
  catId: "locations",
  entryId: null,
  query: "",
};

// ================================================================
//  工具函数
// ================================================================
function _wkE(s) {
  if (s === undefined || s === null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// 数值估算：调用 payCalc 取样若干次得到 min/max
function _wkSamplePay(job, state, n) {
  if (typeof job.payCalc !== "function") return null;
  var min = Infinity;
  var max = -Infinity;
  for (var i = 0; i < (n || 7); i++) {
    try {
      var v = job.payCalc(state) || 0;
      if (v < min) min = v;
      if (v > max) max = v;
    } catch (e) {
      return null;
    }
  }
  if (min === Infinity) return null;
  return { min: Math.floor(min), max: Math.floor(max) };
}

// 跨模块跳转工具（暴露为全局）
function wikiNavigate(catId, entryId) {
  _wikiState.catId = catId;
  _wikiState.entryId = entryId || null;
  _wikiState.query = "";
  if (typeof switchTab === "function") {
    switchTab("wiki");
    return;
  }
  if (typeof renderAll === "function") renderAll();
}

function _wikiBackToList() {
  _wikiState.entryId = null;
  _wikiState.query = "";
  if (typeof renderAll === "function") renderAll();
}

function _wikiSwitchCat(catId) {
  _wikiState.catId = catId;
  _wikiState.entryId = null;
  if (typeof renderAll === "function") renderAll();
}

function _wikiSetQuery(q) {
  _wikiState.query = q || "";
  _wikiState.entryId = null;
  if (typeof renderAll === "function") renderAll();
}

// ================================================================
//  分类列表数据
// ================================================================
var WIKI_CATEGORIES = [
  { id: "locations", name: "地点", icon: "📍" },
  { id: "jobs", name: "工作", icon: "💼" },
  { id: "goods", name: "商品", icon: "📦" },
  { id: "items", name: "装备", icon: "🎒" },
  { id: "skills", name: "技能", icon: "📚" },
  { id: "certs", name: "证书", icon: "📜" },
  { id: "npcs", name: "居民", icon: "👥" },
  { id: "festivals", name: "节日", icon: "🎭" },
  { id: "weather", name: "天气", icon: "🌤️" },
  { id: "invest", name: "投资", icon: "💰" },
  { id: "mechanics", name: "系统", icon: "💡" },
  { id: "narrative", name: "叙事", icon: "🌍" },
  { id: "victory", name: "成就/胜利", icon: "🏆" },
];

// 列表条目（{id, name, icon, brief}）
function _wikiListEntries(catId, state) {
  var out = [];
  switch (catId) {
    case "locations":
      if (typeof LOCATIONS !== "undefined") {
        for (var k in LOCATIONS) {
          var loc = LOCATIONS[k];
          out.push({ id: loc.id, name: loc.name, icon: "📍", brief: loc.desc });
        }
      }
      break;
    case "jobs":
      if (typeof STREET_JOBS !== "undefined") {
        for (var i = 0; i < STREET_JOBS.length; i++) {
          var j = STREET_JOBS[i];
          out.push({
            id: j.id,
            name: j.name,
            icon: j.icon || "💼",
            brief: j.desc,
          });
        }
      }
      break;
    case "goods":
      if (typeof GOODS !== "undefined") {
        for (var i2 = 0; i2 < GOODS.length; i2++) {
          var g = GOODS[i2];
          out.push({
            id: g.id,
            name: g.name,
            icon: "📦",
            brief:
              "基础价 ¥" +
              g.basePrice +
              "/" +
              g.unit +
              " · " +
              _goodCatLabel(g.category),
          });
        }
      }
      break;
    case "items":
      if (typeof ITEMS !== "undefined") {
        for (var i3 = 0; i3 < ITEMS.length; i3++) {
          var it = ITEMS[i3];
          out.push({
            id: it.id,
            name: it.name,
            icon: it.icon || "🎒",
            brief: it.desc + " · ¥" + it.price,
          });
        }
      }
      break;
    case "skills":
      var skMap = [
        { id: "cooking", name: "烹饪" },
        { id: "sales", name: "销售" },
        { id: "repair", name: "维修" },
        { id: "english", name: "英语" },
        { id: "driving", name: "驾驶" },
        { id: "coding", name: "编程" },
        { id: "management", name: "管理" },
        { id: "accounting", name: "会计" },
        { id: "electrician", name: "电工" },
        { id: "welding", name: "焊接" },
      ];
      for (var i4 = 0; i4 < skMap.length; i4++) {
        var sk = skMap[i4];
        var lvl =
          state && state.skills && state.skills[sk.id]
            ? state.skills[sk.id].level
            : 0;
        out.push({
          id: sk.id,
          name: sk.name,
          icon: "📚",
          brief: "当前 Lv." + lvl + " · 衍生加成与解锁工作",
        });
      }
      break;
    case "certs":
      if (typeof CERTIFICATES !== "undefined") {
        for (var i5 = 0; i5 < CERTIFICATES.length; i5++) {
          var c = CERTIFICATES[i5];
          out.push({
            id: c.id,
            name: c.name,
            icon: "📜",
            brief: c.desc,
          });
        }
      }
      break;
    case "npcs":
      if (typeof NPCS !== "undefined") {
        for (var i6 = 0; i6 < NPCS.length; i6++) {
          var n = NPCS[i6];
          out.push({
            id: n.id,
            name: n.name,
            icon: "👤",
            brief: n.role + " · " + (n.desc || ""),
          });
        }
      }
      break;
    case "festivals":
      if (typeof FESTIVALS !== "undefined") {
        for (var i7 = 0; i7 < FESTIVALS.length; i7++) {
          var f = FESTIVALS[i7];
          out.push({
            id: f.id,
            name: f.name,
            icon: f.icon || "🎭",
            brief:
              "Day " +
              f.startDay +
              " · " +
              f.duration +
              "天 · " +
              (f.desc || ""),
          });
        }
      }
      break;
    case "weather":
      if (typeof WEATHER_TYPES !== "undefined") {
        for (var i8 = 0; i8 < WEATHER_TYPES.length; i8++) {
          var w = WEATHER_TYPES[i8];
          out.push({
            id: w.id,
            name: w.name,
            icon: w.icon || "🌤️",
            brief:
              "室外×" +
              w.outdoorMod.toFixed(2) +
              " · 心情" +
              (w.happinessBonus >= 0 ? "+" : "") +
              w.happinessBonus,
          });
        }
      }
      out.push({
        id: "season",
        name: "四季节奏",
        icon: "🍃",
        brief: "春夏秋冬：影响节日时序与天气分布",
      });
      break;
    case "invest":
      out.push({
        id: "stocks",
        name: "股票",
        icon: "📈",
        brief: "30 只本地化幽默股票",
      });
      out.push({
        id: "btc",
        name: "虚拟币",
        icon: "💎",
        brief: "20 种主流币 + 恐惧贪婪指数",
      });
      out.push({
        id: "precious",
        name: "贵金属",
        icon: "🥇",
        brief: "8 种：黄金/白银/铂金/钯金/铜/镍/铝/锂",
      });
      out.push({
        id: "futures",
        name: "期货",
        icon: "🛢️",
        brief: "16 种商品期货",
      });
      out.push({
        id: "funds",
        name: "基金",
        icon: "📊",
        brief: "12 种 ETF/固收产品",
      });
      out.push({
        id: "property",
        name: "房产",
        icon: "🏠",
        brief: "20 处可投/可住房产",
      });
      out.push({
        id: "car",
        name: "汽车",
        icon: "🚗",
        brief: "20 款代步/收藏汽车",
      });
      out.push({
        id: "bank",
        name: "银行储蓄/借贷",
        icon: "🏦",
        brief: "存款利息 vs 村长/银行欠款日息",
      });
      break;
    case "mechanics":
      out.push({
        id: "ap",
        name: "行动力 (AP)",
        icon: "⚡",
        brief: "100 AP/天，倍率系统，低 AP 预警",
      });
      out.push({
        id: "stat_link",
        name: "状态互联",
        icon: "🔗",
        brief: "饥饿/疲劳/心情多米诺，AP 倍率",
      });
      out.push({
        id: "synergy",
        name: "技能协同",
        icon: "🔀",
        brief: "6 种组合：餐饮/工匠/海外外包/跑单/商务/外贸",
      });
      out.push({
        id: "streak",
        name: "熟练工连击",
        icon: "🔥",
        brief: "连续 3/5/7 天同一工作 +5%/+10%/+15%",
      });
      out.push({
        id: "city_pulse",
        name: "城市脉搏",
        icon: "🌆",
        brief: "新闻 → 地点客流/工作收入实时联动",
      });
      out.push({
        id: "intel",
        name: "街头情报网",
        icon: "📡",
        brief: "高好感 NPC 提前透露新闻",
      });
      out.push({
        id: "history",
        name: "历史声誉",
        icon: "📜",
        brief: "道德选择 7 种 flag 长期影响",
      });
      out.push({
        id: "edu",
        name: "学历系统",
        icon: "🎓",
        brief: "大专 → 本科 → 研究生",
      });
      out.push({
        id: "dream",
        name: "梦想追踪",
        icon: "💭",
        brief: "5 类目标 × 5 里程碑",
      });
      out.push({
        id: "festival_link",
        name: "节日联动",
        icon: "🎉",
        brief: "价格修正/限定工作/NPC 台词",
      });
      out.push({
        id: "weather_link",
        name: "天气联动",
        icon: "☂️",
        brief: "室外工作/AP/心情",
      });
      out.push({
        id: "npc_affinity",
        name: "NPC 好感",
        icon: "💕",
        brief: "30/60/80 阈值奖励 + 委托 + 深度任务",
      });
      out.push({
        id: "vending_footfall",
        name: "摆摊客流",
        icon: "🛒",
        brief: "位置×天气×节日×周末综合修正",
      });
      out.push({
        id: "fame_vip",
        name: "名气 VIP",
        icon: "⭐",
        brief: "高名气解锁 5 种特殊行动",
      });
      out.push({
        id: "skill_tree",
        name: "技能天赋树",
        icon: "🌳",
        brief: "30级分支选择、天赋节点激活、职场联动",
      });
      break;
    case "narrative":
      out.push({
        id: "news_4layer",
        name: "四层新闻生态",
        icon: "📰",
        brief: "L1 国际/L2 国内/L3 城市/L4 街头",
      });
      out.push({
        id: "news_cascade",
        name: "新闻级联",
        icon: "🪜",
        brief: "L1 → L2 滚雪球（10 个事件）",
      });
      out.push({
        id: "world_events",
        name: "有梗世界事件",
        icon: "🎬",
        brief: "5 条事件链（补贴大战/收购反噬/黑马冲击/创始人回购/政策套利）",
      });
      out.push({
        id: "moral",
        name: "道德困境",
        icon: "⚖️",
        brief: "无绝对正确选项，长期影响声誉",
      });
      out.push({
        id: "ng_plus",
        name: "新游戏+ 继承",
        icon: "🆕",
        brief: "多周目积累：起始现金/技能/属性",
      });
      break;
    case "victory":
      out.push({
        id: "v_p10",
        name: "晋升 P10",
        icon: "🏢",
        brief: "成为合伙人，职场之巅",
      });
      out.push({
        id: "v_wealth",
        name: "财务自由",
        icon: "💸",
        brief: "累计 ¥2,000 万",
      });
      out.push({
        id: "v_business",
        name: "经商大亨",
        icon: "🏪",
        brief: "经商利润 ¥50 万",
      });
      out.push({
        id: "v_fame",
        name: "城市名人",
        icon: "🌟",
        brief: "名气达到 100",
      });
      out.push({
        id: "v_skill",
        name: "技能大师",
        icon: "🥷",
        brief: "全部 10 项技能 80 级",
      });
      out.push({
        id: "v_invest",
        name: "投资天才",
        icon: "💎",
        brief: "投资资产 ¥1,000 万",
      });
      out.push({
        id: "fail",
        name: "失败条件",
        icon: "💀",
        brief: "健康/债务/发量/尊严/绩效/年龄危机",
      });
      out.push({
        id: "achievements",
        name: "🏅 成就一览（22 个）",
        icon: "🏅",
        brief: "前往成就 Tab 查看完整成就",
      });
      break;
  }
  return out;
}

// 商品类别中文
function _goodCatLabel(c) {
  return (
    {
      daily: "日用",
      food: "食品",
      luxury: "奢侈",
      clothing: "服装",
      electronics: "电子",
      scrap: "废品",
    }[c] || c
  );
}

// ================================================================
//  主入口：渲染百科 Tab
// ================================================================
function renderWikiTab(state, parent) {
  var box = document.createElement("div");
  box.className = "wiki-tab";

  // 顶部搜索 + 标题
  box.innerHTML =
    '<div class="wiki-header">' +
    '<h2 style="margin:0;">📖 城市浮生记 · 游戏百科</h2>' +
    '<p style="margin:6px 0 0;color:var(--text-muted);font-size:12px;">' +
    "一站式查询：地点 / 工作 / 商品 / 装备 / 技能 / 证书 / NPC / 节日 / 天气 / 投资 / 系统机制 / 世界叙事 / 胜利路线" +
    "</p>" +
    '<div class="wiki-search">' +
    '<input type="text" id="wiki-search-input" placeholder="🔍 搜索条目（名称/描述）..." value="' +
    _wkE(_wikiState.query) +
    '" />' +
    (_wikiState.query
      ? '<button class="wiki-clear" type="button">✕ 清除</button>'
      : "") +
    "</div>" +
    "</div>";

  // 主布局：左侧导航 + 右侧内容
  var layout = document.createElement("div");
  layout.className = "wiki-layout";

  // ----- 左侧分类导航 -----
  var nav = document.createElement("aside");
  nav.className = "wiki-nav";
  for (var i = 0; i < WIKI_CATEGORIES.length; i++) {
    var c = WIKI_CATEGORIES[i];
    var entries = _wikiListEntries(c.id, state);
    var btn = document.createElement("button");
    btn.className = "wiki-nav-btn";
    if (c.id === _wikiState.catId && !_wikiState.query)
      btn.className += " active";
    btn.dataset.cat = c.id;
    btn.innerHTML =
      '<span class="wiki-nav-ico">' +
      c.icon +
      "</span>" +
      '<span class="wiki-nav-name">' +
      _wkE(c.name) +
      "</span>" +
      '<span class="wiki-nav-count">' +
      entries.length +
      "</span>";
    btn.addEventListener("click", _wikiOnNavClick);
    nav.appendChild(btn);
  }
  layout.appendChild(nav);

  // ----- 右侧内容 -----
  var content = document.createElement("section");
  content.className = "wiki-content";

  if (_wikiState.query) {
    _wikiRenderSearchResults(state, content);
  } else if (_wikiState.entryId) {
    _wikiRenderDetail(state, content);
  } else {
    _wikiRenderEntryList(state, content);
  }
  layout.appendChild(content);

  box.appendChild(layout);
  parent.appendChild(box);

  // 绑定搜索输入框（debounce 简易实现）
  var input = box.querySelector("#wiki-search-input");
  if (input) {
    var timer = null;
    input.addEventListener("input", function (e) {
      var v = e.target.value;
      if (timer) clearTimeout(timer);
      timer = setTimeout(function () {
        _wikiSetQuery(v);
      }, 250);
    });
  }
  var clr = box.querySelector(".wiki-clear");
  if (clr)
    clr.addEventListener("click", function () {
      _wikiSetQuery("");
    });
}

function _wikiOnNavClick(e) {
  var btn = e.currentTarget;
  _wikiSwitchCat(btn.dataset.cat);
}

// ================================================================
//  列表视图
// ================================================================
function _wikiRenderEntryList(state, parent) {
  var entries = _wikiListEntries(_wikiState.catId, state);
  var cat = _wikiFindCat(_wikiState.catId);
  var hd = document.createElement("div");
  hd.className = "wiki-list-header";
  hd.innerHTML =
    "<h3>" +
    (cat ? cat.icon + " " + _wkE(cat.name) : "条目") +
    ' <span class="wiki-count">(' +
    entries.length +
    ")</span></h3>";
  parent.appendChild(hd);

  if (entries.length === 0) {
    var empty = document.createElement("p");
    empty.className = "wiki-empty";
    empty.textContent = "暂无条目";
    parent.appendChild(empty);
    return;
  }

  var list = document.createElement("div");
  list.className = "wiki-entries";
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    var card = document.createElement("article");
    card.className = "wiki-card";
    card.dataset.cat = _wikiState.catId;
    card.dataset.id = e.id;
    var badge = _wikiStatusBadge(_wikiState.catId, e.id, state);
    card.innerHTML =
      '<div class="wiki-card-head">' +
      '<span class="wiki-card-ico">' +
      _wkE(e.icon || "•") +
      "</span>" +
      "<h4>" +
      _wkE(e.name) +
      "</h4>" +
      (badge
        ? '<span class="wiki-badge ' +
          badge.cls +
          '">' +
          _wkE(badge.text) +
          "</span>"
        : "") +
      "</div>" +
      '<p class="wiki-card-brief">' +
      _wkE(e.brief || "") +
      "</p>";
    card.addEventListener("click", _wikiOnCardClick);
    list.appendChild(card);
  }
  parent.appendChild(list);
}

function _wikiOnCardClick(e) {
  var card = e.currentTarget;
  _wikiState.catId = card.dataset.cat;
  _wikiState.entryId = card.dataset.id;
  if (typeof renderAll === "function") renderAll();
}

function _wikiFindCat(id) {
  for (var i = 0; i < WIKI_CATEGORIES.length; i++)
    if (WIKI_CATEGORIES[i].id === id) return WIKI_CATEGORIES[i];
  return null;
}

// 状态徽章（玩家相对的解锁/获得状态）
function _wikiStatusBadge(catId, entryId, state) {
  if (!state) return null;
  switch (catId) {
    case "skills":
      var sk = state.skills && state.skills[entryId];
      if (sk) return { cls: "ok", text: "Lv." + sk.level };
      break;
    case "certs":
      if (state.certificates && state.certificates.indexOf(entryId) >= 0)
        return { cls: "ok", text: "✅已获得" };
      break;
    case "items":
      if (state.inventory && state.inventory.items) {
        for (var i = 0; i < state.inventory.items.length; i++) {
          if (state.inventory.items[i].id === entryId)
            return { cls: "ok", text: "✅×" + state.inventory.items[i].qty };
        }
      }
      // 装备槽
      if (state.inventory && state.inventory.equipment) {
        for (var sl in state.inventory.equipment) {
          if (state.inventory.equipment[sl] === entryId)
            return { cls: "ok", text: "🔱已装备" };
        }
      }
      break;
    case "npcs":
      var rel = state.relationships && state.relationships[entryId];
      if (rel && rel.met) {
        var aff = rel.affinity || 0;
        var c =
          aff >= 70 ? "ok" : aff >= 40 ? "warn" : aff >= 0 ? "info" : "bad";
        return { cls: c, text: "好感 " + aff };
      }
      return { cls: "muted", text: "未结识" };
    case "locations":
      if (state.trade && state.trade.currentLocation === entryId)
        return { cls: "ok", text: "📍当前" };
      break;
    case "festivals":
      if (typeof FESTIVALS !== "undefined" && state.player) {
        var dayInYear = (state.player.day || 1) % 365;
        for (var fi = 0; fi < FESTIVALS.length; fi++) {
          if (FESTIVALS[fi].id !== entryId) continue;
          var f = FESTIVALS[fi];
          if (dayInYear >= f.startDay && dayInYear < f.startDay + f.duration)
            return { cls: "ok", text: "进行中" };
          var diff = f.startDay - dayInYear;
          if (diff > 0 && diff <= 30)
            return { cls: "warn", text: diff + " 天后" };
        }
      }
      break;
  }
  return null;
}

// ================================================================
//  搜索结果
// ================================================================
function _wikiRenderSearchResults(state, parent) {
  var q = (_wikiState.query || "").trim().toLowerCase();
  var hd = document.createElement("div");
  hd.className = "wiki-list-header";
  hd.innerHTML = "<h3>🔍 搜索结果：" + _wkE(q) + "</h3>";
  parent.appendChild(hd);
  if (!q) {
    parent.appendChild(document.createElement("br"));
    return;
  }

  var hits = [];
  for (var i = 0; i < WIKI_CATEGORIES.length; i++) {
    var c = WIKI_CATEGORIES[i];
    var entries = _wikiListEntries(c.id, state);
    for (var j = 0; j < entries.length; j++) {
      var e = entries[j];
      var hay = (e.name + " " + (e.brief || "")).toLowerCase();
      if (hay.indexOf(q) >= 0) {
        hits.push({
          catId: c.id,
          catName: c.name,
          catIcon: c.icon,
          entry: e,
        });
      }
    }
  }

  if (hits.length === 0) {
    var p = document.createElement("p");
    p.className = "wiki-empty";
    p.textContent = "未找到匹配条目，试试其他关键词。";
    parent.appendChild(p);
    return;
  }

  var list = document.createElement("div");
  list.className = "wiki-entries";
  for (var k = 0; k < hits.length; k++) {
    var h = hits[k];
    var card = document.createElement("article");
    card.className = "wiki-card";
    card.dataset.cat = h.catId;
    card.dataset.id = h.entry.id;
    card.innerHTML =
      '<div class="wiki-card-head">' +
      '<span class="wiki-card-ico">' +
      _wkE(h.entry.icon || "•") +
      "</span>" +
      "<h4>" +
      _wkE(h.entry.name) +
      "</h4>" +
      '<span class="wiki-badge muted">' +
      _wkE(h.catIcon + " " + h.catName) +
      "</span>" +
      "</div>" +
      '<p class="wiki-card-brief">' +
      _wkE(h.entry.brief || "") +
      "</p>";
    card.addEventListener("click", _wikiOnCardClick);
    list.appendChild(card);
  }
  parent.appendChild(list);
}

// ================================================================
//  详情视图（dispatch）
// ================================================================
function _wikiRenderDetail(state, parent) {
  var detail = document.createElement("div");
  detail.className = "wiki-detail";

  var backBtn = document.createElement("button");
  backBtn.className = "wiki-back";
  backBtn.textContent = "← 返回列表";
  backBtn.addEventListener("click", _wikiBackToList);
  detail.appendChild(backBtn);

  var body = document.createElement("div");
  body.className = "wiki-detail-body";

  var html = "";
  switch (_wikiState.catId) {
    case "locations":
      html = _wikiDetailLocation(state, _wikiState.entryId);
      break;
    case "jobs":
      html = _wikiDetailJob(state, _wikiState.entryId);
      break;
    case "goods":
      html = _wikiDetailGood(state, _wikiState.entryId);
      break;
    case "items":
      html = _wikiDetailItem(state, _wikiState.entryId);
      break;
    case "skills":
      html = _wikiDetailSkill(state, _wikiState.entryId);
      break;
    case "certs":
      html = _wikiDetailCert(state, _wikiState.entryId);
      break;
    case "npcs":
      html = _wikiDetailNpc(state, _wikiState.entryId);
      break;
    case "festivals":
      html = _wikiDetailFestival(state, _wikiState.entryId);
      break;
    case "weather":
      html = _wikiDetailWeather(state, _wikiState.entryId);
      break;
    case "invest":
      html = _wikiDetailInvest(state, _wikiState.entryId);
      break;
    case "mechanics":
      html = _wikiDetailMechanic(state, _wikiState.entryId);
      break;
    case "narrative":
      html = _wikiDetailNarrative(state, _wikiState.entryId);
      break;
    case "victory":
      html = _wikiDetailVictory(state, _wikiState.entryId);
      break;
  }
  body.innerHTML = html || '<p class="wiki-empty">条目不存在</p>';
  detail.appendChild(body);

  // 绑定 wiki-link 跳转
  var links = body.querySelectorAll(".wiki-link");
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function (e) {
      e.preventDefault();
      var a = e.currentTarget;
      wikiNavigate(a.dataset.cat, a.dataset.id);
    });
  }

  parent.appendChild(detail);
}

// 链接生成器：跨条目跳转按钮
function _wkLink(catId, entryId, label, icon) {
  return (
    '<a class="wiki-link" href="#" data-cat="' +
    _wkE(catId) +
    '" data-id="' +
    _wkE(entryId) +
    '">' +
    (icon ? _wkE(icon) + " " : "") +
    _wkE(label) +
    "</a>"
  );
}

// ================================================================
//  详情：地点
// ================================================================
function _wikiDetailLocation(state, id) {
  if (typeof LOCATIONS === "undefined" || !LOCATIONS[id]) return "";
  var loc = LOCATIONS[id];
  var typeLabel =
    {
      residential: "居住区",
      commercial: "商业区",
      industrial: "工业区",
      institutional: "机构",
      corporate: "写字楼",
      service: "服务",
      recreation: "休闲",
      education: "教育",
    }[loc.type] || loc.type;

  var stars = "";
  if (typeof getFootfallStars === "function") {
    try {
      stars = getFootfallStars(loc.footfall || 1) || "";
    } catch (e) {}
  }

  var html =
    "<h2>📍 " +
    _wkE(loc.name) +
    "</h2>" +
    '<p class="wiki-desc">' +
    _wkE(loc.desc) +
    "</p>" +
    '<div class="wiki-attrs">' +
    "<div><b>地点类型</b>" +
    _wkE(typeLabel) +
    "</div>" +
    "<div><b>基础客流量</b>" +
    (loc.footfall || 1).toFixed(2) +
    " " +
    _wkE(stars) +
    "</div>" +
    "<div><b>摆摊提示</b>" +
    _wkE(loc.vendingNote || "—") +
    "</div>" +
    "</div>";

  if (loc.jobs && loc.jobs.length > 0) {
    html += '<h3>💼 在此可做的工作</h3><ul class="wiki-list">';
    for (var i = 0; i < loc.jobs.length; i++) {
      var jid = loc.jobs[i];
      var job = typeof getJobById === "function" ? getJobById(jid) : null;
      if (job) {
        html +=
          "<li>" +
          _wkLink("jobs", job.id, job.name, job.icon) +
          " — " +
          _wkE((job.desc || "").slice(0, 40)) +
          "...</li>";
      } else {
        html += "<li>" + _wkE(jid) + "</li>";
      }
    }
    html += "</ul>";
  }

  if (loc.priceMod && Object.keys(loc.priceMod).length > 0) {
    html +=
      "<h3>📦 商品价格修正</h3>" +
      '<table class="wiki-table"><tr><th>商品</th><th>修正</th><th>提示</th></tr>';
    for (var gid in loc.priceMod) {
      var mod = loc.priceMod[gid];
      var good = typeof getGoodById === "function" ? getGoodById(gid) : null;
      var hint = mod < 0.95 ? "✅适合进货" : mod > 1.1 ? "💰适合卖出" : "—";
      html +=
        "<tr><td>" +
        (good ? _wkLink("goods", good.id, good.name) : _wkE(gid)) +
        "</td><td>×" +
        mod.toFixed(2) +
        "</td><td>" +
        _wkE(hint) +
        "</td></tr>";
    }
    html += "</table>";
  }

  if (typeof TRAVEL_GRAPH !== "undefined" && TRAVEL_GRAPH[id]) {
    html += '<h3>🗺️ 直达地点</h3><div class="wiki-links">';
    for (var t = 0; t < TRAVEL_GRAPH[id].length; t++) {
      var nb = LOCATIONS[TRAVEL_GRAPH[id][t]];
      if (nb) html += _wkLink("locations", nb.id, nb.name, "📍") + " ";
    }
    html += "</div>";
  }

  if (typeof NPCS !== "undefined") {
    var npcsHere = NPCS.filter(function (n) {
      return n.location === id;
    });
    if (npcsHere.length > 0) {
      html += '<h3>👥 在此的居民</h3><div class="wiki-links">';
      for (var n = 0; n < npcsHere.length; n++) {
        html += _wkLink("npcs", npcsHere[n].id, npcsHere[n].name, "👤") + " ";
      }
      html += "</div>";
    }
  }

  // 在此可购买的装备
  if (typeof ITEMS !== "undefined") {
    var itHere = ITEMS.filter(function (it) {
      return (it.buyLocations || []).indexOf(id) >= 0;
    });
    if (itHere.length > 0) {
      html += '<h3>🎒 可购买装备</h3><div class="wiki-links">';
      for (var ih = 0; ih < itHere.length; ih++) {
        html +=
          _wkLink("items", itHere[ih].id, itHere[ih].name, itHere[ih].icon) +
          " ";
      }
      html += "</div>";
    }
  }

  return html;
}

// ================================================================
//  详情：工作
// ================================================================
function _wikiDetailJob(state, id) {
  var job = typeof getJobById === "function" ? getJobById(id) : null;
  if (!job) return "";
  var loc = typeof LOCATIONS !== "undefined" ? LOCATIONS[job.location] : null;

  var html =
    "<h2>" +
    _wkE(job.icon || "💼") +
    " " +
    _wkE(job.name) +
    "</h2>" +
    '<p class="wiki-desc">' +
    _wkE(job.desc) +
    "</p>" +
    '<div class="wiki-attrs">' +
    "<div><b>所在地点</b>" +
    (loc ? _wkLink("locations", loc.id, loc.name) : _wkE(job.location)) +
    "</div>";

  var pay = state ? _wkSamplePay(job, state, 12) : null;
  if (pay) {
    html += "<div><b>当前收入区间</b>¥" + pay.min + " ~ ¥" + pay.max + "</div>";
  }

  if (job.startupCost) {
    html += "<div><b>启动成本</b>¥" + job.startupCost + "</div>";
  }

  if (job.effects) {
    var apCost = 20;
    if (job.effects.fatigue)
      apCost = Math.max(15, Math.min(45, job.effects.fatigue));
    html += "<div><b>预估 AP</b>⚡" + apCost + "</div>";
  }

  if (job.risk && (job.risk.injury || job.risk.illness)) {
    var risks = [];
    if (job.risk.injury)
      risks.push("受伤 " + Math.round(job.risk.injury * 100) + "%");
    if (job.risk.illness)
      risks.push("生病 " + Math.round(job.risk.illness * 100) + "%");
    html += "<div><b>风险</b>" + _wkE(risks.join(" · ")) + "</div>";
  }

  html += "</div>";

  if (job.requirements && Object.keys(job.requirements).length > 0) {
    html += '<h3>🔒 前置条件</h3><ul class="wiki-list">';
    var rq = job.requirements;
    if (rq.minAge) html += "<li>年龄 ≥ " + rq.minAge + "</li>";
    if (rq.maxAge) html += "<li>年龄 ≤ " + rq.maxAge + "</li>";
    if (rq.physique) html += "<li>体质 ≥ " + rq.physique + "</li>";
    if (rq.intelligence) html += "<li>智力 ≥ " + rq.intelligence + "</li>";
    if (rq.agility) html += "<li>敏捷 ≥ " + rq.agility + "</li>";
    if (rq.mental) html += "<li>心智 ≥ " + rq.mental + "</li>";
    var skKeys = [
      "cooking",
      "sales",
      "repair",
      "english",
      "driving",
      "coding",
      "management",
      "accounting",
      "electrician",
      "welding",
    ];
    for (var sk = 0; sk < skKeys.length; sk++) {
      if (rq[skKeys[sk]])
        html +=
          "<li>" +
          _wkLink("skills", skKeys[sk], _skName(skKeys[sk])) +
          " ≥ Lv." +
          rq[skKeys[sk]] +
          "</li>";
    }
    if (rq.certificate)
      html += "<li>" + _wkLink("certs", rq.certificate, "需要证书") + "</li>";
    if (job.educationRequired !== undefined) {
      var eduLabel =
        ["大专", "本科", "研究生"][job.educationRequired] || "未知";
      html += "<li>学历 ≥ " + _wkE(eduLabel) + "</li>";
    }
    if (job.requiredFlag)
      html +=
        "<li>解锁标志：<code>" +
        _wkE(job.requiredFlag) +
        "</code>（来自 NPC 委托或剧情）</li>";
    html += "</ul>";
  }

  if (job.effects) {
    html += '<h3>📊 每次执行效果</h3><ul class="wiki-list">';
    var eff = job.effects;
    if (eff.fatigue) html += "<li>疲劳 +" + eff.fatigue + "</li>";
    if (eff.hygiene)
      html +=
        "<li>卫生 " + (eff.hygiene > 0 ? "+" : "") + eff.hygiene + "</li>";
    if (eff.happiness)
      html +=
        "<li>心情 " + (eff.happiness > 0 ? "+" : "") + eff.happiness + "</li>";
    if (eff.physiqueXp) html += "<li>体质 EXP +" + eff.physiqueXp + "</li>";
    if (eff.intelligenceXp)
      html += "<li>智力 EXP +" + eff.intelligenceXp + "</li>";
    if (eff.agilityXp) html += "<li>敏捷 EXP +" + eff.agilityXp + "</li>";
    if (eff.mentalXp) html += "<li>心智 EXP +" + eff.mentalXp + "</li>";
    var xpKeys = [
      ["cookingXp", "烹饪"],
      ["salesXp", "销售"],
      ["repairXp", "维修"],
      ["englishXp", "英语"],
      ["drivingXp", "驾驶"],
      ["managementXp", "管理"],
      ["accountingXp", "会计"],
      ["electricianXp", "电工"],
      ["weldingXp", "焊接"],
    ];
    for (var x = 0; x < xpKeys.length; x++) {
      if (eff[xpKeys[x][0]])
        html += "<li>" + xpKeys[x][1] + " XP +" + eff[xpKeys[x][0]] + "</li>";
    }
    html += "</ul>";
  }

  if (typeof NPCS !== "undefined") {
    var bonusNpcs = [];
    for (var ni = 0; ni < NPCS.length; ni++) {
      var npc = NPCS[ni];
      if (!npc.presenceBonus) continue;
      for (var pb = 0; pb < npc.presenceBonus.length; pb++) {
        var rule = npc.presenceBonus[pb];
        if (
          rule.jobs &&
          rule.jobs.indexOf(id) >= 0 &&
          npc.location === job.location
        ) {
          bonusNpcs.push({
            npc: npc,
            threshold: rule.minAffinity,
            mult: rule.multiplier,
          });
          break;
        }
      }
    }
    if (bonusNpcs.length > 0) {
      html += '<h3>👥 NPC 在场加成</h3><ul class="wiki-list">';
      for (var bi = 0; bi < bonusNpcs.length; bi++) {
        var bn = bonusNpcs[bi];
        html +=
          "<li>" +
          _wkLink("npcs", bn.npc.id, bn.npc.name) +
          "（好感 ≥" +
          bn.threshold +
          "）：收入 ×" +
          bn.mult.toFixed(2) +
          "</li>";
      }
      html += "</ul>";
    }
  }

  if (typeof SKILL_SYNERGIES !== "undefined") {
    var synHits = [];
    for (var si = 0; si < SKILL_SYNERGIES.length; si++) {
      if (SKILL_SYNERGIES[si].jobs && SKILL_SYNERGIES[si].jobs.indexOf(id) >= 0)
        synHits.push(SKILL_SYNERGIES[si]);
    }
    if (synHits.length > 0) {
      html += '<h3>🔀 可激活的技能协同</h3><ul class="wiki-list">';
      for (var sj = 0; sj < synHits.length; sj++) {
        html +=
          "<li>" +
          _wkE(synHits[sj].label) +
          " — " +
          _wkE(synHits[sj].desc) +
          "</li>";
      }
      html += "</ul>";
    }
  }

  return html;
}

function _skName(k) {
  return typeof getSkillChineseName === "function" ? getSkillChineseName(k) : k;
}

// ================================================================
//  详情：商品
// ================================================================
function _wikiDetailGood(state, id) {
  var good = typeof getGoodById === "function" ? getGoodById(id) : null;
  if (!good) return "";

  var html =
    "<h2>📦 " +
    _wkE(good.name) +
    "</h2>" +
    '<p class="wiki-desc">基础流通商品，可在不同地点低买高卖。</p>' +
    '<div class="wiki-attrs">' +
    "<div><b>类别</b>" +
    _wkE(_goodCatLabel(good.category)) +
    "</div>" +
    "<div><b>基础价</b>¥" +
    good.basePrice +
    " / " +
    _wkE(good.unit) +
    "</div>" +
    "</div>";

  if (typeof LOCATIONS !== "undefined") {
    html +=
      "<h3>🌆 各地点价格修正</h3>" +
      '<table class="wiki-table"><tr><th>地点</th><th>修正</th><th>预估价</th><th>提示</th></tr>';
    var rows = [];
    for (var lk in LOCATIONS) {
      var loc = LOCATIONS[lk];
      var mod = (loc.priceMod && loc.priceMod[id]) || 1.0;
      rows.push({ loc: loc, mod: mod });
    }
    rows.sort(function (a, b) {
      return a.mod - b.mod;
    });
    var minMod = rows[0].mod,
      maxMod = rows[rows.length - 1].mod;
    for (var ri = 0; ri < rows.length; ri++) {
      var r = rows[ri];
      var pred = (good.basePrice * r.mod).toFixed(2);
      var hint =
        r.mod === minMod && minMod < 1.0
          ? "✅最低（适合进货）"
          : r.mod === maxMod && maxMod > 1.0
            ? "💰最高（适合卖出）"
            : "—";
      html +=
        "<tr><td>" +
        _wkLink("locations", r.loc.id, r.loc.name) +
        "</td><td>×" +
        r.mod.toFixed(2) +
        "</td><td>¥" +
        pred +
        "</td><td>" +
        _wkE(hint) +
        "</td></tr>";
    }
    html += "</table>";

    if (minMod < maxMod) {
      var diff = (((maxMod - minMod) / minMod) * 100).toFixed(0);
      html +=
        '<p class="wiki-tip">💡 理论倒卖空间：约 ' +
        diff +
        "%（实际还要扣 5% 交易税与城管 heat）</p>";
    }
  }

  return html;
}

// ================================================================
//  详情：装备
// ================================================================
function _wikiDetailItem(state, id) {
  if (typeof ITEMS === "undefined") return "";
  var item = null;
  for (var i = 0; i < ITEMS.length; i++)
    if (ITEMS[i].id === id) {
      item = ITEMS[i];
      break;
    }
  if (!item) return "";

  var slotLabel =
    {
      head: "头部",
      body: "上身",
      feet: "脚部",
      hand: "手部",
      accessory: "配饰",
    }[item.slot] || item.slot;

  var html =
    "<h2>" +
    _wkE(item.icon || "🎒") +
    " " +
    _wkE(item.name) +
    "</h2>" +
    '<p class="wiki-desc">' +
    _wkE(item.desc) +
    "</p>" +
    '<div class="wiki-attrs">' +
    "<div><b>装备槽</b>" +
    _wkE(slotLabel) +
    "</div>" +
    "<div><b>价格</b>¥" +
    item.price +
    "</div>" +
    "</div>";

  // 数值化效果
  if (item.effects) {
    html += '<h3>📊 装备效果</h3><ul class="wiki-list">';
    var ef = item.effects;
    var labels = {
      physique: "体质",
      intelligence: "智力",
      agility: "敏捷",
      mental: "心智",
      hygiene: "卫生",
      happiness: "心情",
      fame: "名气",
      capacity: "背包容量",
      injury: "受伤概率",
      illness: "生病概率",
      fatigue: "疲劳",
      outdoor: "室外加成",
    };
    for (var k in ef) {
      var lbl = labels[k] || k;
      var v = ef[k];
      var disp;
      if (k === "injury" || k === "illness") {
        disp = (v >= 0 ? "+" : "") + Math.round(v * 100) + "%";
      } else if (v >= 0) {
        disp = "+" + v;
      } else {
        disp = "" + v;
      }
      html += "<li>" + _wkE(lbl) + " " + _wkE(disp) + "</li>";
    }
    html += "</ul>";
  }

  if (item.buyLocations && item.buyLocations.length > 0) {
    html += '<h3>🛒 购买地点</h3><div class="wiki-links">';
    for (var b = 0; b < item.buyLocations.length; b++) {
      var bl =
        typeof LOCATIONS !== "undefined"
          ? LOCATIONS[item.buyLocations[b]]
          : null;
      if (bl) html += _wkLink("locations", bl.id, bl.name, "📍") + " ";
    }
    html += "</div>";
  }
  return html;
}

// ================================================================
//  详情：技能
// ================================================================
function _wikiDetailSkill(state, id) {
  var sk = state && state.skills && state.skills[id] ? state.skills[id] : null;
  var skName = _skName(id);
  var html =
    "<h2>📚 " +
    _wkE(skName) +
    "</h2>" +
    '<p class="wiki-desc">技能等级影响相关工作收入、解锁特定行动，并产生衍生加成。</p>';

  if (sk) {
    html +=
      '<div class="wiki-attrs">' +
      "<div><b>当前等级</b>Lv." +
      sk.level +
      "</div>" +
      "<div><b>当前 EXP</b>" +
      sk.xp +
      " / " +
      (sk.level + 1) * 120 +
      "</div>" +
      "<div><b>训练消耗</b>⚡15 AP + ¥50</div>" +
      "<div><b>每日上限</b>3 次/技能</div>" +
      "</div>";
  }

  // 解锁的工作
  if (typeof STREET_JOBS !== "undefined") {
    var unlockedJobs = [];
    for (var i = 0; i < STREET_JOBS.length; i++) {
      var job = STREET_JOBS[i];
      if (job.requirements && job.requirements[id]) {
        unlockedJobs.push({ job: job, lv: job.requirements[id] });
      }
    }
    if (unlockedJobs.length > 0) {
      html += '<h3>🔓 该技能解锁的工作</h3><ul class="wiki-list">';
      unlockedJobs.sort(function (a, b) {
        return a.lv - b.lv;
      });
      for (var uj = 0; uj < unlockedJobs.length; uj++) {
        var u = unlockedJobs[uj];
        var ok = sk && sk.level >= u.lv;
        html +=
          "<li>" +
          (ok ? "✅ " : "🔒 ") +
          _wkLink("jobs", u.job.id, u.job.name, u.job.icon) +
          " — 需 Lv." +
          u.lv +
          "</li>";
      }
      html += "</ul>";
    }
  }

  // 衍生加成
  var derivations = {
    cooking: "🍚 自己做饭花费降低（最低¥5）",
    sales:
      "💰 买进折扣最高 15%、卖出溢价最高 15%；摆摊收益倍率（0级60%→100级125%）",
    repair: "🛠️ 装备效果 +repair × 0.5%",
    coding: "💻 职场能力 +2/10 级；街头：大学城/科技园解锁「网络外包单」",
    english: "🇬🇧 家教收入 +english × 0.3；解锁外贸/客服协同",
    driving: "🛵 出行 AP 减免：每 20 级 -1（最多 -5）",
    management: "📋 职场向上管理 +1/10 级",
    accounting: "🏦 银行存款日息 +accounting × 0.0005（最多+5%/年）",
    electrician: "🔌 工厂工作收入 +electrician × 0.5%",
    welding: "🔧 建筑工作收入 +welding × 0.8%",
  };
  if (derivations[id]) {
    html += "<h3>✨ 衍生加成</h3><p>" + _wkE(derivations[id]) + "</p>";
  }

  // 关联协同
  if (typeof SKILL_SYNERGIES !== "undefined") {
    var related = [];
    for (var si = 0; si < SKILL_SYNERGIES.length; si++) {
      if (SKILL_SYNERGIES[si].skills && SKILL_SYNERGIES[si].skills[id])
        related.push(SKILL_SYNERGIES[si]);
    }
    if (related.length > 0) {
      html += '<h3>🔀 涉及的技能协同</h3><ul class="wiki-list">';
      for (var ri = 0; ri < related.length; ri++) {
        html +=
          "<li>" +
          _wkE(related[ri].label) +
          " — " +
          _wkE(related[ri].desc) +
          "</li>";
      }
      html += "</ul>";
    }
  }

  // 关联证书
  if (typeof CERTIFICATES !== "undefined") {
    var hits = CERTIFICATES.filter(function (c) {
      return (
        (c.effects && c.effects[id + "Xp"]) ||
        (c.requirements && c.requirements[id])
      );
    });
    if (hits.length > 0) {
      html += '<h3>📜 相关证书</h3><div class="wiki-links">';
      for (var hi = 0; hi < hits.length; hi++) {
        html += _wkLink("certs", hits[hi].id, hits[hi].name, "📜") + " ";
      }
      html += "</div>";
    }
  }
  return html;
}

// ================================================================
//  详情：证书
// ================================================================
function _wikiDetailCert(state, id) {
  if (typeof CERTIFICATES === "undefined") return "";
  var cert = null;
  for (var i = 0; i < CERTIFICATES.length; i++)
    if (CERTIFICATES[i].id === id) {
      cert = CERTIFICATES[i];
      break;
    }
  if (!cert) return "";

  var owned =
    state && state.certificates && state.certificates.indexOf(id) >= 0;

  var html =
    "<h2>📜 " +
    _wkE(cert.name) +
    (owned ? ' <span class="wiki-badge ok">✅已获得</span>' : "") +
    "</h2>" +
    '<p class="wiki-desc">' +
    _wkE(cert.desc) +
    "</p>" +
    '<div class="wiki-attrs">' +
    "<div><b>考试费用</b>¥" +
    cert.requirements.cash +
    "</div>" +
    "<div><b>通过率</b>" +
    Math.round(cert.examPassRate * 100) +
    "%</div>" +
    "</div>";

  // 前置
  html += '<h3>🔒 前置条件</h3><ul class="wiki-list">';
  var rq = cert.requirements;
  if (rq.intelligence) html += "<li>智力 ≥ " + rq.intelligence + "</li>";
  if (rq.physique) html += "<li>体质 ≥ " + rq.physique + "</li>";
  if (rq.agility) html += "<li>敏捷 ≥ " + rq.agility + "</li>";
  if (rq.repair)
    html +=
      "<li>" +
      _wkLink("skills", "repair", "维修") +
      " ≥ Lv." +
      rq.repair +
      "</li>";
  html += "<li>现金 ≥ ¥" + rq.cash + "</li>";
  html += "</ul>";

  // 效果
  if (cert.effects) {
    html += '<h3>📊 通过后效果</h3><ul class="wiki-list">';
    var ef = cert.effects;
    if (ef.intelligence) html += "<li>智力 +" + ef.intelligence + "</li>";
    if (ef.physique) html += "<li>体质 +" + ef.physique + "</li>";
    if (ef.agility) html += "<li>敏捷 +" + ef.agility + "</li>";
    if (ef.repair) html += "<li>维修 +" + ef.repair + " 级</li>";
    if (ef.injuryReduction)
      html += "<li>受伤概率 ×" + (1 - ef.injuryReduction).toFixed(2) + "</li>";
    var xpKeys = [
      ["codingXp", "编程"],
      ["accountingXp", "会计"],
      ["weldingXp", "焊接"],
      ["drivingXp", "驾驶"],
      ["englishXp", "英语"],
      ["electricianXp", "电工"],
      ["managementXp", "管理"],
    ];
    for (var x = 0; x < xpKeys.length; x++) {
      if (ef[xpKeys[x][0]])
        html +=
          "<li>" +
          _wkLink("skills", xpKeys[x][0].replace("Xp", ""), xpKeys[x][1]) +
          " XP +" +
          ef[xpKeys[x][0]] +
          "</li>";
    }
    html += "</ul>";
  }

  html +=
    '<p class="wiki-tip">📍 在 ' +
    _wkLink("locations", "trainingCenter", "培训中心") +
    " 报名考取。</p>";
  return html;
}

// ================================================================
//  详情：NPC
// ================================================================
function _wikiDetailNpc(state, id) {
  if (typeof NPCS === "undefined") return "";
  var npc = null;
  for (var i = 0; i < NPCS.length; i++)
    if (NPCS[i].id === id) {
      npc = NPCS[i];
      break;
    }
  if (!npc) return "";

  var rel = state && state.relationships && state.relationships[id];
  var aff = rel ? rel.affinity || 0 : 0;
  var met = rel && rel.met;

  var html =
    "<h2>👤 " +
    _wkE(npc.name) +
    ' <span class="wiki-badge ' +
    (met ? (aff >= 70 ? "ok" : aff >= 40 ? "warn" : "info") : "muted") +
    '">' +
    (met ? "好感 " + aff : "未结识") +
    "</span></h2>" +
    '<p class="wiki-desc">' +
    _wkE(npc.desc || "") +
    "</p>" +
    '<div class="wiki-attrs">' +
    "<div><b>角色</b>" +
    _wkE(npc.role || "") +
    "</div>" +
    "<div><b>常驻地点</b>" +
    (typeof LOCATIONS !== "undefined" && LOCATIONS[npc.location]
      ? _wkLink("locations", npc.location, LOCATIONS[npc.location].name)
      : _wkE(npc.location)) +
    "</div>";
  if (npc.birthday)
    html += "<div><b>生日</b>第 " + npc.birthday + " 天（按 day%365）</div>";
  html += "</div>";

  // 礼物偏好
  if (npc.giftPrefers && npc.giftPrefers.length > 0) {
    html += '<h3>🎁 喜欢的礼物</h3><div class="wiki-links">';
    for (var g = 0; g < npc.giftPrefers.length; g++) {
      var goodId = npc.giftPrefers[g];
      var good = typeof getGoodById === "function" ? getGoodById(goodId) : null;
      if (good) html += _wkLink("goods", good.id, good.name, "📦") + " ";
      else html += '<span class="wiki-pill">' + _wkE(goodId) + "</span> ";
    }
    html +=
      '</div><p class="wiki-tip">送投其所好礼物 +15 好感（普通礼物 +5）；生日当天 ×2。</p>';
  }

  // 在场加成
  if (npc.presenceBonus && npc.presenceBonus.length > 0) {
    html += '<h3>✨ 在场加成（TA 在该地点时）</h3><ul class="wiki-list">';
    for (var pi = 0; pi < npc.presenceBonus.length; pi++) {
      var pb = npc.presenceBonus[pi];
      var jobLabel = pb.jobs
        ? pb.jobs
            .map(function (jid) {
              var job =
                typeof getJobById === "function" ? getJobById(jid) : null;
              return job ? job.name : jid;
            })
            .join(" / ")
        : "所有相关工作";
      html +=
        "<li>好感 ≥" +
        pb.minAffinity +
        " · " +
        _wkE(jobLabel) +
        " 收入 ×" +
        pb.multiplier.toFixed(2) +
        "</li>";
    }
    html += "</ul>";
  }

  // 好感阈值奖励
  if (npc.affinityRewards && npc.affinityRewards.length > 0) {
    html += '<h3>💕 好感阈值奖励</h3><ul class="wiki-list">';
    for (var ar = 0; ar < npc.affinityRewards.length; ar++) {
      var rwd = npc.affinityRewards[ar];
      var ok = aff >= rwd.threshold;
      html +=
        "<li>" +
        (ok ? "✅ " : "🔒 ") +
        "好感 " +
        rwd.threshold +
        ":" +
        _wkE(rwd.desc) +
        "</li>";
    }
    html += "</ul>";
  }

  // 委托
  if (npc.favor) {
    var favorDone = state && state.flags && state.flags["_npcFavor_" + id];
    html +=
      "<h3>📜 委托任务（好感 ≥30 解锁" +
      (favorDone ? "，已完成" : "") +
      "）</h3>" +
      '<p class="wiki-quote">' +
      _wkE(npc.favor.story) +
      "</p>";
  }

  // 深度任务
  if (npc.deepTask) {
    var deepDone = state && state.flags && state.flags["_npcDeepTask_" + id];
    html +=
      "<h3>💌 深度任务（好感 ≥70 解锁" +
      (deepDone ? "，已完成" : "") +
      "）</h3>" +
      '<p class="wiki-quote">' +
      _wkE(npc.deepTask.story) +
      "</p>";
  }

  // 节日台词
  if (npc.festivalLines) {
    html += '<h3>🎭 节日台词</h3><ul class="wiki-list">';
    var festLabels = {
      spring_festival: "春节",
      labor_day: "劳动节",
      dragon_boat: "端午",
      mid_autumn: "中秋",
      national_day: "国庆",
      shopping_festival: "剁手节",
    };
    for (var fk in npc.festivalLines) {
      html +=
        "<li><b>" +
        _wkE(festLabels[fk] || fk) +
        "：</b>" +
        _wkE(npc.festivalLines[fk]) +
        "</li>";
    }
    html += "</ul>";
  }

  return html;
}

// ================================================================
//  详情：节日
// ================================================================
function _wikiDetailFestival(state, id) {
  if (typeof FESTIVALS === "undefined") return "";
  var f = null;
  for (var i = 0; i < FESTIVALS.length; i++)
    if (FESTIVALS[i].id === id) {
      f = FESTIVALS[i];
      break;
    }
  if (!f) return "";

  var html =
    "<h2>" +
    _wkE(f.icon || "🎭") +
    " " +
    _wkE(f.name) +
    "</h2>" +
    '<p class="wiki-desc">' +
    _wkE(f.desc || "") +
    "</p>" +
    '<div class="wiki-attrs">' +
    "<div><b>开始日期</b>第 " +
    f.startDay +
    " 天（按 day%365）</div>" +
    "<div><b>持续</b>" +
    f.duration +
    " 天</div>";
  if (f.moodBonus) html += "<div><b>每日心情加成</b>+" + f.moodBonus + "</div>";
  html += "</div>";

  if (f.priceMods && Object.keys(f.priceMods).length > 0) {
    html += '<h3>💰 商品价格修正</h3><ul class="wiki-list">';
    var catNames = {
      food: "食品",
      luxury: "奢侈品",
      daily: "日用品",
      clothing: "服装",
      electronics: "电子",
    };
    for (var c in f.priceMods) {
      var pct = ((f.priceMods[c] - 1) * 100).toFixed(0);
      var sign = pct >= 0 ? "+" : "";
      html +=
        "<li>" +
        _wkE(catNames[c] || c) +
        "：" +
        _wkE(sign + pct + "%") +
        "</li>";
    }
    html += "</ul>";
  }

  if (f.announceTxt) {
    html +=
      '<h3>📣 节日公告</h3><p class="wiki-quote">' +
      _wkE(f.announceTxt) +
      "</p>";
  }

  // 限定工作
  if (typeof FESTIVAL_JOBS !== "undefined") {
    var fjobs = FESTIVAL_JOBS[id];
    if (fjobs && fjobs.length > 0) {
      html += '<h3>🎪 节日限定工作</h3><ul class="wiki-list">';
      for (var fj = 0; fj < fjobs.length; fj++) {
        var fjob = fjobs[fj];
        html +=
          "<li>" + _wkE(fjob.name) + " — " + _wkE(fjob.desc || "") + "</li>";
      }
      html += "</ul>";
    }
  }

  return html;
}

// ================================================================
//  详情：天气
// ================================================================
function _wikiDetailWeather(state, id) {
  if (id === "season") {
    return (
      "<h2>🍃 四季节奏</h2>" +
      '<p class="wiki-desc">游戏中按 day 推演四季更替（春/夏/秋/冬），影响天气分布与节日时序。</p>' +
      '<div class="wiki-attrs">' +
      "<div><b>春</b>多雨多雷，温度回升</div>" +
      "<div><b>夏</b>酷暑频发，户外疲劳加重</div>" +
      "<div><b>秋</b>气温适中，最适合工作</div>" +
      "<div><b>冬</b>大雪/严寒，AP 倍率上升</div>" +
      "</div>" +
      '<p class="wiki-tip">💡 在 ' +
      _wkLink("mechanics", "weather_link", "天气联动机制") +
      " 查看完整天气×AP×心情公式。</p>"
    );
  }

  if (typeof WEATHER_TYPES === "undefined") return "";
  var w = null;
  for (var i = 0; i < WEATHER_TYPES.length; i++)
    if (WEATHER_TYPES[i].id === id) {
      w = WEATHER_TYPES[i];
      break;
    }
  if (!w) return "";

  var html =
    "<h2>" +
    _wkE(w.icon || "🌤️") +
    " " +
    _wkE(w.name) +
    "</h2>" +
    '<div class="wiki-attrs">' +
    "<div><b>室外工作收入修正</b>×" +
    w.outdoorMod.toFixed(2) +
    "</div>" +
    "<div><b>每日疲劳加成</b>+" +
    w.fatigueBonus +
    "</div>" +
    "<div><b>每日心情加成</b>" +
    (w.happinessBonus >= 0 ? "+" : "") +
    w.happinessBonus +
    "</div>" +
    "</div>";

  // 极端天气提示
  var extreme = ["stormy", "snowy", "extreme_heat", "extreme_cold"];
  if (extreme.indexOf(w.id) >= 0) {
    html +=
      '<p class="wiki-tip">⚠️ 极端天气会额外增加 AP 消耗倍率（+0.15~0.20），适合改室内行动。</p>';
  }

  html +=
    '<p class="wiki-tip">💡 摆摊收入受 ' +
    _wkLink("mechanics", "vending_footfall", "客流量") +
    " 综合影响（位置×天气×节日×周末）。</p>";
  return html;
}

// ================================================================
//  详情：投资
// ================================================================
function _wikiDetailInvest(state, id) {
  var html = "";
  switch (id) {
    case "stocks":
      html =
        "<h2>📈 股票（30 只）</h2>" +
        '<p class="wiki-desc">幽默化映射现实企业，行业特征和股价波动参考真实市场。</p>' +
        '<h3>📋 行业代表</h3><ul class="wiki-list">' +
        "<li><b>互联网</b>阿里妈妈 / 腾飞控股 / 拼少少 / 美图秀（与现实大厂同行业波动相关）</li>" +
        "<li><b>科技/芯片</b>恩威达 / 哥斯拉 / 苹果家 / 英特尔之家</li>" +
        "<li><b>传统蓝筹</b>茅小台 / 招行国际 / 中石化双子</li>" +
        "<li><b>新能源</b>宁德时代家 / 比亚仿（电池与车企）</li>" +
        "</ul>" +
        '<h3>📊 影响因素</h3><ul class="wiki-list">' +
        "<li>📰 新闻事件按 industry/symbol 匹配（13+ 投资专项新闻）</li>" +
        "<li>🪜 重大新闻有 L2 级联效果（详见 " +
        _wkLink("narrative", "news_cascade", "新闻级联") +
        "）</li>" +
        "<li>📈 每日 tick 市场波动 + 季度财报</li>" +
        "</ul>";
      break;
    case "btc":
      html =
        "<h2>💎 虚拟币（20 种）</h2>" +
        '<p class="wiki-desc">BTC/ETH/DOGE/SOL/BNB/XRP/ADA/AVAX/MATIC/SHIB/DOT/LINK/UNI/LTC/TRX/TON/NEAR/APT/ARB/OP，受全局恐惧贪婪指数影响。</p>' +
        '<h3>📊 关键机制</h3><ul class="wiki-list">' +
        "<li>🌡️ 恐惧贪婪指数（0~100）：贪婪期波动放大，恐慌期下跌加速</li>" +
        "<li>🪜 加密牛市/崩盘新闻有 L2 级联（5~7 天后再次冲击）</li>" +
        "<li>📈 BTC 减半事件触发全市场上涨</li>" +
        "</ul>";
      break;
    case "precious":
      html =
        "<h2>🥇 贵金属（8 种）</h2>" +
        '<p class="wiki-desc">黄金 / 白银 / 铂金 / 钯金 / 铜 / 镍 / 铝 / 锂。受地缘政治、电动车需求、避险情绪影响。</p>' +
        '<h3>📊 关键机制</h3><ul class="wiki-list">' +
        "<li>🌍 地缘冲突 → 黄金/白银暴涨</li>" +
        "<li>🔋 电动车需求 → 锂/镍/铜上行</li>" +
        "<li>🏠 楼市低迷 → 铝/铜下行</li>" +
        "</ul>";
      break;
    case "futures":
      html =
        "<h2>🛢️ 期货（16 种）</h2>" +
        '<p class="wiki-desc">原油 / 天然气 / 玉米 / 大豆 / 小麦 / 咖啡 / 棉花 / 白糖 / 活牛 / 瘦肉猪 / 可可 / 橙汁 / 黄金期货 / 白银期货 / 铜期货 / 螺纹钢。</p>' +
        '<p class="wiki-tip">⚠️ 期货波动大于现货，适合有经验的玩家短线。</p>';
      break;
    case "funds":
      html =
        "<h2>📊 基金（12 种）</h2>" +
        '<p class="wiki-desc">国债基金 / 标普500ETF / 沪深300ETF / REITs / 纳斯达克100ETF / 恒生ETF / 日经ETF / 黄金ETF / 货币基金 / 国债逆回购 / 红利ETF / 科创50ETF。</p>' +
        '<p class="wiki-tip">💡 货币基金/国债逆回购波动小，适合保本理财。</p>';
      break;
    case "property":
      html =
        "<h2>🏠 房产（20 处）</h2>" +
        '<p class="wiki-desc">从城中村握手楼到迪拜投资房，每处独立市价 + 月租。Tier 4 豪华公寓可自住免日租。</p>' +
        '<h3>📊 关键机制</h3><ul class="wiki-list">' +
        "<li>📈 月度增值 ±0.5%~2%（受楼市新闻影响）</li>" +
        "<li>💰 月租收入（自住时跳过）</li>" +
        "<li>⚠️ 房地产暴雷事件可能让房产贬值 50%+</li>" +
        "</ul>";
      break;
    case "car":
      html =
        "<h2>🚗 汽车（20 款）</h2>" +
        '<p class="wiki-desc">电驴 / 五菱MINI / ... / 保时捷 / 劳斯莱斯幻影。每款独立折旧 + 维护费 + AP 加成。</p>' +
        '<p class="wiki-tip">💡 高端车有名气加成（开劳斯莱斯出门 fame +）；电驴/MINI 实用主义。</p>';
      break;
    case "bank":
      html =
        "<h2>🏦 银行储蓄 / 借贷</h2>" +
        '<p class="wiki-desc">城市浮生记的双层金融系统：低风险储蓄 vs 高息债务。</p>' +
        '<h3>📊 利率</h3><ul class="wiki-list">' +
        "<li>💰 银行存款日息 0.1%（约 4%/年）+ 会计技能加成（最多 5%/年）</li>" +
        "<li>🚨 村长欠款日息 0.35%（约 12.8%/年），复利</li>" +
        "<li>⚠️ 银行欠款日息略低于村长，但有还款日</li>" +
        "</ul>" +
        '<p class="wiki-tip">💡 持有大量村长债务时，可能触发「村长债务追讨」事件链。</p>';
      break;
  }
  return html;
}

// ================================================================
//  详情：系统机制
// ================================================================
function _wikiDetailMechanic(state, id) {
  var pages = {
    ap:
      "<h2>⚡ 行动力 (AP) 系统</h2>" +
      '<p class="wiki-desc">每天 100 AP（满）。所有行动消耗对应 AP（卡片右下显示），AP 耗尽自动 endDay。</p>' +
      '<h3>📊 关键规则</h3><ul class="wiki-list">' +
      "<li>大多数街头工作 ⚡15~38 AP</li>" +
      "<li>训练技能、做饭、洗澡 ⚡10~15 AP</li>" +
      "<li>跨地点出行 ⚡15 AP（驾驶 ≥20 级减免）</li>" +
      "<li>极端状态（饿晕/过劳/病危）会跳过当天</li>" +
      "<li>AP ≤ 20 时顶部和侧栏闪烁预警</li>" +
      "</ul>" +
      "<h3>🔢 AP 倍率</h3><p>实际 AP 消耗 = 基础 × 倍率（保底 0.5×，封顶 2.5×）。详见 " +
      _wkLink("mechanics", "stat_link", "状态互联") +
      "。</p>",

    stat_link:
      "<h2>🔗 状态互联系统</h2>" +
      '<p class="wiki-desc">参考《这是我的战争》《模拟人生》：一个状态崩塌引发连锁反应。</p>' +
      '<h3>🍞 状态多米诺（每日结算）</h3><ul class="wiki-list">' +
      "<li>饥饿 &lt; 30 → +5 疲劳/天</li>" +
      "<li>饥饿 &lt; 15 → +8 疲劳/天 + 心情 -5/天</li>" +
      "<li>疲劳 &gt; 70 → 心情 -3/天</li>" +
      "<li>疲劳 &gt; 85 → 心情 -5/天 + 卫生 -3/天</li>" +
      "<li>卫生 &lt; 20 → 心情 -3/天</li>" +
      "<li>心情 &lt; 20 → 睡眠效率 ×0.5</li>" +
      "<li>生病 → +8 疲劳/天 + 心情 -5</li>" +
      "</ul>" +
      "<h3>📊 状态 → 属性修正（实时）</h3><p>例如：饥饿 &lt; 15 → 体质 ×0.85, 敏捷 ×0.75；健康 &lt; 30 → 全维度打折。详见侧边栏「实际有效值」。</p>" +
      '<h3>⚡ AP 倍率加成</h3><ul class="wiki-list">' +
      "<li>疲劳 70~85 +0.20；85~95 +0.45；&gt;95 +0.80</li>" +
      "<li>饥饿 &lt; 20 +0.30；&lt; 10 +0.50</li>" +
      "<li>生病 +0.50，受伤 +0.30</li>" +
      "<li>极端天气 +0.15~0.20</li>" +
      "<li>敏捷 &gt; 50 -0.10；&gt; 75 -0.20（最大减免）</li>" +
      "</ul>",

    synergy:
      "<h2>🔀 技能协同增益</h2>" +
      '<p class="wiki-desc">两个技能同时达到门槛时，相关工作收入持续提升。</p>' +
      '<h3>📋 6 种协同组合</h3><ul class="wiki-list">' +
      "<li>🍜 美食创业者：" +
      _wkLink("skills", "cooking", "烹饪") +
      " ≥10 + " +
      _wkLink("skills", "sales", "销售") +
      " ≥10 → 餐饮摆摊 +15%</li>" +
      "<li>🔧 全能工匠：" +
      _wkLink("skills", "repair", "维修") +
      " ≥10 + " +
      _wkLink("skills", "electrician", "电工") +
      " ≥10 → 维修/建筑 +14%</li>" +
      "<li>💻 海外外包专家：" +
      _wkLink("skills", "coding", "编程") +
      " ≥15 + " +
      _wkLink("skills", "english", "英语") +
      " ≥15 → 技术/教育 +22%</li>" +
      "<li>🛵 跑单达人：销售 ≥8 + 驾驶 ≥8 → 配送 +12%</li>" +
      "<li>📋 商务精英：管理 ≥15 + 会计 ≥15 → 仓储/商务 +18%</li>" +
      "<li>🌐 外贸达人：英语 ≥12 + 销售 ≥12 → 教育/客服 +20%</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 多个协同可叠加。在 📚 技能 Tab 底部可查看激活情况。</p>',

    streak:
      "<h2>🔥 熟练工连击</h2>" +
      '<p class="wiki-desc">连续 N 天做同一份工作，习得熟练度，收入递增。</p>' +
      '<h3>📊 加成阶梯</h3><ul class="wiki-list">' +
      "<li>连续 3 天 → +5%</li>" +
      "<li>连续 5 天 → +10%</li>" +
      "<li>连续 7 天 → +15%</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 中断当天就归零。在工作卡片下方的 tag 行可看到连击状态。</p>',

    city_pulse:
      "<h2>🌆 城市脉搏联动</h2>" +
      '<p class="wiki-desc">活跃新闻派生为地点客流量、工作收入倍率和今日建议。新闻不再只是文字，而是"今天最优行动是什么"。</p>' +
      '<h3>📋 主要规则（10+ 种）</h3><ul class="wiki-list">' +
      "<li>🚨 城管严查 → 摆摊客流 -35%，外卖 +8%</li>" +
      "<li>🛵 平台补贴 → 外卖骑手 +25%，餐饮摊 -8%</li>" +
      "<li>🏚️ 旧改施工 → 工地/清运/维修需求暴涨</li>" +
      "<li>🤖 AI 热潮 → 科技园数据/客服/写作 +12~18%</li>" +
      "<li>🤒 流感高峰 → 医院护工 +35%，餐饮 -8%</li>" +
      "<li>🎒 开学旺季 → 大学城快递/家教 +18%</li>" +
      "<li>📈 通胀压力 → 批发周转/银行储蓄相对受益</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 在行动卡的 payTags 行可看到今天哪些维度在影响收入。</p>',

    intel:
      "<h2>📡 街头情报网</h2>" +
      '<p class="wiki-desc">高好感 NPC 会向你透露即将发生的新闻，让你提前布局。</p>' +
      '<h3>📋 工作流</h3><ol class="wiki-list">' +
      "<li>NPC 好感 ≥30 → 解锁「向 TA 打听消息」行动</li>" +
      "<li>不同 NPC 提供不同情报：王大婶（旧改/房产）、李工头（工地）、张姐（平台补贴）、老周（科技/废品）、小美（科技股/AI）、陈师傅（餐饮/医疗）</li>" +
      "<li>情报写入 _pendingIntelNews，N 天后兑现成真实新闻</li>" +
      "<li>心智越高，情报可信度展示越精确</li>" +
      "</ol>" +
      '<p class="wiki-tip">💡 信息差 = 钱。提前几天买入相关投资资产可大幅获利。</p>',

    history:
      "<h2>📜 历史声誉系统</h2>" +
      '<p class="wiki-desc">道德选择不只是当下加减分，而是 7 种长期 flag 持续影响游戏。</p>' +
      '<h3>📋 道德 flag 列表</h3><ul class="wiki-list">' +
      "<li>💼 _walletKarmaGood：还回钱包 → 幸运 +5（避免某些坏事件）</li>" +
      "<li>🤝 _helpedCoworker：帮过工友 → 工作收入 ×1.03</li>" +
      "<li>🛡️ _refusedFakeGoods：拒绝假货 → 进货 9.8 折</li>" +
      "<li>⚖️ _foughtWageTheft：维权欠薪 → 工作收入 ×1.04</li>" +
      "<li>✨ _honestyCompound：综合声誉 → ×1.06 + 9.4 折 + 名声标签</li>" +
      "<li>🚩 _laborOrganizer：劳工组织者 → 工作收入 ×1.08 + 好感 +2</li>" +
      "<li>📋 _hasBusinessLicense：拿到执照 → 工作收入 ×1.10</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 侧边栏会动态显示已获声誉徽章。</p>',

    edu:
      "<h2>🎓 学历系统</h2>" +
      '<p class="wiki-desc">大专（默认）→ 本科（自考）→ 研究生。学历是某些工作和职场入职的硬门槛。</p>' +
      '<h3>📋 自考流程</h3><ol class="wiki-list">' +
      "<li>📖 备考（⚡20 AP）：每次 +1 学习点，需要积累一定点数才能考试</li>" +
      "<li>📝 参加考试（⚡30 AP）：通过率 = 40% + mental×0.4% + intelligence×0.1%</li>" +
      "<li>🎓 考过 6 次 → 申请本科认证（在 " +
      _wkLink("locations", "school", "大学城") +
      "）</li>" +
      "</ol>" +
      "<h3>📊 学历影响的工作</h3><p>如：" +
      _wkLink("jobs", "tutoring", "家教") +
      " 需本科；科技园 4 个白领工作需本科起。</p>",

    dream:
      "<h2>💭 梦想追踪系统</h2>" +
      '<p class="wiki-desc">5 类人生目标 × 5 个里程碑，每达成一个会触发专属叙事文本。</p>' +
      '<h3>📋 5 类梦想</h3><ul class="wiki-list">' +
      "<li>🍜 开一家餐馆（烹饪/存款/合规）</li>" +
      "<li>🏠 买一套房（首付/房贷/还清）</li>" +
      "<li>✈️ 出国看世界（英语/护照/启程）</li>" +
      "<li>💰 投资达人（首笔/百万/千万）</li>" +
      "<li>🌟 城市名人（名气/曝光/影响力）</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 在街头阶段使用「确立人生目标」行动设定梦想；侧边栏显示当前进度。</p>',

    festival_link:
      "<h2>🎉 节日联动机制</h2>" +
      '<p class="wiki-desc">6 个节日全方位影响游戏：价格 / 工作 / NPC 台词 / 心情 / 摆摊客流。</p>' +
      '<h3>📋 联动维度</h3><ul class="wiki-list">' +
      "<li>💰 价格修正：食品/奢侈品节日涨，电子/服装促销期降</li>" +
      "<li>🎪 限定工作：年货推广员/月饼配送/景区导游等</li>" +
      "<li>👥 NPC 节日台词：6 个 NPC × 5 个节日 = 30 条专属台词</li>" +
      "<li>😊 心情加成：每日 +3~8</li>" +
      "<li>🛒 客流量：剁手节 ×2.5，国庆 ×1.3</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 节日开始前 3 天会公告，可提前囤货/换工作。</p>',

    weather_link:
      "<h2>☂️ 天气联动机制</h2>" +
      '<p class="wiki-desc">7 种天气全方位影响：室外工作收入 / 疲劳 / 心情 / AP 倍率。</p>' +
      '<h3>📊 影响表</h3><ul class="wiki-list">' +
      "<li>☀️ 晴天：室外 ×1.0，心情 +5</li>" +
      "<li>⛅ 多云：室外 ×0.95</li>" +
      "<li>🌧️ 小雨：室外 ×0.75，疲劳 +8，心情 -5</li>" +
      "<li>⛈️ 暴雨：室外 ×0.40，疲劳 +15，AP 倍率 +0.15</li>" +
      "<li>🌨️ 大雪：室外 ×0.50，AP 倍率 +0.15</li>" +
      "<li>🥵 酷暑：AP 倍率 +0.20</li>" +
      "<li>🥶 严寒：AP 倍率 +0.20</li>" +
      "</ul>",

    npc_affinity:
      "<h2>💕 NPC 好感度系统</h2>" +
      '<p class="wiki-desc">参考《Stardew Valley》Heart Events，每位 NPC 有 30/60/80 三档奖励 + 委托 + 深度任务。</p>' +
      '<h3>📋 阈值奖励</h3><ul class="wiki-list">' +
      "<li>30（熟人）：解锁特殊对话 + 小福利（带饭/废品 tips/提点工作）</li>" +
      "<li>60（好友）：独家资源（房租折扣/秘密渠道/猎头）</li>" +
      "<li>80（挚友）：稀有机会（介绍奖金/秘方/支教/天使投资）</li>" +
      "</ul>" +
      '<h3>📜 委托 vs 深度任务</h3><ul class="wiki-list">' +
      "<li>📜 委托（好感 ≥30）：每个 NPC 一个一次性任务，奖励中等</li>" +
      "<li>💌 深度任务（好感 ≥70）：叙事性更强的人生选择，奖励大</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 投其所好礼物 +15 好感，生日 ×2，节日 +5~10。</p>',

    vending_footfall:
      "<h2>🛒 摆摊客流量综合修正</h2>" +
      '<p class="wiki-desc">摆摊收入 ∝ 基础客流 × 天气 × 节日 × 周末。</p>' +
      '<h3>📊 影响因素</h3><ul class="wiki-list">' +
      "<li>📍 地点基础客流：商业区 1.8（最高）→ 银行 0.4（最低）</li>" +
      "<li>☀️ 天气：晴天/暴雨差异巨大</li>" +
      "<li>🎉 节日：国庆 ×1.3，剁手节 ×2.5</li>" +
      "<li>📅 周末：商业区/公园 +20% 客流</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 行动卡片上显示客流星级（⭐⭐⭐~⭐⭐⭐⭐⭐）。</p>',

    fame_vip:
      "<h2>⭐ 名气 VIP 行动系统</h2>" +
      '<p class="wiki-desc">高名气解锁 5 种特殊行动（每天限 1 次）：</p>' +
      '<ul class="wiki-list">' +
      "<li>商业区 fame ≥25：本地名人效应（¥50+fame×1.2+随机）</li>" +
      "<li>公园 fame ≥20：粉丝认出你（心情 +20）</li>" +
      "<li>培训中心 fame ≥40：名人专属指导课（属性 +3）</li>" +
      "<li>医院 fame ≥35：VIP 就诊通道（健康 +25）</li>" +
      "<li>科技园 fame ≥50：科技论坛演讲（¥200+fame×2.5）</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 可通过参加 NPC 委托/达成成就/解决重大事件提升名气。</p>',

    skill_tree:
      "<h2>🌳 技能天赋树</h2>" +
      '<p class="wiki-desc">参考《中国式家长》天赋树：每项技能达到 Lv.30 后可选择 2~3 个发展方向，每个分支内嵌 3 个天赋节点（Lv.10/25/50 解锁），形成树状成长路径。</p>' +
      '<h3>📋 分支选择</h3><ul class="wiki-list">' +
      "<li>技能达 Lv.30 后，在技能 Tab 点击「选择发展方向」按钮</li>" +
      "<li>每技能有 2~3 个方向可选（编程有前端/后端/安全 3 方向，其余为 2 方向）</li>" +
      "<li>选择需消耗 ⚡15AP + ¥200</li>" +
      "<li>已选分支可切换（⚡30AP + ¥500），切换后旧天赋节点重置</li>" +
      "</ul>" +
      '<h3>⭐ 天赋节点</h3><ul class="wiki-list">' +
      "<li>每个分支有 3 个天赋节点，分别于 Lv.10 / Lv.25 / Lv.50 解锁</li>" +
      "<li>节点有前置依赖，须先激活前置节点才能激活后续</li>" +
      "<li>激活消耗 ⚡20~35AP + ¥300~¥1600（节点越深越贵）</li>" +
      "<li>效果包括：技能 XP+25%、工作收入加成、新工作解锁、被动收入等</li>" +
      "</ul>" +
      '<h3>🏢 职场联动</h3><ul class="wiki-list">' +
      "<li>编程→后端/前端：晋升 P7 时能力要求 -5（天赋节点额外叠加 -10）</li>" +
      "<li>管理→战略规划：晋升 P8 时向上管理要求 -5（叠加 -10）</li>" +
      "<li>管理→团队管理：晋升 P8 时人缘要求 -5（叠加 -10）</li>" +
      "</ul>" +
      '<h3>📊 分支加成总览</h3><ul class="wiki-list">' +
      "<li>家常大厨：餐饮收入+25%，食材成本-15%</li>" +
      "<li>街头美食家：摆摊收入+30%，客流量+18%</li>" +
      "<li>精密维修：维修收入+25%，解锁精密仪器维修</li>" +
      "<li>改装达人：装备效果+20%，解锁改装工作</li>" +
      "<li>前端开发：能力加成+30%，解锁网页设计</li>" +
      "<li>后端架构：能力加成+50%，解锁服务器运维（晋升最优）</li>" +
      "<li>安全攻防：职场风险-30%，解锁安全审计</li>" +
      "<li>商务英语：外语收入+30%，解锁外贸工作</li>" +
      "<li>翻译达人：翻译收入+25%，解锁文档翻译</li>" +
      "<li>客运驾驶：AP减免翻倍，解锁出租车</li>" +
      "<li>货运驾驶：物流收入+30%，解锁跟车助理</li>" +
      "<li>门店销售：折扣上限25%，解锁导购</li>" +
      "<li>商务谈判：溢价上限25%，解锁采购</li>" +
      "<li>团队管理：向上管理+50%，团队规模+2</li>" +
      "<li>战略规划：向上管理+50%，晋升最优</li>" +
      "<li>税务会计：存款利率翻倍，解锁税务工作</li>" +
      "<li>审计风控：风险-30%，解锁审计工作</li>" +
      "<li>强电工程：工厂加成翻倍，解锁工厂电工</li>" +
      "<li>弱电智能：智能家居收入+25%，解锁网络布线</li>" +
      "<li>结构焊接：建筑加成+50%，解锁钢结构</li>" +
      "<li>精密焊接：精密焊接收入+30%，解锁电子焊接</li>" +
      "</ul>",
  };
  return pages[id] || "";
}

// ================================================================
//  详情：世界叙事
// ================================================================
function _wikiDetailNarrative(state, id) {
  var pages = {
    news_4layer:
      "<h2>📰 四层新闻生态</h2>" +
      '<p class="wiki-desc">新闻是世界与玩家对话的主渠道，从宏观到微观完整传导：</p>' +
      '<table class="wiki-table"><tr><th>层级</th><th>类型</th><th>频率</th><th>影响</th></tr>' +
      "<tr><td><b>L1 国际</b></td><td>地缘冲突/制裁/科技封锁</td><td>15~30 天</td><td>大宗商品/股市板块</td></tr>" +
      "<tr><td><b>L2 国内</b></td><td>行业整顿/楼市调控/最低工资</td><td>10~20 天</td><td>工作收入/房产/职位开放</td></tr>" +
      "<tr><td><b>L3 城市</b></td><td>拆迁/地铁/招商/节日季</td><td>5~10 天</td><td>地点客流/摆摊 heat/特定商品需求</td></tr>" +
      "<tr><td><b>L4 街头</b></td><td>邻里纠纷/八卦/工友传言</td><td>1~3 天</td><td>NPC 好感/局部价格扰动</td></tr>" +
      "</table>" +
      '<p class="wiki-tip">💡 通过 ' +
      _wkLink("mechanics", "city_pulse", "城市脉搏") +
      " 系统，新闻实时影响行动收益。</p>",

    news_cascade:
      "<h2>🪜 新闻级联（L1 → L2）</h2>" +
      '<p class="wiki-desc">10 个重大宏观事件会在 N 天后产生连锁后续：</p>' +
      '<ul class="wiki-list">' +
      "<li>📉 降息 → 楼市回暖（5 天后）</li>" +
      "<li>📈 加息 → 楼市降温（5 天后）</li>" +
      "<li>🌍 地缘危机 → 黄金/石油持续上涨（3 天后）</li>" +
      "<li>🤖 AI 热潮 → 算力短缺溢价（4 天后）</li>" +
      "<li>💎 加密牛市 → 山寨币轮动（3 天后）</li>" +
      "<li>📉 加密崩盘 → 杠杆爆仓潮（2 天后）</li>" +
      "<li>⚡ 能源危机 → 制造业成本上行（5 天后）</li>" +
      "<li>🔥 黑天鹅 → 全市场恐慌（7 天后）</li>" +
      "<li>💥 贸易战 → 国产替代崛起（10 天后）</li>" +
      "<li>🛵 平台补贴大战 → 骑手寒冬（8 天后）</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 提前预判 L2 后续，可以在投资市场上获得超额收益。</p>',

    world_events:
      "<h2>🎬 有梗世界事件</h2>" +
      '<p class="wiki-desc">5 条多阶段事件链，每条都是一个完整的商业/人生故事：</p>' +
      '<h3>📺 事件清单</h3><ul class="wiki-list">' +
      "<li><b>🛒 网约车补贴大战</b>：临时工种收入暴增→骤降→平台合并</li>" +
      "<li><b>💼 收购反噬</b>：花 ¥80k 收购茶饮 → 经营难 → 被星巴超连锁低价吞掉</li>" +
      "<li><b>🐎 行业黑马冲击</b>：深耕 30 天后新模式来袭，All-in 转型 vs 副业 vs 坚守</li>" +
      "<li><b>🔁 创始人回购</b>：被 VC 清洗 → 屈辱期 → 老朋友凑钱买回主导权</li>" +
      "<li><b>🪟 政策套利窗口</b>：科技园扩建/摊贩持证/餐饮卫生评级，提前消息差</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 每条事件链需要不同的前置（NPC 好感/天数/资产/职级），多周目可触达不同结局。</p>',

    moral:
      "<h2>⚖️ 道德困境系统</h2>" +
      '<p class="wiki-desc">参考《这是我的战争》：道德选择没有"绝对正确"，只有代价不同。</p>' +
      '<h3>📋 5+ 经典两难</h3><ul class="wiki-list">' +
      "<li>👶 巷子里的孩子（买饭/给钱/装没看见）</li>" +
      "<li>🔥 工厂火警（冲进去/打 119/往后退）</li>" +
      "<li>📁 工友的秘密（偷偷留证/告诉他/假装没见）</li>" +
      "<li>👴 迷路老人（送过去/叫顺风车/指路走了）</li>" +
      "<li>🎫 地上的彩票（去兑奖/等人来找）</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 选择会设置 ' +
      _wkLink("mechanics", "history", "道德 flag") +
      "，长期影响后续事件触发与声誉。</p>",

    ng_plus:
      "<h2>🆕 新游戏+ 继承系统</h2>" +
      '<p class="wiki-desc">胜利或失败后，可选择"新游戏+"继承部分进度：</p>' +
      '<h3>📋 继承内容</h3><ul class="wiki-list">' +
      "<li>💰 起始现金：总收入 × 1%（上限 ¥5,000）</li>" +
      "<li>🎯 最高技能：水平 × 20%（上限 Lv.20）</li>" +
      "<li>📊 最高属性：+10%（最多 +5）</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 让多周目有累积感和新鲜感。</p>',
  };
  return pages[id] || "";
}

// ================================================================
//  详情：成就/胜利
// ================================================================
function _wikiDetailVictory(state, id) {
  var pages = {
    v_p10:
      "<h2>🏢 胜利：晋升 P10</h2>" +
      '<p class="wiki-desc">从 P5 一路晋升到 P10（合伙人），成为职场金字塔尖。</p>' +
      '<ul class="wiki-list">' +
      "<li>晋升关键：每年 Q3 答辩，KPI/向上管理/能力综合评分</li>" +
      "<li>P7+ 解锁团队管理</li>" +
      "<li>P5→P6→P7→P8→P9→P10，约需 5~8 年</li>" +
      "<li>关注：发量（勿归零）、风险（勿满 100）、人缘（勿低于 20）</li>" +
      "</ul>",
    v_wealth:
      "<h2>💸 胜利：财务自由</h2>" +
      '<p class="wiki-desc">累计 ¥2,000 万（现金 + 银行 + 投资市值 + 房产 + 汽车）。</p>' +
      '<p class="wiki-tip">💡 投资 + 经商 + 职场组合，最快约 6~8 年达成。</p>',
    v_business:
      "<h2>🏪 胜利：经商大亨</h2>" +
      '<p class="wiki-desc">trade.totalProfit ≥ ¥500,000（街头交易/摆摊累积净利润）。</p>' +
      '<p class="wiki-tip">💡 找准批发地→零售地差价，配合 ' +
      _wkLink("skills", "sales", "销售") +
      " 技能加成。</p>",
    v_fame:
      "<h2>🌟 胜利：城市名人</h2>" +
      '<p class="wiki-desc">名气达到 100。</p>' +
      '<p class="wiki-tip">💡 名人 VIP 行动 + 道德正直选择 + 完成 NPC 委托快速涨名气。</p>',
    v_skill:
      "<h2>🥷 胜利：技能大师</h2>" +
      '<p class="wiki-desc">10 项技能全部达到 Lv.80。</p>' +
      '<p class="wiki-tip">💡 单技能从 0 到 80 约需 200+ 次行动；多技能并行最高效。</p>',
    v_invest:
      "<h2>💎 胜利：投资天才</h2>" +
      '<p class="wiki-desc">投资资产（股票/虚拟币/期货/基金/房产/贵金属）累计市值 ≥ ¥1,000 万。</p>' +
      '<p class="wiki-tip">💡 抓住 ' +
      _wkLink("narrative", "news_cascade", "新闻级联") +
      " 的 L2 机会，比单一持有更有效。</p>",
    fail:
      "<h2>💀 失败条件</h2>" +
      '<ul class="wiki-list">' +
      "<li>❤️ 健康归零</li>" +
      "<li>💸 总债务 &gt; ¥50,000 且无力偿还</li>" +
      "<li>🦲 发量归零（职场过劳）</li>" +
      "<li>😔 尊严归零（职场崩溃）</li>" +
      "<li>📉 连续 8 季度绩效 C（淘汰）</li>" +
      "<li>⚠️ 风险值 100%（职场被开除）</li>" +
      "<li>👴 年龄 ≥ 35 且职级 &lt; P8（35 岁危机）</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 失败也可触发 ' +
      _wkLink("narrative", "ng_plus", "新游戏+") +
      " 继承下一周目。</p>",
    achievements:
      "<h2>🏅 成就系统</h2>" +
      '<p class="wiki-desc">22 个成就 × 4 个分类，参考《Papers Please》隐藏成就的叙事化设计。</p>' +
      '<h3>📋 类别</h3><ul class="wiki-list">' +
      "<li>🌅 人生第一次（7 个）：第一桶金/第一份工作/第一次倒卖等</li>" +
      "<li>🏆 里程碑（8 个）：月入 5000/三个月/存款 1 万/全 NPC 结识等</li>" +
      "<li>📜 道德档案（4 个隐藏）：追踪帮助 vs 放弃选择</li>" +
      "<li>🎁 隐藏（3 个）：流浪歌手/还是私吞/100 天坚韧</li>" +
      "</ul>" +
      '<p class="wiki-tip">💡 切换到 🏅 成就 Tab 查看完整解锁状态与叙事文案。</p>',
  };
  return pages[id] || "";
}
