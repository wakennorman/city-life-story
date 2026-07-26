/**
 * 域F(UI/UX) 联动增强 R318
 * 第八轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→G  ui_life_command_center       人生→指挥中心（核心机制·信息中枢）
 *   F→B  ui_event_journal_v2          事件→日记v2（事件/叙事·历史记录）
 *   F→H  ui_company_intelligence       公司→情报面板（公司·经营可视化）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR318Loaded) return;
  RANDOM_EVENTS._domainFLinkageR318Loaded = true;

  var EVENTS = [
    {
      id: "ui_life_command_center",
      phase: "street",
      _isChainEvent: false,
      icon: "🎛️",
      title: "人生指挥中心",
      story: "你打开人生指挥中心，看到自己这些年的全方位关键指标——工作、收入、健康、社交、技能、投资、公司。\n\n这些数字和图表，是你在这座城市存在过的全方位证据。每一个指标都是一段真实经历的浓缩。\n\n你开始用数据「指挥」自己的人生，而不是随波逐流。",
      triggers: { minDay: 500, excludeFlags: ["_uiLifeCommandSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 500;
      },
      choices: [
        {
          text: "🎛️ 设置人生指挥中心",
          hint: "心智+12，置指挥中心flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeCommandSeen = true;
            st.flags._lifeCommandCenter = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎛️ 你设置了人生指挥中心。数据让人生有方向。心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeCommandSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得随遇而安就好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "ui_event_journal_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "事件日记v2",
      story: "你打开事件日记，看到自己这些年经历的所有事件——有些让你笑，有些让你哭，有些让你成长。\n\n这些事件在日记中按时间排列，形成了一部属于你的「城市浮生记」。\n\n你决定把这些故事写下来，不是为了发表，而是为了在未来的某一天，当你迷茫时，可以翻回这些页面，告诉自己：「我已经走过了这么远。」",
      triggers: { minDay: 400, excludeFlags: ["_uiEventJournalV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 70;
      },
      choices: [
        {
          text: "📖 写下事件日记",
          hint: "心情+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了事件日记。文字让记忆变成历史。心情+15，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，记住就好",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "ui_company_intelligence",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "公司情报面板",
      story: "你打开公司情报面板，看到营收、利润、现金流、团队效率、市场份额等关键经营指标的实时数据。\n\n这些数字是你创业多年积累的成果。每一条上升的曲线，都是团队一起拼出来的。\n\n你开始用数据「驾驶」公司，而不是凭感觉。",
      triggers: { minDay: 350, excludeFlags: ["_uiCompanyIntelSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.revenue || 0) >= 40000;
      },
      choices: [
        {
          text: "📊 设置经营预警",
          hint: "心智+9，公司声誉+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyIntelSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 6;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了公司情报面板。数据让经营更精准。心智+9，声誉+6。", "success");
            }
          },
        },
        {
          text: "🤷 大概看看就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiCompanyIntelSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得大概看看就行。心智+3。", "info");
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
