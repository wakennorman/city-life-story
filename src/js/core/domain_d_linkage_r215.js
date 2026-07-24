/*
 * 城市浮生记 — 域D（NPC/社交）联动增强 · R215
 * 全系统优化 loop R215 · 联动增强 2项
 */
(function () {
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR215) return;
  RANDOM_EVENTS._domainDLinkageR215 = true;

  function getMetNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var c = 0;
    for (var k in st.relationships) {
      if (st.relationships[k] && st.relationships[k].met) c++;
    }
    return c;
  }

  var D_EVENTS = [
    // ===== 联动1: D→G 温暖社交圈 =====
    {
      id: "social_circle_warmth",
      phase: "street",
      icon: "🤗",
      title: "朋友圈的温暖",
      story: "你翻看着手机，几个老朋友发来问候。有人记得你的生日，有人问你最近怎么样。这座城市虽然大，但你不孤单。",
      conditions: function (st) {
        if (!st || !st.flags || !st.relationships) return false;
        if (st.flags._socialWarmthDone) return false;
        if (st.player && st.player.day < 20) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 40) highAff++;
        }
        return highAff >= 3;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "💬 给朋友们回消息",
          hint: "心情+8，疲劳-5",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWarmthDone = true;
            st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            st.needs.fatigue = Math.max(0, (st.needs.fatigue || 50) - 5);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            StateManager.addMessage("🤗 朋友们的问候让你心里暖暖的，心情+8，疲劳-5。", "success");
          },
        },
        {
          text: "😌 默默看完，继续忙",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._socialWarmthDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            StateManager.addMessage("😌 你知道有人惦记着你，这就够了。心智+2。", "info");
          },
        },
      ],
    },
    // ===== 联动2: D→C 人脉内推 =====
    {
      id: "npc_job_referral",
      phase: "street",
      icon: "💼",
      title: "朋友的内推机会",
      story: "一个关系不错的朋友告诉你，他公司正在招人，待遇不错，他可以帮你内推。",
      conditions: function (st) {
        if (!st || !st.flags || !st.relationships) return false;
        if (st.flags._npcJobReferralDone) return false;
        if (st.player && st.player.day < 30) return false;
        var highAff = 0;
        for (var k in st.relationships) {
          if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 50) highAff++;
        }
        return highAff >= 1;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "👍 谢谢，我试试！",
          hint: "获得技能XP奖励",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcJobReferralDone = true;
            // 随机提升一项技能
            if (st.skills) {
              var keys = Object.keys(st.skills);
              if (keys.length > 0) {
                var sk = keys[Random.int(0, keys.length - 1)];
                st.skills[sk].xp = (st.skills[sk].xp || 0) + 60;
                StateManager.addMessage("💼 朋友帮你内推了一份好工作！你感觉" + sk + "技能有了新的领悟。技能XP+60。", "success");
              }
            }
          },
        },
        {
          text: "😅 现在工作还行，先不考虑",
          hint: "好感+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._npcJobReferralDone = true;
            if (st.relationships) {
              for (var k in st.relationships) {
                if (st.relationships[k] && st.relationships[k].met && (st.relationships[k].affinity || 0) >= 50) {
                  if (typeof applyAffinityChange === "function") {
                    applyAffinityChange(st, k, 3, "内推婉拒");
                  }
                  break;
                }
              }
            }
            StateManager.addMessage("😅 你婉拒了朋友的好意，但心里记着这份人情。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < D_EVENTS.length; i++) {
    RANDOM_EVENTS.push(D_EVENTS[i]);
  }
})();