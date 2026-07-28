/**
 * 域F(UI/UX) 联动增强 R360
 * 第十三轮循环——UI不仅是界面，还在经济/职业/社交层面留下痕迹。
 * 桥接：
 *   F→B  ui_event_journal_v4          事件→日记v4（事件/叙事·个人记录）
 *   F→A  ui_data_dashboard_v3         数据→仪表盘v3（数据/数值·信息中枢）
 *   F→G  ui_life_command_v3           人生→指挥中心v3（核心机制·信息整合）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainFLinkageR360Loaded) return;
  RANDOM_EVENTS._domainFLinkageR360Loaded = true;

  var EVENTS = [
    {
      // F→B: 事件日记（事件/叙事·个人记录）
      id: "ui_event_journal_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📔",
      title: "生活的日记本",
      story: "你翻开了自己记录生活的日记本。里面有开心的事、难过的事、愤怒的事、感动的事……\n\n每一页都是你在城市中真实活过的证明。有些事你已经忘了，但文字还记得。\n\n「如果不记下来，那些细小的幸福就会像雨滴一样消失在时间里。」",
      triggers: { minDay: 30, excludeFlags: ["_uiEventJournalV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 10;
      },
      choices: [
        {
          text: "📔 写下今天的日记",
          hint: "心智+5，心情+5，养成记录习惯",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV4Seen = true;
            st.flags._journalHabit = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📔 你写下了今天的日记。文字是抵抗遗忘最好的方式。心智+5，心情+5。", "success");
            }
          },
        },
        {
          text: "📱 拍张照就行",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiEventJournalV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📱 你拍了张照片。一张好照片胜过千言万语。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // F→A: 数据仪表盘（数据/数值·信息中枢）
      id: "ui_data_dashboard_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "数据仪表盘",
      story: "你开始用数据管理自己的生活——收入趋势、支出结构、资产变化、技能成长曲线。\n\n以前你觉得这些数据毫无意义，但现在你发现，数据是了解自己最好的方式。\n\n「如果你不能衡量它，你就不能改进它。」",
      triggers: { minDay: 60, excludeFlags: ["_uiDataDashboardV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 15;
      },
      choices: [
        {
          text: "📊 建立个人数据看板",
          hint: "心智+6，理财意识+5，flag数据管理",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataDashboardV3Seen = true;
            st.flags._dataDrivenMindset = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.skills && st.skills.accounting && typeof addSkillXp === "function") {
              addSkillXp("accounting", 5); // [R620 A类修复] 原addSkillXp(st,...) state作首参→XP静默丢弃
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你建立了个人数据看板。数据是了解自己最好的方式。心智+6，会计经验+5。", "success");
            }
          },
        },
        {
          text: "📈 看看就行了，不搞那么复杂",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiDataDashboardV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你看了看数据，心里有数就行。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // F→G: 人生指挥中心（核心机制·信息整合）
      id: "ui_life_command_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "人生指挥中心",
      story: "你坐在桌前，面前摊开一张纸，上面画着你的人生地图——\n\n短期目标、长期规划、当前资源、风险储备、需要提升的能力……\n\n你开始像经营一家公司一样经营自己的人生。\n\n「人生不是偶然，是设计出来的。」",
      triggers: { minDay: 90, excludeFlags: ["_uiLifeCommandV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 20;
      },
      choices: [
        {
          text: "🎯 制定人生规划图",
          hint: "心智+7，心情+5，人生规划flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeCommandV3Seen = true;
            st.flags._lifePlanningDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你制定了人生规划图。人生不是偶然，是设计出来的。心智+7，心情+5。", "success");
            }
          },
        },
        {
          text: "🗺️ 心里有方向就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._uiLifeCommandV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🗺️ 你觉得心里有方向就行。方向比规划更重要。心智+3。", "info");
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