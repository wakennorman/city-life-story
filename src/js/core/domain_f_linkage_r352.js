/**
 * 域F(UI/UX) 联动增强 R352
 * 第十二轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→H  ui_company_dashboard_v4     公司→仪表盘（公司·经营可视化）
 *   F→C  ui_career_path_v3           职业→路径导航（职业/成长·导航升级）
 *   F→D  ui_npc_relationship_web_v2  NPC→关系网（NPC/社交·可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR352Loaded) return;
  RANDOM_EVENTS._domainFLinkageR352Loaded = true;

  var EVENTS = [
    {
      id: "ui_company_dashboard_v4",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司仪表盘v4",
      story: "你打开公司仪表盘，看到营收、利润、现金流、团队效率、市场份额等关键经营指标的实时数据。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 600, excludeFlags: ["_uiCompanyDashV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 200000;
      },
      choices: [
        {
          text: "📊 设置经营预警系统",
          hint: "心智+14，公司声誉+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 14);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 12;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了经营预警系统。数据让经营更精准。心智+14，声誉+12。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyDashV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得大概看看就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_career_path_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🧭",
      title: "职业路径导航v3",
      story: "你打开职业路径导航，看到自己当前的职业位置和所有可选的发展方向。\n\n每一条路径都有清晰的要求、预期收入、和发展前景。你不再盲目试错，而是有目标地前进。\n\n「选择比努力更重要」——当你有了导航，走路就不再是赌博。",
      triggers: { minDay: 550, excludeFlags: ["_uiCareerPathV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        return job && job.path ? true : false;
      },
      choices: [
        {
          text: "🧭 探索更多职业方向",
          hint: "心智+12，置职业导航flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathV3Seen = true;
            st.flags._careerPathfinderV3 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧭 你探索了更多职业方向。有导航的走路不是赌博。心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 走好眼前的路就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCareerPathV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得走好眼前的路就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_npc_relationship_web_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "NPC关系网v2",
      story: "你打开NPC关系网，看到自己认识的NPC之间的关系——谁和谁关系好、谁和谁有矛盾、谁是关键节点。\n\n这些关系在网图上可视化，让你发现了一些以前没注意到的社交结构。你开始理解，社交不是点对点的连线，而是一张复杂的网。",
      triggers: { minDay: 650, excludeFlags: ["_uiNpcWebV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var metNpcs = 0;
        for (var id in st.relationships) if (st.relationships[id] && st.relationships[id].met) metNpcs++;
        return metNpcs >= 9;
      },
      choices: [
        {
          text: "🕸️ 整理成关系网",
          hint: "心智+13，解锁关系网flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiNpcWebV2Seen = true;
            st.flags._npcRelationshipWebV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🕸️ 你整理了NPC关系网。社交是张网，你是网上的节点。心智+13。", "success");
            }
          },
        },
        {
          text: "🤷 不用整理，心里有数",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiNpcWebV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用整理。心智+3。", "info");
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
