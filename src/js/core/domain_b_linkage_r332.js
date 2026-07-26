/**
 * 域B(事件/叙事) 联动增强 R332
 * 第十轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→H  event_company_legacy         事件→公司传承（公司·历史感）
 *   B→G  event_life_milestone_v2      事件→人生里程碑（核心机制·峰终定律）
 *   B→A  event_data_pattern_v4        事件→数据模式（数据/数值·信息沉淀）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR332Loaded) return;
  RANDOM_EVENTS._domainBLinkageR332Loaded = true;

  var EVENTS = [
    {
      id: "event_company_legacy",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏛️",
      title: "事件构成公司传承",
      story: "你开始收集公司的「传承故事」——团队一起熬过难关的故事、客户感谢信背后的故事、员工成长的故事。\n\n这些故事不仅是回忆，也是公司文化的载体。你决定把它们整理成一本「公司传承手册」，让每一个新员工都能感受到这份传承。\n\n「公司会倒闭，但故事会留下来。」",
      triggers: { minDay: 500, excludeFlags: ["_eventCompanyLegacySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        return (st.startup.company.reputation || 0) >= 50;
      },
      choices: [
        {
          text: "🏛️ 整理成传承手册",
          hint: "心智+11，公司声誉+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyLegacySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 11);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 10;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏛️ 你整理了公司传承手册。公司会倒闭，但故事会留下来。心智+11，声誉+10。", "success");
            }
          },
        },
        {
          text: "🤷 文化不用记录",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyLegacySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得文化不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "event_life_milestone_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🏅",
      title: "事件构成人生里程碑",
      story: "你回顾自己这些年经历的事件，发现它们构成了你人生故事的各个里程碑——第一次工作、第一次赚钱、第一次投资、第一次创业。\n\n每一个里程碑都是一段奋斗的历史，每一个事件都是这个里程碑的一个注脚。你开始理解，人生不是线性的，而是由无数个事件编织而成的「叙事网络」。\n\n「人生不是找到答案，是学会讲故事。」",
      triggers: { minDay: 600, excludeFlags: ["_eventLifeMilestoneV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 110;
      },
      choices: [
        {
          text: "🏅 记录这个人生里程碑",
          hint: "心情+20，心智+13",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏅 你记录了人生里程碑。人生不是找到答案，是学会讲故事。心情+20，心智+13。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneV2Seen = true;
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
      id: "event_data_pattern_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "🔍",
      title: "事件数据模式v4",
      story: "你开始深度分析自己经历的事件数据——不仅是频率和类型，还有事件之间的因果关系、时间间隔的规律、选择的长期影响。\n\n这些分析让你发现了一些更深层的模式：某些事件是「因」，某些事件是「果」，某些事件是「催化剂」。\n\n你开始用数据「理解」人生的因果链，而不是用命运。",
      triggers: { minDay: 550, excludeFlags: ["_eventDataPatternV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.stats.actionFreq) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 90;
      },
      choices: [
        {
          text: "🔍 深度分析事件因果",
          hint: "心智+13，置因果分析flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataPatternV4Seen = true;
            st.flags._eventCausalAnalysisV4 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🔍 你深度分析了事件因果。数据让人生有因可循。心智+13。", "success");
            }
          },
        },
        {
          text: "🤷 事件是随机的，没有因果",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataPatternV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得事件是随机的。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
