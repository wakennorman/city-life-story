/**
 * 域B(事件/叙事) 联动增强 R506
 * 桥接：
 *   B→D  b506_story_icebreaker   故事破冰 → 消费 flags 数据,
 *     故事→"分享一个故事，拉近彼此距离"的社交破冰
 *   B→H  b506_event_corp_adapt   事件公司适应 → 消费 flags+corporate 数据,
 *     外部→"大环境变了，公司怎么应对"的适应叙事
 *   B→E  b506_news_invest_link   新闻投资链接 → 消费 flags 数据,
 *     新闻→"这条新闻利好什么股票"的投资分析
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR506Loaded) return;
  RANDOM_EVENTS._domainBLinkageR506Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "b506_story_icebreaker", phase: "street", _isChainEvent: false, icon: "💬",
      title: "破冰故事",
      story: "你分享了一个自己的经历，拉近了和对方的距离——{desc}",
      triggers: { minDay: 15, interval: 45, maxRepeats: 5, excludeFlags: ["_b506IcebreakerCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b506IcebreakerCooldown);
      },
      choices: [
        { text: "💬 多分享一些", hint: "好感+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b506IcebreakerCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 3, "分享故事破冰");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 '真的吗？我也有过类似的经历！' 一个故事，让两个陌生人变成了朋友。好感+3,心情+2。", "success");
        }},
        { text: "👂 听对方的故事", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b506IcebreakerCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "倾听对方的故事");
          if (typeof StateManager !== "undefined") StateManager.addMessage("💬 '那你呢？' 你认真倾听了对方的故事。有时候，倾听比讲述更重要。好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你分享了一个自己的经历，拉近了和对方的距离——'我以前也遇到过这种事！' 共同的经历，是最快的破冰方式。";
      }
    },
    {
      id: "b506_event_corp_adapt", phase: "corporate", _isChainEvent: false, icon: "🔄",
      title: "大环境变了",
      story: "外部环境发生了重大变化，公司需要适应——{desc}",
      triggers: { minDay: 50, interval: 120, maxRepeats: 3, excludeFlags: ["_b506CorpAdaptCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._b506CorpAdaptCooldown);
      },
      choices: [
        { text: "🔄 调整战略", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b506CorpAdaptCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 '大环境变了，我们不能不变。' 你调整了公司的战略方向。管理XP+5,心智+2。", "success");
        }},
        { text: "📊 评估影响", hint: "会计XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b506CorpAdaptCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔄 你评估了外部变化对公司的影响——'短期有压力，但长期来看是机会。' 会计XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "外部环境发生了重大变化，公司需要适应——'政策变了，市场变了，客户需求也变了。' 唯一不变的就是变化本身。";
      }
    },
    {
      id: "b506_news_invest_link", phase: "street", _isChainEvent: false, icon: "📰",
      title: "新闻里的机会",
      story: "你看到一条新闻，觉得某个股票可能要涨——{desc}",
      triggers: { minDay: 25, interval: 60, maxRepeats: 5, excludeFlags: ["_b506NewsInvestCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._b506NewsInvestCooldown);
      },
      choices: [
        { text: "📰 研究一下", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b506NewsInvestCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 你研究了这条新闻对应的投资机会——'果然，新闻里藏着黄金。' 会计XP+4,心智+1。", "success");
        }},
        { text: "📝 记下来", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b506NewsInvestCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📰 你记下了这条新闻——'也许以后用得着。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你看到一条新闻，觉得某个股票可能要涨——'XX公司获得重大政策支持，股价可能要起飞。' 你开始认真研究起来。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();