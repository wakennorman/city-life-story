/**
 * 域B(事件/叙事) 联动增强 R364
 * 第十四轮循环——叙事积累的多维回响。
 * 桥接：
 *   B→H  event_company_impact        事件→公司影响（公司·品牌叙事）
 *   B→C  event_career_inspiration    事件→职业灵感（职业/成长·人生选择）
 *   B→G  event_life_weather          事件→生活节奏（核心机制·天气叙事）
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined") return;
  if (RANDOM_EVENTS._domainBLinkageR364Loaded) return;
  RANDOM_EVENTS._domainBLinkageR364Loaded = true;

  var EVENTS = [
    {
      // B→H: 事件→公司影响（公司·品牌叙事）
      id: "event_company_impact",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🏢",
      title: "故事就是品牌",
      story: "你在公司里跟团队聊天，说起自己创业前在街头的经历。\n\n那些在雨中奔跑的日子、那些被客户拒绝的时刻、那些一个人加班到深夜的夜晚……\n\n这些故事让团队里的年轻人听得入神。他们开始理解，这家公司不是从天上掉下来的，是从泥土里长出来的。\n\n「没有这些故事，公司就只是一个名字。」",
      triggers: { minDay: 90, excludeFlags: ["_eventCompanyImpactSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.startup || !st.startup.company) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 10;
      },
      choices: [
        {
          text: "🏢 分享创业故事，塑造品牌文化",
          hint: "公司声誉+8，员工忠诚+3，心智+4",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyImpactSeen = true;
            if (st.startup && st.startup.company) {
              st.startup.company.reputation = (st.startup.company.reputation || 0) + 8;
              if (st.startup.company.employees) {
                for (var i = 0; i < st.startup.company.employees.length; i++) {
                  if (st.startup.company.employees[i]) {
                    st.startup.company.employees[i].loyalty = Math.min(100, (st.startup.company.employees[i].loyalty || 50) + 3);
                  }
                }
              }
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏢 你分享了创业故事。故事让品牌有了温度。声誉+8，忠诚+3，心智+4。", "success");
            }
          },
        },
        {
          text: "📋 保持专业形象",
          hint: "心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCompanyImpactSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📋 你保持专业形象。专业也是一种力量。心智+3。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // B→C: 事件→职业灵感（职业/成长·人生选择）
      id: "event_career_inspiration",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "经历是最好的老师",
      story: "你回顾自己最近经历的事情，发现每一件事都在教你一些东西——\n\n被解雇教会你职场不只看能力，还要看人际关系。\n\n创业失败教会你风险控制比激情更重要。\n\n帮朋友解决困难教会你，有些技能比你想象的有用。\n\n「经历不是浪费，它是你职业道路上最真实的老师。」",
      triggers: { minDay: 45, excludeFlags: ["_eventCareerInspirationSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var history = (st.flags && st.flags._eventHistory) || [];
        return history.length >= 8;
      },
      choices: [
        {
          text: "💡 从经历中提炼职业心得",
          hint: "心智+5，随机技能+3XP，职业flag",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerInspirationSeen = true;
            st.flags._careerInsightFromEvents = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
            if (st.skills) {
              var skillKeys = Object.keys(st.skills);
              if (skillKeys.length > 0) {
                // [全系统自洽修复] 域B R400: Math.random()→Random.fromArray()种子化随机(保证存档回放一致性)
                var randSkill = (typeof Random !== "undefined" && Random.fromArray) ? Random.fromArray(skillKeys) : skillKeys[0];
                if (typeof addSkillXp === "function") {
                  addSkillXp(st, randSkill, 3);
                }
              }
            }
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("💡 你从经历中提炼了职业心得。经历是最好的老师。心智+5，随机技能+3XP。", "success");
            }
          },
        },
        {
          text: "📝 记下来，以后用得上",
          hint: "心智+2",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventCareerInspirationSeen = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("📝 你记了下来。有些经验现在用不上，但以后一定有用。心智+2。", "info");
            }
          },
        },
      ],
      probability: 0.5,
      repeatable: false,
    },
    {
      // B→G: 事件→生活节奏（核心机制·天气叙事）
      id: "event_life_weather",
      phase: "street",
      _isChainEvent: false,
      icon: "🌤️",
      title: "天气与心情",
      story: "你推开窗户，今天的天气格外好。阳光洒在脸上，微风带着城市的气息。\n\n你突然意识到，你已经很久没有好好感受过天气了——每天都匆匆忙忙，在不同的地点之间奔波。\n\n也许，生活不只是从一个目标到另一个目标，而是在每一段路上，感受风的方向和阳光的温度。",
      triggers: { minDay: 20, excludeFlags: ["_eventLifeWeatherSeen"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要天气系统存在
        if (!st.weather || !st.weather.current) return false;
        // 只在好天气触发
        var w = st.weather.current;
        return w === "sunny" || w === "cloudy";
      },
      choices: [
        {
          text: "🌤️ 出门走走，感受好天气",
          hint: "心情+8，疲劳-5，心智+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeWeatherSeen = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 8);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 5);
            }
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🌤️ 你出门走了走。好天气是最好的心情调节剂。心情+8，疲劳-5，心智+3。", "success");
            }
          },
        },
        {
          text: "🏠 在窗边看看就好",
          hint: "心情+3",
          apply: function (st) {
            if (!st.flags) st.flags = {};
            st.flags._eventLifeWeatherSeen = true;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined" && StateManager.addMessage) {
              StateManager.addMessage("🏠 你在窗边看了看。好天气看看就好，心里也是暖的。心情+3。", "info");
            }
          },
        },
      ],
      probability: 0.4,
      repeatable: false,
    },
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();