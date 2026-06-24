/**
 * 今日重点（Daily Focus）— P0 改进 #1
 *
 * 问题：玩家面对 35+ 街头工作、6 行业投资、20+ 标签界面，
 *   每日开局有"决策瘫痪"。Hermes 评估指出"信息层级过载（D）"。
 *
 * 设计参考：
 * - 《大多数》"今日目标"区块（侧边栏黄色挂条）
 * - BitLife "Top Recommendations"
 * - This War of Mine 早晨清单
 *
 * 实现：基于 state 推断 1-3 条"今日最该做"，渲染到 #daily-focus-section
 *   每条 ≤ 14 字，单 emoji 起头；点击关闭则当日不再显示。
 *
 * 规则采用"加权评分 → 取前 3"算法：
 *   1) 紧急健康/疲劳/食物 (权重 100)
 *   2) 紧急债务到期      (权重 90)
 *   3) 装备临近报废      (权重 70)
 *   4) 当前可领的成就    (权重 50)
 *   5) 行业热度异常机会  (权重 40)
 *   6) 节日抢钱窗口      (权重 30)
 *   7) 梦想里程碑接近    (权重 20)
 */

(function () {
  function _fmt(text) {
    return text;
  }

  function _collectCandidates(state) {
    var out = [];
    var p = state.player || {};
    var n = state.needs || {};
    var r = state.resources || {};
    var s = state.status || {};

    // 健康危机
    if ((s.health || 100) < 35) {
      out.push({
        w: 100,
        icon: "🚑",
        text: "去医院或药店看病",
        hint: "健康<35，再低会昏迷",
      });
    }
    if ((n.hunger || 100) < 30) {
      out.push({
        w: 95,
        icon: "🍜",
        text: "买饭吃，别饿着",
        hint: "饥饿过低损耗体力",
      });
    }
    if ((n.fatigue || 0) > 80) {
      out.push({
        w: 92,
        icon: "🛏️",
        text: "回家睡一觉",
        hint: "疲劳过高效率折半",
      });
    }
    if ((n.happiness || 50) < 20) {
      out.push({
        w: 88,
        icon: "🎮",
        text: "找件开心的事做",
        hint: "心情过低会触发心理事件",
      });
    }

    // 债务紧迫
    var vd = r.villageDebt || 0;
    if (vd > 0) {
      var vi = r.villageDebtInterest || 0;
      if (vi > 0 && vd > 3000 && p.day && p.day > 30) {
        out.push({
          w: 90,
          icon: "🏘️",
          text: "尽快还村长一些钱",
          hint: "利息复利越滚越大",
        });
      } else if (vd > 0 && p.day && p.day > 80) {
        out.push({
          w: 60,
          icon: "🏘️",
          text: "找时间还村长债",
          hint: "拖太久会被催债事件",
        });
      }
    }

    // 装备耐久
    var equipped = (state.equipment && state.equipment.equipped) || {};
    var dur = state._equipmentDurability || {};
    Object.keys(equipped).forEach(function (slot) {
      var itemId = equipped[slot];
      if (!itemId) return;
      var d = dur[itemId];
      if (!d || typeof d.current !== "number" || typeof d.max !== "number")
        return;
      var pct = d.current / d.max;
      if (pct < 0.2) {
        out.push({
          w: 70,
          icon: "🔧",
          text: "修一下装备别报废",
          hint: itemId + " 耐久仅 " + Math.round(pct * 100) + "%",
        });
      }
    });

    // 节日抢钱
    if (typeof getActiveFestival === "function") {
      try {
        var fes = getActiveFestival(state);
        if (fes && fes.id) {
          out.push({
            w: 30,
            icon: "🎊",
            text: "节日窗口：摆摊好时机",
            hint: fes.name + " 期间客流暴增",
          });
        }
      } catch (e) {
        /* ignore */
      }
    }

    // 行业热度异常
    if (typeof getSectorHeat === "function") {
      var sectors = ["科技", "消费", "金融", "房地产", "医药", "新能源"];
      var hottest = null,
        coolest = null;
      for (var si = 0; si < sectors.length; si++) {
        var h = getSectorHeat(sectors[si]);
        if (h === undefined || h === null) continue;
        if (!hottest || h > hottest.h) hottest = { name: sectors[si], h: h };
        if (!coolest || h < coolest.h) coolest = { name: sectors[si], h: h };
      }
      if (hottest && hottest.h > 1.15) {
        out.push({
          w: 40,
          icon: "📈",
          text: hottest.name + "行业过热",
          hint: "可考虑投资该行业股",
        });
      }
      if (coolest && coolest.h < 0.85) {
        out.push({
          w: 35,
          icon: "📉",
          text: coolest.name + "在低位",
          hint: "或为抄底窗口",
        });
      }
    }

    // 梦想里程碑
    if (typeof getDreamProgress === "function" && p.day > 30) {
      try {
        var prog = getDreamProgress(state);
        if (prog >= 60 && prog < 100) {
          out.push({
            w: 20,
            icon: "🌟",
            text: "梦想进度 " + prog + "%",
            hint: "完成下一里程碑触发剧情",
          });
        }
      } catch (e) {
        /* ignore */
      }
    }

    // 学习/技能：极低核心属性预警
    if ((p.intelligence || 0) < 15 && p.day > 20) {
      out.push({
        w: 25,
        icon: "📚",
        text: "智力过低，考虑学习",
        hint: "图书馆/夜校提升智力",
      });
    }
    if ((p.physique || 0) < 15 && p.day > 20) {
      out.push({
        w: 25,
        icon: "💪",
        text: "体质过低，影响体力工作",
        hint: "公园锻炼或多吃肉",
      });
    }

    // 35岁危机预警（P1：中国本土化）
    if (p.phase === "street" && p.age >= 33 && p.age < 36) {
      out.push({
        w: 45,
        icon: "⏳",
        text: "接近35岁分水岭",
        hint: "现在还来得及转型/上岸",
      });
    }

    if (typeof getStoryChapterChecklist === "function") {
      try {
        var chapterGoals = getStoryChapterChecklist(state);
        for (var gi = 0; gi < chapterGoals.length; gi++) {
          var goal = chapterGoals[gi];
          if (!goal || goal.done) continue;
          out.push({
            w: 58 + (goal.weight || 0) / 10,
            icon: "\uD83D\uDCD6",
            text: goal.label,
            hint: goal.hint,
          });
        }
      } catch (e) {
        /* ignore */
      }
    }

    return out;
  }

  function getDailyFocus(state) {
    var cands = _collectCandidates(state);
    cands.sort(function (a, b) {
      return b.w - a.w;
    });
    return cands.slice(0, 3);
  }

  function renderDailyFocusSection(state) {
    var el = document.getElementById("daily-focus-section");
    if (!el) return;
    // 序章/欢迎页面或职场后期不显示
    if (
      !state.player ||
      state.player.phase !== "street" ||
      state.player.day < 2
    ) {
      el.style.display = "none";
      return;
    }
    // 玩家关闭过当天的提示
    if (
      state.flags &&
      state.flags._dailyFocusDismissedDay === state.player.day
    ) {
      el.style.display = "none";
      return;
    }
    var items = getDailyFocus(state);
    if (!items.length) {
      el.style.display = "none";
      return;
    }
    el.style.display = "";
    var html =
      '<h3 style="display:flex;justify-content:space-between;align-items:center;">' +
      "<span>📌 今日重点</span>" +
      '<button class="btn-mini" onclick="dismissDailyFocus()" title="今天不再显示" ' +
      'style="font-size:10px;padding:1px 5px;background:transparent;border:1px solid var(--border);' +
      'color:var(--text-muted);border-radius:3px;cursor:pointer;">✕</button>' +
      "</h3>";
    html +=
      '<div style="display:flex;flex-direction:column;gap:4px;font-size:11px;">';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      html +=
        '<div style="padding:5px 7px;background:rgba(243,180,90,0.10);border-left:2px solid #d2964a;border-radius:3px;" title="' +
        (it.hint || "").replace(/"/g, "&quot;") +
        '">' +
        '<span style="font-size:13px;">' +
        it.icon +
        "</span> " +
        '<span style="color:var(--text-primary);">' +
        _fmt(it.text) +
        "</span>" +
        "</div>";
    }
    html += "</div>";
    el.innerHTML = html;
  }

  function dismissDailyFocus() {
    var st = StateManager.getState();
    if (!st.flags) st.flags = {};
    st.flags._dailyFocusDismissedDay = st.player.day;
    renderDailyFocusSection(st);
  }

  if (typeof window !== "undefined") {
    window.getDailyFocus = getDailyFocus;
    window.renderDailyFocusSection = renderDailyFocusSection;
    window.dismissDailyFocus = dismissDailyFocus;
  }
})();
