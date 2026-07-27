/**
 * 域B(事件/叙事) 联动增强 R584
 * 桥接：
 *   B→D  b584_event_help_stranger 事件帮助陌生人 → 消费 flags 数据,
 *     温暖→"帮助陌生人的善意"的城市温度
 *   B→C  b584_event_tech_breakthrough 事件技术突破 → 消费 flags 数据,
 *     科技→"技术突破带来的职业机会"的科技叙事
 *   B→H  b584_event_social_responsibility 事件社会责任 → 消费 flags+corporate 数据,
 *     责任→"企业社会责任"的公益叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR584Loaded) return;
  RANDOM_EVENTS._domainBLinkageR584Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "b584_event_help_stranger", phase: "street", _isChainEvent: false, icon: "💛",
      title: "举手之劳",
      story: "你帮了一个陌生人一个小忙——{desc}",
      triggers: { minDay: 10, interval: 30, maxRepeats: 5, excludeFlags: ["_b584HelpStrangerCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b584HelpStrangerCooldown);
      },
      choices: [
        { text: "💛 举手之劳", hint: "心情+2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b584HelpStrangerCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💛 '谢谢你！' 陌生人的微笑，是最好的回报。心情+2,心智+1。", "success");
        }},
        { text: "🙂 微微一笑", hint: "心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b584HelpStrangerCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💛 你笑了笑——'没事，举手之劳。' 心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你帮了一个陌生人一个小忙——'请问XX路怎么走？' 你耐心地指了路。帮助别人，快乐自己。";
      }
    },
    {
      id: "b584_event_tech_breakthrough", phase: "street", _isChainEvent: false, icon: "💡",
      title: "技术突破",
      story: "你听说了一项重大的技术突破——{desc}",
      triggers: { minDay: 20, interval: 90, maxRepeats: 3, excludeFlags: ["_b584TechBreakthroughCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b584TechBreakthroughCooldown);
      },
      choices: [
        { text: "💡 学习新技术", hint: "技术XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b584TechBreakthroughCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("coding", 5); } catch(e) {} } // [全系统自洽修复] 域E R588 修复:technology非真实技能键(XP静默丢弃)→映射coding(学习新技术=编程)
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 'AI技术又突破了，得跟上时代步伐。' 技术XP+5,心智+2。", "success");
        }},
        { text: "📈 关注趋势", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b584TechBreakthroughCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '技术变革带来了新的职业机会。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你听说了一项重大的技术突破——'XX公司研发出了新一代AI芯片，性能提升10倍！' 技术变革，正在改变世界。";
      }
    },
    {
      id: "b584_event_social_responsibility", phase: "corporate", _isChainEvent: false, icon: "🌍",
      title: "企业责任",
      story: "公司参与了一项公益活动——{desc}",
      triggers: { minDay: 40, interval: 180, maxRepeats: 3, excludeFlags: ["_b584SocialResponsibilityCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._b584SocialResponsibilityCooldown);
      },
      choices: [
        { text: "🌍 积极参与", hint: "管理XP+5,公司知名度+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b584SocialResponsibilityCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌍 '公司参与了公益活动，为社会贡献力量。' 管理XP+5,公司知名度+3,心情+2。", "success");
        }},
        { text: "📋 组织员工参与", hint: "管理XP+3,社交XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b584SocialResponsibilityCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌍 '组织员工一起参与，团队凝聚力更强了。' 管理XP+3,社交XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "公司参与了一项公益活动——'山区小学捐书活动，员工们都很积极。' 企业越大，责任越大。";
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