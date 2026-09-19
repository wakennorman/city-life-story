/**
 * 小游戏层（Minigames）—— 对标《大多数》的「手动小游戏 + 自动过场」双执行模式
 *
 * ══ 为什么要做这个文件 ═══════════════════════════════════════════════════
 * 《大多数》的全部工作/娱乐都不是"点一下看数字"，而是"点进去玩一个小交互"：
 *   · 打工：搬砖（限时搬运，体质决定移速）、保安（辨身份，判断越快收益越高）、
 *           发传单（智力决定路人接受率）、分拣快递……
 *   · 娱乐：象棋残局（从残局下起）、打篮球、飞镖、掷骰子、娃娃机……
 *
 * 而我们现有的 62 个职业 / 18 个街头工作 / 26 个服务，全部是「点一下 → 七层乘区
 * 自动结算 → 飘字」。同一张卡点第 100 次，结果分布完全不变 —— 这是"不好玩"的
 * 头号原因（不是内容不够，是操作层缺失）。
 *
 * ══ 但"逼玩家每次都玩小游戏"是错的 ═══════════════════════════════════════
 * 62 个职业全强制玩小游戏 = 折磨。所以这里实现《大多数》最聪明的那处设计：
 *
 *   ┌──────────────────────────────────────────────────────────────┐
 *   │ 手动模式 Manual：玩小游戏 → 基础收益 + 手动奖励（玩得越好越多）│
 *   │ 自动模式 Auto  ：看一段过场 → 基础收益 + 【历史最高手动奖励】 │
 *   └──────────────────────────────────────────────────────────────┘
 *
 * 【查证】GamerScout 评测原文：
 *   "Jobs can be completed either as manual mini-games for a bonus payout
 *    or skipped via an automatic cutscene if you just want to bank the base
 *    wage and move on. That dual-execution option is a smart design call:
 *    it respects your time without stripping the tactile feedback entirely."
 *
 * 【查证】PeakD 全流程实录（Day 7 保安）原文：
 *   "Maximum Manual Bonus is the highest bonus we've been able to earn, when
 *    manually doing the job. If we choose to do the job in Auto mode, the
 *    Maximum Manual Bonus is used and added to our Base Wage."
 *
 * 关键点：**自动模式给的不是零奖励，是"你历史最好成绩"**。于是：
 *   · 玩一次小游戏 → 永久提升你的自动收益上限 → 老玩家有正反馈
 *   · 不想玩时随时切自动 → 不惩罚时间有限的玩家
 *   · 小游戏手感被保留 → 不丢失"触感反馈"
 *
 * ══ 本文件与 3D 的关系 ═════════════════════════════════════════════════
 * 小游戏的挂载点是**行动 handler 内部**。3D 场景点热点 → invokeAction(id) →
 * 找到 getAvailableActions 里同 id 的行动 → 调它的 handler（见 scene3d_bridge.js
 * 顶注："3D 层不判任何条件"）。
 * 所以：**本文件开的小游戏界面，3D 和 2D 两端自动都能玩到，不需要写任何 3D 代码。**
 *
 * ══ 依赖（全部是旧运行时已有的全局）═══════════════════════════════════
 *   window.StateManager / showModal / consumeAP / addDailyTransaction / Random
 *
 * ══ 摘除方式 ═══════════════════════════════════════════════════════════
 * 删掉本文件 + index.html 那一个 script 标签即完全回到原状，不改一行既有代码。
 */

