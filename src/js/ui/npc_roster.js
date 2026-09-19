/**
 * 熟人名册（NPC 名册 / 联系人面板）
 * ───────────────────────────────────────────────────────────────────────────
 * 解决恒稳 2026-09-19 的三个问题：
 *   · 「这些人在什么地方呢？」—— 名册按「当前地点 / 全城」分组，每人标注「现在在：XXX」
 *   · 「我也看不到立绘啊」—— 每张卡片带立绘缩略图，点开即弹《大多数》式立绘对话框
 *   · 「无法和…人交互」—— 点卡片 = 和这个人说话（弹立绘 + 一句台词），等价于走到他面前交谈
 *
 * 为什么不走「3D 世界里点人」：
 *   3D 里的命名 NPC 目前只是带名字牌的可见角色，不是可交互热点（src/app/3d/actors.js
 *   的 _spawnNamed 没把它们注册进 world.hotspots），而 onInteract 只路由「游戏行动类」
 *   热点。要让 3D 点人弹立绘，必须改 src/app/3d/*（并行窗口正在途改写的易变源），
 *   本文件刻意不碰那条线，避免破坏对方在途改动。名册面板在 2D / 3D 两种形态下都能用，
 *   是更稳的「先让玩家找得到人、看得到脸、说得上话」方案。
 *
 * 接入方式：挂在 window.NpcRoster，纯 DOM（body 级浮层），不依赖 3D 是否加载。
 */
