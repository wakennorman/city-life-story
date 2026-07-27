/**
 * 域H(Phase2/公司) 联动增强 R457（第三轮循环）
 * 桥接：
 *   H→B  h457_corp_story_legacy   公司故事传承 → 消费 corporate+flags 数据,
 *     公司历程→"那些年我们打过的仗"的企业叙事
 *   H→E  h457_corp_invest_v3      公司投资v3 → 消费 corporate+investment 数据,
 *     公司盈余→"用公司钱生钱"的企业理财
 *   H→G  h457_corp_founder_health 创始人健康v3 → 消费 corporate+status 数据,
 *     创业透支→"老板也要爱惜身体"的健康警示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR457Loaded) return;
  RANDOM_EVENTS._domainHLinkageR457Loaded = true;

  var EVENTS = [
    {
      id: "h457_corp_story_legacy", phase: "corporate", _isChainEvent: false, icon: "📖",
      title: "公司故事",
      story: "老员工聚餐时，聊起了公司创业时的故事——{desc}",
      triggers: { minDay: 70, interval: 180, maxRepeats: 3, excludeFlags: ["_h457CorpStoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._h457CorpStoryCooldown);
      },
      choices: [
        { text: "📖 记录下来", hint: "管理XP+5,公司凝聚力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h457CorpStoryCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.corporate) st.corporate.reputation = Math.min(100, (st.corporate.reputation || 0) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你决定把公司的故事记录下来——'这些故事，是公司最宝贵的财富。' 管理XP+5,公司凝聚力+2。", "success");
        }},
        { text: "🍻 敬大家一杯", hint: "心情+2,团队忠诚+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h457CorpStoryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 1); } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你举杯敬了大家——'谢谢各位一路相随。' 酒杯碰撞声里，是团队的凝聚力。心情+2,团队忠诚+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "老员工聚餐时，聊起了公司创业时的故事——'当年我们只有三个人，在一间小办公室里...' 那些艰苦的日子，现在成了最珍贵的回忆。";
      }
    },
    {
      id: "h457_corp_invest_v3", phase: "corporate", _isChainEvent: false, icon: "💹",
      title: "企业理财",
      story: "财务总监建议你用公司闲置资金做理财——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 3, excludeFlags: ["_h457CorpInvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        var funds = st.corporate.company.funds || 0;
        return funds >= 50000 && (st.flags && !st.flags._h457CorpInvestCooldown);
      },
      choices: [
        { text: "💹 购买理财产品", hint: "会计XP+5,公司资金+3000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h457CorpInvestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 3000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💹 你购买了企业理财产品——'钱不能躺在账上睡觉。' 会计XP+5,公司资金+¥3000。", "success");
        }},
        { text: "🏦 存定期", hint: "公司资金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h457CorpInvestCooldown = true;
          if (st.corporate && st.corporate.company) st.corporate.company.funds = (st.corporate.company.funds || 0) + 2000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💹 你决定把闲置资金存了定期——虽然收益低，但安全第一。公司资金+¥2000。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var funds = (st.corporate && st.corporate.company && st.corporate.company.funds) || 0;
        return "财务总监建议你用公司闲置资金做理财——'公司账上躺着¥" + Math.floor(funds).toLocaleString() + "，理一理能多赚不少。'";
      }
    },
    {
      id: "h457_corp_founder_health", phase: "corporate", _isChainEvent: false, icon: "🏥",
      title: "创业者的代价",
      story: "连续几个月的超负荷工作，你的身体终于抗议了——{desc}",
      triggers: { minDay: 40, interval: 90, maxRepeats: 3, excludeFlags: ["_h457FounderHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        var h = (st.status && st.status.health) || 70;
        return h < 50 && (st.flags && !st.flags._h457FounderHealthCooldown);
      },
      choices: [
        { text: "🏥 去体检", hint: "健康+5,疲劳-3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h457FounderHealthCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 5);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 体检报告出来了——'再这样下去，身体会垮的。' 你决定从今天开始，把健康放在第一位。健康+5,疲劳-3。", "success");
        }},
        { text: "📋 招个帮手", hint: "管理XP+3,疲劳-2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._h457FounderHealthCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏥 你决定招个帮手分担工作——'创业者不是超人，学会 delegating 才是真正的管理。' 管理XP+3,疲劳-2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var h = (st.status && st.status.health) || 70;
        return "连续几个月的超负荷工作，你的身体终于抗议了——健康只剩" + h + "了。创业是一场马拉松，不是百米冲刺。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();