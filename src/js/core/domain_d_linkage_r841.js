/*
 * 城市浮生记 — 域D(NPC/社交) 联动增强 R841
 * 全系统优化·Domain D 第六十四轮循环
 *
 * 【联动增强3项】
 *   1. D→B NPC事件回响v3 — NPC关系触发事件叙事回响
 *   2. D→E 社交投资情报v3 — NPC关系提供经济/投资线索
 *   3. D→G 社交健康恢复v3 — NPC关系反馈为身心状态恢复
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR841Loaded) return;
  RANDOM_EVENTS._domainDLinkageR841Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: D→B NPC事件回响v3 — NPC关系触发事件叙事回响
    // 设计意图：高好感NPC应触发特殊事件，让玩家感到"朋友多了路好走"。
    // 本事件在玩家拥有≥4个好感≥70的NPC时触发，给予"NPC事件回响v3"标记。
    // 心理学：峰终定律 — 与朋友的特殊时刻成为记忆锚点。
    // ========================================================================
    {
      id: "d841_npc_event_echo_v3",
      phase: "street",
      icon: "💫",
      title: "老朋友带来的意外惊喜",
      story: "你收到了一位老朋友的电话——他/她遇到了一个有趣的机会，第一时间想到了你。\n\n「有好事想着你」——这大概就是朋友最大的价值。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d841NpcEchoDone) return false;
        if (!st.relationships) return false;
        var _closeCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 70) _closeCount++;
        }
        return _closeCount >= 4;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💫 珍惜这份友谊",
          hint: "心情+15, 置_d841NpcEcho",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d841NpcEchoDone = true;
            st.flags._d841NpcEcho = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💫 老朋友带来的意外惊喜——心情+15。朋友多了路好走。", "success");
            }
          }
        },
        {
          text: "😊 谢谢，心领了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d841NpcEchoDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 谢谢，心领了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: D→E 社交投资情报v3 — NPC关系提供经济/投资线索
    // 设计意图：高好感NPC应能提供投资/经济线索，让玩家感到"朋友有用"。
    // 本事件在玩家拥有≥3个好感≥60的NPC且总资产≥¥8万时触发。
    // 心理学：互惠原则 — 玩家感到"帮朋友也是帮自己"。
    // ========================================================================
    {
      id: "d841_social_invest_v3",
      phase: "street",
      icon: "💡",
      title: "朋友的一句话，值千金",
      story: "吃饭时，一个朋友无意间提起：「最近那个行业好像要火，好多人往里挤。」\n\n别人当八卦听，你却在心里盘算——这条信息，值多少钱？",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d841InvestIntelDone) return false;
        if (!st.relationships || !st.resources) return false;
        var _total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        if (_total < 80000) return false;
        var _closeCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) _closeCount++;
        }
        return _closeCount >= 3;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💡 记录这条投资情报",
          hint: "智力+12, 会计XP+12, 置_d841InvestIntel",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d841InvestIntelDone = true;
            st.flags._d841InvestIntel = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            grantXp("accounting", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 你记录了这条投资情报——智力+12, 会计XP+12。", "success");
            }
          }
        },
        {
          text: "😅 听听而已，不当真",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d841InvestIntelDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 听听而已，不必当真。心智+2。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: D→G 社交健康恢复v3 — NPC关系反馈为身心状态恢复
    // 设计意图：NPC关系应提供被动的身心恢复，形成"社交→健康"正向循环。
    // 本事件在玩家拥有≥6个好友(好感≥40)时触发，给予"社交支持v3"标记。
    // 心理学：社会支持 — 被关爱感促进身心健康。
    // ========================================================================
    {
      id: "d841_social_health_v3",
      phase: "street",
      icon: "💚",
      title: "朋友是最好的保健品",
      story: "这天你心情不好，几个朋友约你出去坐坐。\n\n没有说什么大道理，就是一起吃顿饭、喝杯酒、聊聊天。\n\n但你感觉好多了——原来朋友，才是最好的保健品。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d841SocHealthDone) return false;
        if (!st.relationships) return false;
        var _friends = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 40) _friends++;
        }
        return _friends >= 6;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "💚 感谢朋友的陪伴",
          hint: "健康+10, 心情+12, 置_d841SocialSupport",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d841SocHealthDone = true;
            st.flags._d841SocialSupport = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 80) + 10);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 感谢朋友的陪伴——健康+10, 心情+12。朋友是最好的保健品。", "success");
            }
          }
        },
        {
          text: "😊 自己调整就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d841SocHealthDone = true;
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
