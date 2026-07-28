/**
 * 域C(职业/成长) 联动增强 R661
 * 桥接：
 *   C→H  c661_career_startup_foundation  职业创业基础 → 消费 state.career+state.skills 数据,
 *     职业→"职业生涯积累创业资本"的公司回响
 *   C→D  c661_career_mentor_network  职业导师网络 → 消费 state.career+state.relationships 数据,
 *     职业→"职场导师人脉积累"的社交回响
 *   C→A  c661_skill_market_value  技能市场价值 → 消费 state.skills+state.resources 数据,
 *     职业→"技能的市场定价"的数值回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR661Loaded) return;
  RANDOM_EVENTS._domainCLinkageR661Loaded = true;

  var EVENTS = [
    // ====== C→H: 职业创业基础 ======
    {
      id: "c661_career_startup_foundation", phase: "street", _isChainEvent: false, icon: "🚀",
      title: "创业资本",
      story: "你在工作中积累的经验,正悄悄变成创业的资本——{desc}",
      triggers: { minDay: 60, interval: 120, maxRepeats: 4, excludeFlags: ["_c661StartupFoundationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c661StartupFoundationCooldown) return false;
        if (!st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 60;
      },
      choices: [
        { text: "📊 整理行业经验", hint: "智力+5,心智+3,未来创业效率+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c661StartupFoundationCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.flags) st.flags._startupPreparation = (st.flags._startupPreparation || 0) + 1;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你整理了这段时间积累的行业经验。'这些经验,以后创业都用得上。' 智力+5,心智+3。", "success");
        }},
        { text: "🤝 积累行业人脉", hint: "好感+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c661StartupFoundationCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof applyAffinityChange === "function" && st.relationships) {
            for (var k in st.relationships) {
              if (st.relationships[k] && st.relationships[k].met) {
                try { applyAffinityChange(st, k, 5, "行业交流"); } catch(e) {} break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🚀 你主动结识行业内的朋友。'人脉就是钱脉,这话一点不假。' 好感+5,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st || !st.career || !st.career.currentJob) return null;
        var days = st.career.currentJob.workDays || 0;
        var jobName = st.career.currentJob.levelName || "工作";
        return "你已经做了" + days + "天的" + jobName + "。'这些经验,将来创业都是宝贵的财富。' 你开始有意识地积累创业资本。";
      }
    },

    // ====== C→D: 职业导师网络 ======
    {
      id: "c661_career_mentor_network", phase: "street", _isChainEvent: false, icon: "👨‍🏫",
      title: "职场导师",
      story: "一个经验丰富的前辈愿意指导你——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 5, excludeFlags: ["_c661MentorNetworkCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c661MentorNetworkCooldown) return false;
        return true;
      },
      choices: [
        { text: "🙏 虚心请教", hint: "智力+5,好感+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c661MentorNetworkCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof applyAffinityChange === "function" && st.relationships) {
            for (var k in st.relationships) {
              if (st.relationships[k] && st.relationships[k].met) {
                try { applyAffinityChange(st, k, 5, "虚心请教"); } catch(e) {} break;
              }
            }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👨‍🏫 '年轻人肯学,我就愿意教。' 前辈的指导让你受益匪浅。智力+5,好感+5,心智+3。", "success");
        }},
        { text: "📝 记下所有建议", hint: "智力+3,心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c661MentorNetworkCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👨‍🏫 你认真记下了前辈的每一条建议。'这些都是用时间换来的经验啊。' 智力+3,心智+5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "一个行业前辈对你说:'小伙子/小姑娘,我看你挺有潜力的,有什么不懂的可以问我。' 你意识到,这是一个难得的学习机会。";
      }
    },

    // ====== C→A: 技能市场价值 ======
    {
      id: "c661_skill_market_value", phase: "street", _isChainEvent: false, icon: "💰",
      title: "技能定价",
      story: "你发现,同样的技能在不同地方价值不同——{desc}",
      triggers: { minDay: 20, interval: 60, maxRepeats: 8, excludeFlags: ["_c661SkillMarketValueCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._c661SkillMarketValueCooldown) return false;
        return true;
      },
      choices: [
        { text: "🔍 调研市场价格", hint: "智力+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c661SkillMarketValueCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你调研了市场上各种技能的薪酬水平。'原来同一种技能,在不同行业的价格差这么多!' 智力+5,心智+2。", "success");
        }},
        { text: "📈 提升高价值技能", hint: "最高价值技能XP+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c661SkillMarketValueCooldown = true;
          var highValue = ["coding", "accounting", "management", "sales", "electrician"];
          if (typeof Random !== "undefined" && typeof addSkillXp === "function") {
            try { addSkillXp(Random.fromArray(highValue), 10); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 你决定重点提升市场价值最高的技能。'学就学最值钱的!' 高价值技能XP+10。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现,同样是修东西,在科技园修电脑比在城中村修家电贵三倍。'技能的价值,取决于你所在的市场。' 你开始思考怎么让技能更值钱。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();