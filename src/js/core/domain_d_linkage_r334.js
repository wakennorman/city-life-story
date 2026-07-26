/**
 * 域D(NPC/社交) 联动增强 R334
 * 第十轮循环——社交积累的多维回响。
 * 桥接：
 *   D→A  social_data_v2              社交→数据（数据/数值·关系分析）
 *   D→B  social_event_story           社交→事件故事（事件/叙事·人物连接）
 *   D→C  social_career_mentor         社交→职业导师（职业/成长·师徒传承）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainDLinkageR334Loaded) return;
  RANDOM_EVENTS._domainDLinkageR334Loaded = true;

  function countHighNpcsD334(st, minAff) {
    minAff = minAff || 50;
    if (!st || !st.relationships) return 0;
    var count = 0;
    for (var id in st.relationships) {
      if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= minAff) count++;
    }
    return count;
  }

  var EVENTS = [
    {
      id: "social_data_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "📊",
      title: "社交数据v2",
      story: "你开始分析自己的社交网络数据——好感分布、互动频率、关系深度、互惠次数。\n\n这些数字让你发现了一些有趣的规律：某些NPC是「关键节点」，某些关系是「高价值投资」。\n\n你开始用数据「经营」人际关系，而不是凭感觉。",
      triggers: { minDay: 500, excludeFlags: ["_socialDataV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD334(st, 45) >= 5;
      },
      choices: [
        {
          text: "📊 用数据优化社交策略",
          hint: "心智+10，NPC好感+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 45) {
                  applyAffinityChange(st, id, 5, "数据洞察");
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📊 你用数据优化社交策略。数据让社交更精准。心智+10，好感+5。", "success");
            }
          },
        },
        {
          text: "🤷 凭直觉就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialDataV2Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得凭直觉就行。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      id: "social_event_story",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "社交是事件的共鸣",
      story: "你发现，和已结识NPC聊起共同经历的事件，能迅速拉近彼此的距离。\n\n「你也经历过这种事？」「原来你也是这么过来的。」共同经历是社交的催化剂，让陌生人变成朋友，让朋友变成挚友。\n\n你开始主动和NPC分享自己的故事，也倾听TA们的故事。",
      triggers: { minDay: 400, excludeFlags: ["_socialEventStorySeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        return countHighNpcsD334(st, 40) >= 3;
      },
      choices: [
        {
          text: "📖 和NPC分享你的故事",
          hint: "NPC好感+7，心情+12",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventStorySeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 40) {
                  applyAffinityChange(st, id, 7, "故事分享");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你和NPC分享了你的故事。共同经历是社交的催化剂。好感+7，心情+12。", "success");
            }
          },
        },
        {
          text: "🤫 故事不用分享，自己知道就行",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialEventStorySeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得故事不用分享。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "social_career_mentor",
      phase: "street",
      _isChainEvent: false,
      icon: "🎓",
      title: "NPC成为职业导师",
      story: "你发现，某个高好感的NPC在职业上给了你很大的帮助——分享行业经验、推荐工作机会、在你迷茫时给出建议。\n\n你开始理解，「导师」不是正式的，而是在关键时刻愿意帮助你的人。\n\n你决定珍惜这段关系，也承诺在未来帮助其他人。",
      triggers: { minDay: 450, excludeFlags: ["_socialCareerMentorSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.career || !st.career.currentJob) return false;
        return countHighNpcsD334(st, 60) >= 1;
      },
      choices: [
        {
          text: "🎓 珍惜这段师徒关系",
          hint: "NPC好感+10，最高技能XP+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCareerMentorSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 60) {
                  applyAffinityChange(st, id, 10, "师徒关系");
                  break;
                }
              }
            }
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎓 你珍惜了这段师徒关系。导师是在关键时刻帮助你的人。好感+10，技能XP+10。", "success");
            }
          },
        },
        {
          text: "🤷 职业发展靠自己，不需要导师",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialCareerMentorSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得职业发展靠自己。心智+3。", "info");
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
