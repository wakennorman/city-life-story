/**
 * 域F(UI/UX) 联动增强 R638
 * 桥接：
 *   F→D  f638_ui_social_discovery  UI社交发现 → 消费 state.relationships+state.flags 数据,
 *     UI→"发现身边的社交机会"社交回响
 *   F→C  f638_ui_skill_roadmap  UI技能路线图 → 消费 state.skills+state.player 数据,
 *     UI→"技能树可视化"职业回响
 *   F→E  f638_ui_expense_tracker  UI开支追踪 → 消费 state.resources+state.flags 数据,
 *     UI→"钱花在哪了"经济回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR638Loaded) return;
  RANDOM_EVENTS._domainFLinkageR638Loaded = true;

  var EVENTS = [
    // ================================================================
    // F→D: UI社交发现 — 提醒社交机会
    // ================================================================
    {
      id: "f638_ui_social_discovery",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "社交发现",
      triggers: { minDay: 5 },
      text: function (st) {
        var rels = st.relationships || {};
        var npcCount = 0;
        var dormantCount = 0;
        for (var k in rels) {
          if (rels[k] && rels[k].met) npcCount++;
          if (rels[k] && rels[k].met && rels[k].dormant) dormantCount++;
        }

        if (npcCount === 0) {
          return "你还没有结识任何朋友。城市里有很多和你一样的人，试着走出去——" +
            "去公园、社区中心、商业区，参加一些活动，认识新朋友。" +
            "社交不仅能让生活更丰富，还能带来意想不到的机会。";
        }

        if (dormantCount > 0) {
          return "你有" + dormantCount + "位朋友很久没联系了（处于休眠状态）。" +
            "人际关系需要维护，太久不联系感情会变淡。" +
            "发个消息问候一下，或者约出来吃个饭，重新点燃友谊的火花。";
        }

        if (npcCount >= 3) {
          return "你的社交圈有" + npcCount + "位朋友，圈子不错。" +
            "定期和朋友保持联系，不仅能获得情感支持，还可能通过朋友认识更多新朋友。" +
            "社交网络的价值随着规模增长而指数级上升。";
        }

        return "你认识" + npcCount + "位朋友，还有很大的扩展空间。" +
          "多参加不同的活动，认识不同圈子的人，让社交网络更丰富。";
      },
      choices: [
        { text: "🤝 联系朋友", apply: function(st) {
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage("🤝 给朋友们发了问候消息，心情+3", "success");
        }},
        { text: "🚶 出去走走", apply: function(st) {
          StateManager.addMessage("🚶 你决定出门走走，看看能不能认识新朋友", "info");
        }},
      ],
      conditions: function (st) {
        return st.relationships && Object.keys(st.relationships).length > 0;
      },
      weight: 1,
    },

    // ================================================================
    // F→C: UI技能路线图 — 技能成长路径提示
    // ================================================================
    {
      id: "f638_ui_skill_roadmap",
      phase: "street",
      _isChainEvent: false,
      icon: "🗺️",
      title: "技能路线图",
      triggers: { minDay: 12 },
      text: function (st) {
        var skills = st.skills || {};
        var skillList = [];
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level > 0) {
            skillList.push({ id: k, level: skills[k].level, name: (typeof getSkillChineseName === "function") ? getSkillChineseName(k) : k });
          }
        }
        if (skillList.length === 0) {
          return "你还没有学习任何技能。技能是改变命运最可靠的途径——" +
            "去培训中心看看有什么课程适合你，或者在工作中边干边学。";
        }
        skillList.sort(function(a, b) { return b.level - a.level; });
        var top = skillList[0];
        var nextMilestone = 0;
        if (top.level < 30) nextMilestone = 30;
        else if (top.level < 50) nextMilestone = 50;
        else if (top.level < 70) nextMilestone = 70;
        else nextMilestone = 100;

        var branchAvail = false;
        if (typeof SKILL_BRANCHES !== "undefined" && SKILL_BRANCHES[top.id] && top.level >= 30) {
          branchAvail = true;
        }

        return "你的技能路线图：<br>" +
          "🏆 最强技能：" + top.name + " Lv." + top.level + "<br>" +
          (nextMilestone > top.level ? "🎯 下一个里程碑：Lv." + nextMilestone + "（还差" + (nextMilestone - top.level) + "级）<br>" : "") +
          (branchAvail ? "🌿 已解锁技能分支方向，可前往「技能」Tab选择发展方向<br>" : (top.level >= 25 ? "🌿 即将解锁技能分支（Lv.30），提前规划发展方向<br>" : "")) +
          "共" + skillList.length + "项技能，总等级" + skillList.reduce(function(s, sk) { return s + sk.level; }, 0) + "。";
      },
      choices: [
        { text: "🎓 去培训中心", apply: function(st) {
          if (typeof showLocationNavModal === "function") {
            showLocationNavModal("trainingCenter", "🎓 培训中心", "actions");
          } else {
            StateManager.addMessage("🎓 前往培训中心提升技能", "info");
          }
        }},
        { text: "📊 查看技能", apply: function(st) {
          StateManager.addMessage("📊 前往「技能」Tab查看详细技能信息", "info");
        }},
      ],
      conditions: function (st) {
        var skills = st.skills || {};
        for (var k in skills) {
          if (skills[k] && skills[k].level > 0) return true;
        }
        return false;
      },
      weight: 1,
    },

    // ================================================================
    // F→E: UI开支追踪 — 财务流向可视化
    // ================================================================
    {
      id: "f638_ui_expense_tracker",
      phase: "street",
      _isChainEvent: false,
      icon: "💳",
      title: "开支追踪",
      triggers: { minDay: 7 },
      text: function (st) {
        var cash = st.resources && st.resources.cash || 0;
        var bank = st.resources && st.resources.bankBalance || 0;
        var totalEarned = st.resources && st.resources.totalEarned || 0;
        var day = st.player && st.player.day || 1;
        var dailyIncome = Math.round(totalEarned / Math.max(1, day));
        var totalAssets = cash + bank;

        if (totalAssets < 1000 && dailyIncome < 50) {
          return "你的财务状况比较紧张：现金¥" + cash.toLocaleString() + "，日均收入¥" + dailyIncome + "。" +
            "建议记录每一笔开支，找出可以节省的地方。" +
            "一杯奶茶¥15、一包烟¥20——这些小额支出积累起来也是一笔不小的数目。";
        }

        if (dailyIncome >= 200) {
          return "你的日均收入¥" + dailyIncome + "，总资产¥" + totalAssets.toLocaleString() + "。" +
            "收入不错，但钱花得值不值才是关键。" +
            "建议每月做一次开支复盘，看看钱都花在了哪里，有没有可以优化的地方。";
        }

        return "你的现金¥" + cash.toLocaleString() + "，存款¥" + bank.toLocaleString() + "，日均收入¥" + dailyIncome + "。" +
          "养成记账的习惯，能帮你更好地控制开支、增加储蓄。" +
          "每个月省下的钱，就是未来投资的子弹。";
      },
      choices: [
        { text: "📝 记一笔账", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._f638_budgetTrack = (st.flags._f638_budgetTrack || 0) + 1;
          if (st.skills && st.skills.accounting) {
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 3;
          }
          StateManager.addMessage("📝 记录了今天的开支，会计经验+3", "success");
        }},
        { text: "💰 查看资产", apply: function(st) {
          StateManager.addMessage("💰 总资产 ¥" + (cash + bank).toLocaleString() + "（现金¥" + cash.toLocaleString() + "，存款¥" + bank.toLocaleString() + "）", "info");
        }},
      ],
      conditions: function (st) {
        return st.resources && (st.resources.cash !== undefined || st.resources.totalEarned !== undefined);
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();