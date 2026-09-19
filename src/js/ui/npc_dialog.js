/**
 * NPC 立绘对话框 —— 复刻《大多数》的人物区分方法（2026-09-19 恒稳定案）
 *
 * ── 为什么是这个方案 ─────────────────────────────────────────────────────
 * 恒稳的原话：「大多数这个游戏他是这样实现的：模型其实长得差不多，
 * 他是靠对话时产生的对话框里的任务原画来区别人的，请你完全复刻它的方法。」
 *
 * 本项目的现状正好卡在同一位置：
 *   · 3D 行人是程序化低模（球头+胶囊四肢），0.6m 特写也只是"有五官的球"，
 *     堆到天上去也堆不出"人味"；
 *   · 而 17 个 NPC 的 2D 立绘**早就生成好了**（src/images/avatars/*.png，
 *     npc.avatar 字段也早就写在数据里），却没有任何 UI 渲染它 ——
 *     `.npc-avatar` 样式类在 style.css 里躺了两个版本没人用。
 * 《大多数》的答案：把"像不像人"从 3D 挪到 2D——模型通用，立绘辨识。
 *
 * ── 行为 ─────────────────────────────────────────────────────────────────
 *   · showNpcTalk({npc, line, affinity, gain, tag, actions}) 打开底部对话框：
 *     左侧大立绘（半身像，从对话框上缘探出），右侧名牌+台词+「继续」。
 *   · 立绘加载失败**必须降级**：img.onerror → 程序化 canvas 立绘
 *     （底色按 npc.id 哈希取色 + 名字首字 + 职业徽章）——绝不空白、绝不抛。
 *     （与 assets.get() 的"拿不到返回 null"同一条铁律。）
 *   · 对话连续触发时**替换内容**而不是排队——对话是即时交互，
 *     排队会让玩家看到"上一句的回复迟到"。
 *   · 类名走 `npc-talk-modal`：被 scene3d.css 的 `[class*="-modal"]`
 *     3D 皮肤兜底选中（z-index/pointer-events 自动复位），无需 3D 侧接线。
 *
 * ⚠ 挂载：必须在 src/index.html 有 <script> —— 漏挂 = build 静默剔除（悬空）。
 */

/* ── 立绘降级：程序化 canvas 立绘 ─────────────────────────────────────────
   不追求好看，追求"绝不像坏图"：纯色底 + 首字 + 职业徽章，
   颜色由 npc.id 的 FNV-1a 哈希决定（同一个人永远同一个颜色）。 */
