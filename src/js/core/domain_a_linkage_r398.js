/**
 * 域A(数据/数值平衡) 联动增强 R398
 * 第十七轮循环——把隐藏在economy_v3.1/lifecycle数据中的数字转化为叙事体验。
 * 背景：域A 经 R14/R22/R189/R197/R242/R245/R248/R251/R258/R267/R277/R280/R288/
 *   R296/R304/R313/R321/R331/R339/R347/R355/R363/R371/R379/R389 多轮加固后 A类净尽。
 * 本轮聚焦3个历轮未覆盖的数据→叙事桥接：
 *   A→G  a398_life_data_portrait   人生数据画像 → 消费 age+status.health+needs 数据,
 *     把生命周期状态转化为"人生阶段数据肖像"叙事,mental+happiness
 *   A→C  a398_skill_roi            技能投入产出比 → 消费 jobs.payCalc+skills 数据,
 *     对比不同工作的技能回报率,引导玩家做最优职业决策
 *   A→E  a398_economy_perception   经济周期感知 → 消费 economy_v3.1+_eraState 数据,
 *     宏观经济数据→"感受到经济在变化"的叙事觉醒
 *
 * 严格照 domain_a_linkage_r389.js / r379.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainALinkageR398Loaded) return;
  RANDOM_EVENTS._domainALinkageR398Loaded = true;

  // 安全技能经验
  function grantSkillXpR398(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // A→G: 人生数据画像 — 消费 age+status.health+needs 数据
      id: "a398_life_data_portrait",
      phase: "street",
      _isChainEvent: false,
      icon: "🪞",
      title: "人生数据画像",
      story:
        "你停下来审视自己的人生数据——{ageStage}岁,健康{healthLevel}。{needsSummary}\n\n数字背后,是一个真实的你。",
      triggers: { minDay: 80, excludeFlags: ["_a398PortraitCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player) return false;
        return true;
      },
      choices: [
        {
          text: "🌟 接纳数据,理解自己",
          hint: "心智+4,心情+5,置 _a398PortraitCooldown(120天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a398PortraitCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🪞 你审视了自己的人生数据画像——理解自己是成长的第一步。心智+4,心情+5。", "success");
          }
        },
        {
          text: "💪 继续前行,数据只是参考",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.player) return null;
        var age = st.player.age || 20;
        var health = (st.status && isFinite(st.status.health)) ? st.status.health : 80;
        var healthLevel = health >= 70 ? "良好" : health >= 50 ? "一般" : "需要关注";
        var summary = "";
        if (st.needs) {
          var lowNeeds = [];
          if ((st.needs.hunger || 100) < 40) lowNeeds.push("饥饿");
          if ((st.needs.fatigue || 0) > 70) lowNeeds.push("疲劳");
          if ((st.needs.happiness || 100) < 40) lowNeeds.push("心情低落");
          summary = lowNeeds.length > 0
            ? "需要关注:" + lowNeeds.join("、") + "。"
            : "各项需求基本满足。";
        }
        return "你停下来审视自己的人生数据——" + age + "岁,健康" + healthLevel + "。" + summary + "\n\n数字背后,是一个真实的你。";
      }
    },
    {
      // A→C: 技能投入产出比 — 消费 jobs.payCalc+skills 数据
      id: "a398_skill_roi",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "技能投入产出比",
      story:
        "你对比了自己各项技能的赚钱效率——{roiInsight}\n\n技能不仅是爱好,也是谋生的本钱。",
      triggers: { minDay: 60, excludeFlags: ["_a398RoiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills) return false;
        // 至少有一门技能≥15级
        for (var k in st.skills) {
          if (st.skills[k] && (st.skills[k].level || 0) >= 15) return true;
        }
        return false;
      },
      choices: [
        {
          text: "📊 把技能当作投资来经营",
          hint: "accounting XP+5,心智+3,置 _a398RoiCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a398RoiCooldown = true;
            grantSkillXpR398("accounting", 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你学会了用投资思维经营技能——投入时间,收获回报。会计XP+5,心智+3。", "success");
          }
        },
        {
          text: "😊 开心就好,不必事事计较",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st || !st.skills) return null;
        // 找最高和最低等级技能
        var best = null, worst = null, bestLv = -1, worstLv = 999;
        for (var k in st.skills) {
          if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
          var lv = st.skills[k].level || 0;
          if (lv > bestLv) { bestLv = lv; best = k; }
          if (lv < worstLv && lv > 0) { worstLv = lv; worst = k; }
        }
        var cn = { cooking: "烹饪", repair: "维修", coding: "编程", english: "英语",
          driving: "驾驶", sales: "销售", management: "管理", accounting: "会计",
          electrician: "电工", welding: "焊接", medicine: "医护", social: "社交" };
        var insight = "";
        if (best && bestLv > 0) {
          insight = "你的" + (cn[best] || best) + "技能最强(Lv." + bestLv + "),是赚钱的核心竞争力。";
          if (worst && worst !== best) insight += "而" + (cn[worst] || worst) + "还有提升空间。";
        } else {
          insight = "各项技能都在起步阶段,持续积累会有回报。";
        }
        return "你对比了自己各项技能的赚钱效率——" + insight + "\n\n技能不仅是爱好,也是谋生的本钱。";
      }
    },
    {
      // A→E: 经济周期感知 — 消费 economy_v3.1+_eraState 数据
      id: "a398_economy_perception",
      phase: "street",
      _isChainEvent: false,
      icon: "🌊",
      title: "经济周期感知",
      story:
        "你隐约感觉到经济环境在变化——{economyInsight}\n\n读懂周期,是在这座城市生存的重要能力。",
      triggers: { minDay: 70, excludeFlags: ["_a398EconomyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "🧠 学会读懂经济周期",
          hint: "心智+4,accounting XP+3,置 _a398EconomyCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._a398EconomyCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            grantSkillXpR398("accounting", 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🌊 你学会了感知经济周期——顺势而为,逆势守心。心智+4,会计XP+3。", "success");
          }
        },
        {
          text: "🤷 过好眼前就好",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var insight = "市场似乎在不断变化";
        // 尝试读取era状态
        if (st.flags && st.flags._eraState) {
          var inf = st.flags._eraState.inflationIndex || 1.0;
          if (inf > 1.3) insight = "通胀持续走高,钱越来越不值钱,持有现金在贬值";
          else if (inf > 1.1) insight = "温和通胀,物价缓慢上涨,是经济的常态";
          else if (inf < 0.9) insight = "通缩压力显现,物价下跌,但消费意愿也在降低";
          else insight = "经济环境相对稳定,物价波动不大";
        }
        return "你隐约感觉到经济环境在变化——" + insight + "。\n\n读懂周期,是在这座城市生存的重要能力。";
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
