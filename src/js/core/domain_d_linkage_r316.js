/**
 * 域D(NPC/社交) 联动增强 R316
 * 第八轮循环——社交积累的多维回响。
 * 桥接：
 *   D→G  social_life_balance         社交→生活平衡（核心机制·心理健康）
 *   D→B  social_event_inspiration    社交→事件灵感（事件/叙事·人物催化）
 *   D→A  social_capital_dashboard    社交→资本面板（数据/数值·关系可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR316Loaded) return;
  RANDOM_EVENTS._domainDLinkageR316Loaded = true;

  function countHighNpcsD316(st, minAff) {
    minAff = minAff || 40;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_life_balance",
      phase: "street",
      _isChainEvent: false,
      icon: "⚖️",
      title: "社交与生活的平衡",
      story: "你发现，丰富的社交生活开始影响你的个人时间——朋友聚会占用周末、深夜聊天影响睡眠、社交压力让你无法专注。\n\n你开始思考：社交是生活的「维生素」还是「负担」？\n\n你决定设定一个「社交时间预算」，把更多的时间留给自己。\n\n「独处不是孤独，是充电。」",
      triggers: { minDay: 300, excludeFlags: ["_socialLifeBalanceSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.needs || !st.relationships) return false;
        return countHighNpcsD316(st, 30) >= 4 && (st.needs.happiness || 50) < 55;
      },
      choices: [
        {
          text: "⚖️ 设定社交时间预算",
          hint: "心情+12，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialLifeBalanceSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚖️ 你设定了社交时间预算。独处不是孤独，是充电。心情+12，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 社交越多越好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialLifeBalanceSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得社交越多越好。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_event_inspiration",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "社交是事件的灵感来源",
      story: "你发现，和NPC的互动会激发更多有趣的事件——一个关于创业的故事让你想开公司，一个关于旅行的分享让你想出去走走，一个关于学习的讨论让你想提升技能。\n\n你开始主动从社交中「提取」事件灵感，而不是被动等待机会。\n\n「社交不仅是聊天，也是故事的催化剂。」",
      triggers: { minDay: 250, excludeFlags: ["_socialEventInspSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.career || !st.career.currentJob) return false;
        return countHighNpcsD316(st, 45) >= 2;
      },
      choices: [
        {
          text: "💡 从社交中提取事件灵感",
          hint: "最高技能XP+10，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventInspSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你从社交中提取了事件灵感。社交是故事的催化剂。技能XP+10，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 社交是社交，事件是事件",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventInspSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得社交和事件应该分开。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_capital_dashboard",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交资本面板",
      story: "你打开社交资本面板，看到自己这些年的社交网络——好感分布、互动频率、关系深度、互惠次数。\n\n这些数字让你发现了一些有趣的规律：某些NPC是「关键节点」，某些关系是「高价值投资」。\n\n你开始用数据「经营」自己的社交网络，而不是凭感觉。",
      triggers: { minDay: 350, excludeFlags: ["_socialCapitalDashSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD316(st, 35) >= 5;
      },
      choices: [
        {
          text: "📊 设置社交资本面板",
          hint: "心智+9，置社交面板flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCapitalDashSeen = true;
            st.flags._socialCapitalDashboard = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了社交资本面板。数据让关系经营更科学。心智+9。", "success");
            }
          },
        },
        {
          text: "🤷 关系不用量化",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCapitalDashSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得关系不用量化。心智+3。", "info");
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
