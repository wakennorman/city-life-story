/*
 * 城市浮生记 — 域B(事件/叙事) 联动增强 R875
 * 全系统优化·Domain B 第六十九轮循环
 *
 * 【联动增强3项 — B→D 方向(仅2次,历轮最薄弱)】
 *   1. B→D 事件失败后朋友的安慰v1 — 负面事件后已结识NPC主动安慰
 *   2. B→D 事件成功后朋友的祝贺v1 — 正面事件后已结识NPC主动祝贺
 *   3. B→D 道德事件影响NPC态度v1 — 道德选择后NPC对玩家态度变化
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - B→D 核心设计理念：事件不应只是孤立的叙事,
 *    好的事件有人祝贺,坏的事件有人安慰——社会支持+峰终定律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR875Loaded) return;
  RANDOM_EVENTS._domainBLinkageR875Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  /** 获取最高好感的已结识NPCid */
  function topMetNpcId(state) {
    if (!state || !state.relationships) return null;
    var _best = null, _bestAff = -101;
    for (var _id in state.relationships) {
      if (!Object.prototype.hasOwnProperty.call(state.relationships, _id)) continue;
      var _r = state.relationships[_id];
      if (_r && _r.met && (_r.affinity || 0) > _bestAff) { _bestAff = _r.affinity || 0; _best = _id; }
    }
    return _best;
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: B→D 事件失败后朋友的安慰v1
    // 设计意图：玩家经历负面事件(亏损/被骗/生病)后,
    //   已结识NPC主动安慰——社会支持+峰终定律。
    // 触发：玩家心情<30 + ≥1个好感≥40的NPC
    // 心理学：社会支持(低谷时的温暖)+峰终定律(危机时刻的记忆)
    // ========================================================================
    {
      id: "b875_event_loss_comfort_v1",
      phase: "street",
      icon: "💚",
      title: "低谷时,有人陪着你",
      story: "最近运气不太好,心情跌到了谷底。\n\n这时候,一个朋友找到了你——什么都没说,只是默默递过来一瓶啤酒,陪你坐了一会儿。\n\n有些温暖,不必多说。",
      triggers: { minDay: 60, interval: 200, maxRepeats: 1, excludeFlags: ["_b875ComfortCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b875ComfortCd) return false;
        // 需心情<30(低谷状态)
        if (!st.needs || (st.needs.happiness || 50) >= 30) return false;
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
          text: "💚 感谢朋友的陪伴",
          hint: "社交XP+15, 朋友好感+8, 心情+15, 置_b875Grateful",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b875ComfortCd = true;
            st.flags._b875Grateful = true;
            grantXp("social", 15);
            var _friend = topMetNpcId(st);
            if (_friend && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _friend, 8, "低谷时安慰");
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💚 感谢朋友的陪伴——社交XP+15, 朋友好感+8, 心情+15。", "success");
            }
          }
        },
        {
          text: "😅 自己消化,不让朋友担心",
          hint: "心智+12, 置_b875SoloProcess",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b875ComfortCd = true;
            st.flags._b875SoloProcess = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 自己消化——心智+12。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: B→D 事件成功后朋友的祝贺v1
    // 设计意图：玩家经历正面事件(升职/发财/中奖)后,
    //   已结识NPC主动祝贺——社会认同+峰终定律。
    // 触发：玩家心情≥80 + ≥1个好感≥50的NPC
    // 心理学：社会认同(被朋友认可)+峰终定律(成功时刻的记忆)
    // ========================================================================
    {
      id: "b875_event_success_congrats_v1",
      phase: "street",
      icon: "🎉",
      title: "好消息,朋友们都知道了",
      story: "最近好事连连,心情大好。\n\n朋友们纷纷发来祝贺——「听说你最近混得不错啊,请客请客！」\n\n被朋友认可的感觉,真好。",
      triggers: { minDay: 80, interval: 240, maxRepeats: 1, excludeFlags: ["_b875CongratsCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b875CongratsCd) return false;
        // 需心情≥80(高兴状态)
        if (!st.needs || (st.needs.happiness || 50) < 80) return false;
        // 需有至少1个好感≥50的已结识NPC
        if (!st.relationships) return false;
        var _hasFriend = false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 50) { _hasFriend = true; break; }
        }
        return _hasFriend;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🎉 请客,大家一起开心",
          hint: "社交XP+18, 所有已结识NPC好感+5, 置_b875Celebrate",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b875CongratsCd = true;
            st.flags._b875Celebrate = true;
            grantXp("social", 18);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 5, "成功祝贺");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 请客,大家一起开心——社交XP+18, 所有朋友好感+5。", "success");
            }
          }
        },
        {
          text: "😅 谦虚一下,继续努力",
          hint: "心智+10, 管理XP+10, 置_b875Humble",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b875CongratsCd = true;
            st.flags._b875Humble = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            grantXp("management", 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 谦虚一下——心智+10, 管理XP+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: B→D 道德事件影响NPC态度v1
    // 设计意图：玩家做出道德选择(拾金不昧/帮助他人)后,
    //   已结识NPC对玩家态度变化——社会认同+禀赋效应。
    // 触发：moral≥60 + ≥2个已结识NPC
    // 心理学：社会认同(被认可的价值感)+禀赋效应(道德资本的拥有感)
    // ========================================================================
    {
      id: "b875_moral_npc_attitude_v1",
      phase: "street",
      icon: "⚖️",
      title: "你的选择,朋友们看在眼里",
      story: "你最近做了一些让自己骄傲的事——帮助了需要帮助的人,做了对的事。\n\n朋友们看在眼里,对你的态度悄悄发生了变化。",
      triggers: { minDay: 100, interval: 280, maxRepeats: 1, excludeFlags: ["_b875MoralAttCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._b875MoralAttCd) return false;
        // 需道德≥60
        if (!st.player || (st.player.morality || 50) < 60) return false;
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
          hint: "社交XP+15, 所有已结识NPC好感+6, 心智+8, 置_b875MoralKeeper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b875MoralAttCd = true;
            st.flags._b875MoralKeeper = true;
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
          hint: "智力+10, 置_b875Pragmatist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b875MoralAttCd = true;
            st.flags._b875Pragmatist = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 道德不能当饭吃——智力+10。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
