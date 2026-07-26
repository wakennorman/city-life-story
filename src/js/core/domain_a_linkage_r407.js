/**
 * 域A(数据/数值平衡) 联动增强 R407
 * 第十七轮循环——把隐藏在trade_intel/carry/jobs中的数据转化为叙事体验。
 * 桥接：
 *   A→B  a407_market_pulse          市场脉搏 → 消费 marketEvents+news+pricing 数据,
 *     把市场价格波动→"市场正在发生什么"的叙事风味
 *   A→C  a407_skill_demand_heatmap   技能需求热图 → 消费 jobs+skills 数据,
 *     不同工作对技能的需求→"学什么最吃香"的决策洞察
 *   A→G  a407_prevention_awakening   预防觉醒 → 消费 illnesses+needs 数据,
 *     疾病预防数据→"防患于未然"的健康觉醒
 *
 * 严格照 domain_a_linkage_r398.js / r389.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR407Loaded) return;
  RANDOM_EVENTS._domainALinkageR407Loaded = true;

  var EVENTS = [
    {
      // A→B: 市场脉搏 — 消费 marketEvents+news+pricing
      id: "a407_market_pulse",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "市场脉搏",
      story:
        "你注意到市场上的变化——{marketPulse}\n\n读懂市场,是在这座城市生存的基本功。",
      triggers: { minDay: 40, excludeFlags: ["_a407PulseCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.trade) return false;
        return true;
      },
      choices: [
        {
          text: "📊 做市场观察笔记",
          hint: "心智+3,sales XP+3,置 _a407PulseCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a407PulseCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("sales", 3); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📈 你记录了市场变化——观察力是商人最重要的品质。心智+3,销售XP+3。", "success");
          }
        },
        {
          text: "🤷 市场变化太难把握",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.trade) return null;
        var pulse = "市场似乎在平静中酝酿着变化";
        if (st.trade.marketEvents && st.trade.marketEvents.length > 0) {
          var evt = st.trade.marketEvents[0];
          pulse = "「" + (evt.name || "市场异动") + "」正在影响" + (evt.goodId || "相关商品") + "价格";
        }
        return "你注意到市场上的变化——" + pulse + "。\n\n读懂市场,是在这座城市生存的基本功。";
      }
    },
    {
      // A→C: 技能需求热图 — 消费 jobs+skills
      id: "a407_skill_demand_heatmap",
      phase: "street",
      _isChainEvent: false,
      icon: "🔥",
      title: "什么技能最吃香",
      story:
        "你分析了市场上各工作的技能需求——{heatmapInsight}\n\n顺势而为,事半功倍。",
      triggers: { minDay: 50, excludeFlags: ["_a407HeatmapCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (typeof STREET_JOBS !== "undefined" && st.skills);
      },
      choices: [
        {
          text: "🎯 按需学习,精准提升",
          hint: "心智+4,accounting XP+3,置 _a407HeatmapCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a407HeatmapCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 3); } catch(e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🔥 你分析了技能需求热图——按需学习是最优策略。心智+4,会计XP+3。", "success");
          }
        },
        {
          text: "😊 喜欢什么就学什么",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st || typeof STREET_JOBS === "undefined") return null;
        // 统计最常被工作要求的核心技能
        var skillDemand = {};
        for (var i = 0; i < STREET_JOBS.length; i++) {
          var job = STREET_JOBS[i];
          if (job.requirements) {
            for (var key in job.requirements) {
              if (key !== "minAge" && key !== "maxAge" && key !== "educationRequired") {
                skillDemand[key] = (skillDemand[key] || 0) + 1;
              }
            }
          }
        }
        // 找最高需求
        var topSkill = null, topCount = 0;
        for (var k in skillDemand) {
          if (skillDemand[k] > topCount) { topCount = skillDemand[k]; topSkill = k; }
        }
        var cn = { cooking: "烹饪", repair: "维修", coding: "编程", english: "英语",
          driving: "驾驶", sales: "销售", management: "管理", accounting: "会计",
          intelligence: "智力", physique: "体质", agility: "敏捷", mental: "心智" };
        var insight = topSkill
          ? (cn[topSkill] || topSkill) + "是市场上最被需要的技能(top" + topCount + "个工作要求)"
          : "各项技能都有需求,关键是找到自己的方向";
        return "你分析了市场上各工作的技能需求——" + insight + "。\n\n顺势而为,事半功倍。";
      }
    },
    {
      // A→G: 预防觉醒 — 消费 illnesses+needs
      id: "a407_prevention_awakening",
      phase: "street",
      _isChainEvent: false,
      icon: "🛡️",
      title: "预防胜于治疗",
      story:
        "你意识到健康需要提前关注——{preventionInsight}\n\n防患于未然,是最明智的健康投资。",
      triggers: { minDay: 55, excludeFlags: ["_a407PreventCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "💪 养成健康习惯",
          hint: "心智+4,置 _a407PreventCooldown(80天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a407PreventCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🛡️ 你理解了预防的重要性——健康是最好的投资。心智+4。", "success");
          }
        },
        {
          text: "😅 年轻就是本钱",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var insight = "很多疾病可以通过良好的生活习惯预防";
        if (st.needs) {
          var hygiene = st.needs.hygiene || 100;
          var fatigue = st.needs.fatigue || 0;
          if (hygiene < 40) insight = "卫生状况下降会显著增加患病风险,注意清洁";
          else if (fatigue > 70) insight = "过度疲劳会削弱免疫系统,注意休息";
        }
        return "你意识到健康需要提前关注——" + insight + "。\n\n防患于未然,是最明智的健康投资。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
