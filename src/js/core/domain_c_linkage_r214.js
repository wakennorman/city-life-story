/*
 * 城市浮生记 — 域C（职业/成长）联动增强 · R214
 * 全系统优化 loop R214 · 联动增强 2项
 *
 * 设计约束：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR214) return;
  RANDOM_EVENTS._domainCLinkageR214 = true;

  function safeAffinityR214(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "域C R214联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId])
      st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity =
      (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var C_EVENTS = [

    // ===== 联动1: C→D 技能传帮带 =====
    // 设计意图：当玩家某项技能达到较高水平（≥60），可以指导该领域有潜力的NPC，
    //   增进关系的同时获得技能XP奖励，让技能成长产生社交价值。
    {
      id: "skill_mentor_npc",
      title: "技能指导",
      desc: "你的技能水平引起了身边人的注意，有人想向你请教学习。",
      phase: "street",
      triggers: { minDay: 15 },
      conditions: function (st) {
        if (!st || !st.flags || !st.skills) return false;
        if (st.flags._skillMentorDone) return false;
        // 检查是否有任何技能≥60
        var hasHighSkill = false;
        var highSkill = null;
        for (var sk in st.skills) {
          if (st.skills[sk] && (st.skills[sk].level || 0) >= 60) {
            hasHighSkill = true;
            highSkill = sk;
            break;
          }
        }
        if (!hasHighSkill) return false;
        // 需要至少认识一个NPC
        if (!st.relationships) return false;
        var metCount = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met) metCount++;
        }
        if (metCount < 1) return false;
        st.flags._skillMentorCache = highSkill;
        return true;
      },
      choices: [
        {
          text: "📚 耐心指导他",
          hint: "好感+8，技能XP+40",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._skillMentorDone = true;
            var skillKey = st.flags._skillMentorCache || "cooking";
            // 提升好感
            if (st.relationships) {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met) {
                  safeAffinityR214(st, id, 3, "技能指导");
                  break;
                }
              }
            }
            // 技能XP奖励
            if (st.skills && st.skills[skillKey]) {
              st.skills[skillKey].xp = (st.skills[skillKey].xp || 0) + 40;
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📚 你耐心指导了一番，对方受益匪浅。好感+3，技能经验+40。", "success");
          },
        },
        {
          text: "😅 婉拒了，没时间",
          hint: "无变化",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._skillMentorDone = true;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("😅 你婉拒了请求，对方表示理解。", "info");
          },
        },
      ],
    },

    // ===== 联动2: C→A 技能巧用 =====
    // 设计意图：当玩家技能组合达到特定水平时，发现日常生活中的省钱/赚钱小技巧，
    //   让技能成长产生实际的经济效益。
    {
      id: "skill_smart_use",
      title: "技能巧用",
      desc: "你日常积累的知识和技能让你发现了一个省钱的妙招。",
      phase: "street",
      triggers: { minDay: 10 },
      conditions: function (st) {
        if (!st || !st.flags || !st.skills) return false;
        if (st.flags._skillSmartUseDone) return false;
        // 需要至少两项技能≥30
        var highCount = 0;
        for (var sk in st.skills) {
          if (st.skills[sk] && (st.skills[sk].level || 0) >= 30) highCount++;
        }
        return highCount >= 2;
      },
      choices: [
        {
          text: "💡 试试看",
          hint: "小赚一笔",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._skillSmartUseDone = true;
            var bonus = 100 + Random.int(0, 200);
            st.resources.cash = (st.resources.cash || 0) + bonus;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + bonus;
            // 智力微量增长
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💡 你利用技能找到了一个省钱办法，赚了¥" + bonus + "。", "success");
          },
        },
        {
          text: "🤔 记下来，以后再用",
          hint: "技能XP+20",
          apply: function (st) {
            if (!st || !st.flags) return;
            st.flags._skillSmartUseDone = true;
            // 随机提升一项技能XP
            var skillKeys = Object.keys(st.skills || {});
            if (skillKeys.length > 0) {
              var randSk = skillKeys[Random.int(0, skillKeys.length - 1)];
              if (st.skills[randSk]) {
                st.skills[randSk].xp = (st.skills[randSk].xp || 0) + 20;
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤔 你记下了这个妙招，感觉自己的技能又有精进。技能XP+20。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < C_EVENTS.length; i++) {
    RANDOM_EVENTS.push(C_EVENTS[i]);
  }
})();