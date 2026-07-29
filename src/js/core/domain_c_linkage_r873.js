/*
 * 城市浮生记 — 域C(职业/成长) 联动增强 R873
 * 全系统优化·Domain C 第六十八轮循环
 *
 * 【联动增强3项 — C→D 方向(仅2次,历轮最薄弱)】
 *   1. C→D 职业导师介绍人脉v1 — 职业技能达到一定水平,导师介绍高阶人脉
 *   2. C→D 同行聚会结识行业人脉v1 — 在职≥90天触发行业聚会
 *   3. C→D 职业口碑影响社交地位v1 — 职业声誉影响NPC对玩家的态度
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS,避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 *  - C→D 核心设计理念：职业成长不应只是数值提升,
 *    还应带来社交圈的扩展和人际关系的深化——禀赋效应+社会认同。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR873Loaded) return;
  RANDOM_EVENTS._domainCLinkageR873Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  /** 获取最高等级的真实技能键 */
  function topSkillKey(state) {
    if (!state || !state.skills) return null;
    var _best = null, _topLv = 0;
    for (var _sk in state.skills) {
      var _sl = state.skills[_sk];
      if (_sl && (_sl.level || 0) > _topLv) { _topLv = _sl.level || 0; _best = _sk; }
    }
    return _best;
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: C→D 职业导师介绍人脉v1
    // 设计意图：职业技能达到一定水平后,导师/前辈主动介绍高阶人脉,
    //   体现"职业成长→社交圈扩展"的正反馈——禀赋效应+社会认同。
    // 触发：任一技能≥Lv.40 + ≥1个好感≥50的NPC
    // 心理学：禀赋效应(技能被认可产生的拥有感)+社会认同(被前辈提携)
    // ========================================================================
    {
      id: "c873_mentor_introduce_network_v1",
      phase: "street",
      icon: "👨‍🏫",
      title: "导师介绍人脉",
      story: "你在职场的表现引起了一位前辈的注意。\n\n「你小子不错,我介绍个人给你认识——在这一行干了十几年,资源广得很。跟着他学,少走弯路。」\n\n好机会,但也意味着新的社交责任。",
      triggers: { minDay: 80, interval: 200, maxRepeats: 1, excludeFlags: ["_c873MentorIntroCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c873MentorIntroCd) return false;
        // 需有至少1个技能≥Lv.40
        if (!st.skills) return false;
        var _hasExpertSkill = false;
        for (var _sk in st.skills) {
          var _sl = st.skills[_sk];
          if (_sl && (_sl.level || 0) >= 40) { _hasExpertSkill = true; break; }
        }
        if (!_hasExpertSkill) return false;
        // 需有至少1个好感≥50的已结识NPC(导师人选)
        if (!st.relationships) return false;
        var _hasMentor = false;
        for (var _rid in st.relationships) {
          var _rr = st.relationships[_rid];
          if (_rr && _rr.met && (_rr.affinity || 0) >= 50) { _hasMentor = true; break; }
        }
        return _hasMentor;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "👨‍🏫 感谢前辈,认真结识",
          hint: "社交XP+20, 魅力+12, 导师好感+10, 置_c873NetworkExpanded",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c873MentorIntroCd = true;
            st.flags._c873NetworkExpanded = true;
            grantXp("social", 20);
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 12);
            // 给最高好感NPC(导师)大幅提升
            var _bestNpc = null, _bestAff = -1;
            if (st.relationships) {
              for (var _id in st.relationships) {
                var _r = st.relationships[_id];
                if (_r && _r.met && (_r.affinity || 0) > _bestAff) { _bestAff = _r.affinity || 0; _bestNpc = _id; }
              }
            }
            if (_bestNpc && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, _bestNpc, 10, "导师介绍人脉");
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("👨‍🏫 感谢前辈介绍人脉——社交XP+20, 魅力+12, 导师好感+10。", "success");
            }
          }
        },
        {
          text: "😅 自己慢慢积累,不麻烦前辈",
          hint: "心智+10, 置_c873SelfReliant",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c873MentorIntroCd = true;
            st.flags._c873SelfReliant = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 自己慢慢积累——心智+10。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: C→D 同行聚会结识行业人脉v1
    // 设计意图：在职达到一定天数后,触发行业聚会事件,
    //   结识新的行业NPC或加深现有NPC关系——社会认同+弱连接理论。
    // 触发：在职≥90天 + ≥2个已结识NPC
    // 心理学：社会认同(同行认可)+弱连接理论(泛泛之交的信息价值)
    // ========================================================================
    {
      id: "c873_industry_mix_v1",
      phase: "street",
      icon: "🥂",
      title: "同行聚会",
      story: "一个行业交流会的邀请函摆在你面前——同行们聚在一起,聊聊行业动态,分享经验。\n\n这种聚会,是结识行业人脉的好机会。",
      triggers: { minDay: 90, interval: 180, maxRepeats: 2, excludeFlags: ["_c873MixCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c873MixCd) return false;
        // 需有固定工作且在职≥90天
        if (!st.career || !st.career.currentJob) return false;
        if ((st.career.currentJob.workDays || 0) < 90) return false;
        // 需有至少2个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🥂 积极参加,扩展人脉",
          hint: "社交XP+18, 魅力+10, 所有已结识NPC好感+3, 置_c873Mixer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c873MixCd = true;
            st.flags._c873Mixer = true;
            grantXp("social", 18);
            if (st.player) st.player.charm = Math.min(100, (st.player.charm || 50) + 10);
            // 给所有已结识NPC小幅好感提升
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 3, "行业聚会");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🥂 积极参加同行聚会——社交XP+18, 魅力+10, 所有朋友好感+3。", "success");
            }
          }
        },
        {
          text: "😅 独自钻研,不凑热闹",
          hint: "心智+10, 最高技能XP+8, 置_c873SoloStudy",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c873MixCd = true;
            st.flags._c873SoloStudy = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            var _top = topSkillKey(st);
            if (_top) grantXp(_top, 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 独自钻研技能——心智+10, 最高技能XP+8。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: C→D 职业口碑影响社交地位v1
    // 设计意图：职业声誉(performance)影响NPC对玩家的态度,
    //   好口碑让社交更顺畅——社会认同+禀赋效应。
    // 触发：performance≥70 + ≥3个已结识NPC
    // 心理学：社会认同(被认可的价值感)+禀赋效应(声誉的拥有感)
    // ========================================================================
    {
      id: "c873_career_reputation_social_v1",
      phase: "street",
      icon: "🏆",
      title: "职业口碑",
      story: "你在职场的好名声传开了——「那个小伙子/姑娘靠谱,做事认真」。\n\n朋友们提起你时,语气里多了一份尊重。",
      triggers: { minDay: 120, interval: 240, maxRepeats: 1, excludeFlags: ["_c873ReputationCd"] },
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._c873ReputationCd) return false;
        // 需有固定工作且performance≥70
        if (!st.career || !st.career.currentJob) return false;
        if ((st.career.currentJob.performance || 0) < 70) return false;
        // 需有至少3个已结识NPC
        if (!st.relationships) return false;
        var _metCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met) _metCount++;
        }
        return _metCount >= 3;
      },
      probability: 0.04,
      repeatable: false,
      choices: [
        {
          text: "🏆 珍惜口碑,继续努力",
          hint: "社交XP+15, 心智+10, 所有已结识NPC好感+5, 置_c873ReputationKeeper",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c873ReputationCd = true;
            st.flags._c873ReputationKeeper = true;
            grantXp("social", 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (st.relationships && typeof applyAffinityChange === "function") {
              for (var _mid in st.relationships) {
                var _mr = st.relationships[_mid];
                if (_mr && _mr.met) applyAffinityChange(st, _mid, 5, "职业口碑");
              }
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏆 珍惜职业口碑——社交XP+15, 心智+10, 所有朋友好感+5。", "success");
            }
          }
        },
        {
          text: "😅 口碑是虚的,实力才是真的",
          hint: "智力+12, 置_c873Pragmatist",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c873ReputationCd = true;
            st.flags._c873Pragmatist = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😅 口碑是虚的,实力才是真的——智力+12。", "info");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) { RANDOM_EVENTS.push(EVENTS[i]); }
})();
