/**
 * 域G(核心机制/生命周期) 联动增强 R294
 * 第五轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→C  life_skill_milestone_event   人生节点→技能里程碑（职业/成长·时间积累）
 *   G→E  life_wealth_milestone_narrative 财富里程碑→叙事（经济·时间故事）
 *   G→B  life_annual_reflection        年度回顾→叙事（事件/叙事·生命主线）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR294Loaded) return;
  RANDOM_EVENTS._domainGLinkageR294Loaded = true;

  var EVENTS = [
    {
      id: "life_skill_milestone_event",
      phase: "street",
      _isChainEvent: false,
      icon: "🎯",
      title: "技能里程碑事件",
      story: "你的一门技能达到了一个新的里程碑——也许是Lv.50，也许是Lv.70，也许是满级。\n\n这个等级不仅是一个数字，它代表着你在这上面投入的时间和精力。每一次练习、每一次失败、每一次突破，都凝聚在这个数字里。\n\n你决定庆祝这个里程碑——不是因为它有多高，而是因为你坚持了这么久。",
      triggers: { minDay: 200, excludeFlags: ["_lifeSkillMilestoneEventSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.skills || !st.flags || !st.flags._skillMilestones) return false;
        var milestones = st.flags._skillMilestones;
        return Object.keys(milestones).length >= 3;
      },
      choices: [
        {
          text: "🎯 庆祝这个里程碑",
          hint: "心情+10，心智+7",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSkillMilestoneEventSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 7);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎯 你庆祝了技能里程碑。坚持本身就是一种胜利。心情+10，心智+7。", "success");
            }
          },
        },
        {
          text: "🤫 继续前进，还有更高目标",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSkillMilestoneEventSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你选择继续前进。山外有山。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.55,
      repeatable: false,
    },
    {
      id: "life_wealth_milestone_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财富里程碑叙事",
      story: "你的总资产达到了¥200,000！\n\n这个数字，一年前的你想都不敢想。那时候你口袋里揣着几百块来到这座城市，连住一晚旅馆都要算计。\n\n你决定把这段财富积累的故事写下来——不是作为炫耀，而是作为对未来的自己在低谷时的鼓励。",
      triggers: { minDay: 300, excludeFlags: ["_lifeWealthMilestoneNarrSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        var total = (st.resources.cash || 0) + (st.resources.bankBalance || 0);
        return total >= 200000;
      },
      choices: [
        {
          text: "💰 写下财富里程碑故事",
          hint: "心情+12，心智+8",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneNarrSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 12);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你写下了财富里程碑故事。这是给未来自己的鼓励。心情+12，心智+8。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，继续积累",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneNarrSeen = true;
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
    {
      id: "life_annual_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "📖",
      title: "年度人生回顾",
      story: "又是一年。你坐在出租屋的床边，回顾这一年的日子。\n\n经历了无数个第一次，也经历了无数次重复。有些让你成长，有些让你困惑，有些让你重新认识自己。\n\n你拿出手机，写下这一年的感悟。不是为了发表，而是为了在未来的某一天，当你迷茫时，可以翻回这一页，告诉自己：「我已经走过了这么远。」",
      triggers: { minDay: 365, excludeFlags: ["_lifeAnnualReflectionSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.player && st.player.day >= 365;
      },
      choices: [
        {
          text: "📖 写下年度感悟",
          hint: "心情+10，心智+10",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeAnnualReflectionSeen = true;
            st.flags._annualReflectionKeeper = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 10);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📖 你写下了年度感悟。文字让成长变得可见。心情+10，心智+10。", "success");
            }
          },
        },
        {
          text: "🤫 不用记录，继续前行",
          hint: "心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeAnnualReflectionSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤫 你觉得不用记录。心智+4。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
