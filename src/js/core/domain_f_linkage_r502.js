/**
 * 域F(UI/UX) 联动增强 R502
 * 桥接：
 *   F→H  f502_corp_report_ui    公司报告UI → 消费 corporate 数据,
 *     经营→"公司运营月报"的数据看板
 *   F→D  f502_social_heatmap    社交热力图 → 消费 relationships 数据,
 *     关系→"谁和你互动最多"的社交热力图
 *   F→C  f502_career_map_ui     职业地图UI → 消费 skills 数据,
 *     职业→"你的职业发展路径"的路线图
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR502Loaded) return;
  RANDOM_EVENTS._domainFLinkageR502Loaded = true;

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
      id: "f502_corp_report_ui", phase: "corporate", _isChainEvent: false, icon: "📋",
      title: "运营月报",
      story: "你打开公司的运营月报——{desc}",
      triggers: { minDay: 45, interval: 90, maxRepeats: 5, excludeFlags: ["_f502CorpReportCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._f502CorpReportCooldown);
      },
      choices: [
        { text: "📋 仔细阅读", hint: "管理XP+5,会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f502CorpReportCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 月报显示公司运营一切正常——'营收增长XX%，成本控制XX%。' 管理XP+5,会计XP+3。", "success");
        }},
        { text: "🔍 关注异常数据", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f502CorpReportCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📋 你重点关注了月报中的异常数据——'这个数字不太对劲，要查一下原因。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你打开公司的运营月报——数字、图表、趋势分析，一目了然。好的管理，建立在准确的数据之上。";
      }
    },
    {
      id: "f502_social_heatmap", phase: "street", _isChainEvent: false, icon: "🔥",
      title: "社交热力图",
      story: "你发现最近和某些人走得特别近——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 5, excludeFlags: ["_f502SocialHeatmapCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f502SocialHeatmapCooldown);
      },
      choices: [
        { text: "🔥 多联系", hint: "好感+2,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f502SocialHeatmapCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "频繁互动");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 '最近跟你聊天最多的人，往往是最懂你的人。' 好感+2,心情+2。", "success");
        }},
        { text: "📊 分析社交圈", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f502SocialHeatmapCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 你分析了自己的社交圈——'原来我的社交圈是这样的结构。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现最近和某些人走得特别近——有些人每天联系，有些人半个月没说话了。社交圈，需要用心经营。";
      }
    },
    {
      id: "f502_career_map_ui", phase: "corporate", _isChainEvent: false, icon: "🗺️",
      title: "职业路线图",
      story: "你规划了一下未来的职业发展路径——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_f502CareerMapCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f502CareerMapCooldown);
      },
      choices: [
        { text: "🗺️ 制定计划", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f502CareerMapCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗺️ '有了路线图，就不会迷路。' 你制定了清晰的职业发展计划。管理XP+5,心智+2。", "success");
        }},
        { text: "📈 看看市场需要什么", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f502CareerMapCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🗺️ 你研究了市场需求——'原来这个方向最缺人。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你规划了一下未来的职业发展路径——'三年后我想成为什么样的人？' 有了目标，每一步都走得更踏实。";
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