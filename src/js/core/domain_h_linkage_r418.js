/**
 * 域H(Phase2/公司) 联动增强 R418
 * （原编号R417执行中被并行窗口占用，本文件按SOP改号r418，事件id前缀h418_全库唯一）
 * 设计基调（峰终定律+禀赋效应）：把玩家在 Phase1 的"沉没积累"在 Phase2 兑现为
 * 可感知的高光时刻，强化跨阶段禀赋感；同时把公司数据转化为社交与财富叙事。
 * 桥接：
 *   H→G  h418_street_roots    街头岁月回望 — 全库首个事件消费 flags._totalStreetDays
 *     （此前仅 corp_legacy_bonus 入职定级 + career_dev UI 读取，事件层零消费）
 *   H→D  h418_team_dinner     团队聚餐 — corporate.team 规模→老友好感传导
 *     （守域D铁律：rel&&rel.met + applyAffinityChange 位置参数）
 *   H→E  h418_expert_consult  外部咨询邀约 — corporate.ability 高能力→外快变现
 *     （ability 此前只被 enterprise_fate 数值消费，无叙事包装）
 *
 * 严格照 domain_h_linkage_r410.js / r404.js 已验证 IIFE 注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainHLinkageR418Loaded) return;
  RANDOM_EVENTS._domainHLinkageR418Loaded = true;

  // 安全技能经验（addSkillXp 全局读 state，签名 (skillKey, amount)）
  function grantSkillXpR418(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  // 找到首个已结识 NPC（域D铁律：必须 rel && rel.met）
  function firstMetNpcR418(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      var rel = st.relationships[id];
      if (rel && rel.met === true) return id;
    }
    return null;
  }

  var EVENTS = [
    {
      // H→G: 街头岁月回望 — 全库首个事件消费 flags._totalStreetDays
      id: "h418_street_roots",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🌆",
      title: "街头岁月回望",
      story:
        "加班后的深夜，出租车驶过你曾经摆摊的街口。你摇下车窗——那些在街头讨生活的日子，成了今天坐进写字楼的底气。",
      triggers: { minDay: 100, excludeFlags: ["_h418StreetRootsSeen"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        var streetDays = (st.flags && st.flags._totalStreetDays) || 0;
        return streetDays >= 60; // [PLACEHOLDER] 街头历练天数门槛
      },
      choices: [
        {
          text: "🌆 那段日子塑造了今天的我",
          hint: "心智+5,心情+4,置 _h418StreetRootsSeen(终身一次)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h418StreetRootsSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5); // [PLACEHOLDER]
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4); // [PLACEHOLDER]
            var d = (st.flags._totalStreetDays || 0);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🌆 " + d + "天街头历练不是弯路，是别人拿不走的底气。心智+5,心情+4。", "success");
          }
        },
        {
          text: "🚕 不想回头看，继续向前",
          hint: "心智+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h418StreetRootsSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          }
        }
      ]
    },
    {
      // H→D: 团队聚餐 — corporate.team 规模→老友好感传导（守域D铁律）
      id: "h418_team_dinner",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🍻",
      title: "团队聚餐",
      story:
        "项目节点顺利交付，你张罗了一顿团队聚餐。饭桌上有人提议：把你城里的老朋友也叫来认识认识——人脉就是这样滚起来的。",
      triggers: { minDay: 90, excludeFlags: ["_h418TeamDinnerCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.corporate || !st.corporate.team || st.corporate.team.length < 2) return false;
        return !!firstMetNpcR418(st); // 必须已有结识的 NPC 才可传导好感
      },
      choices: [
        {
          text: "🍻 把老朋友也叫上",
          hint: "老友好感+6,心情+3,置 _h418TeamDinnerCooldown",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h418TeamDinnerCooldown = true;
            var npcId = firstMetNpcR418(st);
            var shown = npcId;
            if (npcId && typeof applyAffinityChange === "function") {
              try {
                applyAffinityChange(st, npcId, 6, "团队聚餐引荐"); // [PLACEHOLDER] 位置参数固定 (state,npcId,change,reason)
              } catch (e) { /* safe */ }
              if (typeof getNpcDisplayName === "function") {
                try { shown = getNpcDisplayName(npcId); } catch (e2) { /* safe */ }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🍻 你把" + (shown || "老朋友") + "介绍给了团队——两个圈子在饭桌上连成一片。好感+6,心情+3。", "success");
          }
        },
        {
          text: "👥 就团队内部聚聚",
          hint: "心情+2",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h418TeamDinnerCooldown = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2); // [PLACEHOLDER]
          }
        }
      ]
    },
    {
      // H→E: 外部咨询邀约 — corporate.ability 高能力→外快变现
      id: "h418_expert_consult",
      phase: "corporate",
      _isChainEvent: false,
      icon: "💼",
      title: "外部咨询邀约",
      story:
        "一家初创公司通过前同事找到你，想请你做一次付费业务咨询——你在公司里练出来的能力，市场上有人愿意真金白银地买单。",
      triggers: { minDay: 120, excludeFlags: ["_h418ConsultCooldown"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return ((st.player.corporate.ability || 0) >= 60); // [PLACEHOLDER] 能力门槛
      },
      choices: [
        {
          text: "💼 接下这单咨询",
          hint: "现金+1500,会计XP+6,置 _h418ConsultCooldown",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h418ConsultCooldown = true;
            if (st.resources) st.resources.cash = (st.resources.cash || 0) + 1500; // [PLACEHOLDER] 咨询费
            grantSkillXpR418("accounting", 6); // [PLACEHOLDER]
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💼 两小时咨询,对方付了¥1500——能力值钱的感觉真好。现金+1500,会计XP+6。", "success");
          }
        },
        {
          text: "🙅 精力有限，婉拒",
          hint: "心智+2(专注主业)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._h418ConsultCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          }
        }
      ]
    }
  ];

  // 注入 RANDOM_EVENTS（id 去重防双载）
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    var dup = false;
    for (var j = 0; j < RANDOM_EVENTS.length; j++) {
      if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === _e.id) { dup = true; break; }
    }
    if (!dup) RANDOM_EVENTS.push(_e);
  }
})();
