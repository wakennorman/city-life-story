/**
 * 域D(NPC/社交) 联动增强 R358
 * 第十三轮循环——社交积累的多维回响。
 * 桥接：
 *   D→C  social_skill_sharing        社交→技能共享（职业/成长·社交学习）
 *   D→E  social_investment_network   社交→投资网络（经济·社交信息变现）
 *   D→F  social_relationship_ui      社交→关系洞察（UI/UX·社交可视化）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR358Loaded) return;
  RANDOM_EVENTS._domainDLinkageR358Loaded = true;

  // 统计好感度达阈值的NPC数
  function countHighAffNpcs(st, minAff) {
    minAff = minAff || 30;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= minAff) count++;
      }
    }
    return count;
  }

  // 获取第一个好感度达阈值的NPC ID
  function firstHighAffNpc(st, minAff) {
    minAff = minAff || 30;
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
        var r = st.relationships[id];
        if (r && r.met && (r.affinity || 0) >= minAff) return id;
      }
    }
    return null;
  }

  // 安全加好感
  function safeAffinity(st, npcId, change, reason) {
    if (!st || !npcId) return;
    if (typeof applyAffinityChange === "function") {
      applyAffinityChange(st, npcId, change, reason || "R358域D联动");
      return;
    }
    if (!st.relationships) st.relationships = {};
    if (!st.relationships[npcId]) st.relationships[npcId] = { met: true, affinity: 0 };
    st.relationships[npcId].affinity = (st.relationships[npcId].affinity || 0) + change;
    st.relationships[npcId].met = true;
  }

  var EVENTS = [
    {
      // D→C: 高好感NPC传授技能（职业/成长·社交学习）
      id: "social_skill_sharing",
      phase: "street",
      _isChainEvent: false,
      icon: "📚",
      title: "朋友的独门手艺",
      story: "一个老朋友来找你，手里拿着工具箱。「你不是说想学这个吗？我今天有空，教你几手。」\n\n你这才想起来，上次喝酒时随口提了一句想学点新技能。没想到对方一直记在心里。\n\n有人愿意花时间教你东西——在这座城市里，这是最珍贵的情分。",
      triggers: { minDay: 30, excludeFlags: ["_socialSkillSharingSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少一个好感≥25的NPC
        var npc = firstHighAffNpc(st, 25);
        if (!npc) return false;
        // 玩家至少有一个技能等级≤5（有提升空间）
        if (!st.skills) return false;
        var hasLowSkill = false;
        for (var k in st.skills) {
          if (Object.prototype.hasOwnProperty.call(st.skills, k)) {
            if ((st.skills[k].level || 0) < 5) { hasLowSkill = true; break; }
          }
        }
        return hasLowSkill;
      },
      choices: [
        {
          text: "📚 认真学，请朋友多指点",
          hint: "随机技能+5XP，NPC好感+4，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialSkillSharingSeen = true;
            // 找最低技能加XP
            if (st.skills) {
              var lowestSkill = null;
              var lowestLv = 999;
              for (var k in st.skills) {
                if (Object.prototype.hasOwnProperty.call(st.skills, k)) {
                  var lv = st.skills[k].level || 0;
                  if (lv < lowestLv) { lowestLv = lv; lowestSkill = k; }
                }
              }
              if (lowestSkill && typeof addSkillXp === "function") {
                addSkillXp(st, lowestSkill, 5);
              }
            }
            var npc = firstHighAffNpc(st, 25);
            if (npc) safeAffinity(st, npc, 4, "技能传授");
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📚 你学得很认真。有人愿意教，是这座城市里最珍贵的情分。技能XP+5，好感+4，心智+3。", "success");
            }
          },
        },
        {
          text: "🙏 感谢好意，但先记下",
          hint: "心智+3，NPC好感+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialSkillSharingSeen = true;
            var npc = firstHighAffNpc(st, 25);
            if (npc) safeAffinity(st, npc, 2, "技能传授好意");
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🙏 你感谢了朋友的好意，说改天再学。有些情分不怕晚。心智+3，好感+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // D→E: 高好感NPC提供投资情报（经济·社交信息变现）
      id: "social_investment_network",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "圈子里的消息",
      story: "你在茶楼喝茶，一个做生意的朋友凑过来，压低声音说：「最近有个机会，我这边有个内部消息，一般人我不告诉他。」\n\n你竖起耳朵。在这座城市里，信息就是金钱，而信息往往通过「信任」流动。\n\n你在这个圈子里积累的信誉，正在变成一种无形的资产。",
      triggers: { minDay: 60, excludeFlags: ["_socialInvestmentNetworkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少3个好感≥30的NPC（社交圈子够大）
        if (countHighAffNpcs(st, 30) < 3) return false;
        // 需要有一些投资经验或现金储备
        var cash = (st.resources && st.resources.cash) || 0;
        var hasInvested = st.flags && st.flags._hasInvested;
        if (cash < 2000 && !hasInvested) return false;
        return true;
      },
      choices: [
        {
          text: "💡 听消息，小额投资试试水",
          hint: "投资回报+15%(持续3天)，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialInvestmentNetworkSeen = true;
            // 设置投资情报flag
            st.flags._socialInvestmentIntel = true;
            st.flags._socialInvestmentIntelDay = st.player ? st.player.day : 0;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你听了消息，决定小试牛刀。信息就是金钱，而信任是信息的货币。投资回报+15%持续3天。心智+4。", "success");
            }
          },
        },
        {
          text: "🤫 听听就好，不参与",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialInvestmentNetworkSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你听听就好，不打算参与。有些消息听听就够了，不一定要行动。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      // D→F: 社交关系洞察UI（UI/UX·社交可视化）
      id: "social_relationship_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "谁是你的真朋友",
      story: "你翻看着手机通讯录，发现认识的人不少，但真正能交心的没几个。\n\n你开始思考：在这座城市里，什么样的关系是「真」的？\n\n是那些你在困难时愿意借钱给你的？是那些深夜愿意听你倾诉的？还是那些在你成功时真心为你高兴的？\n\n你决定整理一下自己的社交圈，看看谁才是真正值得珍惜的人。",
      triggers: { minDay: 45, excludeFlags: ["_socialRelationshipInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要至少认识5个NPC
        if (!st.relationships) return false;
        var metCount = 0;
        for (var id in st.relationships) {
          if (Object.prototype.hasOwnProperty.call(st.relationships, id)) {
            if (st.relationships[id] && st.relationships[id].met) metCount++;
          }
        }
        return metCount >= 5;
      },
      choices: [
        {
          text: "🔍 整理朋友圈，标注真心朋友",
          hint: "心智+5，心情+5，建立社交洞察flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialRelationshipInsightSeen = true;
            st.flags._socialCircleAware = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 你整理了自己的朋友圈。认识的人很多，但真正重要的就那么几个。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "🤷 朋友不用分类，随缘就好",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialRelationshipInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得朋友不用分类，随缘就好。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();