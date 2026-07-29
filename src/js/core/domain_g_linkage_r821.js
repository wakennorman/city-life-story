/*
 * 城市浮生记 — 域G(核心机制/生命周期) 联动增强 R821
 * 全系统优化·Domain G 第六十轮循环
 *
 * 【联动增强3项】
 *   1. G→A 数据健康觉醒 — 核心机制数据转化为数值平衡洞察
 *   2. G→D 人生社交里程碑 — 人生节点触发NPC社交事件
 *   3. G→H 创始人生活平衡 — 创业者身心状态影响公司决策
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR821Loaded) return;
  RANDOM_EVENTS._domainGLinkageR821Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: G→A 数据健康觉醒 — 核心机制数据转化为数值洞察
    // 设计意图：核心机制产生的数据(健康/需求/状态)应成为数值域可消费的资产。
    // 本事件在玩家健康<40时触发，给予"数据健康觉醒"标记。
    // 心理学：损失厌恶 — 玩家更害怕失去健康。
    // ========================================================================
    {
      id: "g821_data_health_awakening",
      phase: "street",
      icon: "💡",
      title: "健康数据在警告你",
      story: "你看着健康面板上的数字——它们不再只是数字，而是你身体发出的警告。\n\n健康<40，需求告急，状态不佳……这些数据在告诉你：该停下来休息了。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g821DataHealthDone) return false;
        var _health = st.status ? st.status.health : 100;
        return _health < 40 && st.player.day >= 30;
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "💡 重视健康数据，调整生活方式",
          hint: "智力+8, 置_g821DataHealthAware",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g821DataHealthDone = true;
            st.flags._g821DataHealthAware = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 你开始重视健康数据——智力+8。听懂数据的声音，才能更好地照顾自己。", "success");
            }
          }
        },
        {
          text: "😅 小毛病，不用在意",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g821DataHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 小毛病，不用在意。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: G→D 人生社交里程碑 — 人生节点触发NPC社交事件
    // 设计意图：人生节点(年龄/阶段)应触发NPC社交事件，让玩家感到"朋友陪我成长"。
    // 本事件在玩家年龄≥25且拥有≥3个好友时触发。
    // 心理学：社会支持 — 被朋友陪伴的满足感。
    // ========================================================================
    {
      id: "g821_life_social_milestone",
      phase: "street",
      icon: "🎉",
      title: "朋友们陪你走过人生节点",
      story: "你发现——每当你走到人生的一个重要节点，总有一些朋友在你身边。\n\n他们不一定能帮你解决问题，但他们的陪伴，本身就是一种力量。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g821LifeSocialDone) return false;
        if (!st.relationships) return false;
        var _age = st.player.age || 18;
        if (_age < 25) return false;
        var _friends = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _friends++;
        }
        return _friends >= 3;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🎉 感谢朋友的陪伴",
          hint: "心情+10, 置_g821FriendCompanion",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g821LifeSocialDone = true;
            st.flags._g821FriendCompanion = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 感谢朋友的陪伴——心情+10。人生的路上，有朋友同行，是一种幸运。", "success");
            }
          }
        },
        {
          text: "😊 自己走也挺好",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g821LifeSocialDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 自己走也挺好。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: G→H 创始人生活平衡 — 创业者身心状态影响公司决策
    // 设计意图：创业者的身心状态应影响公司决策质量，形成"个人→公司"反馈环。
    // 本事件在corporate阶段且玩家健康<50时触发。
    // 心理学：损失厌恶 — 玩家更害怕因个人问题影响公司。
    // ========================================================================
    {
      id: "g821_founder_life_balance",
      phase: "corporate",
      icon: "⚖️",
      title: "创始人平衡不好，公司也会出问题",
      story: "你发现——当你疲惫、焦虑、状态不好的时候，公司的决策也会受到影响。\n\n创始人就是公司的天花板。你的状态，就是公司的状态。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._g821FounderBalanceDone) return false;
        if (st.player.phase !== "corporate") return false;
        var _health = st.status ? st.status.health : 100;
        return _health < 50 && st.player.day >= 90;
      },
      probability: 0.08,
      repeatable: false,
      choices: [
        {
          text: "⚖️ 调整生活节奏，平衡工作",
          hint: "健康+10, KPI+5, 置_g821WorkLifeBalance",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g821FounderBalanceDone = true;
            st.flags._g821WorkLifeBalance = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 50) + 10);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 0) + 5);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚖️ 你调整了生活节奏——健康+10, KPI+5。平衡好生活，才能经营好公司。", "success");
            }
          }
        },
        {
          text: "🔥 公司要紧，个人再说",
          hint: "健康-5, KPI+10, 置_g821BurnoutRisk",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g821FounderBalanceDone = true;
            st.flags._g821BurnoutRisk = true;
            if (st.status) st.status.health = Math.max(0, (st.status.health || 50) - 5);
            if (st.player && st.player.corporate) {
              st.player.corporate.kpi = Math.min(150, (st.player.corporate.kpi || 0) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🔥 你选择先顾公司——健康-5, KPI+10。注意身体！", "warning");
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
