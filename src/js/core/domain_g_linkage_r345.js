/**
 * 域G(核心机制/生命周期) 联动增强 R345
 * 第十一轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→B  life_event_chapters_v4      人生→事件章节（事件/叙事·生命主线）
 *   G→C  life_career_v2              人生→职业（职业/成长·人生规划）
 *   G→D  life_social_v2              人生→社交（NPC/社交·人生网络）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR345Loaded) return;
  RANDOM_EVENTS._domainGLinkageR345Loaded = true;

  var EVENTS = [
    {
      id: "life_event_chapters_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "人生事件章节v4",
      story: "你回顾自己这些年经历的事件，发现它们构成了你人生故事的各个章节——生存、立足、选择、成长、转型、传承。\n\n每一个章节都有其主题和挑战，每一个事件都是这个章节的一个注脚。你开始理解，人生不是线性的，而是由无数个事件编织而成的「叙事网络」。\n\n「人生不是找到答案，是学会讲故事。」",
      triggers: { minDay: 700, excludeFlags: ["_lifeEventChaptersV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 150;
      },
      choices: [
        {
          text: "📖 写下人生章节",
          hint: "心情+22，心智+15",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV4Seen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 22);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了人生章节。人生不是找到答案，是学会讲故事。心情+22，心智+15。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeEventChaptersV4Seen = true;
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
      id: "life_career_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "人生职业规划v2",
      story: "你发现，人生的重要节点总是伴随着职业发展的关键时刻。\n\n第一次入职时你是普通员工，第一次晋升时你成了管理者，第一次创业时你成了创始人。人生的每一步，都在为职业发展创造可能。\n\n你开始理解，人生和事业不是两条平行线，而是相互交织的螺旋。",
      triggers: { minDay: 600, excludeFlags: ["_lifeCareerV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 500;
      },
      choices: [
        {
          text: "🎯 记录职业里程碑",
          hint: "最高技能XP+16，心智+11",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerV2Seen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 16);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 11);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你记录了职业里程碑。人生和事业是相互交织的螺旋。技能XP+16，心智+11。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerV2Seen = true;
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
    {
      id: "life_social_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "人生社交v2",
      story: "你回顾自己这些年的社交历程——从一个人都不认识，到有了朋友、同事、导师、合作伙伴。\n\n这些人不仅是你的社交网络，也是你在这座城市里的「家」。你决定组织一次「老友聚会」，把大家聚在一起，回忆过去的点点滴滴。\n\n「社交不是利益交换，是情感的积累。」",
      triggers: { minDay: 600, excludeFlags: ["_lifeSocialV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 60) highNpcs++;
        }
        return highNpcs >= 5;
      },
      choices: [
        {
          text: "👥 组织老友聚会",
          hint: "NPC好感+12，心情+20",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 60) {
                  applyAffinityChange(st, id, 12, "老友聚会");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 20);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你组织了老友聚会。社交是情感的积累。好感+12，心情+20。", "success");
            }
          },
        },
        {
          text: "🤷 不用组织，各自安好",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得各自安好就好。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
