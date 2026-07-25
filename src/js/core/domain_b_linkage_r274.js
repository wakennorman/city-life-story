/**
 * 域B(事件/叙事) 联动增强 R274
 * 第三轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→G  event_life_milestone      事件→人生里程碑（核心机制·峰终定律）
 *   B→A  event_data_pattern        事件→数据模式（数据/数值·信息沉淀）
 *   B→C  event_career_catalyst     事件→职业催化剂（职业/成长·经历变现）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR274Loaded) return;
  RANDOM_EVENTS._domainBLinkageR274Loaded = true;

  var EVENTS = [
    {
      id: "event_life_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🏅",
      title: "人生里程碑事件",
      story: "今天，你经历了一件值得记住的事——也许是第一次赚到¥1000，也许是第一次被老板表扬，也许是第一次在深夜觉得自己长大了。\n\n你拿出手机，把这一刻记录下来。不是为了炫耀，而是为了在未来的某一天，当你怀疑自己时，可以翻回这一页，告诉自己：「我已经走了这么远。」",
      triggers: { minDay: 180, excludeFlags: ["_eventLifeMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 20;
      },
      choices: [
        {
          text: "🏅 记录这个里程碑",
          hint: "心情+10，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneSeen = true;
            st.flags._lifeMilestoneKeeper = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏅 你记录了人生里程碑。每一个值得被记住的瞬间，都是你存在的证明。心情+10，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，心里记得就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "event_data_pattern",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "事件中的数据规律",
      story: "你开始回顾自己经历过的所有事件，发现了一些有趣的规律：\n\n某些类型的事件总是出现在特定的时间段，某些选择总是导致相似的结果。这些规律不是命运，而是概率和选择的叠加。\n\n你开始用数据理解人生，而不是用运气解释人生。",
      triggers: { minDay: 200, excludeFlags: ["_eventDataPatternSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 25;
      },
      choices: [
        {
          text: "📊 分析事件规律",
          hint: "心智+8，置数据意识flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataPatternSeen = true;
            st.flags._eventPatternAnalysis = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你分析了事件规律。数据让人生不再靠运气。心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 事件是随机的，没有规律",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventDataPatternSeen = true;
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
    {
      id: "event_career_catalyst",
      phase: "street",
      _isChainEvent: false,
      icon: "⚡",
      title: "事件是职业的催化剂",
      story: "你发现，很多随机事件其实可以成为职业发展的催化剂。\n\n一个关于行业趋势的讲座让你想学习新技能，一个关于成功创业者的故事让你想辞职单干，一个关于失败的教训让你避免了同样的错误。\n\n你不再被动等待机会，而是主动从事件中提取价值。",
      triggers: { minDay: 150, excludeFlags: ["_eventCareerCatalystSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 12;
      },
      choices: [
        {
          text: "⚡ 主动从事件中提取职业价值",
          hint: "最高技能XP+12，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerCatalystSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("⚡ 你开始主动从事件中提取职业价值。经历就是最好的老师。技能XP+12，心智+7。", "success");
            }
          },
        },
        {
          text: "🤷 事件是事件，不用想太多",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerCatalystSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用想太多。心智+3。", "info");
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
