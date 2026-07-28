/**
 * 域B(事件/叙事) 联动增强 R658
 * 桥接：
 *   B→D  b658_shared_experience  共同经历叙事 → 消费 state.flags+state.relationships 数据,
 *     叙事→"一起经历过的事"社交回响
 *   B→E  b658_economic_rumor  经济传言 → 消费 state.flags+state.resources 数据,
 *     叙事→"街边经济学"经济回响
 *   B→G  b658_life_reflection  人生反思 → 消费 state.flags+state.player 数据,
 *     叙事→"停下来想一想"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR658Loaded) return;
  RANDOM_EVENTS._domainBLinkageR658Loaded = true;

  // 辅助：获取已结识NPC列表
  function metNpcsR658(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0 });
    }
    return out;
  }

  var EVENTS = [
    // ================================================================
    // B→D: 共同经历叙事 — 和NPC的共同回忆
    // ================================================================
    {
      id: "b658_shared_experience",
      phase: "street",
      _isChainEvent: false,
      icon: "💭",
      title: "共同回忆",
      triggers: { minDay: 10 },
      story: function (st) {
        var npcs = metNpcsR658(st);
        if (npcs.length === 0) return "你还没有结识朋友，一个人经历的事虽然多，但没有人分享总觉得少了点什么。";
        var day = st.player.day || 0;
        var recentEvents = st.flags && st.flags._eventsExperienced || 0;

        if (npcs.length >= 2 && recentEvents > 5) {
          var highAff = 0;
          for (var i = 0; i < npcs.length; i++) { if (npcs[i].affinity >= 40) highAff++; }
          return "你经历了" + recentEvents + "件事，身边有" + npcs.length + "位朋友（" + highAff + "位关系不错）。" +
            "有些事你和朋友们一起经历过——那些共同的回忆，是友谊最牢固的纽带。" +
            "偶尔和朋友们聊聊过去的事，能让人感到温暖和力量。";
        }
        if (npcs.length >= 1) {
          return "你最近经历了一些事，和朋友们分享后，发现大家都有类似的感受。" +
            "共同的经历让友谊更加深厚——无论是开心的事还是困难的事，有人分享总是好的。";
        }
        return "你经历了一些事，但还没来得及和朋友们分享。约个时间聊聊近况吧。";
      },
      choices: [
        { text: "💬 分享经历", apply: function(st) {
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          StateManager.addMessage("💬 和朋友们分享了最近的经历，心情+5", "success");
        }},
        { text: "📝 记在心里", apply: function(st) {
          StateManager.addMessage("📝 把这些经历记在心里，都是人生的财富", "info");
        }},
      ],
      conditions: function (st) {
        var npcs = metNpcsR658(st);
        return npcs.length >= 1 && (st.flags && st.flags._eventsExperienced > 2);
      },
      weight: 1,
    },

    // ================================================================
    // B→E: 经济传言 — 街头巷尾的经济消息
    // ================================================================
    {
      id: "b658_economic_rumor",
      phase: "street",
      _isChainEvent: false,
      icon: "🗣️",
      title: "街边经济学",
      triggers: { minDay: 14 },
      story: function (st) {
        var day = st.player.day || 0;
        var cash = st.resources && st.resources.cash || 0;

        if (day > 60) {
          return "你在城市里生活了" + day + "天，渐渐学会了从街边消息中捕捉经济信号。" +
            "菜市场的大妈知道哪家菜便宜，出租司机知道哪个片区在开发，摆摊的大哥知道什么货好卖。" +
            "这些看似不起眼的街边消息，其实都是最接地气的经济情报。";
        }
        if (cash >= 5000) {
          return "你手头有一些资金（¥" + cash.toLocaleString() + "），最近听到一些街边传言——" +
            "有人说城东要建新商场，有人说某样东西最近缺货涨价了。" +
            "这些传言真真假假，但有时候，最值钱的信息就藏在最不起眼的闲聊里。";
        }
        return "街头巷尾总是传着各种消息——"谁谁谁做生意赚了钱"、"最近什么东西涨价了"。" +
          "虽然不一定每条都靠谱，但多听听总没错，说不定哪天就能用上。";
      },
      choices: [
        { text: "👂 多听多看", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._b658_econRumor = (st.flags._b658_econRumor || 0) + 1;
          if (st.skills && st.skills.accounting) {
            st.skills.accounting.xp = (st.skills.accounting.xp || 0) + 3;
          }
          StateManager.addMessage("👂 留意街边消息，会计经验+3", "success");
        }},
        { text: "📊 理性分析", apply: function(st) {
          StateManager.addMessage("📊 传言不可尽信，你决定用数据和分析来验证", "info");
        }},
      ],
      conditions: function (st) {
        return (st.player.day || 0) >= 7;
      },
      weight: 1,
    },

    // ================================================================
    // B→G: 人生反思 — 阶段性回顾
    // ================================================================
    {
      id: "b658_life_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "🪷",
      title: "人生反思",
      triggers: { minDay: 20 },
      story: function (st) {
        var day = st.player.day || 0;
        var totalEarned = st.resources && st.resources.totalEarned || 0;
        var skills = st.skills || {};
        var skillCount = 0;
        for (var k in skills) { if (skills[k] && skills[k].level > 0) skillCount++; }
        var npcs = metNpcsR658(st);
        var milestone = day % 30 === 0 ? "（满月）" : day % 100 === 0 ? "（百日）" : "";

        if (day >= 90) {
          return "你在这座城市已经生活了" + day + "天" + milestone + "。" +
            "赚了¥" + totalEarned.toLocaleString() + "，学了" + skillCount + "项技能，认识了" + npcs.length + "位朋友。" +
            "回首这段日子，有苦有甜，但每一步都算数。" +
            "古人说"三十而立"——在这个城市里，你正在一步步立起来。";
        }
        if (day >= 30) {
          return "你在这座城市已经生活了" + day + "天" + milestone + "。" +
            "从最初的陌生和不安，到现在渐渐找到了自己的节奏。" +
            "这一个月里，你赚了¥" + totalEarned.toLocaleString() + "，学了" + skillCount + "项技能。" +
            "继续努力，未来会更好。";
        }
        return "你来到这座城市已经" + day + "天了。" +
          "虽然时间不长，但每一天都在适应和成长。" +
          "保持积极的心态，脚踏实地，你会在这里找到属于自己的位置。";
      },
      choices: [
        { text: "🧘 静心冥想", apply: function(st) {
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          StateManager.addMessage("🧘 静下心来反思人生，心智+3，心情+3", "success");
        }},
        { text: "📝 写日记", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._b658_journal = (st.flags._b658_journal || 0) + 1;
          StateManager.addMessage("📝 把这段日子的感悟写进了日记", "info");
        }},
      ],
      conditions: function (st) {
        return st.player && (st.player.day || 0) > 0;
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();