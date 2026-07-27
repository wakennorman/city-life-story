/**
 * 域G(核心机制/生命周期) 联动增强 R353
 * 第十二轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→H  life_company_milestone_v2   人生→公司里程碑（公司·时间积累）
 *   G→A  life_data_dashboard_v2       人生→数据面板（数据/数值·信息中枢）
 *   G→C  life_career_milestone_v4     人生→职业里程碑（职业/成长·时间积累）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR353Loaded) return;
  RANDOM_EVENTS._domainGLinkageR353Loaded = true;

  var EVENTS = [
    {
      id: "life_company_milestone_v2",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "人生节点与公司里程碑v2",
      story: "你发现，人生的重要节点总是与公司的发展密切相关。\n\n第一次入职时你是普通员工，第一次晋升时你成了管理者，第一次创业时你成了创始人。人生的每一步，都在为公司的发展铺路。\n\n你开始理解，人生和事业不是两条平行线，而是相互交织的螺旋。",
      triggers: { minDay: 700, excludeFlags: ["_lifeCompanyMilestoneV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.valuation || 0) >= 3000000;
      },
      choices: [
        {
          text: "🏢 记录这个交汇点",
          hint: "心智+15，公司声誉+14",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyMilestoneV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 14;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你记录了人生与事业的交汇点。人生和事业是相互交织的螺旋。心智+15，声誉+14。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyMilestoneV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "life_data_dashboard_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生数据面板v2",
      story: "你打开人生数据面板，看到自己这些年的全方位关键指标——工作、收入、健康、社交、技能、投资、公司。\n\n这些数字和图表，是你在这座城市存在过的全方位证据。每一个指标都是一段真实经历的浓缩。\n\n你开始用数据「理解」自己的人生，而不是用感觉。",
      triggers: { minDay: 800, excludeFlags: ["_lifeDataDashV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 800;
      },
      choices: [
        {
          text: "📊 设置人生数据面板",
          hint: "心智+16，置数据面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataDashV2Seen = true;
            st.flags._lifeDataDashboardV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 16);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了人生数据面板。数据让人生变得全面可见。心智+16。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataDashV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得随遇而安就好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "life_career_milestone_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "人生职业里程碑v4",
      story: "你发现，人生的重要节点总是伴随着职业发展的关键时刻。\n\n第一次入职时你是普通员工，第一次晋升时你成了管理者，第一次创业时你成了创始人。人生的每一步，都在为职业发展创造可能。\n\n你开始理解，人生和事业不是两条平行线，而是相互交织的螺旋。",
      triggers: { minDay: 650, excludeFlags: ["_lifeCareerMilestoneV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 600;
      },
      choices: [
        {
          text: "🎯 记录职业里程碑",
          hint: "最高技能XP+18，心智+13",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneV4Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你记录了职业里程碑。人生和事业是相互交织的螺旋。技能XP+18，心智+13。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