(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════════════
     一、手动/自动 双轨机制
     ══════════════════════════════════════════════════════════════════ */

  /** 每个工作/活动的手动奖励记忆字段名 */
  function bestKey(kind, id) {
    return "_manualBest_" + kind + "_" + id;
  }

  /**
   * 读取某项活动的历史最高手动奖励。
   * @param {object} state
   * @param {string} kind 'job' | 'extra' | 'minigame'
   * @param {string} id   工作/活动 id
   * @returns {number}
   */
  function getManualBest(state, kind, id) {
    if (!state || !state.flags) return 0;
    var v = state.flags[bestKey(kind, id)];
    return typeof v === "number" && isFinite(v) && v > 0 ? v : 0;
  }

  /**
   * 记录一次手动成绩（只有超过历史最好成绩才写入）。
   * @returns {boolean} 是否刷新了记录
   */
  function recordManualBonus(state, kind, id, bonus) {
    if (!state || !state.flags || typeof bonus !== "number" || !isFinite(bonus)) {
      return false;
    }
    var k = bestKey(kind, id);
    var prev = getManualBest(state, kind, id);
    if (bonus > prev) {
      state.flags[k] = Math.round(bonus);
      return true;
    }
    return false;
  }

  /**
   * 结算一次活动（手动或自动）。
   *
   * @param {object} opts
   * @param {string} opts.kind        'job' | 'extra' | 'minigame'
   * @param {string} opts.id          活动 id
   * @param {number} opts.base        基础收益
   * @param {number} opts.manualBonus 本次手动奖励（自动模式传 0 或不传）
   * @param {boolean} opts.auto       是否自动模式
   * @param {string} [opts.label]     显示名
   * @returns {{total:number, bonus:number, breakdown:string, newRecord:boolean, usedBest:number}}
   */
  function settle(state, opts) {
    var kind = opts.kind || "job";
    var id = opts.id;
    var base = Math.max(0, Math.round(opts.base || 0));
    var label = opts.label || id;

    if (opts.auto) {
      /* 自动模式：用历史最高手动奖励 */
      var best = getManualBest(state, kind, id);
      return {
        total: base + best,
        bonus: best,
        usedBest: best,
        newRecord: false,
        breakdown:
          best > 0
            ? "基础 ¥" + base + " + 历史最佳手动奖励 ¥" + best + "（自动执行）"
            : "基础 ¥" + base + "（自动执行 · 尚未有手动记录，先去玩一次小游戏可永久提升）",
      };
    }

    /* 手动模式：结算本次奖励并尝试刷新记录 */
    var bonus = Math.max(0, Math.round(opts.manualBonus || 0));
    var newRecord = recordManualBonus(state, kind, id, bonus);
    return {
      total: base + bonus,
      bonus: bonus,
      usedBest: 0,
      newRecord: newRecord,
      breakdown:
        "基础 ¥" + base + " + 手动奖励 ¥" + bonus + (newRecord ? "  ★新纪录！" : ""),
    };
  }

  /**
   * 统一的「手动 / 自动」选择弹窗。
   * 所有接入双轨的活动都用它，保证交互一致。
   *
   * @param {object} cfg
   * @param {string} cfg.title
   * @param {string} cfg.kind
   * @param {string} cfg.id
   * @param {string} [cfg.icon]
   * @param {number} cfg.base       基础收益
   * @param {string} [cfg.desc]     活动描述
   * @param {function} cfg.onManual 点「手动」时的回调 → 返回 { bonus, text }
   * @param {function} [cfg.onAuto] 点「自动」时的额外回调（可选）
   * @param {function} [cfg.onDone] 结算完成后回调 (result)
   */
  function runActivity(cfg) {
    var state = StateManager.getState();
    var best = getManualBest(state, cfg.kind, cfg.id);
    var icon = cfg.icon || "⚡";

    var body =
      '<div style="font-size:13px;line-height:1.8;">' +
      "<p>" +
      (cfg.desc || "选择执行方式。") +
      "</p>" +
      '<div style="margin:10px 0;padding:10px;border-radius:8px;' +
      'background:var(--bg-secondary,rgba(0,0,0,.04));">' +
      "<div>💰 基础收益：<b>¥" +
      cfg.base +
      "</b></div>" +
      "<div>🏅 历史最佳手动奖励：<b>" +
      (best > 0 ? "¥" + best : "—") +
      "</b>" +
      (best > 0
        ? ""
        : '<span style="font-size:12px;color:var(--text-secondary);"> （玩一次手动即永久提升自动收益）</span>') +
      "</div>" +
      "</div>" +
      '<div style="font-size:12px;color:var(--text-secondary);">' +
      "✋ <b>手动</b>：玩小游戏，玩得越好奖励越多，并刷新历史记录<br>" +
      "⏩ <b>自动</b>：直接拿基础收益 + 历史最佳奖励，省时间" +
      "</div>" +
      "</div>";

    showModal({
      title: icon + " " + cfg.title,
      body: body,
      buttons: [
        {
          text: "✋ 手动执行",
          cls: "btn-primary",
          callback: function () {
            /* 手动：交给调用方的 onManual，它负责开小游戏并返回奖励 */
            var r = cfg.onManual ? cfg.onManual() : null;
            if (r === false || r == null) {
              /* 玩家取消/未完成 —— 不结算、不关弹窗由调用方决定，
                 这里按"直接关闭"处理（小游戏自己会开新弹窗） */
              return true;
            }
            finish(state, cfg, { auto: false, manualBonus: r.bonus || 0, note: r.text });
            return true;
          },
        },
        {
          text: "⏩ 自动执行",
          cls: "",
          callback: function () {
            if (cfg.onAuto) cfg.onAuto(state);
            finish(state, cfg, { auto: true });
            return true;
          },
        },
        { text: "取消", cls: "" },
      ],
    });
  }

  /** 结算收尾：算钱、记录、提示。手动与自动共用。 */
  function finish(state, cfg, mode) {
    var res = settle(state, {
      kind: cfg.kind,
      id: cfg.id,
      base: cfg.base,
      auto: mode.auto,
      manualBonus: mode.manualBonus,
      label: cfg.title,
    });

    /* 入账 */
    if (res.total > 0) {
      state.resources.cash = (state.resources.cash || 0) + res.total;
      if (state.resources.totalEarned != null) {
        state.resources.totalEarned += res.total;
      }
      if (typeof addDailyTransaction === "function") {
        addDailyTransaction(
          state,
          "income",
          cfg.kind === "job" ? "work" : "side_job",
          res.total,
          cfg.title,
        );
      }
    }

    var msg =
      (cfg.icon || "⚡") +
      " " +
      cfg.title +
      "：" +
      res.breakdown +
      (mode.note ? "　" + mode.note : "") +
      "　合计 <b>¥" +
      res.total +
      "</b>";
    StateManager.addMessage(msg, res.newRecord ? "success" : "info");

    if (typeof renderAll === "function") renderAll();
    if (cfg.onDone) cfg.onDone(res);
  }

  /* ══════════════════════════════════════════════════════════════════
     二、象棋残局（对标《大多数》街头残局）
     ══════════════════════════════════════════════════════════════════

     【查证】《大多数》象棋残局规则（itemlevel.net/?p=45359）：
       · 街头老人摆摊，付 ¥5 下一局，赢 ¥50
       · 不是从开局下起 —— 直接给一个下到一半的残局，从残局里找赢法
       · 玩家执下方，永远有 1 子优势
       · 每天最多赢 3 局（上限封锁，防刷钱）

     这里实现的是**中国象棋的简化残局**：9×10 棋盘，红黑各若干子，
     玩家执红（下方）。点击选中 → 点击目标移动 → 吃掉黑将即胜。
     为避免实现完整象棋规则（将帅照面、马腿、象眼、士的九宫限制……）的复杂度，
     这里实现**核心棋子走法**并明确标注简化处，保证可玩且不误导。
     ══════════════════════════════════════════════════════════════════ */

  var CHESS_RANK = { K: "帅", A: "仕", B: "相", N: "马", R: "车", C: "炮", P: "兵" };
  var CHESS_RANK_B = { K: "将", A: "士", B: "象", N: "马", R: "车", C: "炮", P: "卒" };

  /** 棋盘坐标：x 0-8（左→右），y 0-9（黑方底线 → 红方底线）
      红方在下（y 大），黑方在上（y 小）。 */
  function chessInit(seed) {
    /* 三个残局：难度递增。玩家执红（下方），红方有子力优势（对齐《大多数》"1 子优势"）。

       ★ 难度阶梯是**实测**出来的，不是拍脑袋定的（用 BFS 穷举求解器验证）：
         简化规则下"吃掉黑将即胜"，所以难度 = 红车进杀前需要多少步铺垫。

       ★ 一个反直觉的结构性结论（穷举 4.5 万+ 布局得出，别再重复踩）：
         红帅固定在 (4,9)、黑将在 (4,0) 时，**纯车力（帅不动）取胜最多只需 3 步**。
         实测分布（车(0,2) + 1~4 个黑卒全组合）：
           卒数=1 → 全部 2 步
           卒数=2 → 2 步 501 个 / 3 步 4 个
           卒数=3 → 2 步 5089 个 / 3 步 150 个
           卒数=4 → 2 步 37555 个 / 3 步 2596 个
         纯车力 4 步解：**0 个**。原因：红帅与黑将同列，"将帅照面"这条规则
         每次最多只让玩家多花 1 个节奏；车是长兵器，一旦进了线就是一步到将。
         ⇒ 所以阶梯定为 **2 / 3 / 3**，"高手"局靠**歧义度**（唯一解更少、
           第一手更像"闲棋"）而不是靠步数拉长。硬凑 4 步只会做出假难度。

       ★ 摆放规律（三条，踩坑换来的）：
         1) 拦路子的位置不能紧贴黑将——否则"清子"与"进杀"合并成一步，步数永远上不去。
         2) 红车起手不能与黑将同行或同列——否则 1 步进杀线。
         3) 红兵不能与黑将同列且能前进吃到将——否则兵 2 步杀，车成摆设。 */
    var puzzles = [
      {
        name: "单车寡帅 · 入门",
        /* 红车 (0,2) 与黑将 (4,0) 不同线，需先平移再沉底吃。实测 2 步。 */
        pieces: [
          { side: "R", t: "K", x: 4, y: 9 },
          { side: "R", t: "R", x: 0, y: 2 },
          { side: "B", t: "K", x: 4, y: 0 },
        ],
        hint: "红车先走到将与帅同一列，再沉底吃将。注意别让黑将站到中路。",
      },
      {
        name: "卒挡车路 · 进阶",
        /* 黑将在 (4,1)（不在底线上，位置更靠里）。
           红车在 (0,4)——与将**既不同行也不同列**，必须至少走两步才能进杀。
           黑卒 (4,3) 卡在将的纵线上 → 纵线接近被卒挡，须先清卒。
           黑卒 (2,1) 卡在将的横线上 → 横线接近同样被挡。
           两条接近路线**都需要先清子**，实测最短 3 步。 */
        pieces: [
          { side: "R", t: "K", x: 4, y: 9 },
          { side: "R", t: "R", x: 0, y: 4 },
          { side: "B", t: "K", x: 4, y: 1 },
          { side: "B", t: "P", x: 4, y: 3 },
          { side: "B", t: "P", x: 2, y: 1 },
        ],
        hint: "将与车不同线，且两条接近路线都有卒把守——先清路，再进杀。",
      },
      {
        name: "双卒护驾 · 高手",
        /* 实测 3 步，但**最短解只有 2 条**（"进阶"局有 9 条）——这才是本局的难点：
           不是步数更多，而是"能赢的路更窄"。

           布局：黑将 (4,0)；黑卒 (2,0) 守底线通道、(4,1) 守纵线入口、
           (1,2) 守在红车的横向活动线上；红车 (0,2) 与将不同行不同列。

           两条正解（都必须先清子再进杀，且清的子不同）：
             解 A：车升到 (0,0) → 横吃 (2,0) → 沉底 (4,0) 吃将
             解 B：车走到 (0,1) → 横吃 (4,1) → 上一步 (4,0) 吃将
           容易走错的岔路：红车若先去吃 (1,2) 的卒，就会多花一步落到 4 步，
           所以第一手的判断（往 y=0 还是 y=1 走）是本局的胜负手。

           ★ 这局是**用穷举搜索选出来的**，不是我拍脑袋摆的：
             固定 将(4,0) 车(0,2)，穷举 2~3 个黑卒的全部组合（154 个 3 步解布局），
             按"最短解数量"升序取最少者 → 就是本布局（解数=2，全场最低）。
             详见 docs/象棋残局难度设计-2026-09-19.md 的搜索方法与数据。 */
        pieces: [
          { side: "R", t: "K", x: 4, y: 9 },
          { side: "R", t: "R", x: 0, y: 2 },
          { side: "B", t: "K", x: 4, y: 0 },
          { side: "B", t: "P", x: 2, y: 0 },
          { side: "B", t: "P", x: 4, y: 1 },
          { side: "B", t: "P", x: 1, y: 2 },
        ],
        hint: "红车面前两条路都要先清子。第一手往哪个方向走，决定了三步能不能拿下。",
      },
    ];
    var p = puzzles[Math.abs(seed | 0) % puzzles.length];
    return {
      name: p.name,
      hint: p.hint,
      pieces: p.pieces.map(function (q) {
        return { side: q.side, t: q.t, x: q.x, y: q.y };
      }),
      moves: 0,
      log: [],
    };
  }

  function chessAt(g, x, y) {
    for (var i = 0; i < g.pieces.length; i++) {
      var p = g.pieces[i];
      if (p.x === x && p.y === y) return p;
    }
    return null;
  }

  /** 将帅照面判定：两王在同一列且中间无子 → 该局面非法（走子方不得造成此局面）
   *
   *  ★ 为什么必须判这条：中国象棋里将帅不能照面。少了它，很多残局会退化成
   *    "车随便走一步就赢"——难度阶梯直接失效。
   *    注意本实现只把"照面"当作**非法着法**来判定（走完不能照面），
   *    不实现"被将军必须应将"的完整规则（那需要搜索整棵博弈树）。
   *    对方不会反击 —— 这是本小游戏明确声明的简化，与《大多数》的"残局推演"
   *    定位一致（原作也是给你一个可解的残局，不是完整对局）。 */
  function chessKingsFacing(pieces) {
    var rk = null,
      bk = null;
    for (var i = 0; i < pieces.length; i++) {
      var p = pieces[i];
      if (p.t !== "K") continue;
      if (p.side === "R") rk = p;
      else bk = p;
    }
    if (!rk || !bk || rk.x !== bk.x) return false;
    var lo = Math.min(rk.y, bk.y),
      hi = Math.max(rk.y, bk.y);
    for (var y = lo + 1; y < hi; y++) {
      for (var j = 0; j < pieces.length; j++) {
        if (pieces[j].x === rk.x && pieces[j].y === y) return false; /* 中间有子，不算照面 */
      }
    }
    return true;
  }

  /** 基础走法校验（简化：不含马腿/象眼，但**判将帅照面**） */
  function chessCanMove(g, p, tx, ty) {
    if (p.x === tx && p.y === ty) return false;
    if (tx < 0 || tx > 8 || ty < 0 || ty > 9) return false;
    var target = chessAt(g, tx, ty);
    if (target && target.side === p.side) return false;

    var dx = tx - p.x,
      dy = ty - p.y;
    var adx = Math.abs(dx),
      ady = Math.abs(dy);

    /* 中间隔子数（用于车/炮） */
    function blockers() {
      var n = 0;
      var sx = Math.sign(dx),
        sy = Math.sign(dy);
      var cx = p.x + sx,
        cy = p.y + sy;
      while (cx !== tx || cy !== ty) {
        if (chessAt(g, cx, cy)) n++;
        cx += sx;
        cy += sy;
      }
      return n;
    }

    var legal = false;
    switch (p.t) {
      case "K": /* 帅/将：九宫内走一步 */
        if (p.side === "R") {
          if (tx < 3 || tx > 5 || ty < 7 || ty > 9) return false;
        } else {
          if (tx < 3 || tx > 5 || ty < 0 || ty > 2) return false;
        }
        legal = adx + ady === 1;
        break;
      case "A": /* 仕/士：九宫内斜走一步 */
        if (p.side === "R") {
          if (tx < 3 || tx > 5 || ty < 7 || ty > 9) return false;
        } else {
          if (tx < 3 || tx > 5 || ty < 0 || ty > 2) return false;
        }
        legal = adx === 1 && ady === 1;
        break;
      case "B": /* 相/象：田字，简化（不判象眼） */
        legal = adx === 2 && ady === 2;
        break;
      case "N": /* 马：日字，简化（不判马腿） */
        legal = (adx === 1 && ady === 2) || (adx === 2 && ady === 1);
        break;
      case "R": /* 车：直线无阻挡 */
        legal = (dx === 0 || dy === 0) && blockers() === 0;
        break;
      case "C": /* 炮：直线；吃子须恰好 1 个隔子 */
        legal = (dx === 0 || dy === 0) && (target ? blockers() === 1 : blockers() === 0);
        break;
      case "P": /* 兵/卒：只能向前一步 */
        legal = p.side === "R" ? dx === 0 && dy === -1 : dx === 0 && dy === 1;
        break;
      default:
        return false;
    }
    if (!legal) return false;

    /* 走完之后不能造成将帅照面 */
    var after = [];
    for (var i = 0; i < g.pieces.length; i++) {
      var q = g.pieces[i];
      if (q === p) continue;
      if (q === target) continue; /* 被吃掉的子 */
      after.push(q);
    }
    after.push({ side: p.side, t: p.t, x: tx, y: ty });
    if (chessKingsFacing(after)) return false;

    return true;
  }

  /** 渲染棋盘为 HTML */
  function chessRender(g, sel) {
    var cell = 34;
    var w = cell * 9,
      h = cell * 10;
    var s =
      '<div style="display:flex;flex-direction:column;align-items:center;">' +
      '<div style="font-size:12px;color:var(--text-secondary);margin-bottom:6px;">' +
      "残局：" +
      g.name +
      "　·　已走 " +
      g.moves +
      " 步</div>" +
      '<div id="mg-chess-board" style="position:relative;width:' +
      w +
      "px;height:" +
      h +
      'px;background:#f6e6c8;border:2px solid #8a6b3f;border-radius:4px;">';

    /* 网格 */
    for (var i = 0; i < 10; i++) {
      s +=
        '<div style="position:absolute;left:0;right:0;top:' +
        i * cell +
        'px;height:1px;background:#b99a6b;"></div>';
    }
    for (var j = 0; j < 9; j++) {
      s +=
        '<div style="position:absolute;top:0;bottom:0;left:' +
        j * cell +
        'px;width:1px;background:#b99a6b;"></div>';
    }
    /* 楚河汉界 */
    s +=
      '<div style="position:absolute;left:0;right:0;top:' +
      4 * cell +
      "px;height:" +
      cell +
      'px;background:rgba(180,150,100,.25);"></div>';

    /* 棋子 */
    for (var k = 0; k < g.pieces.length; k++) {
      var p = g.pieces[k];
      var isSel = sel && sel.x === p.x && sel.y === p.y;
      var red = p.side === "R";
      var label = red ? CHESS_RANK[p.t] : CHESS_RANK_B[p.t];
      s +=
        '<div class="mg-chess-p" data-x="' +
        p.x +
        '" data-y="' +
        p.y +
        '" style="position:absolute;left:' +
        (p.x * cell + 3) +
        "px;top:" +
        (p.y * cell + 3) +
        "px;width:" +
        (cell - 6) +
        "px;height:" +
        (cell - 6) +
        "px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
        "font-size:17px;font-weight:700;cursor:pointer;user-select:none;transition:all .12s;" +
        "background:" +
        (red ? "#fff7ee" : "#3a3a3a") +
        ";color:" +
        (red ? "#c0392b" : "#f0f0f0") +
        ";border:2px solid " +
        (isSel ? "#e67e22" : red ? "#c0392b" : "#222") +
        ";" +
        (isSel ? "transform:scale(1.12);box-shadow:0 0 0 3px rgba(230,126,34,.4);" : "") +
        '">' +
        label +
        "</div>";
    }

    s += "</div>";
    s +=
      '<div style="font-size:12px;color:var(--text-secondary);margin-top:8px;text-align:center;max-width:320px;">' +
      "💡 " +
      g.hint +
      "<br>点自己的棋子选中，再点目标格走子。吃掉黑「将」即胜。" +
      "</div></div>";
    return s;
  }

  /** 开一局象棋残局小游戏（含《大多数》的「每天 3 局上限」+「付 5 赢 50」） */
  function playChessEndgame(state, onFinish) {
    var COST = 5;
    var REWARD = 50;
    var DAILY_WIN_CAP = 3;

    var day = (state.player && state.player.day) || 0;
    var wonToday =
      state.flags._chessWinDay === day ? state.flags._chessWinCount || 0 : 0;

    if ((state.resources.cash || 0) < COST) {
      StateManager.addMessage(
        "♟️ 摆摊的老人抬眼看了看你：「¥5 一局，没钱就先看别人下。」",
        "warning",
      );
      return false;
    }
    if (wonToday >= DAILY_WIN_CAP) {
      StateManager.addMessage(
        "♟️ 老人收起棋盘：「今天你已经赢了三局，见好就收吧。」（每天最多赢 " +
          DAILY_WIN_CAP +
          " 局）",
        "info",
      );
      return false;
    }

    /* 先收 ¥5 入场费 */
    state.resources.cash = Math.max(0, (state.resources.cash || 0) - COST);

    /* ★ 必须走 Random.int，不能用裸 Math.random()：
       棋局由 (天数 + 今日胜场×7 + 随机数) 播种，同一存档重放应得到同一局。
       裸 Math.random() 绕过种子 → 复现性断裂，且会被 `npm run test:unit`
       的 rngHygiene 判为真违规（该用例挂了会让 quality-gate 整体失败，
       进而**挡掉线上部署** —— 2026-09-19 实测线上旧版就是被它卡住的）。 */
    var g = chessInit((state.player.day || 0) + wonToday * 7 + Random.int(0, 2));
    var sel = null;
    var over = false;

    function closeAnd(ok) {
      /* 关闭棋盘弹窗 */
      var ov = document.querySelector(".modal-overlay");
      if (ov && ov.parentNode) ov.parentNode.removeChild(ov);
      if (typeof onFinish === "function") onFinish(ok);
    }

    function openBoard() {
      showModal({
        title: "♟️ 街头象棋残局（入场 ¥" + COST + "）",
        body: chessRender(g, sel),
        buttons: [
          { text: "认输 / 离开", cls: "", callback: function () { closeAnd(false); return false; } },
        ],
      });

      var board = document.getElementById("mg-chess-board");
      if (!board) return;

      board.addEventListener("click", function (e) {
        if (over) return;
        var el = e.target.closest(".mg-chess-p");
        var x, y;
        if (el) {
          x = Number(el.dataset.x);
          y = Number(el.dataset.y);
        } else {
          /* 点空格 —— 若已选中且走法合法则移动 */
          var rect = board.getBoundingClientRect();
          x = Math.floor((e.clientX - rect.left) / 34);
          y = Math.floor((e.clientY - rect.top) / 34);
        }
        var p = chessAt(g, x, y);

        /* 未选中：点自己的红子 → 选中 */
        if (!sel) {
          if (p && p.side === "R") {
            sel = { x: x, y: y };
            repaint();
          }
          return;
        }

        /* 已选中：点自己的另一个子 → 改选 */
        if (p && p.side === "R") {
          sel = { x: x, y: y };
          repaint();
          return;
        }

        /* 已选中：尝试走子 */
        var mover = chessAt(g, sel.x, sel.y);
        if (!mover) { sel = null; repaint(); return; }
        if (!chessCanMove(g, mover, x, y)) {
          sel = null;
          repaint();
          return;
        }

        /* 执行移动 */
        var captured = p;
        mover.x = x;
        mover.y = y;
        g.moves++;
        if (captured) {
          g.pieces = g.pieces.filter(function (q) { return q !== captured; });
        }
        sel = null;

        /* 胜利判定：吃掉黑将 */
        if (captured && captured.side === "B" && captured.t === "K") {
          over = true;
          /* 记录胜场 */
          state.flags._chessWinDay = day;
          state.flags._chessWinCount = wonToday + 1;
          var earn = REWARD;
          state.resources.cash = (state.resources.cash || 0) + earn;
          if (typeof addDailyTransaction === "function") {
            addDailyTransaction(state, "income", "gambling", earn - COST, "象棋残局赢棋");
          }
          state.needs.happiness = Math.min(100, (state.needs.happiness || 50) + 3);
          StateManager.addMessage(
            "♟️ 你将死了对方！老人笑着递过 ¥" +
              REWARD +
              "：「后生仔，棋不错。」（今日已赢 " +
              (wonToday + 1) +
              "/" +
              DAILY_WIN_CAP +
              " 局）",
            "success",
          );
          closeAnd(true);
          if (typeof renderAll === "function") renderAll();
          return;
        }

        repaint();
      });
    }

    /** 重绘棋盘（保留弹窗，只换内容） */
    function repaint() {
      var board = document.getElementById("mg-chess-board");
      if (!board) return;
      var wrap = board.parentNode;
      var tmp = document.createElement("div");
      tmp.innerHTML = chessRender(g, sel);
      var fresh = tmp.firstChild;
      wrap.parentNode.replaceChild(fresh, wrap);
      /* 重新绑定（DOM 被替换，监听器已失效） */
      openBoard();
    }

    openBoard();
    return true;
  }

  /* ══════════════════════════════════════════════════════════════════
     三、挂载到 job_market 的「投简历」之外 —— 新增街头象棋摊行动
     ══════════════════════════════════════════════════════════════════ */

  /**
   * 给行动列表追加小游戏行动。
   * 由 main.js 的 getAvailableActions 末尾调用（与 addExtraActions 并列）。
   */
  function addMinigameActions(state, actions) {
    if (!state || !state.trade || state.player.phase !== "street") return;
    var loc = state.trade.currentLocation;
    var day = state.player.day || 0;

    /* ── 街头象棋残局：人才市场（对标《大多数》"人才中心东侧的象棋摊"）── */
    if (loc === "job_market") {
      var wonToday =
        state.flags._chessWinDay === day ? state.flags._chessWinCount || 0 : 0;
      var capped = wonToday >= 3;
      actions.push({
        id: "minigame_chess",
        category: "social",
        name: "♟️ 街头象棋残局",
        desc: capped
          ? "老人说今天你已经赢了三局，见好就收。（每日上限）"
          : "付 ¥5 与摆摊老人下一局残局。赢了得 ¥50。玩家执下方，有子力优势。（今日已赢 " +
            wonToday +
            "/3）",
        icon: "♟️",
        apCost: 5,
        payEstimate: "45",
        disabled: capped ? "今日已达获胜上限(3局)" : null,
        handler: function () {
          if (typeof consumeAP === "function" && consumeAP(5) === false) return;
          playChessEndgame(StateManager.getState(), function () {
            if (typeof renderAll === "function") renderAll();
          });
        },
      });
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     四、全局挂载
     ══════════════════════════════════════════════════════════════════ */

  if (typeof window !== "undefined") {
    window.Minigames = {
      getManualBest: getManualBest,
      recordManualBonus: recordManualBonus,
      settle: settle,
      runActivity: runActivity,
      addMinigameActions: addMinigameActions,
      playChessEndgame: playChessEndgame,
      _chessInit: chessInit,
      _chessCanMove: chessCanMove,
      _chessAt: chessAt,
    };
    /* 顶层函数声明，供 main.js 直接 typeof 检测调用（与项目既有风格一致） */
    window.addMinigameActions = addMinigameActions;

    window.MECHANICS = window.MECHANICS || {};
    window.MECHANICS.minigames = {
      id: "minigames",
      name: "小游戏层（手动/自动双轨）",
      desc:
        "对标《大多数》的双执行模式：手动玩小游戏拿额外奖励并刷新历史记录，" +
        "自动直接拿基础收益 + 历史最佳手动奖励。",
      icon: "🎮",
      ref: "《大多数》Nobody: The Turnaround",
    };
  }
})();
