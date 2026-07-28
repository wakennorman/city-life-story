/**
 * 域B(事件/叙事) 联动增强 R625
 * 桥接：
 *   B→E  b625_news_economic_insight  新闻经济洞察 → 消费 state.news+state.player 数据,
 *     叙事→"新闻中看到经济信号"的经济回响
 *   B→C  b625_event_career_spark  事件职业火花 → 消费 state.flags+state.skills 数据,
 *     叙事→"事件激发职业灵感"的职业回响
 *   B→G  b625_story_mental_resilience  故事心智韧性 → 消费 state.flags+state.needs 数据,
 *     叙事→"故事带来心智成长"的生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR625Loaded) return;
  RANDOM_EVENTS._domainBLinkageR625Loaded = true;

  var EVENTS = [
    // ================================================================
    // B→E: 新闻经济洞察 — 新闻事件触发经济意识
    // ================================================================
    {
      id: "b625_news_economic_insight",
      phase: "street",
      _isChainEvent: false,
      icon: "📰",
      title: "新闻里的经济信号",
      triggers: { minDay: 7 },
      story: function (st) {
        var newsRead = st.flags && st.flags._newsReadCount || 0;
        var day = st.player.day || 0;

        if (newsRead < 3) {
          return "你最近没怎么关注新闻。其实新闻里藏着很多经济信号——" +
            "政策变化影响房价、国际局势冲击股市、季节灾害推高物价。" +
            "养成看新闻的习惯，对投资理财很有帮助。";
        }

        if (day > 90) {
          return "你坚持看新闻已经" + day + "天了，读了" + newsRead + "条新闻。" +
            "长期关注时事让你的经济嗅觉越来越敏锐——" +
            "你能从政策调整中预判行业走向，从国际新闻中感知市场风险。";
        }

        return "你已经读了" + newsRead + "条新闻，继续保持。" +
          "新闻不仅是了解世界的窗口，更是发现经济机会的雷达。";
      },
      choices: [
        { text: "📰 看新闻", apply: function(st) {
          if (typeof showNewsTab === "function") {
            showNewsTab();
          } else if (typeof StateManager !== "undefined") {
            StateManager.addMessage("📰 前往新闻Tab查看今日要闻", "info");
          }
        }},
        { text: "📊 分析经济", apply: function(st) {
          st.flags = st.flags || {};
          st.flags._b625_econAware = (st.flags._b625_econAware || 0) + 1;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你分析了新闻中的经济信号，会计经验+5", "success");
        }},
      ],
      conditions: function (st) {
        return (st.player.day || 0) % 7 === 0;
      },
      weight: 1,
    },

    // ================================================================
    // B→C: 事件职业火花 — 随机事件触发职业灵感
    // ================================================================
    {
      id: "b625_event_career_spark",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "职业灵感",
      triggers: { minDay: 14 },
      story: function (st) {
        var skills = st.skills || {};
        var topSkill = null;
        var topLevel = 0;
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level > topLevel) {
            topLevel = skills[k].level;
            topSkill = k;
          }
        }

        if (!topSkill || topLevel < 10) {
          return "你最近经历的一些事让你开始思考职业方向。" +
            "也许可以尝试学习一门新技能，或者去培训中心看看有什么适合你的课程。";
        }

        var skillName = (typeof getSkillChineseName === "function") ? getSkillChineseName(topSkill) : topSkill;
        var paths = [];
        if (typeof CAREER_PATHS !== "undefined" && CAREER_PATHS) {
          for (var p in CAREER_PATHS) {
            var entry = CAREER_PATHS[p].levels && CAREER_PATHS[p].levels[0];
            if (entry && entry.reqSkills && entry.reqSkills[topSkill]) {
              paths.push(CAREER_PATHS[p].icon + " " + CAREER_PATHS[p].name);
            }
          }
        }

        if (paths.length > 0) {
          return "你的" + skillName + "技能已达到Lv." + topLevel + "，在业内已经有一定竞争力。" +
            "回顾最近经历的事，你发现这些技能可以应用到以下职业方向：<br>" +
            paths.join("<br>") +
            "<br>是时候考虑将兴趣转化为职业了。";
        }
        return "你的" + skillName + "技能已达到Lv." + topLevel + "。" +
          "继续深耕这门技能，未来会有更多职业机会向你敞开。";
      },
      choices: [
        { text: "💼 查看职业路线", apply: function(st) {
          if (typeof switchCareerSubTab === "function") {
            switchCareerSubTab("career_jobs");
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 前往事业发展Tab查看职业路线", "info");
        }},
        { text: "📚 继续学习", apply: function(st) {
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你受到了启发，决定继续提升技能", "info");
        }},
      ],
      conditions: function (st) {
        var skills = st.skills || {};
        var count = 0;
        for (var k in skills) {
          if (skills[k] && skills[k].level > 0) count++;
        }
        return count >= 1;
      },
      weight: 1,
    },

    // ================================================================
    // B→G: 故事心智韧性 — 经历故事事件后心智成长
    // ================================================================
    {
      id: "b625_story_mental_resilience",
      phase: "street",
      _isChainEvent: false,
      icon: "🧠",
      title: "心智成长",
      triggers: { minDay: 20 },
      story: function (st) {
        var eventsExperienced = st.flags && st.flags._eventsExperienced || 0;
        var mental = st.player && st.player.mental || 0;

        if (eventsExperienced < 5) {
          return "你经历的事情还不多，但每一次经历都在塑造你的心智。" +
            "无论是好的还是坏的遭遇，都是人生宝贵的财富。";
        }

        if (mental >= 50) {
          return "经历了" + eventsExperienced + "件事后，你的心智已经达到" + mental + "点。" +
            "这些经历让你变得更加沉稳和坚韧——" +
            "你学会了在压力下保持冷静，在挫折中寻找机会。";
        }

        return "你已经经历了" + eventsExperienced + "件事，心智" + mental + "点。" +
          "继续在生活中积累经验，每一次挑战都是心智成长的契机。";
      },
      choices: [
        { text: "🧘 反思沉淀", apply: function(st) {
          if (st) {
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
            if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你静下心来反思最近的经历，心智+2", "success");
          }
        }},
        { text: "📝 写日记", apply: function(st) {
          if (st) {
            st.flags = st.flags || {};
            st.flags._b625_journal = (st.flags._b625_journal || 0) + 1;
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            if (typeof StateManager !== "undefined") StateManager.addMessage("📝 把经历写进日记，心情+3", "success");
          }
        }},
      ],
      conditions: function (st) {
        return (st.flags && st.flags._eventsExperienced > 0) || (st.player && st.player.day > 30);
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();