/**
 * 域D(NPC/社交) 联动增强 R686
 * 桥接：
 *   D→A  d686_social_capital_report  社交资本报告 → 消费 state.relationships,
 *     人际关系网络价值量化
 *   D→C  d686_npc_career_mentor       NPC职业导师 → 消费 state.relationships+state.employment,
 *     高好感NPC提供职业指导
 *   D→G  d686_social_wellbeing       社交幸福感 → 消费 state.relationships+state.needs,
 *     社交质量影响幸福感
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR686Loaded) return;
  RANDOM_EVENTS._domainDLinkageR686Loaded = true;

  function metNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var cnt = 0;
    for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) cnt++; }
    return cnt;
  }

  function totalAffinity(st) {
    if (!st || !st.relationships) return 0;
    var total = 0;
    for (var k in st.relationships) {
      var r = st.relationships[k];
      if (r && typeof r.affinity === "number") total += Math.max(0, r.affinity);
    }
    return total;
  }

  function bumpAff(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") {
      try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {}
    }
  }

  function topMetNpc(st) {
    if (!st || !st.relationships) return null;
    var best = null, bestAff = -999;
    for (var k in st.relationships) {
      var r = st.relationships[k];
      if (r && r.met && typeof r.affinity === "number" && r.affinity > bestAff) {
        bestAff = r.affinity; best = k;
      }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "d686_social_capital_report",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交资本报告",
      story: "你的人脉网络是一笔无形资产",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_d686ReportCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d686ReportCd) return false;
        return metNpcCount(st) >= 3 && st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📈 梳理人脉价值",
          hint: "管理XP+5,智力+3,置_d686Analyzer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d686ReportCd = true;
            st.flags._d686Analyzer = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 人脉就是钱脉,盘点社交资本。管理XP+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🤝 主动维护关系",
          hint: "社交XP+6,好感+2,置_d686Maintain",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d686ReportCd = true;
            st.flags._d686Maintain = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 6); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 2, "主动维护");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 关系不维护就会淡,社交XP+6,好感+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "已结识" + metNpcCount(st) + "位朋友,社交资本总值" + totalAffinity(st) + "——'人脉不是认识多少人,是多少人愿意帮你。'";
      }
    },
    {
      id: "d686_npc_career_mentor",
      phase: "street",
      _isChainEvent: false,
      icon: "🎓",
      title: "前辈的指导",
      story: "一位前辈朋友给了你职业建议",
      triggers: { minDay: 70, interval: 90, maxRepeats: 3, excludeFlags: ["_d686MentorCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d686MentorCd) return false;
        return metNpcCount(st) >= 2 && st.player && st.player.day >= 70;
      },
      choices: [
        {
          text: "🎯 认真听取",
          hint: "管理XP+6,心智+3,好感+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d686MentorCd = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 2, "职业指导");
            if (typeof StateManager !== "undefined") {
              var name = (typeof getNpcDisplayName === "function") ? getNpcDisplayName(topMetNpc(st)) : "前辈";
              StateManager.addMessage("🎓 " + name + "的指导让你少走弯路。管理XP+6,心智+3。", "success");
            }
          }
        },
        {
          text: "🤔 独立思考",
          hint: "智力+4,置_d686Independent",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d686MentorCd = true;
            st.flags._d686Independent = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤔 参考他人,但最终自己拿主意。智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var npc = topMetNpc(st);
        var name = (typeof getNpcDisplayName === "function" && npc) ? getNpcDisplayName(npc) : "一位前辈";
        return name + "拍拍你的肩膀:'年轻人,这行我干了十年,有些事得跟你说说。'";
      }
    },
    {
      id: "d686_social_wellbeing",
      phase: "street",
      _isChainEvent: false,
      icon: "💚",
      title: "社交的温度",
      story: "朋友的陪伴是最好的保健品",
      triggers: { minDay: 50, interval: 70, maxRepeats: 3, excludeFlags: ["_d686WellCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._d686WellCd) return false;
        return metNpcCount(st) >= 2 && st.player && st.player.day >= 50;
      },
      choices: [
        {
          text: "😊 珍惜友情",
          hint: "心情+8,健康+3,置_d686Cherish",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d686WellCd = true;
            st.flags._d686Cherish = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友是最好的保健品。心情+8,健康+3。", "success");
            }
          }
        },
        {
          text: "📱 约线下见面",
          hint: "社交XP+5,好感+3,置_d686Meet",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d686WellCd = true;
            st.flags._d686Meet = true;
            if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
            bumpAff(st, topMetNpc(st), 3, "线下见面");
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📱 线上千言,不如线下一次。社交XP+5,好感+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "和" + metNpcCount(st) + "个朋友相处的点滴——'在这个城市里,有人惦记的感觉真好。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
