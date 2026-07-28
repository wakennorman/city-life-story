/**
 * 域C(职业/成长) 联动增强 R643
 * 桥接：
 *   C→E  c643_career_wealth_milestone  职业财富里程碑 → 消费 state.career+state.resources 数据,
 *     职业→"事业有成"经济回响
 *   C→D  c643_workplace_bond  职场情谊 → 消费 state.employment+state.relationships 数据,
 *     职业→"同事如家人"社交回响
 *   C→G  c643_skill_life_integration  技能生活融合 → 消费 state.skills+state.player 数据,
 *     职业→"学以致用"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR643Loaded) return;
  RANDOM_EVENTS._domainCLinkageR643Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR643(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "c643_career_wealth_milestone", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "事业有成",
      story: "你的职业发展达到了一个新的高度——{desc}",
      triggers: { minDay: 200, interval: 250, maxRepeats: 1, excludeFlags: ["_c643WealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c643WealthDone) return false;
        return st.stats && (st.stats.totalEarned || 0) >= 100000;
      },
      choices: [
        { text: "💰 奖励自己", hint: "心情+8,现金-2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c643WealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '辛苦了这么久,该奖励一下自己。' 你好好犒劳了自己。心情+8,现金-¥2000。", "success");
        }},
        { text: "🎯 再攀高峰", hint: "心智+6,置_c643Higher", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c643WealthDone = true;
          st.flags._c643Higher = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '这才哪到哪,继续往上走。' 你目光投向更高处。心智+6。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你的职业发展达到了一个新的高度——累计赚取¥" + totalEarned + "。'事业有成,是对努力最好的回报。'";
      }
    },
    {
      id: "c643_workplace_bond", phase: "street", _isChainEvent: false, icon: "🤝",
      title: "同事如家人",
      story: "工作中建立的友谊,慢慢变成了家人般的存在——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 2, excludeFlags: ["_c643BondCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c643BondCooldown) return false;
        var met = metNpcsR643(st);
        return met.length >= 2;
      },
      choices: [
        { text: "🍻 聚餐联络", hint: "好感+5,心情+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c643BondCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          var met = metNpcsR643(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "同事聚餐"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍻 '同事如家人。' 你请大家吃了顿饭。好感+5,心情+4。", "success");
        }},
        { text: "💼 保持专业", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c643BondCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '职场友情,贵在分寸。' 你保持了专业距离。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "工作中建立的友谊,慢慢变成了家人般的存在——'一起扛过项目的交情,不一样。'";
      }
    },
    {
      id: "c643_skill_life_integration", phase: "street", _isChainEvent: false, icon: "🌟",
      title: "学以致用",
      story: "你开始把工作中技能用到生活中——{desc}",
      triggers: { minDay: 80, interval: 120, maxRepeats: 2, excludeFlags: ["_c643IntegrateCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c643IntegrateCooldown) return false;
        var skills = st.skills || {};
        var highCount = 0;
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 30) highCount++;
        }
        return highCount >= 2;
      },
      choices: [
        { text: "🏠 技能改善生活", hint: "心情+6,最高技能XP+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c643IntegrateCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
          var skills = st.skills || {};
          var best = null, bestLv = -1;
          for (var k in skills) {
            var lv = skills[k] && typeof skills[k].level === "number" ? skills[k].level : 0;
            if (lv > bestLv) { bestLv = lv; best = k; }
          }
          if (best && typeof addSkillXp === "function") { try { addSkillXp(best, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏠 '学以致用,才是真本事。' 你用技能改善了生活。心情+6,技能XP+5。", "success");
        }},
        { text: "📚 继续深耕", hint: "智力+4", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c643IntegrateCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '技多不压身。' 你选择继续深耕。智力+4。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始把工作中技能用到生活中——'学以致用,才是真本事。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
