/**
 * 域A(数据/数值平衡) 联动增强 R277（第二轮循环·A 域第十一次）
 * 主题：把「数字素养」外化成生活里的具体红利——砍价识货、团购省钱、成本管控。
 * 桥接（数值均为 [PLACEHOLDER] 可调基线，防御式 || 守卫）：
 *   A→C  a277_haggle_edge          真实商业技能+交易频次→识货砍价省钱变现（职业·经历变现）
 *   A→D  a277_neighbor_bulk_buy    现金缓冲+已结识NPC→组织街坊团购涨好感（NPC/社交·守 rel.met 铁律）
 *   A→H  a277_cost_control_report  在职+账务/管理技能→成本控制报告争业绩（Phase2/公司·数据驱动经营）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainALinkageR277Loaded) return;
  RANDOM_EVENTS._domainALinkageR277Loaded = true;

  // 辅助：取第一个已结识(met)的 NPC id（严守域D铁律：只读 relationships、须 met）
  function firstMetNpcR277(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var rel = st.relationships[id];
      if (rel && rel.met) return id;
    }
    return null;
  }

  // 辅助：取最高等级的真实商业技能（sales/accounting/management）
  function topBizSkillR277(st) {
    if (!st || !st.skills) return { key: "", lv: 0 };
    var biz = ["sales", "accounting", "management"];
    var key = "", lv = 0;
    for (var i = 0; i < biz.length; i++) {
      var s = st.skills[biz[i]];
      var l = (s && s.level) || 0;
      if (l > lv) { lv = l; key = biz[i]; }
    }
    return { key: key, lv: lv };
  }

  var EVENTS = [
    {
      // [全系统自洽修复] 域A 联动:A→C 识货砍价——把商业技能与交易经验换成真金白银
      id: "a277_haggle_edge",
      phase: "street",
      _isChainEvent: false,
      icon: "🛒",
      title: "识货的眼力",
      story: "在市场泡久了，你练出了一双识货的眼。\n\n摊主刚要报价，你已经心里有数——这批货成色一般，别处更便宜。三言两语，价格就被你压了下来。\n\n「会算账的人，走到哪都不吃亏。」这门本事，是你用一次次交易攒出来的。",
      triggers: { minDay: 100, excludeFlags: ["_a277HaggleSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.stats || !st.stats.actionFreq) return false;
        var trades = (st.stats.actionFreq.buyGood || 0) + (st.stats.actionFreq.sellGood || 0);
        if (trades < 15) return false; // [PLACEHOLDER] 交易频次门槛
        var top = topBizSkillR277(st);
        return top.lv >= 3; // [PLACEHOLDER] 商业技能等级门槛
      },
      choices: [
        {
          text: "🛒 亮出眼力砍价",
          hint: "现金+[PLACEHOLDER]，最高商业技能XP+10，心情+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._a277HaggleSeen = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 300; // [PLACEHOLDER] 省下的钱
            var top = topBizSkillR277(st);
            if (top.key && typeof addSkillXp === "function") addSkillXp(top.key, 10); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🛒 你靠眼力砍下了价钱。省下的就是赚到的。现金+300，技能XP+10。", "success");
            }
          },
        },
        {
          text: "🤷 差不多就行，不好意思砍",
          hint: "心情+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._a277HaggleSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你不好意思砍价，照价付了。心情+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // [全系统自洽修复] 域A 联动:A→D 街坊团购——现金缓冲组织团购，省钱又攒人情（守 rel.met 铁律）
      id: "a277_neighbor_bulk_buy",
      phase: "street",
      _isChainEvent: false,
      icon: "🧺",
      title: "街坊团购",
      story: "月底盘账，手头还算宽裕。你灵机一动：与其各买各的，不如凑单团购。\n\n你在街坊群里张罗起来，米面油、日用品，一起下单批发价。省下的钱不多，可街坊们记着你这份热心。\n\n「会过日子的人，也会带着大家一起过好日子。」",
      triggers: { minDay: 80, excludeFlags: ["_a277BulkBuySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        if ((st.resources.cash || 0) < 2000) return false; // [PLACEHOLDER] 现金缓冲门槛
        return firstMetNpcR277(st) !== null;
      },
      choices: [
        {
          text: "🧺 张罗团购",
          hint: "现金+[PLACEHOLDER]，街坊好感+[PLACEHOLDER]，心情+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._a277BulkBuySeen = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 200; // [PLACEHOLDER] 团购省下的钱
            var nid = firstMetNpcR277(st);
            if (nid && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, nid, 6, "你组织街坊团购，大家都受益"); // [PLACEHOLDER] 好感
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🧺 你张罗了街坊团购，省钱又攒人情。现金+200，好感+6，心情+4。", "success");
            }
          },
        },
        {
          text: "🤷 各买各的省心",
          hint: "心情+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._a277BulkBuySeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得各买各的更省心。心情+2。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      // [全系统自洽修复] 域A 联动:A→H 成本控制报告——用数据素养在公司经营中争业绩
      id: "a277_cost_control_report",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📉",
      title: "成本控制报告",
      story: "公司账面利润被成本吃掉了一大截。你翻出这几个月的开支明细，一项项拆解、对标、砍冗余。\n\n采购溢价、闲置产能、重复支出——数据不会说谎，问题一目了然。你把一份成本控制报告拍在会上，管理层刮目相看。\n\n「懂数字的人，才配坐在谈成本的桌子上。」",
      triggers: { minDay: 140, excludeFlags: ["_a277CostReportSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false; // 在职于公司
        if (!st.skills) return false;
        var acc = (st.skills.accounting && st.skills.accounting.level) || 0;
        var mgmt = (st.skills.management && st.skills.management.level) || 0;
        return (acc + mgmt) >= 8; // [PLACEHOLDER] 账务+管理综合门槛
      },
      choices: [
        {
          text: "📉 提交成本控制报告",
          hint: "管理XP+[PLACEHOLDER]，奖金+[PLACEHOLDER]，晋升势能+[PLACEHOLDER]",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._a277CostReportSeen = true;
            if (typeof addSkillXp === "function") addSkillXp("management", 12); // [PLACEHOLDER]
            if (st.resources) st.resources.bankBalance = (st.resources.bankBalance || 0) + 1500; // [PLACEHOLDER] 奖金入存款
            if (st.player && st.player.corporate) {
              st.player.corporate.upward = Math.min(100, (st.player.corporate.upward || 50) + 4); // [PLACEHOLDER] 晋升势能
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📉 成本控制报告获管理层认可。数据即话语权。管理XP+12，奖金+1500，晋升势能+4。", "success");
            }
          },
        },
        {
          text: "🤷 多一事不如少一事",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._a277CostReportSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你没多管闲事。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
