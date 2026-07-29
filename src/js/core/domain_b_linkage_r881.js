/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R881
 * 全系统优化·Domain B 第六十九轮循环
 *
 * 【联动增强3项 — B→D 方向(仅2次,历轮最薄弱)】
 *   1. B→D 重大事件后朋友的反应v1 — 重大事件触发NPC关心
 *   2. B→D 道德选择后朋友的态度v1 — 道德选择影响NPC态度
 *   3. B→D 事件分享增进友谊v1 — 分享事件加深NPC关系
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - B→D 核心设计理念：事件不应只是孤立的叙事,
 *    好的事件有人分享,坏的事件有人陪伴——社会支持+峰终定律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR881Loaded) return;
  RANDOM_EVENTS._domainBLinkageR881Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→D 重大事件后朋友的反应v1
    // 设计意图：玩家经历重大事件(升职/生病/中奖)后,
    //   已结识NPC主动关心——社会支持+峰终定律。
    // 触发：心情<30或≥80 + ≥1个好感≥40的NPC
    // 心理学：社会支持(低谷时的温暖)+峰终定律(极端情绪时刻的记忆)
    // ========================================================================
    {
      id: "b878_major_event_friend_reaction_v1",
      phase: "street",
      icon: "💕",
      title: "大事发生,朋友都来了",
      story: "最近经历了人生的重大转折——或喜或悲,都让你百感交集。\n\n朋友们不知道从哪里听说了,纷纷来找你——有的祝贺,有的安慰,有的只是默默陪你坐着。",
      triggers: { minDay: 70, interval: 180, maxRepeats: 2, excludeFlags: ["_b878EventReactCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b878EventReactCd) return false;
        // 需心情<30或≥80(极端情绪)
        if (!st.needs) return false;
        var _happy = st.needs.happiness || 50;
        if (_happy >= 30 && _happy < 80) return false;
        // 需有至少1个好感≥40的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 40) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💕 感谢朋友的陪伴",
          hint: "社交XP+18, 所有已结识NPC好感+5, 置_b878Thankful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b878EventReactCd = true;
            st.flags._b878Thankful = true;
            grantXp("social", 18);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 5, "重大事件关心");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💕 感谢朋友的陪伴——社交XP+18, 所有朋友好感+5。", "success");
            }
          }
        },
        {
          text: "😅 自己消化,不想麻烦人",
          hint: "心智+12, 置_b878Solo",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b878EventReactCd = true;
            st.flags._b878Solo = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 自己消化——心智+12。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→D 道德选择后朋友的态度v1
    // 设计意图：玩家做出道德选择(拾金不昧/帮助他人)后,
    //   已结识NPC对玩家态度变化——社会认同+禀赋效应。
    // 触发：道德≥65 + ≥2个已结识NPC
    // 心理学：社会认同(被认可的价值感)+禀赋效应(道德资本的拥有感)
    // ========================================================================
    {
      id: "b878_moral_friend_attitude_v1",
      phase: "street",
      icon: "⚖️",
      title: "你的选择,朋友们看在眼里",
      story: "你最近做了一些让自己骄傲的事——帮助了需要帮助的人,做了对的事。\n\n朋友们看在眼里,对你的态度悄悄发生了变化。",
      triggers: { minDay: 90, interval: 240, maxRepeats: 1, excludeFlags: ["_b878MoralAttCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b878MoralAttCd) return false;
        // 需道德≥65
        if ((st.player.morality || 50) < 65) return false;
        // 需有至少2个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 2;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "⚖️ 坚持做对的事",
          hint: "社交XP+15, 所有已结识NPC好感+6, 心智+8, 置_b878MoralKeeper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b878MoralAttCd = true;
            st.flags._b878MoralKeeper = true;
            grantXp("social", 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 6, "道德选择");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("⚖️ 坚持做对的事——社交XP+15, 所有朋友好感+6, 心智+8。", "success");
            }
          }
        },
        {
          text: "😅 道德不能当饭吃",
          hint: "智力+12, 置_b878Pragmatist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b878MoralAttCd = true;
            st.flags._b878Pragmatist = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 道德不能当饭吃——智力+12。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→D 事件分享增进友谊v1
    // 设计意图：玩家与NPC分享生活事件,加深彼此关系——
    //    社会认同+弱连接理论。
    // 触发：≥3个已结识NPC + 冷却期已过
    // 心理学：社会认同(被认可的价值感)+弱连接理论(泛泛之交的信息价值)
    // ========================================================================
    {
      id: "b878_event_sharing_bonding_v1",
      phase: "street",
      icon: "🤝",
      title: "分享让友谊更深",
      story: "和朋友聊天时,你分享了最近经历的事情——有欢笑,有泪水,有感慨。\n\n分享让彼此的关系更近了一步。",
      triggers: { minDay: 50, interval: 150, maxRepeats: 2, excludeFlags: ["_b878ShareCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b878ShareCd) return false;
        // 需有至少3个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 3;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🤝 主动分享,加深友谊",
          hint: "社交XP+18, 所有已结识NPC好感+4, 置_b878Sharer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b878ShareCd = true;
            st.flags._b878Sharer = true;
            grantXp("social", 18);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 4, "事件分享");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤝 主动分享,加深友谊——社交XP+18, 所有朋友好感+4。", "success");
            }
          }
        },
        {
          text: "😅 自己知道就好,不用分享",
          hint: "心智+10, 置_b878Private",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b878ShareCd = true;
            st.flags._b878Private = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 自己知道就好——心智+10。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
