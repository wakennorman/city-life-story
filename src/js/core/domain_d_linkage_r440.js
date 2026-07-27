/**
 * 域D(NPC/社交) 联动增强 R440
 * 第十七轮循环——新内容开发:老陈(退休教师)+社区中心
 * 桥接：
 *   D→A  lao_chen_wisdom      老陈的人生智慧→数据素养成长
 *   D→C  lao_chen_career_guide 老陈的职业指导→管理技能
 *   D→G  lao_chen_life_talk    老陈的人生对话→心情/心智
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainDLinkageR440Loaded) return;
  RANDOM_EVENTS._domainDLinkageR440Loaded = true;

  function firstMetNpcR440(st) {
    if (!st || !st.relationships) return null;
    for (var id in st.relationships) {
      if (!Object.prototype.hasOwnProperty.call(st.relationships, id)) continue;
      var r = st.relationships[id];
      if (r && r.met) return id;
    }
    return null;
  }

  var EVENTS = [
    {
      id: "lao_chen_wisdom",
      phase: "street",
      _isChainEvent: false,
      icon: "🧓",
      title: "老陈的人生智慧",
      story:
        "你在社区中心遇到了老陈。他给你讲了一个故事——\n\n\"我教了四十年书,见过太多学生。成功的不是最聪明的,而是最会规划的。\"\n\n他拿出一张纸,帮你画了一张人生规划图。",
      triggers: { minDay: 45, excludeFlags: ["_laoChenWisdomSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return true;
      },
      choices: [
        {
          text: "📝 认真记录老陈的建议",
          hint: "心智+5,智力XP+3,置 _laoChenWisdomSeen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._laoChenWisdomSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("accounting", 3); } catch (e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🧓 你认真记录了老陈的建议——规划让人生有方向。心智+5,会计XP+3。", "success");
          }
        },
        {
          text: "😊 听听就好,不必太认真",
          hint: "心情+2",
          apply: function (st) {
            if (st) {
              st.flags = st.flags || {};
              st.flags._laoChenWisdomSeen = true;
              if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
            }
          }
        }
      ],
      probability: 0.08,
      repeatable: false,
    },
    {
      id: "lao_chen_career_guide",
      phase: "street",
      _isChainEvent: false,
      icon: "💼",
      title: "老陈的职业指导",
      story:
        "老陈看你最近工作不顺,主动找你聊天。\n\n\"年轻人,职业不是越跳越好,关键是找到适合自己的赛道。来,我帮你分析一下。\"\n\n他帮你梳理了技能优势和职业方向,让你豁然开朗。",
      triggers: { minDay: 90, excludeFlags: ["_laoChenCareerSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.career && (st.career.currentJob || (st.career.history && st.career.history.length > 0));
      },
      choices: [
        {
          text: "📊 按老陈的建议调整职业方向",
          hint: "管理XP+8,心智+4,置 _laoChenCareerSeen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._laoChenCareerSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof addSkillXp === "function") {
              try { addSkillXp("management", 8); } catch (e) { /* safe */ }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💼 老陈的职业指导让你找到了方向。管理XP+8,心智+4。", "success");
          }
        },
        {
          text: "🤷 自己的路自己走",
          hint: "心智+2",
          apply: function (st) {
            if (st) {
              st.flags = st.flags || {};
              st.flags._laoChenCareerSeen = true;
              if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            }
          }
        }
      ],
      probability: 0.06,
      repeatable: false,
    },
    {
      id: "lao_chen_life_talk",
      phase: "street",
      _isChainEvent: false,
      icon: "💬",
      title: "老陈的人生对话",
      story:
        "傍晚在社区中心,老陈泡了一壶茶,跟你聊起人生。\n\n\"年轻人,钱不是最重要的。健康、朋友、心态,这些才是真东西。\"\n\n他的话让你最近焦虑的心情平静了许多。",
      triggers: { minDay: 60, excludeFlags: ["_laoChenTalkSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return st.needs && (st.needs.happiness || 50) < 60;
      },
      choices: [
        {
          text: "🍵 和老陈喝茶聊天",
          hint: "心情+8,心智+3,置 _laoChenTalkSeen",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._laoChenTalkSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🍵 和老陈喝茶聊天,心情平静了许多。心情+8,心智+3。", "success");
          }
        },
        {
          text: "😌 安静地听老陈说",
          hint: "心情+4",
          apply: function (st) {
            if (st) {
              st.flags = st.flags || {};
              st.flags._laoChenTalkSeen = true;
              if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            }
          }
        }
      ],
      probability: 0.07,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
