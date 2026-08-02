/**
 * 域D(NPC/社交) 联动增强 R1026
 * — D→B NPC故事回响 / D→E 社交投资情报 / D→G 社交健康恢复
 *
 * 设计意图：NPC社交数据消费到其他域，让玩家感知到社交网络的跨域价值。
 * 1. 好感里程碑 → 触发NPC故事叙事
 * 2. 社交圈质量 → 提供投资情报线索
 * 3. 好友数量 → 心理健康恢复加成
 *
 * 约束：IIFE 注册 RANDOM_EVENTS；显式 phase；全 || 防御；
 *       done-flag 防重；NPC 一律 met 铁律。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR1026Loaded) return;
  RANDOM_EVENTS._domainDLinkageR1026Loaded = true;

  function msg(t, k) {
    if (typeof StateManager !== "undefined" && StateManager.addMessage) StateManager.addMessage(t, k || "info");
  }
  function gx(k, a) {
    if (typeof addSkillXp === "function") { try { addSkillXp(k, a); } catch (e) {} }
  }

  var EVENTS = [
    // ===== 1. D→B NPC故事回响 =====
    {
      id: "d1026_npc_story_echo",
      phase: "street",
      icon: "📖",
      title: "老友的往事",
      story: "你和一位老朋友聊起了往事。\n\n他/她讲起了你们刚认识时的故事——那时候你还在街头摸爬滚打，连一顿像样的饭都吃不起。\n\n「那时候你真是惨啊，」他笑着说，「但现在不一样了。」\n\n你笑了笑，心里却想起了那些艰难的日子。\n\n有些路，走过了回头看，才发现自己已经走了这么远。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d1026NpcStoryDone) return false;
        // 至少有一位NPC好感≥80
        if (!st.relationships) return false;
        var hasHighAff = false;
        for (var _nid in st.relationships) {
          if (st.relationships[_nid] && (st.relationships[_nid].affinity || 0) >= 80) {
            hasHighAff = true;
            break;
          }
        }
        return hasHighAff && st.player.day >= 80;
      },
      probability: 0.03,
      repeatable: false,
      choices: [
        {
          text: "📖 听听他/她的故事",
          hint: "心智+5, 好感+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d1026NpcStoryDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            // 提升所有好感≥60的NPC好感
            if (st.relationships) {
              for (var _nid in st.relationships) {
                var _rel = st.relationships[_nid];
                if (_rel && _rel.met && (_rel.affinity || 0) >= 60 && typeof applyAffinityChange === "function") {
                  applyAffinityChange(st, _nid, 3, "往事回忆");
                }
              }
            }
            msg("📖 听完故事，你对这座城市和这里的人有了更深的感情。心智+5，好友好感+3。", "success");
          },
        },
        {
          text: "📝 把这些故事写下来",
          hint: "智力+3, 编程XP+20",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d1026NpcStoryDone = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
            gx("coding", 20);
            msg("📝 你把这些故事记录了下来。智力+3，编程EXP+20。", "info");
          },
        },
      ],
    },

    // ===== 2. D→E 社交投资情报 =====
    {
      id: "d1026_social_invest_tip",
      phase: "street",
      icon: "💡",
      title: "朋友的投资建议",
      story: "一个在金融圈混的朋友约你吃饭。\n\n酒过三巡，他神秘兮兮地说：「最近有个机会，我觉得你可以关注一下。」\n\n他说的不是具体的股票代码，而是一个行业趋势——一个你可能从来没注意到的方向。\n\n「我认识的人里，就你最适合干这个，」他说，「因为你懂市场，懂人心。」\n\n这种情报，不是有钱就能买到的。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d1026InvestTipDone) return false;
        if (!st.relationships) return false;
        // 至少有3位NPC好感≥40（社交圈够广）
        var highAffCount = 0;
        for (var _nid in st.relationships) {
          if (st.relationships[_nid] && (st.relationships[_nid].affinity || 0) >= 40) {
            highAffCount++;
          }
        }
        return highAffCount >= 3 && st.player.day >= 60;
      },
      probability: 0.025,
      repeatable: false,
      choices: [
        {
          text: "📈 认真研究这个方向",
          hint: "会计XP+40, 智力+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d1026InvestTipDone = true;
            st.flags._d1026SocialInvestIntel = true;
            gx("accounting", 40);
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 10) + 3);
            // 投资分析加成标记
            if (st.investment) st.investment._socialIntelBonus = true;
            msg("📈 你认真研究了朋友的建议。会计EXP+40，智力+3，未来投资分析获得社交情报加成。", "success");
          },
        },
        {
          text: "🤝 请朋友吃饭详聊",
          hint: "好感+5, 客户线索+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d1026InvestTipDone = true;
            var cap = typeof ensureCareerCapital === "function" ? ensureCareerCapital(st) : null;
            if (cap) {
              cap.clientLeads = Math.min(100, (cap.clientLeads || 0) + 5);
              if (typeof clampCareerCapital === "function") clampCareerCapital(cap);
            }
            msg("🤝 你请朋友吃了顿饭，聊得很深入。客户线索+5。", "info");
          },
        },
      ],
    },

    // ===== 3. D→G 社交健康恢复 =====
    {
      id: "d1026_social_health_boost",
      phase: "street",
      icon: "💚",
      title: "朋友的关心是最好的药",
      story: "你最近状态不太好——\n\n疲劳、压力、睡眠不足……\n\n但就在你最难受的时候，手机响了。\n\n是朋友发来的消息：「最近怎么样？好久没见你了，有空出来坐坐？」\n\n有时候，一句简单的问候，就能让人重新振作起来。\n\n你突然意识到：在这个城市里，你不是一个人。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d1026HealthBoostDone) return false;
        if (!st.relationships) return false;
        var metCount = 0;
        for (var _nid in st.relationships) {
          if (st.relationships[_nid] && st.relationships[_nid].met) metCount++;
        }
        var fatigue = (st.needs && st.needs.fatigue) || 0;
        return metCount >= 3 && fatigue >= 50 && st.player.day >= 40;
      },
      probability: 0.035,
      repeatable: false,
      choices: [
        {
          text: "💚 出去见朋友",
          hint: "疲劳-20, 心情+15",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d1026HealthBoostDone = true;
            if (st.needs) {
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 15);
            }
            msg("💚 和朋友聊了一晚上，感觉好多了。疲劳-20，心情+15。", "success");
          },
        },
        {
          text: "📱 回消息说改天",
          hint: "心情+5",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d1026HealthBoostDone = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            msg("📱 虽然没出去，但知道有人惦记着，心里暖暖的。心情+5。", "info");
          },
        },
      ],
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    if (typeof RANDOM_EVENTS.push === "function") {
      RANDOM_EVENTS.push(EVENTS[i]);
    }
  }
})();