function _npcTalkFallbackColor(id) {
  var h = 2166136261;
  var s = String(id || "npc");
  for (var i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  var hue = h % 360;
  return { h: hue, bg: "hsl(" + hue + ",32%,26%)", fg: "hsl(" + hue + ",48%,78%)" };
}

function _npcTalkPaintFallback(canvas, npc) {
  var w = (canvas.width = 260);
  var hgt = (canvas.height = 320);
  var g = canvas.getContext("2d");
  var c = _npcTalkFallbackColor(npc && npc.id);
  /* 纵向渐变底 —— 和立绘的"背景"层次对齐 */
  var grad = g.createLinearGradient(0, 0, 0, hgt);
  grad.addColorStop(0, c.bg);
  grad.addColorStop(1, "hsl(" + c.h + ",28%,16%)");
  g.fillStyle = grad;
  g.fillRect(0, 0, w, hgt);
  /* 名字首字（取第一个字，退化到首字母） */
  var name = String((npc && npc.name) || "?");
  var ch = name.slice(0, 1);
  g.fillStyle = c.fg;
  g.font = "700 120px 'PingFang SC','Microsoft YaHei',sans-serif";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(ch, w / 2, hgt * 0.42);
  /* 职业徽章 */
  g.font = "600 22px 'PingFang SC','Microsoft YaHei',sans-serif";
  g.fillStyle = "rgba(255,255,255,0.82)";
  g.fillText(String((npc && npc.role) || ""), w / 2, hgt * 0.78);
}

/* ── 主入口 ─────────────────────────────────────────────────────────────── */
function showNpcTalk(opts) {
  opts = opts || {};
  var npc = opts.npc || {};
  var line = String(opts.line || "……");

  var root = document.getElementById("npcTalkRoot");
  if (!root) {
    root = document.createElement("div");
    root.id = "npcTalkRoot";
    document.body.appendChild(root);
  }

  /* 已开着 → 替换内容（对话是即时交互，不排队）。
     首次打开 → 建骨架。骨架只建一次，台词/立绘每次换。 */
  var box = root.querySelector(".npc-talk-modal");
  if (!box) {
    box = document.createElement("div");
    box.className = "npc-talk-modal";
    box.innerHTML =
      '<div class="npc-talk-stage">' +
      '  <div class="npc-talk-portrait-wrap"></div>' +
      '  <div class="npc-talk-panel">' +
      '    <div class="npc-talk-nameplate">' +
      '      <span class="npc-talk-name"></span>' +
      '      <span class="npc-talk-role"></span>' +
      '      <span class="npc-talk-affinity"></span>' +
      "    </div>" +
      '    <div class="npc-talk-line"></div>' +
      '    <div class="npc-talk-actions"></div>' +
      "  </div>" +
      "</div>";
    root.appendChild(box);
    /* ESC 关闭（只挂一次） */
    box._escHandler = function (e) {
      if (e.key === "Escape") hideNpcTalk();
    };
    window.addEventListener("keydown", box._escHandler);
  }

  /* ── 立绘：img 优先，onerror 降级 canvas ── */
  var wrap = box.querySelector(".npc-talk-portrait-wrap");
  wrap.innerHTML = "";
  if (npc.avatar) {
    var img = document.createElement("img");
    img.className = "npc-talk-portrait";
    img.alt = npc.name || "NPC";
    /* ★ 缓存破坏（2026-09-19）：立绘被批量去水印后，浏览器仍按旧 URL
       命中**内存/磁盘缓存**，玩家会一直看到带水印的旧图（恒稳实测）。
       加一次版本参数强制重新拉取。以后立绘再有批量处理，把这个串改一次。 */
    img.src = npc.avatar + "?v=20260919";
    img.onerror = function () {
      /* 降级铁律：拿不到图绝不空白、绝不抛（见文件头注释） */
      var cv = document.createElement("canvas");
      cv.className = "npc-talk-portrait npc-talk-fallback";
      _npcTalkPaintFallback(cv, npc);
      if (img.parentNode === wrap) wrap.replaceChild(cv, img);
    };
    wrap.appendChild(img);
  } else {
    var cv2 = document.createElement("canvas");
    cv2.className = "npc-talk-portrait npc-talk-fallback";
    _npcTalkPaintFallback(cv2, npc);
    wrap.appendChild(cv2);
  }

  /* ── 名牌 ── */
  box.querySelector(".npc-talk-name").textContent = npc.name || "陌生人";
  box.querySelector(".npc-talk-role").textContent = npc.role || "";
  var aff = box.querySelector(".npc-talk-affinity");
  var affNum = typeof opts.affinity === "number" ? opts.affinity : null;
  if (affNum != null) {
    aff.textContent = "好感 " + affNum + (opts.gain ? "（+" + opts.gain + "）" : "");
    aff.style.display = "";
  } else {
    aff.style.display = "none";
  }

  /* ── 台词 + 标记（生日 🎂 / 节日等） ── */
  var lineEl = box.querySelector(".npc-talk-line");
  lineEl.textContent = (opts.tag ? opts.tag + " " : "") + line;
  /* 重触发渐显动画：移除类 → 强制 reflow → 加回 */
  lineEl.classList.remove("is-fresh");
  void lineEl.offsetWidth;
  lineEl.classList.add("is-fresh");

  /* ── 按钮：调用方的自定义动作 + 默认「继续」 ── */
  var actions = box.querySelector(".npc-talk-actions");
  actions.innerHTML = "";
  var btns = Array.isArray(opts.actions) ? opts.actions.slice() : [];
  btns.push({ label: "继续", primary: true, onClick: hideNpcTalk });
  for (var i = 0; i < btns.length; i++) {
    (function (b) {
      var el = document.createElement("button");
      el.className = "npc-talk-btn" + (b.primary ? " is-primary" : "");
      el.textContent = b.label || "确定";
      el.addEventListener("click", function () {
        if (typeof b.onClick === "function") b.onClick();
        else hideNpcTalk();
      });
      actions.appendChild(el);
    })(btns[i]);
  }

  box.classList.add("is-open");
  return box;
}

function hideNpcTalk() {
  var root = document.getElementById("npcTalkRoot");
  if (!root) return;
  var box = root.querySelector(".npc-talk-modal");
  if (!box) return;
  box.classList.remove("is-open");
  if (box._escHandler) {
    window.removeEventListener("keydown", box._escHandler);
    box._escHandler = null;
  }
  /* 等退场动画播完再拆骨架（CSS 动画 0.22s，留 0.3s 余量） */
  setTimeout(function () {
    var r = document.getElementById("npcTalkRoot");
    if (r && r.firstChild) r.removeChild(r.firstChild);
  }, 300);
}

function npcTalkOpen() {
  var root = document.getElementById("npcTalkRoot");
  var box = root && root.querySelector(".npc-talk-modal");
  return !!(box && box.classList.contains("is-open"));
}
