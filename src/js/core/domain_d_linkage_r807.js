/*
 * 城市浮生记 — 域D(NPC/社交) 联动增强 R807
 * 全系统优化·Domain D 第六十轮循环
 *
 * 【联动增强3项】
 *   1. D→B NPC事件回响 — NPC关系触发事件叙事回响
 *   2. D→C NPC职业推荐 — NPC关系提供职业技能指导
 *   3. D→H 创业社交圈 — NPC关系网络反哺创业团队
 *
 * 设计约束（与历轮 IIFE linkage 文件一致）：
 *  - IIFE 注入全局 RANDOM_EVENTS，避免改动 cross_system_events.js。
 *  - 所有 state 访问均 || 防御；数值标 [PLACEHOLDER]。
 *  - 严格遵守域D铁律：NPC引用须 rel && rel.met；好感传导走 applyAffinityChange。
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR807Loaded) return;
  RANDOM_EVENTS._domainDLinkageR807Loaded = true;

  // ---- 本地助手 ----
  function grantXp(key, amt) {
    if (typeof addSkillXp === "function") { try { addSkillXp(key, amt); } catch(e) {} }
  }

  var EVENTS = [
    // ========================================================================
    // 联动增强1: D→B NPC事件回响 — NPC关系触发事件叙事回响
    // 设计意图：高好感NPC应触发特殊事件，让玩家感到"朋友多了路好走"。
    // 本事件在玩家拥有≥2个好感≥70的NPC时触发，给予"NPC事件回响"标记。
    // 心理学：峰终定律 — 与朋友的特殊时刻成为记忆锚点。
    // ========================================================================
    {
      id: "d807_npc_event_echo",
      phase: "street",
      icon: "💫",
      title: "老朋友带来的意外惊喜",
      story: "你收到了一位老朋友的电话——他/她遇到了一个有趣的机会，第一时间想到了你。\n\n「有好事想着你」——这大概就是朋友最大的价值。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d807NpcEchoDone) return false;
        if (!st.relationships) return false;
        var _closeCount = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 70) _closeCount++;
        }
        return _closeCount >= 2;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "💫 珍惜这份友谊",
          hint: "心情+10, 置_d807NpcEcho",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d807NpcEchoDone = true;
            st.flags._d807NpcEcho = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💫 老朋友带来的意外惊喜——心情+10。朋友多了路好走。", "success");
            }
          }
        },
        {
          text: "😊 谢谢，心领了",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d807NpcEchoDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 谢谢，心领了。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强2: D→C NPC职业推荐 — NPC关系提供职业技能指导
    // 设计意图：高好感NPC应能提供职业技能指导，让玩家感到"有人带"。
    // 本事件在玩家拥有≥1个好感≥60的NPC时触发，给予"导师指点"标记。
    // 心理学：技能协同 — 不同领域的指导互相强化。
    // ========================================================================
    {
      id: "d807_npc_career_guide",
      phase: "street",
      icon: "🎓",
      title: "有人带，走得更快",
      story: "一位老朋友在行业里摸爬滚打多年，经验丰富。\n\n他/她愿意把自己的经验和技巧传授给你——这不是培训班能学到的，这是「过来人的经验」。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d807NpcGuideDone) return false;
        if (!st.relationships) return false;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 60) return true;
        }
        return false;
      },
      probability: 0.05,
      repeatable: false,
      choices: [
        {
          text: "🎓 虚心请教",
          hint: "最高技能XP+15, 置_d807MentorGuide",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d807NpcGuideDone = true;
            st.flags._d807MentorGuide = true;
            // 找到最高等级技能并给予XP
            var _topSkill = "", _topLevel = 0;
            if (st.skills) {
              for (var _sk in st.skills) {
                var _sl = st.skills[_sk];
                if (_sl && (_sl.level || 0) > _topLevel) {
                  _topLevel = _sl.level || 0;
                  _topSkill = _sk;
                }
              }
            }
            if (_topSkill && typeof addSkillXp === "function") {
              try { addSkillXp(_topSkill, 15); } catch(e) {}
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎓 你虚心请教了老朋友——" + (_topSkill || "技能") + "XP+15。有人带，走得更快。", "success");
            }
          }
        },
        {
          text: "😊 自己摸索更有成就感",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d807NpcGuideDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 自己摸索更有成就感。心智+3。", "info");
            }
          }
        }
      ]
    },

    // ========================================================================
    // 联动增强3: D→H 创业社交圈 — NPC关系网络反哺创业团队
    // 设计意图：NPC关系网络应在创业阶段提供团队组建优势。
    // 本事件在corporate阶段且玩家拥有≥3个好感≥50的NPC时触发。
    // 心理学：社会认同 — 被朋友支持的满足感。
    // ========================================================================
    {
      id: "d807_social_to_startup",
      phase: "corporate",
      icon: "🚀",
      title: "朋友圈，就是创业团队的人才库",
      story: "你发现——身边那些信得过的朋友，其实就是创业团队最好的候选人。\n\n他们了解你、信任你、愿意和你一起拼。\n\n朋友圈，就是创业团队的人才库。",
      conditions: function (st) {
        if (!st || !st.player || st.gameOver) return false;
        if (st.flags && st.flags._d807SocToStartupDone) return false;
        if (st.player.phase !== "corporate" || !st.relationships) return false;
        var _trusted = 0;
        for (var _id in st.relationships) {
          var _r = st.relationships[_id];
          if (_r && _r.met && (_r.affinity || 0) >= 50) _trusted++;
        }
        return _trusted >= 3;
      },
      probability: 0.06,
      repeatable: false,
      choices: [
        {
          text: "🚀 邀请朋友加入创业",
          hint: "管理XP+12, 置_d807TeamFromFriends",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d807SocToStartupDone = true;
            st.flags._d807TeamFromFriends = true;
            grantXp("management", 12);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 朋友圈就是创业团队的人才库——管理XP+12。", "success");
            }
          }
        },
        {
          text: "😊 朋友归朋友，创业归创业",
          hint: "心智+3",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._d807SocToStartupDone = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😊 朋友归朋友，创业归创业。心智+3。", "info");
            }
          }
        }
      ]
    }
  ];

  // ---- 注入全局 RANDOM_EVENTS ----
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
