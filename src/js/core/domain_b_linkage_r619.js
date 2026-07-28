/**
 * 域B(事件/叙事) 联动增强 R619
 * 桥接：
 *   B→D  b619_event_memory_share  事件记忆分享 → 消费 state.relationships+state.flags 数据,
 *     事件→"共同记忆加固友谊"的社交回响
 *   B→E  b619_news_invest_sentiment  新闻情绪传导 → 消费 state.activeNews+state.investment 数据,
 *     事件→"新闻塑造投资情绪"的经济回响
 *   B→C  b619_career_story_reflection  职业故事反思 → 消费 state.career+state.skills 数据,
 *     事件→"职业经历塑造人生叙事"的成长回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR619Loaded) return;
  RANDOM_EVENTS._domainBLinkageR619Loaded = true;

  // 辅助：获取已结识NPC列表
  function metNpcsR619(st) {
    var out = [];
    var rels = st.relationships || {};
    for (var k in rels) {
      if (rels[k] && rels[k].met) out.push({ id: k, affinity: rels[k].affinity || 0, name: (typeof getNpcDisplayName === "function") ? getNpcDisplayName(k) : k });
    }
    return out;
  }

  // 辅助：获取最近经历的事件标志（用于社交对话素材）
  function recentEventFlags(st) {
    var flags = [];
    var eventMarkers = ["_ch1Done", "_ch2Done", "_ch3Done", "_milestone60", "_firstJobDone", "_firstPromotion", "_firstInvestment", "_firstStartup"];
    for (var i = 0; i < eventMarkers.length; i++) {
      if (st.flags && st.flags[eventMarkers[i]]) flags.push(eventMarkers[i]);
    }
    return flags;
  }

  // 辅助：获取最近一条新闻的摘要
  function recentNewsHeadline(st) {
    if (!st.activeNews || !st.activeNews.length) return null;
    for (var i = st.activeNews.length - 1; i >= 0; i--) {
      var n = st.activeNews[i];
      if (n && n.headline) return n.headline;
    }
    return null;
  }

  var EVENTS = [
    // ====== B→D: 事件记忆分享 ======
    {
      id: "b619_event_memory_share", phase: "street", _isChainEvent: false, icon: "💭",
      title: "往事如烟",
      story: "你和一个老朋友聊起了过去的经历——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 5, excludeFlags: ["_b619EventMemoryCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b619EventMemoryCooldown) return false;
        var events = recentEventFlags(st);
        return events.length >= 1;
      },
      choices: [
        { text: "📖 分享那段经历", hint: "好感+8,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619EventMemoryCooldown = true;
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          var met = metNpcsR619(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 8, "往事分享"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💭 '还记得那时候...' 你们聊起了过去的经历,笑声中满是感慨。好感+8,心情+5。", "success");
        }},
        { text: "🤝 默默倾听", hint: "好感+3,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619EventMemoryCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          var met = metNpcsR619(st);
          if (met.length > 0 && typeof applyAffinityChange === "function") {
            try { applyAffinityChange(st, met[0].id, 3, "默默倾听往事"); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💭 你静静地听老朋友讲述那些年的故事。有时候,最好的陪伴就是倾听。好感+3,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var met = metNpcsR619(st);
        var name = met.length > 0 ? met[0].name : "老朋友";
        var events = recentEventFlags(st);
        var eventDesc = "那些一起走过的日子";
        if (events.indexOf("_ch1Done") >= 0) eventDesc = "刚到这座城市打拼的日子";
        else if (events.indexOf("_firstJobDone") >= 0) eventDesc = "你找到第一份工作的时候";
        else if (events.indexOf("_firstPromotion") >= 0) eventDesc = "你第一次升职的时候";
        return name + "突然提起往事:'你还记得" + eventDesc + "吗?' 那些回忆涌上心头,你感慨万千。";
      }
    },

    // ====== B→E: 新闻情绪传导 ======
    {
      id: "b619_news_invest_sentiment", phase: "street", _isChainEvent: false, icon: "📊",
      title: "市场情绪",
      story: "最近的新闻让你对经济形势有了新的判断——{desc}",
      triggers: { minDay: 30, interval: 60, maxRepeats: 10, excludeFlags: ["_b619NewsSentimentCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b619NewsSentimentCooldown) return false;
        var headline = recentNewsHeadline(st);
        return headline !== null;
      },
      choices: [
        { text: "📈 看好后市,加大投入", hint: "心智+3,投资信心+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619NewsSentimentCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.flags) st.flags._investConfidence = (st.flags._investConfidence || 0) + 5;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '新闻里都是好消息,经济形势一片大好!' 你信心倍增。心智+3,投资信心+5。", "success");
        }},
        { text: "📉 保持谨慎,观望为主", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619NewsSentimentCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 '市场有起有落,保持清醒最重要。' 你选择观望。心智+5。", "success");
        }},
        { text: "📰 深入研究新闻背景", hint: "智力+2,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619NewsSentimentCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你花时间研究了新闻背后的经济逻辑,对市场有了更深的理解。智力+2,心智+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var headline = recentNewsHeadline(st) || "经济形势";
        return "你看着最近的新闻——'" + headline + "'——心里盘算着这对自己的财务状况意味着什么。市场总是充满不确定性,但机会也藏在其中。";
      }
    },

    // ====== B→C: 职业故事反思 ======
    {
      id: "b619_career_story_reflection", phase: "street", _isChainEvent: false, icon: "🛤️",
      title: "职业岔路口",
      story: "回想起自己的职业历程,你站在了一个新的岔路口——{desc}",
      triggers: { minDay: 90, interval: 120, maxRepeats: 3, excludeFlags: ["_b619CareerReflectionCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.flags || st.flags._b619CareerReflectionCooldown) return false;
        return st.career && st.career.currentJob;
      },
      choices: [
        { text: "🎯 深耕当前领域", hint: "当前职业技能XP+8,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619CareerReflectionCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          // 给当前职业对应的技能加经验
          if (st.career && st.career.currentJob && typeof addSkillXp === "function") {
            var job = st.career.currentJob;
            var skillMap = { office_assistant: "accounting", programmer: "coding", teacher: "education", chef: "cooking", driver: "agility", waiter: "social", salesperson: "sales", security_guard: "strength", nurse: "medicine", electrician: "electrician", welder: "welding", repairman: "repair", construction_worker: "strength", street_vending_food: "cooking", street_vending_goods: "sales", courier: "agility", cleaner: "hygiene", busking: "art", tutor: "education", freelancer: "coding" };
            var skill = skillMap[job.id || job.levelId];
            if (skill) { try { addSkillXp(skill, 8); } catch(e) {} }
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛤️ '三百六十行,行行出状元。' 你决定继续深耕当前领域。职业技能XP+8,心智+3。", "success");
        }},
        { text: "🔭 探索新方向", hint: "随机技能XP+5,智力+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619CareerReflectionCooldown = true;
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 3);
          var allSkills = ["cooking", "repair", "sales", "coding", "accounting", "medicine", "education", "art", "electrician", "welding", "agility", "strength", "social"];
          if (typeof Random !== "undefined" && typeof addSkillXp === "function") {
            try { addSkillXp(Random.fromArray(allSkills), 5); } catch(e) {}
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛤️ '世界那么大,我想去看看。' 你开始探索新的职业可能性。随机技能XP+5,智力+3。", "success");
        }},
        { text: "📝 写下职业规划", hint: "心智+5,智力+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._b619CareerReflectionCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛤️ 你认真写下了接下来三年的职业规划。有了方向,路就不会太难走。心智+5,智力+2。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var jobName = (st.career && st.career.currentJob && st.career.currentJob.levelName) ? st.career.currentJob.levelName : "当前工作";
        var days = st.player ? st.player.day : 0;
        return "你已经做了" + days + "天的" + jobName + "。夜深人静时,你开始思考:这条路,还要继续走下去吗?还是该换个方向试试?";
      }
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();