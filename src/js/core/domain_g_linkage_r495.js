/**
 * 域G(核心机制/生命周期) 联动增强 R495
 * 桥接：
 *   G→C  g495_life_skill_milestone 人生技能里程碑 → 消费 player.day+skills 数据,
 *     时间→"工作X年了，技能长进了多少"的职业回顾
 *   G→H  g495_life_corp_legacy    人生公司传承 → 消费 player.day+corporate 数据,
 *     传承→"公司离开你还能不能转"的传承思考
 *   G→E  g495_life_inflation_impact 人生通胀影响 → 消费 player.day+resources 数据,
 *     时间→"钱越来越不值钱了"的通胀叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR495Loaded) return;
  RANDOM_EVENTS._domainGLinkageR495Loaded = true;

  var EVENTS = [
    {
      id: "g495_life_skill_milestone", phase: "corporate", _isChainEvent: false, icon: "📈",
      title: "工作周年",
      story: "今天是你在职场的又一个里程碑——{desc}",
      triggers: { minDay: 60, interval: 180, maxRepeats: 3, excludeFlags: ["_g495SkillMilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g495SkillMilestoneCooldown);
      },
      choices: [
        { text: "📈 回顾技能成长", hint: "全技能XP+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g495SkillMilestoneCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域B R572 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 '工作这么多年，我的技能已经不可同日而语了。' 全技能XP+2,心智+2。", "success");
        }},
        { text: "🎯 设定新目标", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g495SkillMilestoneCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你设定了下一个职业目标——'三年内要做到XX位置。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var year = Math.floor(day / 365) + 1;
        return "今天是你在职场的又一个里程碑——第" + day + "天，第" + year + "个年头。时间过得真快。";
      }
    },
    {
      id: "g495_life_corp_legacy", phase: "corporate", _isChainEvent: false, icon: "🏛️",
      title: "传承",
      story: "你开始思考，公司没有你之后会怎样——{desc}",
      triggers: { minDay: 90, interval: 180, maxRepeats: 3, excludeFlags: ["_g495CorpLegacyCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._g495CorpLegacyCooldown);
      },
      choices: [
        { text: "🏛️ 培养接班人", hint: "管理XP+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g495CorpLegacyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏛️ 你开始培养接班人——'一个成功的创始人，不是让自己不可或缺，而是让自己可以被替代。' 管理XP+5,心智+2。", "success");
        }},
        { text: "📝 建立制度", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g495CorpLegacyCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏛️ 你建立了一套完善的管理制度——'靠制度管人，而不是靠人管人。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始思考，公司没有你之后会怎样——'如果我现在离开，公司还能正常运转吗？'";
      }
    },
    {
      id: "g495_life_inflation_impact", phase: "street", _isChainEvent: false, icon: "📉",
      title: "钱不值钱了",
      story: "你发现现在的钱越来越不经花了——{desc}",
      triggers: { minDay: 30, interval: 120, maxRepeats: 3, excludeFlags: ["_g495InflationCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._g495InflationCooldown);
      },
      choices: [
        { text: "📉 理财保值", hint: "会计XP+4,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g495InflationCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 4); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📉 '钱放在手里就是贬值，得想办法让它跑赢通胀。' 会计XP+4,心智+1。", "success");
        }},
        { text: "💪 提高收入", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g495InflationCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📉 '与其省钱，不如赚钱。提高收入才是对抗通胀的最好方式。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现现在的钱越来越不经花了——以前100块能买不少东西，现在买个菜就没了。通胀，偷走了你的购买力。";
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