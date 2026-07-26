/**
 * 域H(Phase2/公司) 联动增强 R410
 * 第十七轮循环——把隐藏在corp_ops/team/promo中的数据转化为叙事体验。
 * 桥接：
 *   H→C  h410_leadership_growth     领导力成长 → 消费 corporate+management 数据,
 *     管理实践→"带团队带出领导力"的职业成长叙事
 *   H→F  h410_team_viz              团队可视化 → 消费 team 数据,
 *     把团队成员状态→"我的团队如何"的UI洞察
 *   H→A  h410_corp_efficiency        企业效率 → 消费 corporate+perf 数据,
 *     经营数据→"企业运转效率"的数据画像
 *
 * 严格照 domain_h_linkage_r404.js / r393.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR410Loaded) return;
  RANDOM_EVENTS._domainHLinkageR410Loaded = true;

  // 安全技能经验
  function grantSkillXpR410(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // H→C: 领导力成长 — 消费 corporate+management
      id: "h410_leadership_growth",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👔",
      title: "领导力成长",
      story:
        "带团队的经历让你成长——{leadershipText}\n\n管理是一门需要实践的艺术。",
      triggers: { minDay: 80, excludeFlags: ["_h410LeadershipCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "📚 把实践转化为管理智慧",
          hint: "management XP+6,心智+4,置 _h410LeadershipCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h410LeadershipCooldown = true;
            grantSkillXpR410("management", 6);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("👔 你把管理实践转化为智慧——领导力在实战中成长。管理XP+6,心智+4。", "success");
          }
        },
        {
          text: "😊 带团队就是责任心",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var text = "从执行者到管理者,角色在变,责任在增";
        if (st.player.corporate.daysInJob > 180) {
          text = "带团队已超过半年,你逐渐找到了自己的管理风格";
        }
        return "带团队的经历让你成长——" + text + "。\n\n管理是一门需要实践的艺术。";
      }
    },
    {
      // H→F: 团队可视化 — 消费 team 数据
      id: "h410_team_viz",
      phase: "corporate",
      _isChainEvent: false,
      icon: "👥",
      title: "团队概览",
      story:
        "你查看了团队状态——{teamSummary}\n\n团队是企业最重要的资产。",
      triggers: { minDay: 70, excludeFlags: ["_h410TeamVizCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.corporate && st.corporate.team && st.corporate.team.length > 0) ||
               (st.player && st.player.corporate);
      },
      choices: [
        {
          text: "📊 用数据管理团队",
          hint: "心智+3,management XP+3,置 _h410TeamVizCooldown(80天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h410TeamVizCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            grantSkillXpR410("management", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("👥 你用数据审视团队——人才是企业最重要的资产。心智+3,管理XP+3。", "success");
          }
        },
        {
          text: "🤷 用心感受团队就好",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var summary = "团队正在建设中";
        if (st.corporate && st.corporate.team && st.corporate.team.length > 0) {
          var cnt = st.corporate.team.length;
          summary = "当前团队" + cnt + "人,是企业发展的基石";
        }
        return "你查看了团队状态——" + summary + "。\n\n团队是企业最重要的资产。";
      }
    },
    {
      // H→A: 企业效率 — 消费 corporate+perf
      id: "h410_corp_efficiency",
      phase: "corporate",
      _isChainEvent: false,
      icon: "⚙️",
      title: "企业运转效率",
      story:
        "你分析了企业的运转效率——{efficiencyText}\n\n效率是企业的生命力。",
      triggers: { minDay: 90, excludeFlags: ["_h410EffCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "📈 持续优化运营效率",
          hint: "心智+4,accounting XP+3,置 _h410EffCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h410EffCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            grantSkillXpR410("accounting", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("⚙️ 你分析企业效率——持续优化是经营者的必修课。心智+4,会计XP+3。", "success");
          }
        },
        {
          text: "😅 效率不是唯一目标",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var text = "企业运转正在步入正轨";
        var corp = st.player.corporate;
        if (typeof corp.kpi === "number") {
          text = corp.kpi >= 80 ? "KPI表现优秀,企业运转良好" :
                 corp.kpi >= 50 ? "KPI达标,仍有提升空间" : "KPI偏低,需要重点关注";
        }
        return "你分析了企业的运转效率——" + text + "。\n\n效率是企业的生命力。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
