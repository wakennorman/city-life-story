/**
 * 域B联动增强 R231 — 创业历史数据叙事化
 *
 * 本文件将 startup.history 数据首次叙事化为事件：
 * 1. B→H 创业里程碑回顾（history.foundedDay → 周年事件）
 * 2. B→G 公司倒闭回望（exitType 字段 → 反思事件）
 * 3. B→A 创业营收里程碑（totalRevenue → 叙事化消费）
 *
 * IIFE 注入 RANDOM_EVENTS。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;

  var _B_R231 = [
    // [全系统自洽修复] 域B R231 联动#1: H→G 公司周年庆
    // 数据源: startup.history.foundedDay (startup.js)
    {
      id: "startup_anniversary",
      title: "🎉 公司成立一周年",
      desc: "公司成立纪念日到了，回顾过去一年的风雨历程。",
      phase: "corporate",
      repeatable: true,
      cooldownDays: 365,
      priority: 50,
      conditions: function (st) {
        if (!st || !st.startup || !st.startup.history) return false;
        if (!st.startup.history.foundedDay) return false;
        if (!st.startup.company) return false;
        var daySinceFounded = (st.player.day || 0) - st.startup.history.foundedDay;
        if (daySinceFounded < 30) return false;
        // 只在周年日附近触发
        if ((daySinceFounded % 365) < 3 || (daySinceFounded % 365) > 362) return true;
        return false;
      },
      probability: 0.30,
      getText: function (st) {
        var daysSince = (st.player.day || 0) - st.startup.history.foundedDay;
        var val = st.startup.company.valuation || 0;
        return "今天是你公司成立的第" + daysSince + "天...\n\n" +
          "从一间小办公室到现在估值¥" + val.toLocaleString() + "的公司，\n" +
          "一路走来确实不容易。团队还在，初心也没变。";
      },
      getStory: function (st) { return this.getText(st); },
      apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._startupAnniversarySeen = st.player.day;
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
      },
    },

    // [全系统自洽修复] 域B R231 联动#2: G→B 创业失败回望
    // 数据源: startup.history.exitType (enterprise_fate.js / startup.js)
    {
      id: "startup_post_mortem",
      title: "💔 公司倒闭后的反思",
      desc: "公司最终没能撑下去，但在废墟中寻找经验和教训。",
      phase: "corporate",
      repeatable: true,
      cooldownDays: 180,
      priority: 40,
      conditions: function (st) {
        if (!st || !st.startup || !st.startup.history) return false;
        // 公司已退出但没有设过 post_mortem flag
        if (!st.startup.history.exitedDay) return false;
        var exitDaysAgo = (st.player.day || 0) - st.startup.history.exitedDay;
        if (exitDaysAgo < 7 || exitDaysAgo > 60) return false;
        if (st.flags && st.flags._postMortemDone) return false;
        return true;
      },
      probability: 0.15,
      getText: function (st) {
        var exitType = st.startup.history.exitType || "unknown";
        var exitMap = { ipo: "上市", acquired: "被收购", bankrupt: "破产清算" };
        var typeText = exitMap[exitType] || exitType;
        return "公司最终以「" + typeText + "」的方式谢幕...\n\n" +
          "虽然结果不尽如人意，但这段经历教会了我很多东西。\n" +
          "下次一定做得更好。";
      },
      getStory: function (st) { return this.getText(st); },
      apply: function (st) {
        if (!st.flags) st.flags = {};
        st.flags._postMortemDone = true;
        if (st.skills && st.skills.management) {
          st.skills.management.xp = (st.skills.management.xp || 0) + 15;
        }
        if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
        // 亏损的心情影响
        if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
      },
    },

    // [全系统自洽修复] 域B R231 联动#3: A→B 创业营收里程碑叙事化
    // 数据源: startup.history.totalRevenue (startup.js)
    {
      id: "startup_revenue_celebration",
      title: "💰 公司营收突破里程碑",
      desc: "公司累计营收达到一个里程碑，值得庆祝。",
      phase: "corporate",
      repeatable: true,
      cooldownDays: 90,
      priority: 45,
      conditions: function (st) {
        if (!st || !st.startup || !st.startup.company) return false;
        var totalRev = st.startup.company.revenue || 0;
        // 检查各里程碑是否已过
        if (totalRev >= 1000000 && st.flags && st.flags._revMilestone1M) return false;
        if (totalRev >= 10000000 && st.flags && st.flags._revMilestone10M) return false;
        if (totalRev >= 100000000 && st.flags && st.flags._revMilestone100M) return false;
        return totalRev >= 100000; // 至少10万才有里程碑意义
      },
      probability: 0.10,
      getText: function (st) {
        var rev = st.startup.company.revenue || 0;
        if (rev >= 100000000) {
          return "公司累计营收突破1亿！\n\n" +
            "从最初的小工作室到现在的行业巨头，\n" +
            "每一步都是团队咬牙挺过来的。感谢每一个人。";
        } else if (rev >= 10000000) {
          return "公司累计营收突破1000万！\n\n" +
            "当初在车库里写代码的日子仿佛还在昨天。\n" +
            "现在我们已经是一个真正有影响力的企业了。";
        } else if (rev >= 1000000) {
          return "公司累计营收突破100万！\n\n" +
            "还记得第一次拿到客户订单时的兴奋...\n" +
            "这条路走对了。";
        } else {
          return "公司累计营收突破10万！\n\n" +
            "创业第一笔像样的收入。一切才刚刚开始。";
        }
      },
      getStory: function (st) { return this.getText(st); },
      apply: function (st) {
        if (!st.flags) st.flags = {};
        var rev = st.startup.company.revenue || 0;
        if (rev >= 100000000) st.flags._revMilestone100M = true;
        else if (rev >= 10000000) st.flags._revMilestone10M = true;
        else if (rev >= 1000000) st.flags._revMilestone1M = true;
        else st.flags._revMilestone100k = true;
        if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
        if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
      },
    },
  ];

  for (var i = 0; i < _B_R231.length; i++) {
    RANDOM_EVENTS.push(_B_R231[i]);
  }

  if (typeof window !== "undefined") {
    window._domainBLinkageR231 = true;
  }
})();
