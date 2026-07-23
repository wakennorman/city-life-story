/**
 * 域H(Phase2/公司/创业) 联动增强 R188
 * 桥接：H→E(创业股权套现→投资本金意识) / H→D(联合创始人共渡难关→NPC好感) / H→G(创业者身心透支→人生反思/健康)
 * 严格照 events_corp.js / domain_h_linkage_r170.js 已验证 IIFE 注入范式：
 *   phase:"corporate"（创业与公司职业均在 corporate 阶段）、RANDOM_EVENTS 守卫、conditions 全字段防御、gameOver 闸门。
 * 引擎不自动扣 cost（仅禁用按钮），扣费在 apply 内手动执行。数值标 [PLACEHOLDER]，待平衡。
 * 真实字段核实：现金 st.resources.cash；心智 st.player.mental；幸福 st.needs.happiness；健康/疲劳 st.needs.*；
 *   创业公司 st.startup.company（.cashReserve/.employees）；职级 st.corporate.rank；NPC 好感走 applyAffinityChange 守 rel.met。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._corpLinkR188Loaded) return;
  RANDOM_EVENTS._corpLinkR188Loaded = true;

  var EVENTS = [
    {
      // H→E: 创业积累（现金流/股权）迁移到个人投资本金意识
      id: "corp_h_r188_equity_cashout",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💰",
      title: "股权套现的诱惑",
      story:
        "公司账上现金渐宽，一位投资人私下找你，愿意按估值收购你手里的一小部分股权。套现一笔，你就能给自己攒下第一桶『体外资金』——放进个人投资账户，也算给未来留条后路。但股权是公司的根，卖多少、卖不卖，得想清楚。",
      triggers: { minDay: 40, excludeFlags: ["_corpEquityCashoutSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false; // [Layer4] 死亡/破产后不触发
        if (!st.resources) return false;
        // 需处于创业/公司阶段且有一定资本沉淀
        var hasStartup =
          st.startup && st.startup.company && (st.startup.company.cashReserve || 0) >= 30000; // [PLACEHOLDER] 创业现金门槛
        var isSeniorCorp =
          st.corporate &&
          ["P7", "P8", "P9", "P10"].indexOf(st.corporate.rank) >= 0; // 或高职级有股权激励
        if (!hasStartup && !isSeniorCorp) return false;
        return true;
      },
      choices: [
        {
          text: "💰 套现一部分，转入个人投资",
          hint: "现金+，开启投资本金意识",
          apply: function (st) {
            st.flags._corpEquityCashoutSeen = true;
            st.resources.cash = (st.resources.cash || 0) + 20000; // [PLACEHOLDER] 套现金额
            st.flags._dataInvestorMindset = true; // H→E: 复用投资意识 flag，供经济/投资域事件门控
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "💰 你套现了一小部分股权，第一笔『体外资金』落进了投资账户——心里踏实多了。",
                "success",
              );
          },
        },
        {
          text: "🛡️ 一股不卖，守住公司",
          hint: "掌控感↑，心智+",
          apply: function (st) {
            st.flags._corpEquityCashoutSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🛡️ 你婉拒了收购——这是你亲手带大的公司，暂时还不到分家的时候。",
                "info",
              );
          },
        },
      ],
    },
    {
      // H→D: 与联合创始人/核心伙伴共渡难关，深化职场社交关系
      id: "corp_h_r188_cofounder_bond",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "并肩作战的夜晚",
      story:
        "又是一个通宵。你和老搭档为了赶下一版方案，在办公室啃着外卖、改到凌晨。忙到最后两人相视一笑——这种并肩作战的默契，是钱买不来的。要不要趁这个机会，好好谢谢这位一路陪你熬过来的伙伴？",
      triggers: { minDay: 30, excludeFlags: ["_corpCofounderBondSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // H→D: 需已结识职场前辈 boss_li（域D铁律：只读 relationships + rel.met 守卫）
        if (!st.relationships || !st.relationships.boss_li || !st.relationships.boss_li.met)
          return false;
        // 需处于公司/创业阶段
        var inCorp =
          (st.corporate && st.corporate.rank) ||
          (st.startup && st.startup.company);
        if (!inCorp) return false;
        return true;
      },
      choices: [
        {
          text: "🤝 请他吃顿好的，走心道谢",
          hint: "好感大幅+，现金-",
          cost: 500,
          apply: function (st) {
            st.flags._corpCofounderBondSeen = true;
            st.resources.cash = Math.max(0, (st.resources.cash || 0) - 500); // [PLACEHOLDER] 引擎不自动扣，手动扣
            if (typeof applyAffinityChange === "function")
              applyAffinityChange(st, "boss_li", 8, "并肩作战的道谢"); // [PLACEHOLDER] 好感增量
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🤝 一顿深夜大餐，两人聊到天亮。这份并肩打拼的交情，比任何合同都牢靠。",
                "success",
              );
          },
        },
        {
          text: "😴 心领了，各自回去补觉",
          hint: "务实，疲劳略缓",
          apply: function (st) {
            st.flags._corpCofounderBondSeen = true;
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "😴 你俩拍拍肩膀各自回家——话不必多，懂的都懂。",
                "info",
              );
          },
        },
      ],
    },
    {
      // H→G: 创业者长期高压→身心透支的人生反思（核心机制/生命周期）
      id: "corp_h_r188_founder_burnout",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🕯️",
      title: "深夜的自我盘问",
      story:
        "连轴转了太久，某个加班的深夜，你忽然停下来问自己：这么拼，到底是为了什么？身体在报警，情绪也快见底。事业固然重要，可人这台机器，也需要检修保养。是时候认真对待自己的状态了。",
      triggers: { minDay: 50, excludeFlags: ["_corpFounderBurnoutSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs) return false;
        // 需处于公司/创业阶段
        var inCorp =
          (st.corporate && st.corporate.rank) ||
          (st.startup && st.startup.company);
        if (!inCorp) return false;
        // 触发闸门：身心已承压（健康偏低或疲劳偏高）
        var strained =
          (st.needs.health || 100) < 55 || (st.needs.fatigue || 0) > 60; // [PLACEHOLDER] 承压阈值
        if (!strained) return false;
        return true;
      },
      choices: [
        {
          text: "🕯️ 停下来，给自己放个假",
          hint: "健康/心智回升，开启健康自觉",
          apply: function (st) {
            st.flags._corpFounderBurnoutSeen = true;
            if (st.needs) {
              st.needs.health = Math.min(100, (st.needs.health || 50) + 12); // [PLACEHOLDER]
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 6);
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            st.flags._founderHealthAwareness = true; // H→G: 健康自觉 flag，供生命节点/核心机制域读取
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🕯️ 你给自己放了个短假，身心都缓了过来——原来慢下来，也是一种能力。",
                "success",
              );
          },
        },
        {
          text: "🔥 咬牙硬扛，事业要紧",
          hint: "短期冲劲，但透支加剧",
          apply: function (st) {
            st.flags._corpFounderBurnoutSeen = true;
            if (st.needs) {
              st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 8); // [PLACEHOLDER]
              st.needs.health = Math.max(0, (st.needs.health || 50) - 4);
            }
            if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 3);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🔥 你把疲惫按了下去，继续埋头往前冲——但身体的账，迟早是要还的。",
                "warning",
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
