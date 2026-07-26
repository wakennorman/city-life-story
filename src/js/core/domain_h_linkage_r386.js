/**
 * 域H(Phase2/公司) 联动增强 R386
 * 第十六轮循环——公司经营者的社会资本回响。
 * 桥接：
 *   H→E  founder_investment_confidence   创始人→投资信心（经济·经营阅历变现）
 *   H→D  workplace_friendship_bridge     职场→NPC社交（社交·同事圈层外延）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainHLinkageR386Loaded) return;
  RANDOM_EVENTS._domainHLinkageR386Loaded = true;

  // 安全改好感
  function safeAffinity(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "R386域H联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 获取第一个好感达阈值的NPC ID
  function firstHighAffNpc(st, minAff) {
    minAff = minAff || 30;
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= minAff) return id;
      }
    }
    return null;
  }

  var EVENTS = [
    {
      // H→E: 创业者的投资直觉（经营阅历→投资信心）
      id: "founder_investment_confidence",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "经营者的盘感",
      story: "你坐在办公室里,看着公司最新的财务报表——营收、成本、现金流,每一个数字你都烂熟于心。\n\n你忽然意识到:这些年经营公司练出的「盘感」,其实也是一种投资直觉。读懂财报、判断行业趋势、感知市场情绪——这些能力在股市里同样管用。\n\n「开公司教会你的,不只是管人,还有读懂数字背后的逻辑。」",
      triggers: { minDay: 600, excludeFlags: ["_founderInvestConfSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        // 公司有一定经营积累(营收≥10万或存活≥180天)
        var co = st.startup.company;
        if ((co.revenue || 0) < 100000 && (st.player.day - (co.foundedDay || 0)) < 180) return false;
        return true;
      },
      choices: [
        {
          text: "📊 把盘感用在投资上,小仓位试水",
          hint: "心智+8,置_dataInvestorMindset投资意识",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._founderInvestConfSeen = true;
            st.flags._dataInvestorMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你开始把经营公司的盘感用在投资上。读懂数字的能力是相通的。心智+8,投资意识觉醒。", "success");
            }
          },
        },
        {
          text: "🤝 专注主业,不碰投资",
          hint: "心智+4,公司专注度+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._founderInvestConfSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.startup && st.startup.company) st.startup.company.focus = (st.startup.company.focus || 0) + 5;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你决定专注主业,不被投资分心。心智+4,公司专注度+5。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      // H→D: 同事圈层外延（职场社交→NPC关系）
      id: "workplace_friendship_bridge",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "同事的朋友圈",
      story: "公司年会上,你注意到几个同事带来了自己的朋友——有做销售的、有开餐馆的、有跑运输的。\n\n「这是小王,我大学同学,现在在做建材。」同事介绍你们认识。\n\n你忽然发现:职场不只是工作场,也是社交圈的延伸。同事的朋友,可能成为你人生中的贵人。",
      triggers: { minDay: 400, excludeFlags: ["_workplaceFriendBridgeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        // 需要至少2个同事
        var team = st.corporate && st.corporate.team ? st.corporate.team : [];
        if (team.length < 2) return false;
        // 需要至少1个已结识NPC(社交基础)
        var npc = firstHighAffNpc(st, 20);
        if (!npc) return false;
        return true;
      },
      choices: [
        {
          text: "🤝 主动认识,交换联系方式",
          hint: "首个已结识NPC好感+5,心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._workplaceFriendBridgeSeen = true;
            var npc = firstHighAffNpc(st, 20);
            if (npc) safeAffinity(st, npc, 5, "同事朋友圈");
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤝 你主动认识了同事的朋友,交换了联系方式。职场社交圈在扩展。好感+5,心智+6。", "success");
            }
          },
        },
        {
          text: "🍻 喝酒就好,不谈业务",
          hint: "心情+6,心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._workplaceFriendBridgeSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🍻 你只管喝酒,不谈业务。心情+6,心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
