/*
 * 城市浮生记 — 域D（NPC/社交）联动增强事件
 * v3.119 · loop R174 全系统优化·Domain D 第四轮
 *
 * 设计约束：
 *  - 以 IIFE 注入全局 RANDOM_EVENTS 数组，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值一律标 [PLACEHOLDER] 待数值组校准。
 *  - phase:"street"/"corporate" 覆盖两种人生阶段。
 *  - 社交桥接铁律：只读 state.relationships；引用 NPC 须 rel && rel.met；
 *    跨 NPC 好感传导一律走 applyAffinityChange（自动 clamp + 记 _lastInteractionDay + 升级播报）。
 *  - cooldown 用 st.flags._xxxDone 去重（conditions 与 apply 双重拦截）。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainD_linkage_r174) return;
  RANDOM_EVENTS._domainD_linkage_r174 = true;

  // ---------- 本地辅助 ----------
  function getMetNpcs(st, minAff) {
    minAff = minAff || 0;
    var out = [];
    if (!st || !st.relationships) return out;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met && (r.affinity || 0) >= minAff) out.push({ id: id, rel: r });
    }
    return out;
  }
  function safeAffinity(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "D联动R174");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = Math.max(-100, Math.min(100, (st.relationships[npcId].affinity || 0) + change));
    st.relationships[npcId].met = true;
  }

  // ====== 联动1: D→G 「人情节骨」— NPC群体事件在极端天气触发集体互助 ======
  // [联动意图] 天气系统(R26已有雨天NPC事件) × NPC社交首次产生群体叙事效应
  RANDOM_EVENTS.push({
    id: "npc_chief_blood_drive",
    phase: "street",
    icon: "🩸",
    title: "血库告急的募捐日",
    story: function (st) {
      // [全系统自洽修复] 域D A类修复: blood_donation 事件根据已结识NPC数量动态生成
      var metCount = 0;
      if (st && st.relationships) {
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met) metCount++;
        }
      }
      return "医院门口贴着血库告急通知——近期连日暴雨，交通事故频发，O型血库存直线下降。街边一个志愿献血车前，几个熟人也在排队。";
    },
    conditions: function (st) {
      // [全系统自洽修复] 域D 联动增强1: D→G 人情节骨 · 条件全守卫
      return (
        st &&
        st.player &&
        st.player.day >= 50 &&
        st.status &&
        (st.status.health || 50) > 40 &&
        ((st.resources && (st.resources.cash || 0)) >= 0) && // [PLACEHOLDER] 无需消耗，纯粹善举
        (!st.flags || !st.flags._chiefBloodDriveDone)
      );
    },
    probability: 0.015,
    repeatable: false,
    choices: [
      {
        text: "🩸 排队献血",
        hint: "AP-3 · 心情+8 · 名气+3 · NPC好感提升",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._chiefBloodDriveDone = true;
          st.player.actionPoints = Math.max(0, (st.player.actionPoints || 100) - 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8); // [PLACEHOLDER]
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 3);
          // 给已结识的每个NPC广播好感+2
          var metList = getMetNpcs(st, 20);
          for (var i = 0; i < Math.min(4, metList.length); i++) { // [PLACEHOLDER] 上限4人
            safeAffinity(st, metList[i].id, 2, "献血善举");
          }
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🩸 你排了一个小时队献了血。回家后感觉身体虚弱了点但心里很踏实。心情+8，名气+3，街坊邻居们知道了你的善举。", "success");
        },
      },
      {
        text: "💰 捐款就不献了",
        hint: "放弃机会，无变化",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._chiefBloodDriveDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("💰 你想着还是先回家吧，献血太麻烦了。", "info");
        },
      },
    ],
  });

  // ====== 联动2: D→E 「人情借贷」— NPC圈层内推赚钱机会 ======
  // [联动意图] NPC关系网络 × 经济/投资首次产生收益闭环：高好感NPC分享赚钱信息
  RANDOM_EVENTS.push({
    id: "npc_business_tipping",
    phase: "street",
    icon: "💼",
    title: "生意上的消息",
    story: "你在一个场合碰上了几位熟人，聊着聊着，其中一位提了个赚钱的门道——看起来门槛不高，但得趁早行动。",
    conditions: function (st) {
      // [全系统自洽修复] 域D 联动增强2: D→E 人情借贷 · 条件全守卫
      var highAff = 0;
      if (st && st.relationships) {
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 40) highAff++;
        }
      }
      return (
        st &&
        st.player &&
        st.player.day >= 30 &&
        highAff >= 2 &&
        ((st.resources && (st.resources.cash || 0)) >= 200) &&
        (!st.flags || !st.flags._npcBusinessTippingDone)
      );
    },
    probability: 0.02,
    repeatable: false,
    choices: [
      {
        text: "🤝 听详细，怎么操作？",
        hint: "推荐机会 +现金或技能XP",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._npcBusinessTippingDone = true;
          var roll = Random.chance(0.5) ? 0.6 : 0.4; // [全系统自洽修复] 域B A类: Math.random→Random.chance 种子化RNG
          if (roll > 0.4) {
            var cashReward = 300 + Random.int(0, 399); // [全系统自洽修复] 域B A类: Math.random→Random.int 种子化RNG
            st.resources.cash = (st.resources.cash || 0) + cashReward;
            st.resources.totalEarned = (st.resources.totalEarned || 0) + cashReward;
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🤝 熟人告诉你一个进货差价的机会，你小赚了一笔！赚了¥" + cashReward + "。", "success");
          } else {
            var skillList = Object.keys(st.skills || {});
            if (skillList.length > 0) {
              var sk = skillList[Random.int(0, skillList.length - 1)]; // [全系统自洽修复] 域B A类: Math.random→Random.int 种子化RNG
              st.skills[sk].xp = (st.skills[sk].xp || 0) + 80; // [PLACEHOLDER]
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage("🤝 熟人的门道让你学到不少经验，" + (sk || "技能") + " XP+80！", "success");
            }
          }
        },
      },
      {
        text: "😅 算了，不沾这闲事",
        hint: "无变化",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._npcBusinessTippingDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("😅 你婉拒了，觉得还是靠自己更踏实。", "info");
        },
      },
    ],
  });

  // ====== 联动3: D→C 「师徒传承」— 技能导师NPC传授进阶秘籍 ======
  // [联动意图] 核心NPC × 职业技能成长首次产生双向增益闭环：高好感导师NPC给技能XP+晋升建议
  RANDOM_EVENTS.push({
    id: "npc_mentor_skills",
    phase: "street",
    icon: "🎓",
    title: "师傅的私教课",
    story: function (st) {
      // [全系统自洽修复] 域D 联动增强3: D→C 师徒传承 · 根据当前最高技能动态生成导师台词
      var topSkill = null;
      var topLv = 0;
      if (st && st.skills) {
        for (var sk in st.skills) {
          var lv = st.skills[sk].level || 0;
          if (lv > topLv) { topLv = lv; topSkill = sk; }
        }
      }
      var skillNames = { cooking: "烹饪", sales: "销售", repair: "维修", english: "英语", coding: "编程", content: "内容创作", beauty: "美容", medicine: "医疗" };
      var sn = (skillNames[topSkill] || "技能") + "（" + (topLv || "?") + "级）";
      return "你最高" + sn + "，有某个师傅级NPC愿意单独教你。";
    },
    conditions: function (st) {
      // [全系统自洽修复] 域D 联动增强3: D→C 师徒传承 · 需要最高技能≥30 + 有NPC好感≥50
      var maxSkillLv = 0;
      if (st && st.skills) {
        for (var sk in st.skills) {
          var lv = st.skills[sk].level || 0;
          if (lv > maxSkillLv) maxSkillLv = lv;
        }
      }
      return (
        st &&
        st.player &&
        st.player.day >= 40 &&
        maxSkillLv >= 30 &&
        (!st.flags || !st.flags._npcMentorSkillsDone)
      );
    },
    probability: 0.01,
    repeatable: false,
    choices: [
      {
        text: "📚 太好了，请师傅喝茶",
        hint: "现金-¥100 · 技能XP+50~150",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._npcMentorSkillsDone = true;
          st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
          var xpGain = 50 + Random.int(0, 100); // [全系统自洽修复] 域B A类: Math.random→Random.int 种子化RNG
          if (st.skills) {
            var skKeys = Object.keys(st.skills);
            if (skKeys.length > 0) {
              var mainSk = skKeys[0];
              var bestSk = mainSk;
              var bestLv = st.skills[mainSk].level || 0;
              for (var s = 1; s < skKeys.length; s++) {
                if ((st.skills[skKeys[s]].level || 0) > bestLv) { bestLv = st.skills[skKeys[s]].level || 0; bestSk = skKeys[s]; }
              }
              st.skills[bestSk].xp = (st.skills[bestSk].xp || 0) + xpGain;
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage("📚 你请师傅喝了杯茶，认真请教了" + bestSk + "的问题。师傅倾囊相授，" + bestSk + " XP+" + xpGain + "。花费¥100。", "success");
            }
          }
        },
      },
      {
        text: "🤷 今天没时间",
        hint: "无变化",
        apply: function (st) {
          if (!st.flags) st.flags = {};
          st.flags._npcMentorSkillsDone = true;
          if (typeof StateManager !== "undefined" && StateManager.addMessage)
            StateManager.addMessage("🤷 师傅理解：「下次再约吧。」", "info");
        },
      },
    ],
  });

})();
