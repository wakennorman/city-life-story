/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R798
 * 全系统优化·Domain C 第五十八轮循环
 *
 * 【联动增强3项】
 *   1. C→A 技能市场定价 — 技能等级转化为商品定价加成
 *   2. C→E 职业收入→投资本金 — 工资积累引导投资意识觉醒
 *   3. C→G 职业倦怠→健康 — 工作压力反馈为身心状态回响
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR798Loaded) return;
  RANDOM_EVENTS._domainCLinkageR798Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→A 技能市场定价 — 技能等级转化为商品定价加成
    // 设计意图：技能等级应影响商品定价/交易效率，让玩家感到"技能有用"。
    // 本事件在玩家拥有≥1个Lv.30+技能时触发，给予"技能定价加成"标记。
    // 心理学：禀赋效应 — 玩家更珍视自己投入时间培养的技能。
    // ========================================================================
    {
      id: "c798_skill_pricing_bonus",
      phase: "street",
      icon: "🏷️",
      title: "你的技能，让你买卖更有优势",
      story: "你在市场上讨价还价，发现自己对商品价值的判断比别人准得多。\n\n那些练起来的技能——会计让你看懂成本，销售让你砍价有术，维修让你识别货好坏。\n\n技能不只是找工作的敲门砖，更是日常生活中的「定价权」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c798SkillPricingDone) return false;
        if (!st.skills) return false;
        // 至少1个技能≥Lv.30
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 30) return true;
        }
        return false;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🏷️ 用技能获取定价优势",
          hint: "智力+5, 销售XP+8, 置_c798SkillPricing",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c798SkillPricingDone = true;
            st.flags._c798SkillPricing = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("sales", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏷️ 技能让你在市场上更有优势——智力+5, 销售XP+8。", "success");
            }
          }
        },
        {
          text: "😊 技能用在哪都行",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c798SkillPricingDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 技能用在哪都行，开心就好。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→E 职业收入→投资本金 — 工资积累引导投资意识觉醒
    // 设计意图：职业收入应引导玩家关注投资，形成"赚钱→理财"的正向循环。
    // 本事件在玩家总资产≥¥5万且已就业≥30天时触发。
    // 心理学：禀赋效应 — 玩家感到"辛苦赚来的钱应该增值"。
    // ========================================================================
    {
      id: "c798_career_to_investment",
      phase: "street",
      icon: "💰",
      title: "工资躺着贬值，还是让它工作？",
      story: "你算了算——存在银行的工资，利息跑不赢通胀。\n\n辛苦赚来的钱，每天都在悄悄缩水。\n\n是时候让钱为你工作了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c798CareerInvestDone) return false;
        if (!st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        // 总资产≥5万且已就业≥30天
        return _total >= 50000 && st.player.day >= 30;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💰 学习让钱为自己工作",
          hint: "智力+8, 会计XP+10, 置_c798InvestMindset",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c798CareerInvestDone = true;
            st.flags._c798InvestMindset = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 你开始学习投资——智力+8, 会计XP+10。让钱为你工作。", "success");
            }
          }
        },
        {
          text: "😅 存银行最安全",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c798CareerInvestDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 存银行最安全，不求大富大贵。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→G 职业倦怠→健康 — 工作压力反馈为身心状态回响
    // 设计意图：职业倦怠应反馈为健康/心情下降，形成"工作→健康"反馈环。
    // 本事件在玩家倦怠≥60且健康<50时触发，警示"身体是革命的本钱"。
    // 心理学：损失厌恶 — 玩家更害怕因健康问题失去工作能力。
    // ========================================================================
    {
      id: "c798_career_burnout_health",
      phase: "street",
      icon: "😮‍💨",
      title: "工作压垮了你",
      story: "你连续加班第三周了。头痛、胃痛、失眠……身体的警告信号越来越明显。\n\n但工作还在继续——业绩要冲、项目要赶、领导要汇报。\n\n你咬了咬牙，继续撑。但身体，不会陪你硬扛。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c798BurnoutHealthDone) return false;
        // 倦怠≥60且健康<50
        var _burnout = st.player.corporate ? (st.player.corporate.burnout || 0) : (st.needs ? st.needs.fatigue : 0);
        var _health = st.status ? st.status.health : 100;
        return _burnout >= 60 && _health < 50;
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "💪 调整节奏，健康第一",
          hint: "健康+15, 疲劳-20, 置_c798HealthFirst",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c798BurnoutHealthDone = true;
            st.flags._c798HealthFirst = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 15);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💪 你决定调整节奏——健康+15, 疲劳-20。身体是革命的本钱。", "success");
            }
          }
        },
        {
          text: "🔥 再撑一阵子就好了",
          hint: "健康-10, 置_c798BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c798BurnoutHealthDone = true;
            st.flags._c798BurnoutRisk = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择继续硬撑——健康-10。注意身体！", "warning");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS ----
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
