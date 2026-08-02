/*
 * 城市浮生记 — 域D（NPC/社交）联动增强 · R175
 * 全系统优化 loop R175 · 联动增强 2项
 *
 * 设计约束（与既有 linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改 cross_system_events.js。
 *  - 所有 state 访问均 || 防御。
 *  - 里程碑类事件用 st.flags._xxxDone 去重。
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR175) return;
  RANDOM_EVENTS._domainDLinkageR175 = true;

  var D_EVENTS = [

    // ===== 联动1: D→C NPC技能指导 =====
    // 设计意图：当与某个NPC好感达到60时，NPC主动传授技能经验，
    //   让社交关系产生技能成长收益，激励玩家经营NPC关系。
    {
      id: "npc_skill_mentor",
      title: "老前辈的指点",
      desc: "你最近和这位老朋友走得很近。今天聊天时，他看你有些地方做得不够好，忍不住提点了几句。\\n\\n'年轻人，这个活儿不是这么干的。你看好了——'他边说边示范，你眼前一亮，学到了不少窍门。",
      phase: "street",
      triggers: { minDay: 15 },
      conditions: function (st) {
        if (!st || !st.relationships || !st.flags) return false;
        if (st.flags._npcSkillMentorDone) return false;
        // 检查是否有NPC好感≥60
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var rel = st.relationships[id];
          if (rel && rel.met && (rel.affinity || 0) >= 60) return true;
        }
        return false;
      },
      choices: [
        {
          text: "📝 认真记下，回去练习",
          apply: function (st) {
            if (st.flags) st.flags._npcSkillMentorDone = true;
            // 找到好感最高的NPC，给对应技能加经验
            var bestNpcId = null;
            var bestAff = 0;
            for (var id2 in st.relationships) {
              if (!Object.prototype.hasOwnProperty.call(st.relationships, id2)) continue;
              var rel2 = st.relationships[id2];
              if (rel2 && rel2.met && (rel2.affinity || 0) > bestAff) {
                bestAff = rel2.affinity || 0;
                bestNpcId = id2;
              }
            }
            // 找NPC对应的技能
            var npcSkillMap = {
              "old_zhou": "repair", "boss_li": "repair", "aunt_wang": "sales",
              "sister_zhang": "sales", "xiao_mei": "english", "chef_chen": "cooking",
              "dr_wang": "medicine", "master_zhao": "welding", "lao_li": "driving"
            };
            var skillKey = npcSkillMap[bestNpcId] || "repair";
            if (st.skills && st.skills[skillKey]) {
              st.skills[skillKey].xp = (st.skills[skillKey].xp || 0) + 60;
            }
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你认真记下了前辈的指点，回去反复练习。" + (skillKey ? getSkillName(skillKey) + "经验+60" : "") + "，心智+2。",
                "good"
              );
          },
        },
        {
          text: "🙏 请对方喝杯茶，表示感谢",
          apply: function (st) {
            if (st.flags) st.flags._npcSkillMentorDone = true;
            if (st.player) {
              st.player.charm = Math.min(100, (st.player.charm || 50) + 2);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你请对方喝了杯茶，聊了很多。魅力+2，名气+1。",
                "success"
              );
          },
        },
      ],
      probability: 0.04,
    },

    // ===== 联动2: D→E NPC投资情报 =====
    // 设计意图：当与某个NPC好感达到70时，NPC分享投资内幕消息，
    //   让社交关系产生经济收益，打通NPC→投资系统的联动。
    // [全系统自洽修复] id 改为 d175_npc_invest_tip：原 id 与 economy_invest_linkage_events.js
    // 的 npc_invest_tip 事件重复（重复事件 ID 检查失败），改为与 d465/d483/d597 同款轮次前缀。
    {
      id: "d175_npc_invest_tip",
      title: "内部消息",
      desc: "你的老朋友今天神秘兮兮地凑过来，压低声音说：'我听说最近有个不错的投资机会，一般人我不告诉他。咱俩这关系，我才跟你说的。'\\n\\n他将一张写着几个字的纸条塞到你手里，拍了拍你的肩膀就走了。",
      phase: "street",
      triggers: { minDay: 45 },
      conditions: function (st) {
        if (!st || !st.relationships || !st.flags) return false;
        if (st.flags._npcInvestTipDone) return false;
        // 检查是否有NPC好感≥70
        for (var id in st.relationships) {
          if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
          var rel = st.relationships[id];
          if (rel && rel.met && (rel.affinity || 0) >= 70) return true;
        }
        return false;
      },
      choices: [
        {
          text: "📈 跟着消息投资一笔",
          hint: "需¥500，高回报",
          apply: function (st) {
            if (st.flags) st.flags._npcInvestTipDone = true;
            if (st.flags) st.flags._npcInvestTipUsed = true;
            var invest = Math.min(500, (st.resources && st.resources.cash) || 0);
            if (invest > 0 && st.resources) {
              st.resources.cash = (st.resources.cash || 0) - invest;
              // 投资回报：1.5~3倍
              var回报 = Math.round(invest * Random.float(1.5, 3.0));
              st.resources.cash = (st.resources.cash || 0) + 回报;
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage(
                  "你投了¥" + invest + "，最终拿回¥" + 回报 + "，净赚¥" + (回报 - invest) + "！",
                  "success"
                );
            } else {
              if (typeof StateManager !== "undefined" && StateManager.addMessage)
                StateManager.addMessage(
                  "你摸了摸口袋，钱不够投资...看来得先攒钱。",
                  "warning"
                );
            }
          },
        },
        {
          text: "📝 记下来，以后再说",
          apply: function (st) {
            if (st.flags) st.flags._npcInvestTipDone = true;
            if (st.flags) st.flags._npcInvestTipSaved = true;
            if (st.player) {
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage(
                "你把消息记在本子上，准备等资金充裕了再出手。智力+2。",
                "info"
              );
          },
        },
      ],
      probability: 0.035,
    },
  ];

  // 注册事件
  for (var i = 0; i < D_EVENTS.length; i++) {
    RANDOM_EVENTS.push(D_EVENTS[i]);
  }

  if (typeof window !== "undefined") {
    window._domainDLinkageR175 = true;
  }
})();