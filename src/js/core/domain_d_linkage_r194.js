/*
 * 城市浮生记 — 域D（NPC/社交）联动增强 · R194
 * 全系统优化 loop R194 · 联动增强 3项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；严守域D铁律(只读 state.relationships /
 *    rel&&rel.met 守卫 / 跨NPC好感传导走 applyAffinityChange)。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 *  - 数值标 [PLACEHOLDER]，便于后续平衡调参。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR194Loaded) return;
  RANDOM_EVENTS._domainDLinkageR194Loaded = true;

  // ---- 本地助手 ----

  // 取首个已结识(met)且好感≥minAff 的NPC id（避免硬编码未激活NPC造成死事件）
  function firstMetNpcD194(st, minAff) {
    if (!st || !st.relationships) return null;
    minAff = minAff || 0;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) return id;
    }
    return null;
  }

  // 安全好感传导（严守域D铁律：走 applyAffinityChange 自动钳制+记_lastInteractionDay+升级播报）
  function bumpAffinityD194(st, npcId, delta, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, delta, reason || "域D R194联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = Math.max(
      -100,
      Math.min(100, (st.relationships[npcId].affinity || 0) + delta),
    );
    st.relationships[npcId].met = true;
  }

  // 取玩家等级最高的真实技能键（addSkillXp 需真实键，否则静默 return）
  function topSkillKeyD194(st) {
    if (!st || !st.skills) return null;
    var best = null,
      bestLv = -1;
    for (var k in st.skills) {
      if (!Object.prototype.hasOwnProperty.call(st.skills, k)) continue;
      var lv = (st.skills[k] && (st.skills[k].level || 0)) || 0;
      if (lv > bestLv) {
        bestLv = lv;
        best = k;
      }
    }
    return best;
  }

  // ===== 联动1: D→A 朋友帮你理账 → 数据素养提升 + 理账意识flag =====
  RANDOM_EVENTS.push({
    id: "npc_d_r194_budget_buddy",
    phase: "street",
    icon: "🧮",
    title: "细心的朋友帮你理了笔账",
    desc:
      "一位平时过日子很精明的朋友翻了翻你的开销，笑着指了指几笔冤枉钱：\n\n" +
      "「你这钱花得冤。记账、比价、攒零钱，都是基本功。我教你两招。」\n\n" +
      "你忽然觉得，过日子也是门学问。",
    conditions: function (st) {
      if (!st || !st.relationships || !st.player) return false;
      if (st.flags && st.flags._npcBudgetBuddyDone) return false;
      if ((st.player.day || 0) < 20) return false;
      return !!firstMetNpcD194(st, 40);
    },
    choices: [
      {
        text: "🧮 认真学两招（心智+数据素养）",
        hint: "intelligence+2, mental+3, 开启理账意识",
        apply: function (st) {
          if (st.flags) {
            st.flags._npcBudgetBuddyDone = true;
            st.flags._npcBudgetSense = true; // [PLACEHOLDER] 数据域可读取: 提升日常开销效率
          }
          if (st.player) {
            st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2); // [PLACEHOLDER]
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
          }
          var nid = firstMetNpcD194(st, 40);
          if (nid) bumpAffinityD194(st, nid, 3, "谢谢你教我理账");
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🧮 朋友的两招理账法让你心里有数。intelligence+2，mental+3。",
              "good",
            );
        },
      },
      {
        text: "😅 记性不好，先记下",
        hint: "好感不变",
        apply: function (st) {
          if (st.flags) st.flags._npcBudgetBuddyDone = true;
        },
      },
    ],
    probability: 0.03,
  });

  // ===== 联动2: D→C 圈里前辈公开夸你 → 职业技能成长 =====
  RANDOM_EVENTS.push({
    id: "npc_d_r194_mentor_praise",
    phase: "street",
    icon: "🌟",
    title: "圈里一位前辈公开夸你靠谱",
    desc:
      "在一次聚会/饭局上，一位你敬重的前辈当着大伙的面说：\n\n" +
      "「这年轻人，交给他的事我放心。肯学、肯扛，难得。」\n\n" +
      "这话传开，竟有人主动想带你做项目。",
    conditions: function (st) {
      if (!st || !st.relationships || !st.player) return false;
      if (st.flags && st.flags._npcMentorPraiseDone) return false;
      if ((st.player.day || 0) < 30) return false;
      return !!firstMetNpcD194(st, 50);
    },
    choices: [
      {
        text: "🌟 把夸奖化作手艺（技能XP+职业心智）",
        hint: "最高技能XP+10, mental+3",
        apply: function (st) {
          if (st.flags) st.flags._npcMentorPraiseDone = true;
          var sk = topSkillKeyD194(st);
          var gain = 10; // [PLACEHOLDER]
          if (sk && typeof addSkillXp === "function") {
            addSkillXp(sk, gain);
          } else if (sk && st.skills[sk]) {
            st.skills[sk].xp = (st.skills[sk].xp || 0) + gain;
          }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3); // [PLACEHOLDER]
          var nid = firstMetNpcD194(st, 50);
          if (nid) bumpAffinityD194(st, nid, 4, "承蒙您抬爱");
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "🌟 前辈的一句夸奖成了你的敲门砖。" + (sk ? sk + " XP+" + gain : "") + "，mental+3。",
              "good",
            );
        },
      },
      {
        text: "🙇 低调记在心里",
        hint: "好感不变",
        apply: function (st) {
          if (st.flags) st.flags._npcMentorPraiseDone = true;
        },
      },
    ],
    probability: 0.025,
  });

  // ===== 联动3: D→E 公司投缘同事聊理财 → 投资意识 + 实打实落袋 =====
  RANDOM_EVENTS.push({
    id: "npc_d_r194_colleague_invest_tip",
    phase: "corporate",
    icon: "💡",
    title: "投缘的同事跟你聊了句理财",
    desc:
      "午休时，一位平时聊得来的同事压低声音：\n\n" +
      "「我最近琢磨了点理财，别全放活期。小钱滚起来也是钱——当然，别梭哈。」\n\n" +
      "你琢磨着，好像有点道理。",
    conditions: function (st) {
      if (!st || !st.relationships || !st.player) return false;
      if (st.player.phase !== "corporate") return false;
      if (st.flags && st.flags._npcColleagueInvestTipDone) return false;
      if ((st.player.day || 0) < 60) return false;
      return !!firstMetNpcD194(st, 30);
    },
    choices: [
      {
        text: "💡 听进去了，挪了点钱试水（投资意识+落袋）",
        hint: "开启_dataInvestorMindset, cash+[PLACEHOLDER], mental+2",
        apply: function (st) {
          if (st.flags) {
            st.flags._npcColleagueInvestTipDone = true;
            st.flags._dataInvestorMindset = true; // 复用工经域联动门槛flag
          }
          if (st.resources) {
            var tip = 1000; // [PLACEHOLDER] 同事情报变现的小额落袋
            st.resources.cash = (st.resources.cash || 0) + tip;
          }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2); // [PLACEHOLDER]
          var nid = firstMetNpcD194(st, 30);
          if (nid) bumpAffinityD194(st, nid, 3, "谢同事的理财思路");
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage(
              "💡 同事一句理财思路，让你挪出本金小试。开启投资意识，cash+" + tip + "，mental+2。",
              "good",
            );
        },
      },
      {
        text: "😅 笑笑没接话",
        hint: "好感不变",
        apply: function (st) {
          if (st.flags) st.flags._npcColleagueInvestTipDone = true;
        },
      },
    ],
    probability: 0.03,
  });
})();
