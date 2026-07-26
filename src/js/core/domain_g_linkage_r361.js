/**
 * 域G(核心机制/生命周期) 联动增强 R361
 * 第十三轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→F  life_ui_insight              人生→UI洞察（UI/UX·生命可视化）
 *   G→B  life_event_chapters_v5       人生→事件章节（事件/叙事·生命主线）
 *   G→E  life_wealth_milestone_v5     人生→财富里程碑（经济·时间积累）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR361Loaded) return;
  RANDOM_EVENTS._domainGLinkageR361Loaded = true;

  var EVENTS = [
    {
      // G→F: 人生UI洞察（UI/UX·生命可视化）
      id: "life_ui_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "🖥️",
      title: "人生仪表盘",
      story: "你打开手机上的生活管理应用，看着上面记录的各种数据——\n\n已在天数、总收入、总支出、技能成长曲线、社交网络图谱……\n\n这些数据串联起来，就是你在这座城市生活的全部轨迹。\n\n你把界面调成了自己最喜欢的颜色，笑着说：「这是我的主场。」",
      triggers: { minDay: 30, excludeFlags: ["_lifeUiInsightSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return !!(st.player && st.player.day >= 30);
      },
      choices: [
        {
          text: "🖥️ 定制专属仪表盘",
          hint: "心智+4，心情+5，个人定制flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeUiInsightSeen = true;
            st.flags._dashboardCustomized = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🖥️ 你定制了专属仪表盘。这是你的主场。心智+4，心情+5。", "success");
            }
          },
        },
        {
          text: "📱 默认界面就挺好",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeUiInsightSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📱 你觉得默认界面就挺好。简单也是一种美。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // G→B: 人生事件章节（事件/叙事·生命主线）
      id: "life_event_chapters_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "人生的章节",
      story: "你坐在窗前，回想自己来到这座城市后的经历。\n\n如果把人生比作一本书，那每一段经历就是一章——\n\n第一章：初来乍到，在陌生城市里摸索\n第二章：第一次赚到钱，第一次被解雇\n第三章：学会与人相处，建立了自己的社交圈\n第四章：找到自己的方向，开始规划未来\n……\n\n每一章都有它的意义，哪怕是那些曾经让你痛苦的章节。",
      triggers: { minDay: 60, excludeFlags: ["_lifeEventChaptersV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 15;
      },
      choices: [
        {
          text: "📖 回顾人生章节",
          hint: "心智+6，心情+5，人生回顾flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV5Seen = true;
            st.flags._lifeReflectionDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你回顾了自己的人生章节。每一章都有它的意义。心智+6，心情+5。", "success");
            }
          },
        },
        {
          text: "📝 继续写下一章",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你决定继续写下一章。最好的故事还没有到来。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // G→E: 财富里程碑（经济·时间积累）
      id: "life_wealth_milestone_v5",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "财富里程碑",
      story: "你看着自己的银行账户余额，想起刚来这座城市时连房租都付不起的日子。\n\n从¥0到¥1000，从¥1000到¥10000，从¥10000到¥100000……\n\n每一个数字背后，都是一段故事。那些加班到凌晨的夜晚、那些省吃俭用的日子、那些冒险投资的决定。\n\n「财富不是目的，而是你在城市里努力生活的证明。」",
      triggers: { minDay: 45, excludeFlags: ["_lifeWealthMilestoneV5Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var totalWealth = (st.resources && st.resources.cash || 0) + (st.resources && st.resources.bankBalance || 0);
        return totalWealth >= 20000;
      },
      choices: [
        {
          text: "🏆 记录这个里程碑",
          hint: "心智+5，心情+8，财富flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV5Seen = true;
            st.flags._wealthMilestoneFlag = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏆 你记录了这个财富里程碑。财富是努力生活的证明。心智+5，心情+8。", "success");
            }
          },
        },
        {
          text: "💰 继续努力，下一个目标",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV5Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你继续努力。下一个目标已经在路上了。心智+3。", "info");
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