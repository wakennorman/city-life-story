/**
 * 域H(Phase2/公司/创业) 联动增强 R193
 * 承接本轮 A类修复：
 *   ① startup_events.js STARTUP_FIELD_MAP 补 revenue —— company.revenue 现在真正累积（营收里程碑事件才有意义）；
 *   ② events_corp.js .exp→.xp —— 管理技能 XP 现在真正生效（管理成长事件才有意义）。
 * 桥接：
 *   H→E: 公司营收创新高 → 经营现金流敏感度迁移为个人理财意识（corp_h_r193_revenue_windfall）
 *   H→D: 年终给核心团队发奖/请客 → 深化与一位已结识职场伙伴的好感（corp_h_r193_team_reward）
 *   H→C: 复盘带团队的历练 → 管理技能沉淀（corp_h_r193_leadership_growth）
 * 范式：照 domain_h_linkage_r188.js 已验证 IIFE 注入范式——phase:"corporate"、RANDOM_EVENTS 守卫、
 *   conditions 全字段防御、gameOver 闸门；引擎不自动扣 cost（仅禁用按钮），扣费在 apply 内手动执行。数值标 [PLACEHOLDER]。
 * 真实字段核实：现金 st.resources.cash；心智 st.player.mental；幸福 st.needs.happiness；
 *   创业公司 st.startup.company（.cashReserve/.revenue/.employees）；职级 st.corporate.rank；
 *   NPC 好感走 applyAffinityChange 守 rel.met（域D铁律，只读 st.relationships）；技能 XP 走 addSkillXp(key,amount)。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._corpLinkR193Loaded) return;
  RANDOM_EVENTS._corpLinkR193Loaded = true;

  // 取首个已结识 NPC（域D铁律：只读 relationships + rel.met；避免硬编码未激活 NPC 造死事件）
  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  // 是否处于公司/创业阶段
  function inCorp(st) {
    return !!(
      (st.corporate && st.corporate.rank) ||
      (st.startup && st.startup.company)
    );
  }

  var EVENTS = [
    {
      // H→E: 承接 revenue 修复 —— 公司营收累积创新高，把经营者的现金流敏感度迁移成个人理财意识
      id: "corp_h_r193_revenue_windfall",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📈",
      title: "营收创新高之后",
      story:
        "季度报表出来，公司营收创下新高。看着账面上滚动的数字，你忽然意识到：管钱这件事，公司和个人其实是相通的。既然能把公司现金流盘活，为什么不给自己也留一份『经营账』？是时候把这份对数字的敏感，用到自己的钱袋子上了。",
      triggers: { minDay: 45, excludeFlags: ["_corpRevenueWindfallSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false; // [Layer4] 死亡/破产后不触发
        if (!st.resources) return false;
        // 需创业公司营收累积达到里程碑（承接本轮 revenue 字段修复，此前恒 0 → 该门槛不可达）
        var co = st.startup && st.startup.company;
        if (!co || (co.revenue || 0) < 100000) return false; // [PLACEHOLDER] 营收里程碑
        return true;
      },
      choices: [
        {
          text: "📈 复用经营思维，开始打理个人财务",
          hint: "现金+，开启投资本金意识",
          apply: function (st) {
            st.flags._corpRevenueWindfallSeen = true;
            st.resources.cash = (st.resources.cash || 0) + 8000; // [PLACEHOLDER] 分红/提成
            st.flags._dataInvestorMindset = true; // H→E: 复用投资意识 flag，供经济/投资域事件门控
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "📈 你把经营公司的那套现金流思维搬到了自己身上——第一次认真规划起个人的『经营账』。",
                "success",
              );
          },
        },
        {
          text: "🎉 先犒劳一下自己和团队",
          hint: "士气/心情↑，现金-",
          cost: 3000,
          apply: function (st) {
            st.flags._corpRevenueWindfallSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 3000); // 引擎不自动扣，手动扣 [PLACEHOLDER]
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🎉 营收新高，先痛快庆祝一场——理财的事，来日方长。",
                "info",
              );
          },
        },
      ],
    },
    {
      // H→D: 年终给一路陪跑的核心伙伴发奖/请客，深化职场社交关系（域D铁律：applyAffinityChange 守 rel.met）
      id: "corp_h_r193_team_reward",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧧",
      title: "给团队的一份心意",
      story:
        "年关将近，你盘算着这一年团队一路陪你扛过来的日子。有个人尤其让你记挂——关键时刻从没掉过链子。发一份实在的奖金，或者请大家搓一顿，把这份并肩的情谊落到实处，值不值？",
      triggers: { minDay: 35, excludeFlags: ["_corpTeamRewardSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        if (!inCorp(st)) return false;
        // H→D: 需已结识至少一位职场伙伴（域D铁律）
        if (firstMetNpc(st) === null) return false;
        return true;
      },
      choices: [
        {
          text: "🧧 发一份实在的奖金，走心道谢",
          hint: "好感大幅+，现金-",
          cost: 2000,
          apply: function (st) {
            st.flags._corpTeamRewardSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000); // [PLACEHOLDER] 手动扣
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function")
              applyAffinityChange(st, nid, 9, "年终的一份心意"); // [PLACEHOLDER] 好感增量
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🧧 一份实在的奖金递过去，对方眼眶都热了——这份并肩打拼的交情，比什么都金贵。",
                "success",
              );
          },
        },
        {
          text: "🙏 口头表扬，心意到了就行",
          hint: "关系小幅+，不花钱",
          apply: function (st) {
            st.flags._corpTeamRewardSeen = true;
            var nid = firstMetNpc(st);
            if (nid && typeof applyAffinityChange === "function")
              applyAffinityChange(st, nid, 3, "一句真诚的肯定"); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🙏 你当众肯定了他这一年的付出——话不多，却也让人心里暖。",
                "info",
              );
          },
        },
      ],
    },
    {
      // H→C: 承接 .exp→.xp 修复 —— 带团队的历练沉淀为真实的管理技能成长（职业/成长域）
      id: "corp_h_r193_leadership_growth",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🧭",
      title: "带队一年的复盘",
      story:
        "夜深人静，你翻着这一年的会议纪要和项目复盘——从手忙脚乱到能稳住阵脚，带团队这件事，你确实成长了不少。把这些踩过的坑、悟出的门道认真梳理一遍，管理这门手艺，才算真正长进了心里。",
      triggers: { minDay: 40, excludeFlags: ["_corpLeadershipGrowthSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!inCorp(st)) return false;
        return true;
      },
      choices: [
        {
          text: "🧭 认真复盘，沉淀管理心得",
          hint: "管理技能XP+，心智↑",
          apply: function (st) {
            st.flags._corpLeadershipGrowthSeen = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 12); // [PLACEHOLDER] 承接 .xp 修复，管理XP真实生效
            if (st.player)
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🧭 一年的带队经验被你梳理成了自己的方法论——管理这门手艺，真正长进了心里。",
                "success",
              );
          },
        },
        {
          text: "😌 过去的就翻篇，向前看",
          hint: "心情略缓",
          apply: function (st) {
            st.flags._corpLeadershipGrowthSeen = true;
            if (st.needs)
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "😌 你合上笔记本——有些成长不必刻意总结，路还长着呢。",
                "info",
              );
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
