/**
 * 域G(核心机制/生命周期) 联动增强 R838
 * 全系统优化·Domain G 第六十九轮循环
 *
 * 【联动增强3项】
 *   1. G→A 人生数据v22 — 核心机制数据转化为数值洞察资产
 *   2. G→D 人生社交v20 — 人生节点触发NPC社交回响
 *   3. G→E 财富健康v11 — 生命周期数据反馈为经济洞察
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；使用 Random.fromArray/Random.int 保持种子RNG。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR838Loaded) return;
  RANDOM_EVENTS._domainGLinkageR838Loaded = true;

  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "g838_life_data_v22",
      phase: "street",
      icon: "📊",
      title: "人生数据，映照来路",
      story: "你翻开自己的生存记录——每一天的喜怒哀乐，都变成了数据。这些数字背后，是你在这座城市里走过的每一步。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g838LifeDataDone) return false;
        return st.player.day >= 600 && st.status && st.needs;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "📈 分析人生轨迹",
          hint: "智力+26, 心智+25, 置_g838Analyst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g838LifeDataDone = true;
            st.flags._g838Analyst = true;
            if (st.status && st.needs) {
              var h = st.status.health || 100;
              var hap = st.needs.happiness || 50;
              st.flags._g838QualityScore = Math.min(100, Math.round(h * 0.6 + hap * 0.4));
            }
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 26);
              st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '数据是过去的见证,也是未来的指引。' 智力+26, 心智+25。", "success");
            }
          }
        },
        {
          text: "🎯 设定新的人生目标",
          hint: "心智+25, 置_g838GoalSetter",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g838LifeDataDone = true;
            st.flags._g838GoalSetter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,人生才有方向。' 心智+25。", "info");
            }
          }
        }
      ]
    },
    {
      id: "g838_life_social_v20",
      phase: "street",
      icon: "🎉",
      title: "人生节点，与友同庆",
      story: "你发现——每当你走到人生的一个重要节点，总有一些朋友在你身边。他们不一定能帮你解决问题，但他们的陪伴，本身就是一种力量。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g838LifeSocialDone) return false;
        if (!st.relationships) return false;
        var _age = st.player.age || 18;
        if (_age < 60) return false;
        var _friends = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _friends++;
        }
        return _friends >= 12;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🎉 感谢朋友的陪伴",
          hint: "心情+35, 社交XP+30, 置_g838FriendCompanion",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g838LifeSocialDone = true;
            st.flags._g838FriendCompanion = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 35);
            grantXp("social", 30);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 感谢朋友的陪伴——心情+35, 社交XP+30。人生的路上,有朋友同行,是一种幸运。", "success");
            }
          }
        },
        {
          text: "😊 自己走也挺好",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g838LifeSocialDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 自己走也挺好。心智+5。", "info");
            }
          }
        }
      ]
    },
    {
      id: "g838_wealth_health_v11",
      phase: "street",
      icon: "💰",
      title: "花甲之年，财富传承",
      story: "你坐在桌前，看着自己的资产清单。六十岁了，是时候考虑财富传承和退休规划了。现在的财富策略，应该更注重稳健和保值。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g838WealthHealthDone) return false;
        if (!st.resources) return false;
        var _age = st.player.age || 18;
        if (_age < 60) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (st.investment) {
          var holdings = st.investment.stockHoldings || [];
          var market = st.investment.stockMarket || {};
          for (var i = 0; i < holdings.length; i++) {
            var h = holdings[i];
            var m = market[h.symbol];
            if (m && isFinite(m.price) && isFinite(h.shares)) _total += m.price * h.shares;
          }
        }
        return _total >= 1000000;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 规划财富传承",
          hint: "会计XP+35, 智力+24, 置_g838WealthReady",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g838WealthHealthDone = true;
            st.flags._g838WealthReady = true;
            grantXp("accounting", 35);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 24);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你规划了财富传承方案——年龄不是负担,是经验的沉淀。会计XP+35, 智力+24。", "success");
            }
          }
        },
        {
          text: "😅 维持现状就好",
          hint: "心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g838WealthHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 维持现状就好。心智+5。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var exists = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === EVENTS[i].id) { exists = true; break; }
    }
    if (!exists) RANDOM_EVENTS.push(EVENTS[i]);
  }
})();