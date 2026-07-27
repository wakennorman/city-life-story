/**
 * 域G(核心机制/生命周期) 联动增强 R487（第七轮循环·续）
 * 桥接：
 *   G→F  g487_life_data_ui         人生数据UI → 消费 stats 数据,
 *     人生→"你的数据长什么样"的UI展示
 *   G→A  g487_economy_health_v2    经济健康度v2 → 消费 economy 数据,
 *     经济→"城市经济还好吗"的数据画像
 *   g487_birthday_narrative(G→B 生日叙事): age→"又长了一岁"的叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainGLinkageR487Loaded) return;
  RANDOM_EVENTS._domainGLinkageR487Loaded = true;

  var EVENTS = [
    {
      id: "g487_life_data_ui", phase: "street", _isChainEvent: false, icon: "📊",
      title: "人生数据",
      story: "你查看了自己的人生数据面板——{desc}",
      triggers: { minDay: 40, interval: 60, maxRepeats: 5, excludeFlags: ["_g487DataUiCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.stats || !st.player) return false;
        return (st.flags && !st.flags._g487DataUiCooldown);
      },
      choices: [
        { text: "📈 分析趋势", hint: "智力+2,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g487DataUiCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你分析了人生数据趋势——'数据不说谎。' 智力+2,会计XP+2。", "success");
        }},
        { text: "🎯 设定目标", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g487DataUiCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了人生目标——'有目标才有方向。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你查看了自己的人生数据面板——已经走过了" + days + "天。这些数据就是你的人生故事。";
      }
    },
    {
      id: "g487_economy_health_v2", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "经济健康",
      story: "你感受到了城市经济的温度——{desc}",
      triggers: { minDay: 50, interval: 80, maxRepeats: 4, excludeFlags: ["_g487EconHealthCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.economy) return false;
        return (st.flags && !st.flags._g487EconHealthCooldown);
      },
      choices: [
        { text: "📊 分析周期", hint: "智力+3,会计XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g487EconHealthCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了经济周期——'知己知彼。' 智力+3,会计XP+2。", "success");
        }},
        { text: "💪 专注自身", hint: "全技能XP+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g487EconHealthCooldown = true;
          var skills = ["accounting", "management", "sales", "coding", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 2); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 你决定专注自身——'打铁还需自身硬。' 全技能XP+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cycle = st.economy && st.economy.cycle ? st.economy.cycle : "normal";
        var desc = cycle === "boom" ? "经济一片繁荣，到处是机会。" : cycle === "recession" ? "经济寒冬，到处是挑战。" : "经济平稳，暗流涌动。";
        return desc + "你开始思考——在这个经济环境下，该怎么管好自己的钱？";
      }
    },
    {
      id: "g487_birthday_narrative", phase: "street", _isChainEvent: false, icon: "🎂",
      title: "又长了一岁",
      story: "你迎来了{age}岁生日——{desc}",
      triggers: { minDay: 100, interval: 150, maxRepeats: 3, excludeFlags: ["_g487BirthdayCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || st.player.age < 25) return false;
        return (st.flags && !st.flags._g487BirthdayCooldown);
      },
      choices: [
        { text: "📖 回顾成长", hint: "心智+4,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g487BirthdayCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你回顾了这一年的成长——'每一年都是新的自己。' 心智+4,心情+3。", "success");
        }},
        { text: "🎯 设定新年目标", hint: "智力+2,全技能XP+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._g487BirthdayCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          var skills = ["accounting", "management", "sales", "coding", "trade"];
          for (var i = 0; i < skills.length; i++) { if (typeof addSkillXp === "function") { try { addSkillXp(skills[i], 1); } catch(e) {} } }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了新年目标——'每一年都是新的开始。' 智力+2,全技能XP+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var age = st.player && st.player.age ? st.player.age : 25;
        return "你迎来了" + age + "岁生日——又长了一岁，你学到了什么？成长了多少？";
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
