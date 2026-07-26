/**
 * 域G(核心机制/生命周期) 联动增强 R302
 * 第六轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→H  life_company_milestone      人生节点→公司里程碑（公司·时间积累）
 *   G→C  life_career_milestone_event  人生节点→职业里程碑（职业/成长·时间积累）
 *   G→D  life_npc_milestone           人生节点→NPC里程碑（NPC/社交·时间积累）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR302Loaded) return;
  RANDOM_EVENTS._domainGLinkageR302Loaded = true;

  var EVENTS = [
    {
      id: "life_company_milestone",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "人生节点与公司里程碑",
      story: "你发现，人生的重要节点总是与公司的发展密切相关。\n\n第一次入职时你是普通员工，第一次晋升时你成了管理者，第一次创业时你成了创始人。人生的每一步，都在为公司的发展铺路。\n\n你开始理解，人生和事业不是两条平行线，而是相互交织的螺旋。",
      triggers: { minDay: 300, excludeFlags: ["_lifeCompanyMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company || !st.career || !st.career.currentJob) return false;
        return (st.career.currentJob.workDays || 0) >= 250;
      },
      choices: [
        {
          text: "🏢 记录这个人生与事业的交汇点",
          hint: "心智+9，公司声誉+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 9);
            if (st.startup && st.startup.company) st.startup.company.reputation = (st.startup.company.reputation || 0) + 6;
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你记录了人生与事业的交汇点。人生和事业是相互交织的螺旋。心智+9，声誉+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCompanyMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.45,
      repeatable: false,
    },
    {
      id: "life_career_milestone_event",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "人生节点触发职业里程碑",
      story: "你发现，人生的重要节点总是伴随着职业发展的关键时刻。\n\n搬家后你找到了更好的工作，病愈后你更加珍惜每一次机会，朋友介绍下你遇到了人生导师。人生的每一步，都在为职业发展创造可能。\n\n你开始理解，职业不是孤立的人生维度，而是与所有其他维度相互影响。",
      triggers: { minDay: 250, excludeFlags: ["_lifeCareerMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var job = st.career && st.career.currentJob;
        if (!job || !job.path) return false;
        return (job.workDays || 0) >= 200;
      },
      choices: [
        {
          text: "🎯 记录这个职业里程碑",
          hint: "最高技能XP+12，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneSeen = true;
            var topSkill = "", topLv = 0;
            for (var k in st.skills) {
              var lv = (st.skills[k] && st.skills[k].level) || 0;
              if (lv > topLv) { topLv = lv; topSkill = k; }
            }
            if (topSkill && typeof addSkillXp === "function") addSkillXp(topSkill, 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你记录了职业里程碑。职业与所有维度相互影响。技能XP+12，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续前进",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeCareerMilestoneSeen = true;
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
      id: "life_npc_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "人生节点与NPC关系里程碑",
      story: "你发现，人生的重要节点总是伴随着与NPC关系的变化。\n\n搬家后你认识了新邻居，换工作后你结识了新同事，病愈后你更加珍惜老朋友的陪伴。人生的每一步，都在重塑你的社交网络。\n\n你开始理解，NPC不是固定不变的「角色」，而是与你一起成长的「人」。",
      triggers: { minDay: 200, excludeFlags: ["_lifeNpcMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships) return false;
        var highNpcs = 0;
        for (var id in st.relationships) {
          if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 50) highNpcs++;
        }
        return highNpcs >= 2;
      },
      choices: [
        {
          text: "👥 记录这个关系里程碑",
          hint: "NPC好感+6，心情+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeNpcMilestoneSeen = true;
            if (typeof applyAffinityChange === "function") {
              for (var id in st.relationships) {
                if (st.relationships[id] && st.relationships[id].met && (st.relationships[id].affinity || 0) >= 50) {
                  applyAffinityChange(st, id, 6, "关系里程碑");
                }
              }
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("👥 你记录了关系里程碑。NPC不是角色，是与你一起成长的人。好感+6，心情+10。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续生活",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeNpcMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得不用记录。心智+3。", "info");
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
