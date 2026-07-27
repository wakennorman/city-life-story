/**
 * 域G(核心机制/生命周期) 联动增强 R591
 * 桥接：
 *   G→D  g591_life_social_milestone  人生社交里程碑 → 消费 player+relationships 数据,
 *     生命→"老朋友是人生财富"的社交回响
 *   G→E  g591_life_wealth_milestone  人生财富里程碑 → 消费 player+resources 数据,
 *     生命→"攒下的钱就是安全感"的经济回响
 *   G→C  g591_life_skill_milestone  人生技能里程碑 → 消费 player+skills 数据,
 *     生命→"学到老活到老"的职业回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR591Loaded) return;
  RANDOM_EVENTS._domainGLinkageR591Loaded = true;

  var EVENTS = [
    {
      id: "g591_life_social_milestone", phase: "street", _isChainEvent: false, icon: "👥",
      title: "老朋友是人生财富",
      story: "回首这些年，你发现有些朋友一直陪在身边——{desc}",
      triggers: { minDay: 100, interval: 180, maxRepeats: 3, excludeFlags: ["_g591SocialMilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g591SocialMilestoneCooldown) return false;
        var metCount = 0;
        if (st.relationships) {
          for (var k in st.relationships) {
            if (st.relationships[k] && st.relationships[k].met) metCount++;
          }
        }
        return metCount >= 2;
      },
      choices: [
        { text: "💝 感谢陪伴", hint: "心智+3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591SocialMilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '有你们在，这座城市不再陌生。' 你感激老朋友的陪伴。心智+3,心情+5。", "success");
        }},
        { text: "📖 记录回忆", hint: "智力+2,社交XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591SocialMilestoneCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💝 '这些回忆值得被记住。' 你把友谊的故事写进日记。智力+2,社交XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回首这些年，你发现有些朋友一直陪在身边——'老朋友是人生最大的财富。' 你决定好好珍惜。";
      }
    },
    {
      id: "g591_life_wealth_milestone", phase: "street", _isChainEvent: false, icon: "💰",
      title: "攒下的钱就是安全感",
      story: "看着存折上的数字，你感到一丝安心——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_g591WealthMilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g591WealthMilestoneCooldown) return false;
        var totalAssets = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return totalAssets >= 50000;
      },
      choices: [
        { text: "🛡️ 继续攒钱", hint: "心智+2,会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591WealthMilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛡️ '多攒一点，心里踏实。' 你决定继续积累。心智+2,会计XP+3。", "success");
        }},
        { text: "🎁 犒劳自己", hint: "心情+8,现金-1000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591WealthMilestoneCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 1000);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎁 '辛苦了这么久，该奖励一下自己。' 你好好放松了一天。心情+8,现金-¥1000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "看着存折上的数字，你感到一丝安心——'攒下的钱，就是生活的底气。' 你开始思考这笔钱的用途。";
      }
    },
    {
      id: "g591_life_skill_milestone", phase: "street", _isChainEvent: false, icon: "📚",
      title: "学到老活到老",
      story: "回顾自己学会的技能，你感到欣慰——{desc}",
      triggers: { minDay: 80, interval: 150, maxRepeats: 3, excludeFlags: ["_g591SkillMilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._g591SkillMilestoneCooldown) return false;
        var skilledCount = 0;
        if (st.skills) {
          for (var k in st.skills) {
            if (st.skills[k] && (st.skills[k].level || 0) >= 20) skilledCount++;
          }
        }
        return skilledCount >= 2;
      },
      choices: [
        { text: "🎯 继续精进", hint: "最高技能XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591SkillMilestoneCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var topSkill = null, topLv = 0;
          if (st.skills) {
            for (var k in st.skills) {
              if (st.skills[k] && (st.skills[k].level || 0) > topLv) { topLv = st.skills[k].level; topSkill = k; }
            }
          }
          if (topSkill && typeof addSkillXp === "function") { try { addSkillXp(topSkill, 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '学无止境。' 你决定继续精进技能。心智+2,最高技能XP+5。", "success");
        }},
        { text: "🎉 庆祝成就", hint: "心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g591SkillMilestoneCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 '看看自己学会了这么多，真不容易。' 你为自己的成长感到骄傲。心情+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "回顾自己学会的技能，你感到欣慰——'学到老，活到老。' 每一项技能都是人生的积淀。";
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
