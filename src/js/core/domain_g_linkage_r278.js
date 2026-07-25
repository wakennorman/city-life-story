/**
 * 域G(核心机制/生命周期) 联动增强 R278
 * 第三轮循环——pipeline不仅是状态机，还在社交/经济/叙事层面留下痕迹。
 * 桥接：
 *   G→D  life_npc_birthday_auto     人生节点→NPC自动生日祝福（社交·自动化关怀）
 *   G→E  life_wealth_milestone_event 财富里程碑→经济事件（经济·时间积累）
 *   G→B  life_season_narrative       季节更替→叙事事件（事件/叙事·时间流逝）
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainGLinkageR278Loaded) return;
  RANDOM_EVENTS._domainGLinkageR278Loaded = true;

  var EVENTS = [
    {
      id: "life_npc_birthday_auto",
      phase: "street",
      _isChainEvent: false,
      icon: "🎂",
      title: "别忘了朋友的生日",
      story: "手机弹出一条提醒：「今天是XXX的生日」。\n\n你差点忘了。赶紧拿起手机，发了一条生日祝福。对方回复了一个感动的表情。\n\n有些关系，不需要天天联系，只需要在重要的日子记得。",
      triggers: { minDay: 90, excludeFlags: ["_lifeNpcBirthdayAutoSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.relationships || !st.player || typeof NPCS === "undefined") return false;
        var dayOfYear = ((st.player.day - 1) % 365) + 1;
        for (var i = 0; i < NPCS.length; i++) {
          if (NPCS[i].birthday === dayOfYear && st.relationships[NPCS[i].id] && st.relationships[NPCS[i].id].met) {
            var flagKey = "_birthdayGreeted_" + NPCS[i].id + "_" + Math.floor(st.player.day / 365);
            if (st.flags && st.flags[flagKey]) continue;
            st._birthdayNpcId = NPCS[i].id;
            return true;
          }
        }
        return false;
      },
      choices: [
        {
          text: "🎂 发一条生日祝福",
          hint: "NPC好感+6，心情+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeNpcBirthdayAutoSeen = true;
            var npcId = st._birthdayNpcId;
            if (npcId && typeof applyAffinityChange === "function") {
              applyAffinityChange(st, npcId, 6, "生日祝福");
              var flagKey = "_birthdayGreeted_" + npcId + "_" + Math.floor(st.player.day / 365);
              st.flags[flagKey] = true;
            }
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🎂 你发了生日祝福。有些人，不需要天天联系，只需要在重要的日子记得。好感+6，心情+5。", "success");
            }
          },
        },
        {
          text: "🤷 太忙了，下次再说",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeNpcBirthdayAutoSeen = true;
            if (st.player) st.player.mental = Math.max(0, (st.player.mental || 50) - 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你太忙了忘了祝福。有些关系，就是这样慢慢淡的。心智-2。", "warning");
            }
          },
        },
      ],
      probability: 0.8,
      repeatable: false,
    },
    {
      id: "life_wealth_milestone_event",
      phase: "street",
      _isChainEvent: false,
      icon: "💰",
      title: "财富里程碑事件",
      story: "你的总资产达到了一个新的里程碑——¥100,000！\n\n这个数字，一年前的你想都不敢想。那时候你口袋里揣着几百块来到这座城市，连住一晚旅馆都要算计。\n\n现在的你，终于有了一点点「财务自由」的雏形。不是很多，但足够让你在某些深夜，睡得稍微踏实一点。",
      triggers: { minDay: 200, excludeFlags: ["_lifeWealthMilestoneSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.resources) return false;
        if (!st.flags || !st.flags._wealthMilestone100k) return false;
        return true;
      },
      choices: [
        {
          text: "💰 给自己一个小奖励",
          hint: "心情+10，现金-2000",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 2000);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💰 你给自己买了礼物。这是你在这座城市奋斗的见证。心情+10。", "success");
            }
          },
        },
        {
          text: "📈 继续攒钱，目标下一个里程碑",
          hint: "心智+5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeWealthMilestoneSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📈 你选择继续攒钱。下一个里程碑在等着你。心智+5。", "info");
            }
          },
        },
      ],
      probability: 0.6,
      repeatable: false,
    },
    {
      id: "life_season_narrative",
      phase: "street",
      _isChainEvent: false,
      icon: "🌸",
      title: "季节更替的叙事",
      story: "又是一年春天。\n\n你走在街上，看到路边的樱花开了。去年的这个时候，你还在这座城市里迷茫地找方向。一年后，你有了工作、有了朋友、有了属于自己的生活。\n\n季节在更替，你也在成长。这座城市不变，但你变了。",
      triggers: { minDay: 365, excludeFlags: ["_lifeSeasonNarrativeSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player) return false;
        var dayOfYear = ((st.player.day - 1) % 365) + 1;
        return dayOfYear >= 60 && dayOfYear <= 120;
      },
      choices: [
        {
          text: "🌸 记录这一刻的感受",
          hint: "心情+8，心智+6",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSeasonNarrativeSeen = true;
            st.flags._lifeJournalKeeper = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 6);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌸 你记录下了这一刻的感受。季节在更替，你也在成长。心情+8，心智+6。", "success");
            }
          },
        },
        {
          text: "🤷 不用记录，感受就好",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._lifeSeasonNarrativeSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🤷 你觉得感受就好。心智+3。", "info");
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
