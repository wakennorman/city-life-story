/*
 * 城市浮生记 — 域D(NPC/社交) 联动增强 R799
 * 全系统优化·Domain D 第五十九轮循环
 *
 * 【联动增强3项】
 *   1. D→A 社交资本量化 — NPC关系网络转化为数值平衡洞察
 *   2. D→E 社交投资情报 — NPC关系提供经济/投资线索
 *   3. D→G 社交健康恢复 — NPC关系反馈为身心状态恢复
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR799Loaded) return;
  RANDOM_EVENTS._domainDLinkageR799Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: D→A 社交资本量化 — NPC关系网络转化为数值洞察
    // 设计意图：NPC关系网络应产生可量化的"社交资本"，供数值域消费。
    // 本事件在玩家拥有≥5个已结识NPC时触发，给予"社交资本"标记。
    // 心理学：禀赋效应 — 玩家感到"我的人脉是我的财富"。
    // ========================================================================
    {
      id: "d799_social_capital_quant",
      phase: "street",
      icon: "💎",
      title: "你的人脉，就是你的财富",
      story: "你数了数——在这座城市里，你已经结识了不少人。\n\n每一个朋友，都是一份潜在的资源和帮助。经济学家管这叫「社交资本」，但你知道，这不只是数字。\n\n这是你在城市里的「安全网」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d799SocCapDone) return false;
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          if (st.relationships[_id] && st.relationships[_id].met) _metCount++;
        }
        return _metCount >= 5;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💎 量化我的社交资本",
          hint: "智力+5, 管理XP+8, 置_d799SocialCapital",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d799SocCapDone = true;
            st.flags._d799SocialCapital = true;
            // 计算社交资本总值供A域消费
            var _totalAff = 0;
            for (var _id in st.relationships) {
              var _r = st.relationships[_id];
              if (_r && _r.met) _totalAff += (_r.affinity || 0);
            }
            st.flags._d799SocialCapitalValue = _totalAff;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 5);
            grantXp("management", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💎 你的社交资本总值：" + _totalAff + "。智力+5, 管理XP+8。", "success");
            }
          }
        },
        {
          text: "😊 朋友不是用来量化的",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d799SocCapDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友不是用来量化的。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: D→E 社交投资情报 — NPC关系提供经济/投资线索
    // 设计意图：高好感NPC应能提供投资/经济线索，让玩家感到"朋友有用"。
    // 本事件在玩家拥有≥1个好感≥50的NPC时触发，给予"投资情报"标记。
    // 心理学：互惠原则 — 玩家感到"帮朋友也是帮自己"。
    // ========================================================================
    {
      id: "d799_social_invest_intel",
      phase: "street",
      icon: "💡",
      title: "朋友的一句话，值千金",
      story: "吃饭时，一个朋友无意间提起：「最近那个行业好像要火，好多人往里挤。」\n\n别人当八卦听，你却在心里盘算——这条信息，值多少钱？\n\n社交圈里的「软情报」，往往是投资决策的「硬依据」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d799InvestIntelDone) return false;
        if (!st.relationships) return false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 50) return true;
        }
        return false;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💡 记录这条投资情报",
          hint: "智力+8, 会计XP+8, 置_d799InvestIntel",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d799InvestIntelDone = true;
            st.flags._d799InvestIntel = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 8);
            grantXp("accounting", 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 你记录了这条投资情报——智力+8, 会计XP+8。朋友的一句话，值千金。", "success");
            }
          }
        },
        {
          text: "😅 听听而已，不当真",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d799InvestIntelDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 听听而已，不必当真。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: D→G 社交健康恢复 — NPC关系反馈为身心状态恢复
    // 设计意图：NPC关系应提供被动的身心恢复，形成"社交→健康"正向循环。
    // 本事件在玩家拥有≥3个好友(好感≥60)时触发，给予"社交支持"标记。
    // 心理学：社会支持 — 被关爱感促进身心健康。
    // ========================================================================
    {
      id: "d799_social_health_recovery",
      phase: "street",
      icon: "💚",
      title: "朋友是最好的保健品",
      story: "这天你心情不好，几个朋友约你出去坐坐。\n\n没有说什么大道理，就是一起吃顿饭、喝杯酒、聊聊天。\n\n但你感觉好多了——原来朋友，才是最好的保健品。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d799SocHealthDone) return false;
        if (!st.relationships) return false;
        var _closeFriends = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _closeFriends++;
        }
        return _closeFriends >= 3;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 感谢朋友的陪伴",
          hint: "健康+8, 心情+10, 置_d799SocialSupport",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d799SocHealthDone = true;
            st.flags._d799SocialSupport = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 8);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 感谢朋友的陪伴——健康+8, 心情+10。朋友是最好的保健品。", "success");
            }
          }
        },
        {
          text: "😊 自己调整就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d799SocHealthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 自己调整就好。心智+3。", "info");
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
