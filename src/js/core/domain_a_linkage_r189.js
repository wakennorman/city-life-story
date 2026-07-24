/**
 * 域A(数据/数值平衡) 联动增强 R189
 * 主题承接本轮A类修复：地点「招牌商品/价格倍率」交易系统（specialties/priceMod 修复后真正生效）。
 * 桥接：A→D(摸清货源门道→荐给街坊 auntie_lin) / A→C(常年练摊比价→议价眼力 sales技能) / A→E(小本倒货攒的现金→投资本金意识)
 * 严格照 domain_h_linkage_r188.js / domain_a_linkage_r171.js 已验证 IIFE 注入范式：
 *   显式 phase、RANDOM_EVENTS 守卫、conditions 全字段防御、gameOver 闸门、引擎不自动扣 cost(apply 内手动扣)。
 * 真实字段核实：现金 st.resources.cash；心智 st.player.mental；幸福 st.needs.happiness；
 *   销售技能键 "sales"(addSkillXp 白名单内)；NPC 好感走 applyAffinityChange 守 rel.met(域D铁律，只读 relationships)；
 *   投资意识复用 _dataInvestorMindset flag。数值标 [PLACEHOLDER]，待平衡。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._dataLinkR189Loaded) return;
  RANDOM_EVENTS._dataLinkR189Loaded = true;

  var EVENTS = [
    {
      // A→D: 摸清各地招牌好货/价格门道后，把靠谱货源介绍给街坊林阿姨（承接 specialties/priceMod 修复）
      id: "data_a_r189_source_share",
      phase: "street",
      _isChainEvent: false,
      icon: "🛒",
      title: "识货荐友",
      story:
        "跑了这些日子的市场，你渐渐摸清了门道——哪个市场的菜最新鲜、哪家的价钱最实在、什么时候去能捡到当天的招牌货。楼下的林阿姨还在为买贵了发愁，你要不要把这套『省钱地图』分享给她？",
      triggers: { minDay: 12, excludeFlags: ["_dataSourceShareSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        // A→D 域D铁律：只读 relationships + rel.met 守卫（auntie_lin 为可激活市井NPC）
        var rel = st.relationships && st.relationships.auntie_lin;
        if (!rel || !rel.met) return false;
        return true;
      },
      choices: [
        {
          text: "🛒 把省钱门道全告诉她",
          hint: "好感+，街坊情谊",
          apply: function (st) {
            st.flags._dataSourceShareSeen = true;
            if (typeof applyAffinityChange === "function")
              applyAffinityChange(st, "auntie_lin", 6, "分享省钱地图"); // [PLACEHOLDER] 好感增量
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🛒 林阿姨照着你的门道去买，果然省下不少。她逢人就夸你懂行——街坊间的情分，就是这么处出来的。",
                "success",
              );
          },
        },
        {
          text: "🤫 门道自己留着用",
          hint: "务实，无变化",
          apply: function (st) {
            st.flags._dataSourceShareSeen = true;
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🤫 你笑笑没多说——这点小便宜的门道，还是自己心里有数就好。",
                "info",
              );
          },
        },
      ],
    },
    {
      // A→C: 常年跑市场低买高卖、讨价还价，练出一身议价眼力→销售技能
      id: "data_a_r189_haggle_mastery",
      phase: "street",
      _isChainEvent: false,
      icon: "💬",
      title: "练摊练出的眼力",
      story:
        "在市场里泡久了，你连摊主的一个眼神都能读懂——什么货成本几何、对方能让到什么价、哪句话一出口就能砍下三成。这一身讨价还价的本事，可不是书本上学得来的。",
      triggers: { minDay: 20, excludeFlags: ["_dataHaggleMasterySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        // 需有一定交易/资金积累（低买高卖攒下的现金）
        if ((st.resources.totalEarned || 0) < 3000) return false; // [PLACEHOLDER] 交易积累门槛
        return true;
      },
      choices: [
        {
          text: "💬 有意识地打磨议价技巧",
          hint: "销售经验+",
          apply: function (st) {
            st.flags._dataHaggleMasterySeen = true;
            if (typeof addSkillXp === "function") addSkillXp("sales", 8); // [PLACEHOLDER] 销售XP，真实技能键
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "💬 你开始把每一次砍价都当成练习——眼力和口才一起长，这是你未来吃饭的真本事。",
                "success",
              );
          },
        },
        {
          text: "🙂 顺其自然，够用就行",
          hint: "心情略好",
          apply: function (st) {
            st.flags._dataHaggleMasterySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🙂 会砍价就够了，你没往深里想——日子踏实过着也挺好。",
                "info",
              );
          },
        },
      ],
    },
    {
      // A→E: 小本倒货攒下的现金，第一次动了拿去钱生钱的念头→投资本金意识
      id: "data_a_r189_petty_capital",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🪙",
      title: "小本生意的第一桶金",
      story:
        "起早贪黑倒腾货物，一分一厘攒下来，账上竟也有了一笔说小不小的余钱。你盯着这笔钱忽然想：光靠现金压箱底，抵不过物价慢慢涨。要不要拿出一部分，试着让钱去生钱？",
      triggers: { minDay: 35, excludeFlags: ["_dataPettyCapitalSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        if ((st.resources.cash || 0) < 20000) return false; // [PLACEHOLDER] 本金门槛
        return true;
      },
      choices: [
        {
          text: "🪙 划一笔出来，开始学着投资",
          hint: "开启投资本金意识",
          apply: function (st) {
            st.flags._dataPettyCapitalSeen = true;
            st.flags._dataInvestorMindset = true; // A→E: 复用投资意识 flag，供经济/投资域事件门控
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🪙 你把一部分积蓄单独拨了出来——从今往后，除了赚辛苦钱，你也开始琢磨怎么让钱替你干活。",
                "success",
              );
          },
        },
        {
          text: "🏦 稳妥为上，钱还是攥在手里踏实",
          hint: "心态稳，无变化",
          apply: function (st) {
            st.flags._dataPettyCapitalSeen = true;
            if (typeof StateManager !== "undefined")
              StateManager.addMessage(
                "🏦 想来想去，你还是决定先把钱攥牢——白手起家的人，最懂得现金在手的安全感。",
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
