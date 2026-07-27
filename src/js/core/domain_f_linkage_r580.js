/**
 * 域F(UI/UX) 联动增强 R580
 * 桥接：
 *   F→H  f580_corp_team_ui    公司团队UI → 消费 corporate 数据,
 *     团队→"团队管理面板"的UI展示
 *   F→D  f580_social_feed_ui  社交动态UI → 消费 relationships 数据,
 *     动态→"朋友的最新动态"的社交feed
 *   F→G  f580_life_rhythm_v3 生活节奏v3 → 消费 needs+status 数据,
 *     节奏→"生活节奏优化建议"的智能提示
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR580Loaded) return;
  RANDOM_EVENTS._domainFLinkageR580Loaded = true;

  function firstMetNpc(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) { if (st.relationships[id] && st.relationships[id].met) return id; }
    return null;
  }
  function bumpAffinity(st, npcId, amt, reason) {
    if (!npcId) return;
    if (typeof applyAffinityChange === "function") { try { applyAffinityChange(st, npcId, amt, reason); } catch(e) {} }
  }

  var EVENTS = [
    {
      id: "f580_corp_team_ui", phase: "corporate", _isChainEvent: false, icon: "👥",
      title: "团队面板",
      story: "你打开了团队管理面板——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 5, excludeFlags: ["_f580CorpTeamCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.team || st.corporate.team.length < 1) return false;
        return (st.flags && !st.flags._f580CorpTeamCooldown);
      },
      choices: [
        { text: "👥 查看详情", hint: "管理XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f580CorpTeamCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '团队面板显示部门有X人，士气良好。' 管理XP+4,心智+1。", "success");
        }},
        { text: "📊 分析绩效", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f580CorpTeamCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("👥 '分析团队绩效数据，找出提升空间。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你打开了团队管理面板——'团队成员、绩效、满意度...' 一屏掌握团队状态。";
      }
    },
    {
      id: "f580_social_feed_ui", phase: "street", _isChainEvent: false, icon: "📱",
      title: "社交动态",
      story: "你刷到了朋友的最新动态——{desc}",
      triggers: { minDay: 10, interval: 20, maxRepeats: 10, excludeFlags: ["_f580SocialFeedCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f580SocialFeedCooldown);
      },
      choices: [
        { text: "📱 点赞", hint: "好感+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f580SocialFeedCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 1, "点赞动态");
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你给朋友的动态点了个赞。好感+1,心情+1。", "success");
        }},
        { text: "💬 评论", hint: "好感+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f580SocialFeedCooldown = true;
          var nid = firstMetNpc(st); bumpAffinity(st, nid, 2, "评论动态");
          if (typeof StateManager !== "undefined") StateManager.addMessage("📱 你认真评论了朋友的动态。好感+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你刷到了朋友的最新动态——'TA发了一张旅行的照片，看起来很开心。' 朋友圈里，大家都在分享生活。";
      }
    },
    {
      id: "f580_life_rhythm_v3", phase: "street", _isChainEvent: false, icon: "⏰",
      title: "生活节律",
      story: "系统根据你的作息给出了优化建议——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 5, excludeFlags: ["_f580LifeRhythmCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f580LifeRhythmCooldown);
      },
      choices: [
        { text: "⏰ 采纳建议", hint: "健康+2,疲劳-2,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f580LifeRhythmCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⏰ '调整作息后，精力更充沛了。' 健康+2,疲劳-2,心智+1。", "success");
        }},
        { text: "📝 看看就好", hint: "心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f580LifeRhythmCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("⏰ '知道了，但改起来不容易。' 心智+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "系统根据你的作息给出了优化建议——'你最近平均睡眠6.5小时，建议增加到7-8小时。' 好的作息，是健康的基石。";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    (function (ev) {
      var exists = false;
      for (var j = 0; j < RANDOM_EVENTS.length; j++) {
        if (RANDOM_EVENTS[j] && RANDOM_EVENTS[j].id === ev.id) { exists = true; break; }
      }
      if (!exists) RANDOM_EVENTS.push(ev);
    })(EVENTS[i]);
  }
})();