/**
 * 域G(核心机制/生命周期) 联动增强 R337
 * 第十轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→C  life_career_milestone_v4    人生→职业里程碑（职业/成长·时间积累）
 *   G→D  life_social_milestone_v2    人生→社交里程碑（NPC/社交·时间积累）
 *   G→E  life_wealth_milestone_v4    人生→财富里程碑（经济·时间积累）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR337Loaded) return;
  RANDOM_EVENTS._domainGLinkageR337Loaded = true;

  var EVENTS = [
    {
      id: "life_career_milestone_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "人生职业里程碑v4",
      story: "你发现，人生的重要节点总是伴随着职业发展的关键时刻。\n\n第一次入职时你是普通员工，第一次晋升时你成了管理者，第一次创业时你成了创始人。人生的每一步，都在为职业发展创造可能。\n\n你开始理解，人生和事业不是两条平行线，而是相互交织的螺旋。",
      triggers: { minDay: 500, excludeFlags: ["_lifeCareerMilestoneV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 450;
      },
      choices: [
        {
          text: "🎯 记录这个职业里程碑",
          hint: "最高技能XP+15，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneV4Seen = true;
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
            st.flags._lifeCareerMilestoneV4Seen = true;
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
      id: "life_social_milestone_v2",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "人生社交里程碑v2",
      story: "你回顾自己这些年的社交历程——从一个人都不认识，到有了朋友、同事、导师、合作伙伴。\n\n这些人不仅是你的社交网络，也是你在这座城市里的「家」。你决定组织一次「老友聚会」，把大家聚在一起，回忆过去的点点滴滴。\n\n「社交不是利益交换，是情感的积累。」",
      triggers: { minDay: 500, excludeFlags: ["_lifeSocialMilestoneV2Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 55) highNpcs++;
        }
        return highNpcs >= 4;
      },
      choices: [
        {
          text: "👥 组织老友聚会",
          hint: "NPC好感+10，心情+18",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialMilestoneV2Seen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 55) {
                  applyAffinityChange(st, id, 10, "老友聚会");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 18);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你组织了老友聚会。社交是情感的积累。好感+10，心情+18。", "success");
            }
          },
        },
        {
          text: "🤷 不用组织，各自安好",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSocialMilestoneV2Seen = true;
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
    {
      id: "life_wealth_milestone_v4",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "人生财富里程碑v4",
      story: "你的总资产达到了¥2,000,000！\n\n这个数字，两年前的你想都不敢想。你决定把这个时刻记录下来——不是作为炫耀，而是作为对未来的自己在低谷时的鼓励。\n\n「财富不仅是数字，也是你在这座城市努力活过的证据。」",
      triggers: { minDay: 600, excludeFlags: ["_lifeWealthMilestoneV4Seen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 2000000;
      },
      choices: [
        {
          text: "💰 记录这个财富里程碑",
          hint: "心情+25，心智+15",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV4Seen = true;
            st.flags._wealthMilestone2M = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你记录了财富里程碑。财富是你努力活过的证据。心情+25，心智+15。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续积累",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneV4Seen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+4。", "info");
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
