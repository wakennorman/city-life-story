/**
 * 域E(经济/投资) 联动增强 R1027
 * — E→C 投资技能树 / E→D 投资圈社交 / E→F 资产可视化
 *
 * 设计意图：投资数据消费到其他域，让玩家感知到投资能力的跨域影响。
 * 1. 投资经验积累 → 解锁职业技能成长
 * 2. 资产规模 → 打开高端社交圈
 * 3. 投资组合多样性 → 提供UI数据
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase；全 || 防御；
 *       done-flag 防重；NPC 一律 met 铁律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainELinkageR1027Loaded) return;
  RANDOM_EVENTS._domainELinkageR1027Loaded = true;

  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info");
  }
  function gx(k, a) {
    if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} }
  }

  var EVENTS = [
    // ===== 1. E→C 投资技能树 =====
    {
      id: "e1027_invest_skill_tree",
      phase: "street",
      icon: "🌳",
      title: "投资能力反哺职业技能",
      story: "你在投资市场摸爬滚打了一段时间，渐渐发现了一个有趣的现象——\n\n你的投资能力，居然在工作上帮了大忙。\n\n做项目时，你更懂得评估ROI了；\n跟客户谈判时，你更懂财务逻辑了；\n在管理团队时，你更懂资源配置了。\n\n钱不只是钱——钱是教你如何思考的工具。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e1027SkillTreeDone) return false;
        var inv = st.investment || {};
        var totalValue = 0;
        if (inv.portfolio) totalValue = inv.portfolio.totalValue || 0;
        return totalValue >= 50000 && st.player.day >= 80;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "📈 把投资经验用到工作上",
          hint: "管理XP+50, 会计XP+30",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e1027SkillTreeDone = true;
            gx("management", 50);
            gx("accounting", 30);
            msg("📈 你把投资经验应用到工作中，管理能力大幅提升。管理EXP+50，会计EXP+30。", "success");
          },
        },
        {
          text: "📝 总结投资方法论",
          hint: "智力+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e1027SkillTreeDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 5);
            msg("📝 你总结了一套自己的投资方法论。智力+5。", "info");
          },
        },
      ],
    },

    // ===== 2. E→D 投资圈社交 =====
    {
      id: "e1027_invest_circle",
      phase: "street",
      icon: "🏛️",
      title: "进入了投资圈",
      story: "你的资产到了一定规模后，开始收到一些邀请——\n\n「xx私募路演，诚邀您参加」\n「xx高净值客户沙龙」\n「xx行业闭门分享会」\n\n以前这些邀请永远不会出现在你的邮箱里。\n\n现在，你开始被当作「有资格的人」对待了。\n\n这个圈子里的信息，比外面早三天。\n\n三天，在投资市场里，就是天堂和地狱的距离。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e1027InvestCircleDone) return false;
        var inv = st.investment || {};
        var totalValue = 0;
        if (inv.portfolio) totalValue = inv.portfolio.totalValue || 0;
        return totalValue >= 100000 && st.player.day >= 100;
      },
      probability: 0.02,
      repeatable: false,
      choices: [
        {
          text: "🎩 参加沙龙",
          hint: "名气+8, 客户线索+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e1027InvestCircleDone = true;
            if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            var cap = typeof ensureCareerCapital === "function" ? ensureCareerCapital(st) : null;
            if (cap) {
              cap.clientLeads = Math.min(100, (cap.clientLeads || 0) + 5);
              if (typeof clampCareerCapital === "function") clampCareerCapital(cap);
            }
            msg("🎩 参加投资沙龙认识了很多人。名气+8，客户线索+5。", "success");
          },
        },
        {
          text: "📚 先学习再社交",
          hint: "会计XP+50, 智力+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e1027InvestCircleDone = true;
            gx("accounting", 50);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
            msg("📚 你决定先把基本功练扎实再去社交。会计EXP+50，智力+3。", "info");
          },
        },
      ],
    },

    // ===== 3. E→F 资产可视化 =====
    {
      id: "e1027_asset_visualization",
      phase: "street",
      icon: "📊",
      title: "你的资产版图",
      story: "你坐下来，认真审视自己的资产版图——\n\n现金、股票、比特币、房产、收藏品……\n\n每一笔投资的背后，都有一个故事。\n\n那笔在低谷时买入的股票，\n那套在所有人都说房价要跌时入手的房子，\n那个在路边摊淘到的被低估的藏品……\n\n你的资产不只是数字——\n它们是你看待世界的方式的投影。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._e1027AssetVizDone) return false;
        var inv = st.investment || {};
        var assetCount = 0;
        if (Array.isArray(inv.stockHoldings) && inv.stockHoldings.length > 0) assetCount += inv.stockHoldings.length;
        if (Array.isArray(inv.properties) && inv.properties.length > 0) assetCount += inv.properties.length;
        if (Array.isArray(inv.cars) && inv.cars.length > 0) assetCount += inv.cars.length;
        if ((inv.btcHoldings || 0) > 0) assetCount += 1;
        return assetCount >= 3 && st.player.day >= 60;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "📊 优化资产配置",
          hint: "会计XP+60, 心智+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e1027AssetVizDone = true;
            gx("accounting", 60);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            msg("📊 你优化了资产配置结构。会计EXP+60，心智+5。", "success");
          },
        },
        {
          text: "📝 记录投资心得",
          hint: "智力+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._e1027AssetVizDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
            msg("📝 你记录了这一路的投资心得。智力+3。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    if (typeof RANDOM_EVENTS.push === "function") {
      RANDOM_EVENTS.push(EVENTS[i]);
    }
  }
})();