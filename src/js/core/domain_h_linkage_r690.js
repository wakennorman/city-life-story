/**
 * 域H(Phase2/公司) 联动增强 R690
 * 桥接：
 *   H→G  h690_founder_reflection      创始人反思 → 消费 state.startup+state.player+state.needs,
 *     创业者的自我审视与成长
 *   H→A  h690_corp_kpi_dashboard     公司KPI仪表盘 → 消费 state.startup,
 *     公司经营数据可视化叙事
 *   H→D  h690_corp_team_bonding      公司团队凝聚力 → 消费 state.startup+state.relationships,
 *     团队关系影响外部社交
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR690Loaded) return;
  RANDOM_EVENTS._domainHLinkageR690Loaded = true;

  function hasCompany(st) {
    return st && st.startup && st.startup.company && st.startup.active;
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
      id: "h690_founder_reflection",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🪞",
      title: "创始人的自我审视",
      story: "创业是一场自我修行",
      triggers: { minDay: 200, interval: 180, maxRepeats: 2, excludeFlags: ["_h690ReflectCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h690ReflectCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 200;
      },
      choices: [
        {
          text: "📝 写创业日记",
          hint: "心智+6,管理XP+4,置_h690Diary",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h690ReflectCd = true;
            st.flags._h690Diary = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📝 创业是一场自我修行,日记是最好的复盘。心智+6,管理XP+4。", "success");
            }
          }
        },
        {
          text: "🚀 继续冲",
          hint: "智力+4,置_h690Grind",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h690ReflectCd = true;
            st.flags._h690Grind = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 时间不等人,继续冲!智力+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "夜深人静,你问自己——'创业是为了什么?现在的我,还是当初那个我吗?'";
      }
    },
    {
      id: "h690_corp_kpi_dashboard",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司KPI仪表盘",
      story: "用数据审视公司的健康状况",
      triggers: { minDay: 150, interval: 120, maxRepeats: 3, excludeFlags: ["_h690KpiCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h690KpiCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 150;
      },
      choices: [
        {
          text: "📈 深度复盘",
          hint: "管理XP+6,智力+3,置_h690Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h690KpiCd = true;
            st.flags._h690Review = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 6); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 数据不会说谎,复盘是进步的阶梯。管理XP+6,智力+3。", "success");
            }
          }
        },
        {
          text: "✅ 快速扫描",
          hint: "智力+2,置_h690Scan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h690KpiCd = true;
            st.flags._h690Scan = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✅ 大方向没问题,继续推进。智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var name = (st.startup && st.startup.company && st.startup.company.name) ? st.startup.company.name : "公司";
        return name + "的KPI仪表盘——'数据是经营的指南针,每个数字背后都是团队的努力。'";
      }
    },
    {
      id: "h690_corp_team_bonding",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "团队是一家人",
      story: "公司不只是工作的地方",
      triggers: { minDay: 180, interval: 150, maxRepeats: 2, excludeFlags: ["_h690BondCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._h690BondCd) return false;
        return hasCompany(st) && st.player && st.player.day >= 180;
      },
      choices: [
        {
          text: "🎉 组织团建",
          hint: "管理XP+5,心情+6,置_h690Party",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h690BondCd = true;
            st.flags._h690Party = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 一起扛过事,才是一家人。管理XP+5,心情+6。", "success");
            }
          }
        },
        {
          text: "💼 保持专业",
          hint: "心智+4,置_g690Pro",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h690BondCd = true;
            st.flags._h690Pro = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💼 专业是最好的尊重。心智+4。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "看着团队加班的身影——'公司不只是工作的地方,这是一段共同的故事。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
