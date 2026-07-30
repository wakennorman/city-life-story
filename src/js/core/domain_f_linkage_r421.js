/**
 * 域F(UI/UX) 联动增强 R421
 * 桥接：
 *   F→B  f421_event_icon_v2            事件图标v2 → 消费事件类型→UI图标提示
 *   F→D  f421_social_bond_v2            社交纽带v2 → 消费 relationships→UI关系条
 *   F→E  f421_finance_glance_v2         财务一览v2 → 消费 resources+investment→UI摘要
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR421Loaded) return;
  RANDOM_EVENTS._domainFLinkageR421Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "f421_event_icon_v2", phase: "street", _isChainEvent: false, icon: "🔔",
      title: "事件追踪",
      story: "你关注最近发生的事件——{desc}",
      triggers: { minDay: 40, excludeFlags: ["_f421EventCooldown"] },
      conditions: function (st) { return !st.gameOver; },
      choices: [
        { text: "📋 记录事件模式", hint: "心智+3,sales XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f421EventCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("sales", 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔔 你追踪事件模式——发现规律是进步的开始。心智+3,销售XP+2。", "success");
        }},
        { text: "🤷 事件随机发生", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var desc = "最近发生了许多值得记录的故事";
        if (st.flags && st.flags._eventHistory) desc = "已记录" + st.flags._eventHistory.length + "个重要事件,构成了你的人生故事";
        return "你关注最近发生的事件——" + desc + "。";
      }
    },
    {
      id: "f421_social_bond_v2", phase: "street", _isChainEvent: false, icon: "🔗",
      title: "社交纽带",
      story: "你查看了与他人的关系——{desc}",
      triggers: { minDay: 55, excludeFlags: ["_f421BondCooldown"] },
      conditions: function (st) { return !st.gameOver && st.relationships && Object.keys(st.relationships).length > 0; },
      choices: [
        { text: "💕 主动维护关系", hint: "心情+4,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f421BondCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔗 你主动维护社交关系——纽带需要用心经营。心情+4,心智+2。", "success");
        }},
        { text: "😌 顺其自然", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st) return null;
        var met = 0, high = 0;
        if (st.relationships) {
          for (var id in st.relationships) {
            if (st.relationships[id] && st.relationships[id].met) {
              met++;
              if ((st.relationships[id].affinity || 0) >= 50) high++;
            }
          }
        }
        var desc = "已结识" + met + "位NPC";
        if (high > 0) desc += ",其中" + high + "位关系密切";
        return "你查看了与他人的关系——" + desc + "。";
      }
    },
    {
      id: "f421_finance_glance_v2", phase: "street", _isChainEvent: false, icon: "💰",
      title: "财务一览",
      story: "你快速浏览了财务状况——{desc}",
      triggers: { minDay: 45, excludeFlags: ["_f421FinanceCooldown"] },
      conditions: function (st) { return !st.gameOver && st.resources; },
      choices: [
        { text: "📊 关注资产配置", hint: "心智+3,accounting XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f421FinanceCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你关注财务状况——清晰的财务意识是成功的基础。心智+3,会计XP+3。", "success");
        }},
        { text: "🤷 够用就行", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.resources) return null;
        var cash = st.resources.cash || 0;
        var desc = "当前现金¥" + cash.toLocaleString();
        if (cash > 500000) desc += ",财务状况良好";
        else if (cash < 500) desc += ",资金紧张,需要节约";
        return "你快速浏览了财务状况——" + desc + "。";
      }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();
