/**
 * 域G(核心机制/生命周期) 联动增强 R697
 * 桥接：
 *   G→D  g697_birthday_milestone      生日里程碑 → 消费 state.player+state.relationships,
 *     生日与朋友分享
 *   G→A  g697_life_data_portrait      人生数据画像 → 消费 state.player+state.status,
 *     综合数据叙事
 *   G→C  g697_skill_milestone_life    技能里程碑人生 → 消费 state.skills,
 *     技能节点触发人生思考
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR697Loaded) return;
  RANDOM_EVENTS._domainGLinkageR697Loaded = true;

  function metNpcCount(st) {
    if (!st || !st.relationships) return 0;
    var cnt = 0;
    for (var k in st.relationships) { if (st.relationships[k] && st.relationships[k].met) cnt++; }
    return cnt;
  }

  var EVENTS = [
    {
      id: "g697_birthday_milestone",
      phase: "street",
      _isChainEvent: false,
      icon: "🎂",
      title: "又长一岁",
      story: "生日到了,你想和朋友分享",
      triggers: { minDay: 100, interval: 120, maxRepeats: 2, excludeFlags: ["_g697BirthdayCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g697BirthdayCd) return false;
        return metNpcCount(st) >= 1 && st.player && st.player.day >= 100;
      },
      choices: [
        {
          text: "🎉 告诉朋友",
          hint: "心情+8,好感+2,置_g697Shared",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g697BirthdayCd = true;
            st.flags._g697Shared = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎂 生日快乐!有朋友记得,就是最好的礼物。心情+8,好感+2。", "success");
            }
          }
        },
        {
          text: "🤫 默默度过",
          hint: "心智+5,置_g697Quiet",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g697BirthdayCd = true;
            st.flags._g697Quiet = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🤫 生日不一定要轰轰烈烈,平静也是力量。心智+5。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "又长一岁——'在这个城市里,有人记得你的生日,就是温暖。'";
      }
    },
    {
      id: "g697_life_data_portrait",
      phase: "street",
      _isChainEvent: false,
      icon: "🖼️",
      title: "人生数据画像",
      story: "用数据描绘自己的人生",
      triggers: { minDay: 80, interval: 100, maxRepeats: 2, excludeFlags: ["_g697PortraitCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g697PortraitCd) return false;
        return st.player && st.player.day >= 80;
      },
      choices: [
        {
          text: "📊 做全面复盘",
          hint: "心智+5,智力+3,置_g697Review",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g697PortraitCd = true;
            st.flags._g697Review = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 了解自己是改变的第一步。心智+5,智力+3。", "success");
            }
          }
        },
        {
          text: "🎯 设定新目标",
          hint: "管理XP+4,智力+2,置_g697Goal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g697PortraitCd = true;
            st.flags._g697Goal = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 没有目标就没有方向。管理XP+4,智力+2。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        return "第" + day + "天——'如果人生有仪表盘,现在各项指标如何?'";
      }
    },
    {
      id: "g697_skill_milestone_life",
      phase: "street",
      _isChainEvent: false,
      icon: "🏆",
      title: "技能里程碑",
      story: "技能提升到新阶段,人生也随之改变",
      triggers: { minDay: 90, interval: 110, maxRepeats: 2, excludeFlags: ["_g697SkillCd"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (st.flags && st.flags._g697SkillCd) return false;
        return st.skills && Object.keys(st.skills).length > 0 && st.player && st.player.day >= 90;
      },
      choices: [
        {
          text: "🎉 庆祝成就",
          hint: "心情+10,置_g697Celebrate(峰终定律)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g697SkillCd = true;
            st.flags._g697Celebrate = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 10);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎉 每一个里程碑都值得庆祝!心情+10。", "success");
            }
          }
        },
        {
          text: "🚀 挑战更高",
          hint: "智力+4,管理XP+3,置_g697Challenge",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._g697SkillCd = true;
            st.flags._g697Challenge = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 4);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🚀 山外有山,继续攀登。智力+4,管理XP+3。", "info");
            }
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        return "技能提升到新阶段——'本事长在身上,谁也拿不走。'";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();
