/*
 * 城市浮生记 — 域C（职业/成长）联动增强事件
 * v3.107 · loop R16 全系统优化·Domain C 职业成长→跨域桥接
 *
 * 设计约束（与 R11 economy / R12 lifecycle / R13 company / R14 data 一致）：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组（非 ES import），避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - 事件引擎严格按 e.phase 过滤（state.player.phase 仅 "street"/"corporate"），
 *    故本文件事件须显式设置 phase；这里 2 street + 1 corporate 覆盖两种人生阶段。
 *  - 里程碑类事件用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截），不依赖引擎 onResolved。
 *  - 职业体系唯一权威入口为 CAREER_PATHS（src/js/ui/career_dev.js），本文件仅做跨域桥接，
 *    不新建平行职业系统、不改 CAREER_PATHS 结构。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._careerLinkageLoaded) return;
  RANDOM_EVENTS._careerLinkageLoaded = true;

  // ---- 本地助手（IIFE 作用域，避免与同模式文件命名冲突） ----

  // 取已结识且好感达阈值的 NPC 列表
  function getMetNpcsC(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff)
        out.push({ id: id, rel: r });
    }
    return out;
  }

  // 取好感最高的已结识 NPC
  function pickClosestMetNpcC(st, minAff) {
    var met = getMetNpcsC(st, minAff || 0);
    if (!met.length) return null;
    met.sort(function (a, b) {
      return (b.rel.affinity || 0) - (a.rel.affinity || 0);
    });
    return met[0];
  }

  // 安全改好感：优先全局 applyAffinityChange（自动 clamp + 记 _lastInteractionDay），否则兜底直写
  function safeAffinityC(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  // 取当前最高技能等级（衡量"成长成果"）
  function topSkillLevelC(st) {
    if (!st || !st.skills) return 0;
    var top = 0;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && st.skills[k].level) || 0;
      if (lv > top) top = lv;
    }
    return top;
  }

  // ---- 域C 联动事件 ----

  var CAREER_EVENTS = [
    // ===== C→D：职业成长（技能被看见）↔ 社交（前辈提携） =====
    {
      id: "career_mentor_bond",
      title: "一位前辈递来了名片",
      desc: "你在专业上的成长，被圈子里一位资深前辈留意到了。饭桌上他半开玩笑地说：「后生可畏，以后多来往。」",
      phase: "street",
      triggers: { minDay: 75 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._careerMentorBondCooldown) return false;
        // 有一份工作 + 技能达到"被看见"的门槛 + 至少有一个已结识 NPC
        var hasJob = !!(st.career && st.career.currentJob);
        if (!hasJob) return false;
        if (topSkillLevelC(st) < 20) return false; // [PLACEHOLDER] 技能"被看见"门槛
        if (!getMetNpcsC(st, 5).length) return false;
        return true;
      },
      choices: [
        {
          text: "珍惜这份提携，主动维系关系",
          apply: function (st) {
            var npc = pickClosestMetNpcC(st, 5);
            if (npc) safeAffinityC(st, npc.id, 6, "前辈提携·职业成长");
            if (st.player) st.player.mental = (st.player.mental || 50) + 3;
            if (st.flags) st.flags._careerMentorBondCooldown = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "专业上的成长，为你换来了一段值得珍惜的人脉。",
                "good",
              );
          },
        },
        {
          text: "客气收下，保持距离",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 1;
            if (st.flags) st.flags._careerMentorBondCooldown = true;
          },
        },
      ],
      probability: 0.05,
    },

    // ===== C→A：技能里程碑 ↔ 数值成长（属性/心智回馈） =====
    {
      id: "career_skill_milestone",
      title: "技能树上亮起一颗节点",
      desc: "长期打磨的一项专长，终于跨过了熟练的分水岭。你能明显感觉到：处理同样的事，脑子转得更快、手也更稳了。",
      phase: "street",
      triggers: { minDay: 100 },
      conditions: function (st) {
        if (!st || !st.player || !st.skills) return false;
        if (st.flags && st.flags._careerSkillMilestoneDone) return false;
        if (topSkillLevelC(st) < 40) return false; // [PLACEHOLDER] 技能里程碑门槛
        return true;
      },
      choices: [
        {
          text: "把熟练转化为综合能力的提升",
          apply: function (st) {
            // A域桥接：技能里程碑回馈基础属性（智力/心智）
            if (st.player) {
              st.player.intelligence =
                (st.player.intelligence || 20) + 2; // [PLACEHOLDER] 属性回馈
              st.player.mental = (st.player.mental || 50) + 4;
            }
            if (st.flags) st.flags._careerSkillMilestoneDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "专精一项技能，反过来让你整个人都更从容了。",
                "good",
              );
          },
        },
        {
          text: "低调继续，稳扎稳打",
          apply: function (st) {
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._careerSkillMilestoneDone = true;
          },
        },
      ],
      probability: 0.04,
    },

    // ===== C→E：职场晋升势能 ↔ 经济/投资资本（公司阶段加薪奖金） =====
    {
      id: "career_promotion_bonus",
      title: "年度考评：一笔晋升奖金",
      desc: "长期积累的职场口碑与晋升势能，换来了一次实打实的加薪与年终奖。到账那一刻，你开始盘算：这笔钱，也该让它替你工作了。",
      phase: "corporate",
      triggers: { minDay: 130 },
      conditions: function (st) {
        if (!st || !st.player) return false;
        if (st.flags && st.flags._careerPromotionBonusDone) return false;
        var upward =
          (st.player.corporate && st.player.corporate.upward) || 0;
        if (upward < 60) return false; // [PLACEHOLDER] 晋升势能门槛
        return true;
      },
      choices: [
        {
          text: "拿出一部分奖金开始理财",
          apply: function (st) {
            // E域桥接：晋升奖金入银行户，释放可投资资金并强化投资心态
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 25000; // [PLACEHOLDER] 晋升奖金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 4;
            if (st.flags) {
              st.flags._careerPromotionBonusDone = true;
              st.flags._dataInvestorMindset = true; // 与 R14 data_savings_milestone 复用同一投资心态 flag
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "职场努力兑现成一笔奖金，你把它变成了投资的起点。",
                "good",
              );
          },
        },
        {
          text: "全部存起来，落袋为安",
          apply: function (st) {
            if (st.resources) {
              st.resources.bankBalance =
                (st.resources.bankBalance || 0) + 25000; // [PLACEHOLDER] 晋升奖金
            }
            if (st.player) st.player.mental = (st.player.mental || 50) + 2;
            if (st.flags) st.flags._careerPromotionBonusDone = true;
          },
        },
      ],
      probability: 0.04,
    },
  ];

  for (var i = 0; i < CAREER_EVENTS.length; i++) {
    RANDOM_EVENTS.push(CAREER_EVENTS[i]);
  }
})();
