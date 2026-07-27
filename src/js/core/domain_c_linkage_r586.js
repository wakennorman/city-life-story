/**
 * 域C(职业/成长) 联动增强 R586
 * 桥接：
 *   C→D  c586_career_circle    职业圈层 → 消费 skills+relationships 数据,
 *     圈层→"职业圈层决定你的高度"的社交圈
 *   C→E  c586_career_side_income_v2 职业副业收入v2 → 消费 skills+resources 数据,
 *     副业→"多元化收入来源"的财务安全
 *   C→G  c586_career_meaning   职业意义 → 消费 skills+needs 数据,
 *     意义→"工作不只是为了钱"的使命感
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR586Loaded) return;
  RANDOM_EVENTS._domainCLinkageR586Loaded = true;

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
      id: "c586_career_circle", phase: "corporate", _isChainEvent: false, icon: "🎯",
      title: "职业圈层",
      story: "你发现身边的人都和你差不多——{desc}",
      triggers: { minDay: 25, interval: 90, maxRepeats: 3, excludeFlags: ["_c586CareerCircleCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c586CareerCircleCooldown);
      },
      choices: [
        { text: "🎯 拓展圈层", hint: "社交XP+5,心智+2,管理XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c586CareerCircleCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("social", 5); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '你的水平，取决于你身边最常接触的五个人。' 社交XP+5,心智+2,管理XP+2。", "success");
        }},
        { text: "📈 提升自己", hint: "随机技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c586CareerCircleCooldown = true;
          var skills = ["accounting", "management", "social", "coding", "sales"]; // [全系统自洽修复] 域E R588 修复:marketing/technology/trade非真实技能键(addSkillXp静默丢弃XP)→映射social/coding/sales
          var sk = skills[Math.floor(Math.random() * skills.length)];
          if (typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 '提升自己，才能进入更好的圈层。' 随机技能XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你发现身边的人都和你差不多——'我的圈层决定了我的视野。' 想变得更好，就要进入更好的圈层。";
      }
    },
    {
      id: "c586_career_side_income_v2", phase: "corporate", _isChainEvent: false, icon: "💰",
      title: "多元收入",
      story: "你开始思考如何创造多元化的收入来源——{desc}",
      triggers: { minDay: 30, interval: 90, maxRepeats: 3, excludeFlags: ["_c586SideIncomeV2Cooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._c586SideIncomeV2Cooldown);
      },
      choices: [
        { text: "💰 开始行动", hint: "会计XP+5,管理XP+2,现金+2000", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c586SideIncomeV2Cooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + 2000;
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '开启副业，让收入来源多元化。' 会计XP+5,管理XP+2,现金+¥2000。", "success");
        }},
        { text: "📋 规划时间", hint: "管理XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c586SideIncomeV2Cooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💰 '副业需要时间，好好规划。' 管理XP+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你开始思考如何创造多元化的收入来源——'如果只有一个收入来源，风险太大了。' 多元化收入，是财务安全的关键。";
      }
    },
    {
      id: "c586_career_meaning", phase: "corporate", _isChainEvent: false, icon: "💡",
      title: "工作的意义",
      story: "你在思考工作除了赚钱还有什么意义——{desc}",
      triggers: { minDay: 35, interval: 120, maxRepeats: 3, excludeFlags: ["_c586MeaningCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate) return false;
        return (st.flags && !st.flags._c586MeaningCooldown);
      },
      choices: [
        { text: "💡 找到使命", hint: "心智+4,心情+3,管理XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c586MeaningCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '工作不只是为了钱，更是为了实现价值。' 心智+4,心情+3,管理XP+2。", "success");
        }},
        { text: "🧘 调整心态", hint: "心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c586MeaningCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💡 '工作本身没有意义，意义是你赋予的。' 心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        return "你在思考工作除了赚钱还有什么意义——'我每天工作8小时，只是为了赚钱吗？' 也许，工作还有更深的意义。";
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