/**
 * 域F(UI/UX) 联动增强 R590
 * 桥接：
 *   F→A  f590_skill_balance_board  技能面板「发展均衡」→ 数据/数值平衡领域：统筹能力提升
 *   F→C  f590_career_panel_praise  职业面板「基本功扎实」→ 职业/成长：Leader 在会上表扬
 *   F→E  f590_watchlist_discipline 投资面板「坚持复盘」→ 经济/投资：波动中更从容的纪律
 *
 * 注：state.skills[key] 为对象 {level,xp}，技能等级须读 .level（非数值）。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR590Loaded) return;
  RANDOM_EVENTS._domainFLinkageR590Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id) &&
          st.relationships[id] && st.relationships[id].met) return id;
    }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch (e) {}
    }
  }
  // 统计达到指定等级的技能数量（skills[key].level 为数值等级）
  function countSkillsAtOrAbove(st, lvl) {
    if (!st || !st.skills) return 0;
    var n = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var sk = st.skills[k];
      if (sk && (sk.level || 0) >= lvl) n++;
    }
    return n;
  }

  var EVENTS = [
    {
      id: "f590_skill_balance_board", phase: "street", _isChainEvent: false, icon: "📊",
      title: "技能面板：均衡发展",
      story: "你翻开技能面板，发现自己在多项技能上都有扎实积累——{desc}",
      triggers: { minDay: 20, interval: 45, maxRepeats: 1, excludeFlags: ["_f590BalanceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        return (st.flags && !st.flags._f590BalanceSeen) && countSkillsAtOrAbove(st, 10) >= 4;
      },
      choices: [
        { text: "📊 顺势统筹一桩事", hint: "智力+2,心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f590BalanceSeen = true;
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 20) + 2);
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '样样都懂一点，反而最会统筹。' 智力+2,心智+3,心情+2。", "success");
        }},
        { text: "🗒️ 记一笔心得", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f590BalanceSeen = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '均衡发展也是一种竞争力。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你翻开技能面板，发现自己在多项技能上都有扎实积累——'cooking、coding、sales……原来不知不觉攒了这么全的本领。' 均衡，也是一种实力。";
      }
    },
    {
      id: "f590_career_panel_praise", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "职业面板：基本功被看见",
      story: "你在职业面板上整理履历，几项硬技能格外亮眼——{desc}",
      triggers: { minDay: 30, interval: 50, maxRepeats: 1, excludeFlags: ["_f590CareerPraiseSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        var hasJob = (st.career && st.career.currentJob) || (st.corporate && st.corporate.company);
        if (!hasJob) return false;
        return (st.flags && !st.flags._f590CareerPraiseSeen) && countSkillsAtOrAbove(st, 20) >= 2;
      },
      choices: [
        { text: "🏆 接下表扬，再接再厉", hint: "管理XP+8,现金+800", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f590CareerPraiseSeen = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch (e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 800;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 'Leader 在会上说：这小子基本功扎实，靠谱。' 管理XP+8,现金+800。", "success");
        }},
        { text: "🤝 请带教前辈喝一杯", hint: "好感+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f590CareerPraiseSeen = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "请前辈喝一杯");
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏆 你请带教前辈喝了杯咖啡，关系更近了。好感+3,心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在职业面板上整理履历，几项硬技能格外亮眼——'coding 25 级、sales 22 级……这些本事，老板都看在眼里。'";
      }
    },
    {
      id: "f590_watchlist_discipline", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "投资面板：纪律成习惯",
      story: "你照例打开投资面板做复盘，组合里躺着好几只标的——{desc}",
      triggers: { minDay: 25, interval: 55, maxRepeats: 1, excludeFlags: ["_f590WatchlistSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.investment || !st.investment.stockHoldings) return false;
        return (st.flags && !st.flags._f590WatchlistSeen) && st.investment.stockHoldings.length >= 3;
      },
      choices: [
        { text: "📈 守住纪律，不为波动所动", hint: "投资意识+会计XP6,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f590WatchlistSeen = true;
          st.flags._dataInvestorMindset = true; // 复用既有投资意识 flag
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 6); } catch (e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '坚持复盘，让人在涨跌里都能睡得着觉。' 投资意识养成,会计XP+6,心智+3。", "success");
        }},
        { text: "📝 记下一条纪律箴言", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f590WatchlistSeen = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '市场会奖励有耐心的人。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你照例打开投资面板做复盘，组合里躺着好几只标的——'分散持有、定期检视，这套动作已经成了肌肉记忆。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();
