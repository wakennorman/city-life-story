/**
 * 域C(职业/成长) 联动增强 R659
 * 桥接：
 *   C→E  c653_career_wealth_milestone  职业财富里程碑 → 消费 state.career+state.resources 数据,
 *     职业→"事业有成"经济回响
 *   C→D  c653_professional_circle  职业圈子 → 消费 state.employment+state.relationships 数据,
 *     职业→"同行是朋友"社交回响
 *   C→G  c653_skill_lifelong_learning  终身学习 → 消费 state.skills+state.player 数据,
 *     职业→"学无止境"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR659Loaded) return;
  RANDOM_EVENTS._domainCLinkageR659Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR659(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  var EVENTS = [
    {
      id: "c653_career_wealth_milestone", phase: "street", _isChainEvent: false, icon: "🏆",
      title: "事业有成",
      story: "你的职业发展达到了一个新的高度——{desc}",
      triggers: { minDay: 250, interval: 300, maxRepeats: 1, excludeFlags: ["_c653WealthDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c653WealthDone) return false;
        return st.stats && (st.stats.totalEarned || 0) >= 150000;
      },
      choices: [
        { text: "💰 奖励自己", hint: "心情+8,现金-3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c653WealthDone = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '辛苦了这么久,该奖励一下自己。' 你好好犒劳了自己。心情+8,现金-¥3000。", "success");
        }},
        { text: "🎯 再攀高峰", hint: "心智+7,置_c653Higher", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c653WealthDone = true;
          st.flags._c653Higher = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '这才哪到哪,继续往上走。' 你目光投向更高处。心智+7。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = (st.stats && st.stats.totalEarned) || 0;
        return "你的职业发展达到了一个新的高度——累计赚取¥" + totalEarned + "。'事业有成,是对努力最好的回报。'";
      }
    },
    {
      id: "c653_professional_circle", phase: "street", _isChainEvent: false, icon: "👥",
      title: "同行是朋友",
      story: "你在工作中结识了很多同行,有些人慢慢变成了朋友——{desc}",
      triggers: { minDay: 150, interval: 200, maxRepeats: 2, excludeFlags: ["_c653CircleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c653CircleCooldown) return false;
        var met = metNpcsR659(st);
        return met.length >= 3;
      },
      choices: [
        { text: "🤝 深度交流", hint: "好感+5,管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c653CircleCooldown = true;
          var met = metNpcsR659(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 5, "同行交流"); } catch(e) {}
          }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 '同行是朋友,交流是财富。' 你与同行深度交流。好感+5,管理XP+3。", "success");
        }},
        { text: "💼 保持距离", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c653CircleCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 '职场友情,贵在分寸。' 你保持了专业距离。心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在工作中结识了很多同行,有些人慢慢变成了朋友——'同行是朋友,交流是财富。'";
      }
    },
    {
      id: "c653_skill_lifelong_learning", phase: "street", _isChainEvent: false, icon: "📚",
      title: "学无止境",
      story: "你开始意识到学习是一辈子的事——{desc}",
      triggers: { minDay: 180, interval: 250, maxRepeats: 1, excludeFlags: ["_c653LearnDone"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c653LearnDone) return false;
        var skills = st.skills || {};
        var highCount = 0;
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 40) highCount++;
        }
        return highCount >= 3;
      },
      choices: [
        { text: "📖 制定学习计划", hint: "管理XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c653LearnDone = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 '学无止境,制定计划。' 你制定了学习计划。管理XP+5,智力+3。", "success");
        }},
        { text: "🎯 继续深耕", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c653LearnDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '学无止境,继续深耕。' 你选择继续提升技能。心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始意识到学习是一辈子的事——'学无止境,制定计划,持续成长。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