(function () {
  "use strict";

  var BTN_ID = "npcRosterBtn";
  var PANEL_ID = "npcRosterPanel";
  var CACHE = "?v=20260919"; // 与 npc_dialog.js 同源的缓存破坏串

  function getState() {
    if (typeof window.StateManager !== "undefined" && typeof window.StateManager.getState === "function") {
      try { return window.StateManager.getState(); } catch (e) { return null; }
    }
    return null;
  }

  function locName(key) {
    if (!key) return "未知地点";
    try {
      if (typeof getLocation === "function") {
        var l = getLocation(key);
        if (l) return (l.icon ? l.icon + " " : "") + (l.name || key);
      }
    } catch (e) { /* 忽略 */ }
    return key;
  }

  function slotOf(st) {
    var ts = (st && st.player && st.player.timeSlot) || "morning";
    return ["morning", "afternoon", "evening", "night"].indexOf(ts) >= 0 ? ts : "morning";
  }

  function currentLoc() {
    var st = getState();
    return st && st.trade ? st.trade.currentLocation : null;
  }

  /** 该 NPC 此时段在哪个地点（优先问逻辑层日程，拿不到退回静态 location 字段） */
  function npcLocNow(npc) {
    var st = getState();
    var slot = slotOf(st);
    if (typeof getNpcCurrentLocation === "function") {
      try {
        var r = getNpcCurrentLocation(npc.id, slot);
        if (r) return r;
      } catch (e) { /* 忽略 */ }
    }
    return npc.location || null;
  }

  function pickLine(npc) {
    var pool = (npc.talkLines && npc.talkLines.length) ? npc.talkLines
      : (npc.encounterLines && npc.encounterLines.length) ? npc.encounterLines : null;
    if (!pool || !pool.length) return "（他看了看你，没说什么。）";
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function card(npc, hereNow) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "npc-roster-card";
    card.setAttribute("aria-label", "查看 " + (npc.name || npc.id));

    var img = document.createElement("img");
    img.className = "npc-roster-card__avatar";
    img.alt = npc.name || "NPC";
    img.loading = "lazy";
    if (npc.avatar) {
      img.src = npc.avatar + CACHE;
      img.onerror = function () { img.style.visibility = "hidden"; };
    } else {
      img.style.visibility = "hidden";
    }

    var meta = document.createElement("div");
    meta.className = "npc-roster-card__meta";
    var nm = document.createElement("div");
    nm.className = "npc-roster-card__name";
    nm.textContent = npc.name || npc.id;
    var role = document.createElement("div");
    role.className = "npc-roster-card__role";
    role.textContent = npc.role || "";
    var where = document.createElement("div");
    where.className = "npc-roster-card__where";
    where.textContent = (hereNow ? "就在这里 · " : "现在在：") + locName(npcLocNow(npc));
    meta.appendChild(nm);
    meta.appendChild(role);
    meta.appendChild(where);

    card.appendChild(img);
    card.appendChild(meta);
    card.addEventListener("click", function () { talkTo(npc); });
    return card;
  }

  function talkTo(npc) {
    var panel = document.getElementById(PANEL_ID);
    if (panel) panel.classList.remove("is-open");
    if (typeof window.showNpcTalk === "function") {
      window.showNpcTalk({ npc: npc, line: pickLine(npc), tag: "" });
    }
  }

  function openPanel() {
    var panel = document.getElementById(PANEL_ID);
    if (!panel) {
      panel = document.createElement("div");
      panel.id = PANEL_ID;
      panel.className = "npc-roster-panel";
      document.body.appendChild(panel);
    }
    renderPanel(panel);
    panel.classList.add("is-open");
  }

  function renderPanel(panel) {
    if (typeof NPCS === "undefined" || !NPCS || !NPCS.length) {
      panel.innerHTML = '<div class="npc-roster-panel__empty">还没有认识的人。</div>';
      return;
    }
    var cur = currentLoc();
    var here = [], away = [];
    for (var i = 0; i < NPCS.length; i++) {
      var n = NPCS[i];
      if (!n || !n.id) continue;
      (npcLocNow(n) === cur && cur ? here : away).push(n);
    }

    panel.innerHTML = "";
    var head = document.createElement("div");
    head.className = "npc-roster-panel__head";
    head.innerHTML = '<span class="npc-roster-panel__title">熟人名册</span>' +
      '<button type="button" class="npc-roster-panel__close" aria-label="关闭">✕</button>';
    head.querySelector(".npc-roster-panel__close").addEventListener("click", function () {
      panel.classList.remove("is-open");
    });
    panel.appendChild(head);

    if (here.length) {
      panel.appendChild(section("本地点熟人 · " + locName(cur), here, true));
    }
    if (away.length) {
      panel.appendChild(section("全城其他人", away, false));
    }
    if (!here.length && !away.length) {
      panel.appendChild(section("全部认识的人", NPCS.filter(function (n) { return n && n.id; }), false));
    }
  }

  function section(title, list, hereNow) {
    var sec = document.createElement("div");
    sec.className = "npc-roster-panel__section";
    var h = document.createElement("div");
    h.className = "npc-roster-panel__section-title";
    h.textContent = title;
    sec.appendChild(h);
    var grid = document.createElement("div");
    grid.className = "npc-roster-panel__grid";
    for (var i = 0; i < list.length; i++) grid.appendChild(card(list[i], hereNow));
    sec.appendChild(grid);
    return sec;
  }

  function ensureButton() {
    if (document.getElementById(BTN_ID)) return;
    var btn = document.createElement("button");
    btn.id = BTN_ID;
    btn.type = "button";
    btn.className = "npc-roster-btn";
    btn.title = "熟人名册（看立绘 / 和人说话）";
    btn.textContent = "熟人";
    btn.addEventListener("click", openPanel);
    document.body.appendChild(btn);

    // 快捷键 N 打开/关闭（在 3D 模式下也能用，WASD 不吃 N 键）
    window.addEventListener("keydown", function (e) {
      if (e.key !== "n" && e.key !== "N") return;
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      var panel = document.getElementById(PANEL_ID);
      if (panel && panel.classList.contains("is-open")) panel.classList.remove("is-open");
      else openPanel();
    });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ensureButton);
    } else {
      ensureButton();
    }
  }

  window.NpcRoster = {
    open: openPanel,
    talkTo: talkTo,
    version: "1.0.0",
  };
})();
