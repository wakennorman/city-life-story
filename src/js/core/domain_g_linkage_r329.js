/**
 * 域G(核心机制/生命周期) 联动增强 R329
 * 第九轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→A  life_data_hub_v2            人生→数据中枢（数据/数值·信息展示）
 *   G→B  life_event_chapters_v2      人生→事件章节（事件/叙事·生命主线）
 *   G→C  life_career_milestone_v3    人生→职业里程碑（职业/成长·时间积累）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR329Loaded) return;
  RANDOM_EVENTS._domainGLinkageR329Loaded = true;

  var EVENTS = [
    {
      id: "life_data_hub_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "人生数据中枢v2",
      story: "你打开人生数据中枢，看到自己这些年的全方位关键指标——工作天数、收入增长、健康趋势、社交密度、技能水平、投资回报。\n\n这些数字和图表，是你在这座城市存在过的全方位证据。每一个指标都是一段真实经历的浓缩。\n\n你开始用数据「理解」自己的人生，而不是用感觉。",
      triggers: { minDay: 600, excludeFlags: ["_lifeDataHubV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 600;
      },
      choices: [
        {
          text: "📊 设置人生数据中枢",
          hint: "心智+13，置数据中枢flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataHubV2Seen = true;
            st.flags._lifeDataHubV2 = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 13);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你设置了人生数据中枢。数据让人生变得全面可见。心智+13。", "success");
            }
          },
        },
        {
          text: "🤷 不用设置，随遇而安",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeDataHubV2Seen = true;
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
      id: "life_event_chapters_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "人生事件章节v2",
      story: "你回顾自己这些年经历的事件，发现它们构成了你人生故事的各个章节——生存、立足、选择、成长、转型。\n\n每一个章节都有其主题和挑战，每一个事件都是这个章节的一个注脚。你开始理解，人生不是线性的，而是由无数个事件编织而成的「叙事网络」。\n\n「人生不是找到答案，是学会讲故事。」",
      triggers: { minDay: 500, excludeFlags: ["_lifeEventChaptersV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 100;
      },
      choices: [
        {
          text: "📖 写下人生章节",
          hint: "心情+18，心智+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV2Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了人生章节。人生不是找到答案，是学会讲故事。心情+18，心智+12。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV2Seen = true;
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
      id: "life_career_milestone_v3",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "人生职业里程碑v3",
      story: "你发现，人生的重要节点总是伴随着职业发展的关键时刻。\n\n第一次入职时你是普通员工，第一次晋升时你成了管理者，第一次创业时你成了创始人。人生的每一步，都在为职业发展创造可能。\n\n你开始理解，人生和事业不是两条平行线，而是相互交织的螺旋。",
      triggers: { minDay: 450, excludeFlags: ["_lifeCareerMilestoneV3Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 400;
      },
      choices: [
        {
          text: "🎯 记录这个职业里程碑",
          hint: "最高技能XP+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneV3Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 15);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你记录了职业里程碑。人生和事业是相互交织的螺旋。技能XP+15，心智+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneV3Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
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
