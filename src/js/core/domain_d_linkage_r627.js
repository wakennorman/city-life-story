/**
 * 域D(NPC/社交) 联动增强 R627
 * 桥接：
 *   D→E  d627_social_invest_tips  社交圈投资情报 → 消费 state.relationships+state.flags 数据,
 *     社交→"朋友推荐的股票"经济回响
 *   D→C  d627_npc_career_advice  NPC职业建议 → 消费 state.relationships+state.skills 数据,
 *     社交→"高人指点"职业回响
 *   D→G  d627_social_mental_boost  社交心情提振 → 消费 state.relationships+state.needs 数据,
 *     社交→"朋友的力量"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR627Loaded) return;
  RANDOM_EVENTS._domainDLinkageR627Loaded = true;

  // 辅助：获取已结识NPC列表(守 rel.met 铁律)
  function metNpcsR627(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 });
    }
    return out;
  }

  var EVENTS = [
    // ================================================================
    // D→E: 社交圈投资情报 — 高好感NPC透露投资信息
    // ================================================================
    {
      id: "d627_social_invest_tips",
      phase: "street",
      _isChainEvent: false,
      icon: "📈",
      title: "朋友的投资建议",
      triggers: { minDay: 10 },
      story: function (st) {
        var npcs = metNpcsR627(st);
        if (npcs.length === 0) return "你还没有结识朋友，多出去走走认识些人吧。";
        var highAff = 0;
        for (var i = 0; i < npcs.length; i++) {
          if (npcs[i].affinity >= 40) highAff++;
        }
        if (highAff < 2) {
          return "你的朋友还不多，交情也还不够深。多花时间维护关系，朋友多了路好走。" +
            "有时候，朋友的一句建议可能比你自己研究半天还有价值。";
        }
        return "你有" + highAff + "位关系不错的朋友（好感≥40）。" +
          "朋友之间不仅聊生活，偶尔也会聊聊投资理财。" +
          "关系好的朋友可能会透露一些实用的投资信息——比如哪只股票最近有动静、哪个行业有政策利好。" +
          "当然，投资决策还是要自己做，朋友的建议仅供参考。";
      },
      choices: [
        { text: "💬 聊聊投资", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._d627_investChat = (st.flags._d627_investChat || 0) + 1;
          if (st.skills && st.skills.accounting) {
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 3;
          }
          StateManager.addMessage("💬 和朋友聊投资心得，会计经验+3", "success");
        }},
        { text: "📊 自己研究", apply: function(st) {
          StateManager.addMessage("📊 你决定还是相信自己的判断，继续研究市场", "info");
        }},
      ],
      conditions: function (st) {
        var npcs = metNpcsR627(st);
        var high = 0;
        for (var i = 0; i < npcs.length; i++) {
          if (npcs[i].affinity >= 40) high++;
        }
        return high >= 1;
      },
      weight: 1,
    },

    // ================================================================
    // D→C: NPC职业建议 — 高好感NPC提供职业方向建议
    // ================================================================
    {
      id: "d627_npc_career_advice",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "贵人的建议",
      triggers: { minDay: 15 },
      story: function (st) {
        var npcs = metNpcsR627(st);
        if (npcs.length === 0) return "你还没有结识什么人，多出去走走，认识些不同行业的朋友。";
        var highAff = 0;
        for (var i = 0; i < npcs.length; i++) {
          if (npcs[i].affinity >= 50) highAff++;
        }
        if (highAff >= 2) {
          return "你身边有" + highAff + "位值得信赖的朋友（好感≥50）。" +
            "他们了解你的为人和能力，给出的职业建议往往一针见血。" +
            "有时候旁观者清——朋友可能比你更清楚你适合做什么。多听听他们的意见，或许能帮你找到职业方向。";
        } else if (highAff >= 1) {
          return "你有一位值得信赖的朋友，他/她似乎对你的职业发展有些想法。" +
            "找个时间聊聊，听听他/她的建议——也许能帮你打开新的思路。";
        }
        return "你的朋友圈还不够深，继续维护关系，信任度上来后，朋友们会愿意给你更真诚的建议。";
      },
      choices: [
        { text: "💼 听取建议", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._d627_careerAdvice = (st.flags._d627_careerAdvice || 0) + 1;
          if (typeof getRecommendedCareerPaths === "function") {
            var recs = getRecommendedCareerPaths(st);
            if (recs && recs.length > 0) {
              StateManager.addMessage("🎯 朋友建议你试试" + recs[0].path.name + "方向，匹配度" + recs[0].score + "%", "info");
            }
          } else {
            StateManager.addMessage("🎯 听取了朋友的建议，对职业规划有了新的认识", "info");
          }
        }},
        { text: "🤝 感谢朋友", apply: function(st) {
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage("🤝 感谢朋友的关心，心情+5", "success");
        }},
      ],
      conditions: function (st) {
        var npcs = metNpcsR627(st);
        var high = 0;
        for (var i = 0; i < npcs.length; i++) {
          if (npcs[i].affinity >= 50) high++;
        }
        return high >= 1;
      },
      weight: 1,
    },

    // ================================================================
    // D→G: 社交心情提振 — 与朋友互动提升心情
    // ================================================================
    {
      id: "d627_social_mental_boost",
      phase: "street",
      _isChainEvent: false,
      icon: "🤗",
      title: "朋友的力量",
      triggers: { minDay: 8 },
      story: function (st) {
        var npcs = metNpcsR627(st);
        if (npcs.length === 0) return "你还没有结识朋友，一个人在外打拼不容易，试着打开心扉认识些新朋友吧。";
        var happiness = st.needs && st.needs.happiness || 50;
        var mental = st.player && st.player.mental || 50;

        if (happiness < 30 || mental < 30) {
          return "你最近状态不太好（心情" + Math.round(happiness) + "，心智" + Math.round(mental) + "）。" +
            "你身边有" + npcs.length + "位朋友，也许该找他们聊聊了。" +
            "有时候，一句关心、一顿饭、一次散步，就能让心情好起来。别一个人扛着。";
        }
        return "你身边有" + npcs.length + "位朋友，社交圈正在慢慢扩大。" +
          "定期和朋友聚聚、聊聊近况，不仅能放松心情，还能从朋友那里获得新的视角和能量。" +
          "研究表明，良好的社交关系是幸福感最重要的来源之一。";
      },
      choices: [
        { text: "📞 约朋友见面", apply: function(st) {
          if (st.needs) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
          }
          if (st.player) {
            st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          }
          StateManager.addMessage("📞 约朋友出来聚了聚，心情+8，心智+3", "success");
        }},
        { text: "💬 发消息问候", apply: function(st) {
          if (st.needs) {
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          }
          StateManager.addMessage("💬 给朋友们发了问候消息，心情+3", "info");
        }},
      ],
      conditions: function (st) {
        var npcs = metNpcsR627(st);
        return npcs.length >= 1;
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();