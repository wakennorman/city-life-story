/**
 * 域D(NPC/社交) 联动增强 R395
 * 第十七轮循环——社交关系的数据回响:把隐藏在relationships/affinity中的数据转化为叙事体验。
 * 桥接：
 *   D→F  d395_social_graph_v2     社交图谱可视化 v2 → 消费 relationships+RELATION_TYPES 数据,
 *     把NPC关系网络转化为"我的社交圈"UI提示,mental+happiness
 *   D→A  d395_social_capital_v2    社交资本量化 v2 → 消费 totalAffinity+metCount 数据,
 *     社交关系数量+质量→社交资本洞察,accounting XP+心智
 *   D→G  d395_social_wellbeing     社交健康回响 → 消费 relationships+needs 数据,
 *     社交支持网络→"朋友多了心情好"的社交幸福感
 *
 * 严格照 domain_d_linkage_r382.js / r374.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR395Loaded) return;
  RANDOM_EVENTS._domainDLinkageR395Loaded = true;

  // 安全技能经验
  function grantSkillXpR395(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  // 取首个已结识(met)的NPC id——守met铁律
  function firstMetNpcR395(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  // 统计社交数据
  function socialStatsR395(st) {
    var rels = st.relationships || {};
    var metCount = 0, totalAffinity = 0, highAffinity = 0;
    for (var id in rels) {
      if (!Object.prototype.hasOwnProperty.call(rels, id)) continue;
      var r = rels[id];
      if (r && r.met) {
        metCount++;
        totalAffinity += (r.affinity || 0);
        if ((r.affinity || 0) >= 50) highAffinity++;
      }
    }
    return { metCount: metCount, totalAffinity: totalAffinity, highAffinity: highAffinity,
             avg: metCount > 0 ? Math.round(totalAffinity / metCount) : 0 };
  }

  var EVENTS = [
    {
      // D→F: 社交图谱可视化 v2 — 消费 relationships+RELATION_TYPES
      id: "d395_social_graph_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🕸️",
      title: "社交图谱",
      story:
        "你梳理了一下自己的人际关系——{graphSummary}\n\n{relationInsight}",
      triggers: { minDay: 50, excludeFlags: ["_d395GraphV2Cooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var stats = socialStatsR395(st);
        return stats.metCount >= 3;
      },
      choices: [
        {
          text: "🤝 珍惜这些关系",
          hint: "心智+3,心情+4,置 _d395GraphV2Cooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d395GraphV2Cooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🕸️ 你梳理了自己的社交图谱,每一段关系都是人生的财富。心智+3,心情+4。", "success");
          }
        },
        {
          text: "💪 继续拓展社交圈",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var stats = socialStatsR395(st);
        var summary = "你已结识" + stats.metCount + "位NPC";
        if (stats.metCount >= 8) summary = "你已结识" + stats.metCount + "位NPC,社交圈相当广泛";
        else if (stats.metCount >= 5) summary = "你已结识" + stats.metCount + "位NPC,社交圈正在扩大";
        var insight = stats.highAffinity > 0
          ? "其中" + stats.highAffinity + "位关系密切,是你在这座城市的重要支持。"
          : "还有很大的发展空间,多与人交流会带来意想不到的收获。";
        return "你梳理了一下自己的人际关系——" + summary + "。\n\n" + insight;
      }
    },
    {
      // D→A: 社交资本量化 v2 — 消费 totalAffinity+metCount
      id: "d395_social_capital_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "社交资本",
      story:
        "你意识到身边的朋友不只是情感支持——{capitalInsight}\n\n社交关系也是一种「资本」。",
      triggers: { minDay: 70, excludeFlags: ["_d395CapitalV2Cooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var stats = socialStatsR395(st);
        return stats.metCount >= 4 && stats.totalAffinity >= 100;
      },
      choices: [
        {
          text: "📊 把社交当作长期投资",
          hint: "accounting XP+4,心智+3,置 _d395CapitalV2Cooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d395CapitalV2Cooldown = true;
            grantSkillXpR395("accounting", 4);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你理解了社交资本的长期价值——关系需要经营和维护。会计XP+4,心智+3。", "success");
          }
        },
        {
          text: "😊 朋友之间不计较这些",
          hint: "心情+3",
          apply: function (st) {
            if (st && st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var stats = socialStatsR395(st);
        var insight = "你与" + stats.metCount + "位NPC建立了关系,累计好感度" + stats.totalAffinity + "点";
        if (stats.avg >= 40) insight += "。平均好感度较高,说明你是值得信赖的人。";
        else insight += "。用心经营,这些关系会在关键时刻帮到你。";
        return "你意识到身边的朋友不只是情感支持——" + insight + "\n\n社交关系也是一种「资本」。";
      }
    },
    {
      // D→G: 社交健康回响 — 消费 relationships+needs
      id: "d395_social_wellbeing",
      phase: "street",
      _isChainEvent: false,
      icon: "🌿",
      title: "社交幸福感",
      story:
        "今天{friendsActivity}。{socialMood}\n\n朋友是人生最好的礼物。",
      triggers: { minDay: 40, excludeFlags: ["_d395WellbeingCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var stats = socialStatsR395(st);
        return stats.metCount >= 2;
      },
      choices: [
        {
          text: "🎉 和朋友在一起的时光真好",
          hint: "心情+5,心智+2,置 _d395WellbeingCooldown(60天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d395WellbeingCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🎉 和朋友在一起的时光让心情变得更好。心情+5,心智+2。", "success");
          }
        },
        {
          text: "😌 享受独处的时光",
          hint: "心智+3",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var stats = socialStatsR395(st);
        var activity = "你和好朋友们度过了一段愉快的时光";
        if (stats.highAffinity >= 3) activity = "几位好友陪你度过了美好的一天,欢声笑语不断";
        else if (stats.metCount >= 5) activity = "你和朋友聚在一起,分享各自的生活故事";
        var mood = "有朋友陪伴的日子,总是格外温暖。";
        if (st.needs && (st.needs.happiness || 50) < 40) {
          mood = "在你心情低落的时候,朋友的陪伴显得格外珍贵。";
        }
        return "今天" + activity + "。" + mood + "\n\n朋友是人生最好的礼物。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
