/**
 * 域H(Phase2/公司) 联动增强 R425
 * 桥接：
 *   H→G  h425_corp_sustainability    公司可持续 → 消费 corporate+needs→ESG
 *   H→A  h425_business_intel_v2      经营情报v2 → 消费 corporate→数据画像
 *   H→C  h425_leadership_v2          领导力v2 → 消费 corporate+management
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR425Loaded) return;
  RANDOM_EVENTS._domainHLinkageR425Loaded = true;
  function grantXp(key, amt) { if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} } }
  var EVENTS = [
    {
      id: "h425_corp_sustainability", phase: "corporate", _isChainEvent: false, icon: "🌱",
      title: "公司可持续发展",
      story: "你关注公司的可持续发展——{desc}",
      triggers: { minDay: 85, excludeFlags: ["_h425SusCooldown"] },
      conditions: function (st) { return !st.gameOver && st.player && st.player.corporate; },
      choices: [
        { text: "🌱 平衡利润与社会责任", hint: "心智+4,management XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h425SusCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("management", 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🌱 你关注公司可持续发展——长期价值大于短期利润。心智+4,管理XP+3。", "success");
        }},
        { text: "💪 利润优先", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        return "你关注公司的可持续发展——企业不仅要追求利润,更要承担社会责任。";
      }
    },
    {
      id: "h425_business_intel_v2", phase: "corporate", _isChainEvent: false, icon: "📊",
      title: "经营情报",
      story: "你分析了公司的经营数据——{desc}",
      triggers: { minDay: 70, excludeFlags: ["_h425IntelCooldown"] },
      conditions: function (st) { return !st.gameOver && st.player && st.player.corporate; },
      choices: [
        { text: "📈 用数据驱动决策", hint: "心智+3,accounting XP+4", apply: function (st) {
          if (!st) return; st.flags._h425IntelCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          grantXp("accounting", 4);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析经营数据——情报是决策的基础。心智+3,会计XP+4。", "success");
        }},
        { text: "🤷 凭经验判断", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var corp = st.player.corporate;
        var desc = "公司运营数据正在积累";
        if (typeof corp.kpi === "number") desc = "当前KPI:" + corp.kpi + "分,需要持续关注";
        return "你分析了公司的经营数据——" + desc + "。";
      }
    },
    {
      id: "h425_leadership_v2", phase: "corporate", _isChainEvent: false, icon: "👔",
      title: "领导力反思",
      story: "你反思自己的管理方式——{desc}",
      triggers: { minDay: 95, excludeFlags: ["_h425LeadCooldown"] },
      conditions: function (st) { return !st.gameOver && st.player && st.player.corporate; },
      choices: [
        { text: "📚 持续学习管理", hint: "management XP+6,心智+4", apply: function (st) {
          if (!st) return; st.flags._h425LeadCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          grantXp("management", 6);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👔 你反思管理方式——领导力是终身修炼。管理XP+6,心智+4。", "success");
        }},
        { text: "😊 带团队就是责任心", hint: "无奖励", apply: function () {} }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var desc = "管理是一门需要不断实践和反思的艺术";
        if (st.player.corporate.daysInJob > 200) desc = "带团队超过200天,你逐渐形成了自己的管理哲学";
        return "你反思自己的管理方式——" + desc + "。";
      }
    }
  ];
  for (var i = 0; i < EVENTS.length; i++) { if (!RANDOM_EVENTS.find(function (ev) { return ev.id === EVENTS[i].id; })) RANDOM_EVENTS.push(EVENTS[i]); }
})();
