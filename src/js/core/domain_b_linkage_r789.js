/**
 * 域B(事件/叙事) 联动增强 R789 (sensenova-exp 第四轮循环)
 * 桥接：
 *   B→E  b789_event_economy_lesson 事件经济教训 → 消费 事件+经济数据
 *   B→C  b789_event_career_spark 事件职业火花 → 消费 事件+职业数据
 *   B→H  b789_event_corp_story 事件公司故事 → 消费 事件+公司数据
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainBLinkageR789Loaded) return;
  RANDOM_EVENTS._domainBLinkageR789Loaded = true;

  var EVENTS = [
    // ====== B→E 事件经济教训 ======
    {
      id: "b789_event_economy_lesson", phase: "street", _isChainEvent: false, icon: "📉",
      title: "事件经济教训",
      story: "每次经历都是一堂经济课——{desc}",
      triggers: { minDay: 500, interval: 600, maxRepeats: 3, excludeFlags: ["_b789EconCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b789EconCd) return false;
        return st.player && st.player.day >= 500;
      },
      choices: [
        {
          text: "📊 总结经济教训", hint: "智力+15, 会计XP+12, 置_b789EconLearner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b789EconCd = true;
            st.flags._b789EconLearner = true;
            // 记录经济教训供E域消费
            var _cash = (st.resources && st.resources.cash) || 0;
            var _debt = 0;
            if (st.resources) {
              _debt = (st.resources.villageDebt || 0) + (st.resources.fineDebt || 0) + (st.resources.bankDebt || 0);
            }
            st.flags._b789EconLessonCash = _cash;
            st.flags._b789EconLessonDebt = _debt;
            st.flags._b789EconLessonNet = _cash - _debt;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 12); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📊 '经历是最好的经济学老师。' 智力+15, 会计XP+12。", "info");
            }
          }
        },
        {
          text: "💰 重新规划财务", hint: "智力+18, 置_b789EconPlanner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b789EconCd = true;
            st.flags._b789EconPlanner = true;
            if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 18);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💰 '吃一堑，长一智。' 智力+18。", "success");
            }
          }
        }
      ]
    },

    // ====== B→C 事件职业火花 ======
    {
      id: "b789_event_career_spark", phase: "street", _isChainEvent: false, icon: "✨",
      title: "事件职业火花",
      story: "一次偶遇，可能改变职业生涯——{desc}",
      triggers: { minDay: 560, interval: 600, maxRepeats: 3, excludeFlags: ["_b789CareerCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b789CareerCd) return false;
        return st.player && st.player.day >= 560;
      },
      choices: [
        {
          text: "💡 思考职业方向", hint: "心智+12, 智力+10, 置_b789CareerThinker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b789CareerCd = true;
            st.flags._b789CareerThinker = true;
            // 记录职业火花数据供C域消费
            var _job = st.player && st.player.job || "unemployed";
            st.flags._b789CareerSparkJob = _job;
            st.flags._b789CareerSparkDay = st.player && st.player.day || 0;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 10);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("💡 '人生没有白走的路，每一步都算数。' 心智+12, 智力+10。", "info");
            }
          }
        },
        {
          text: "📋 规划职业路径", hint: "心智+15, 管理XP+10, 置_b789CareerPlanner",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b789CareerCd = true;
            st.flags._b789CareerPlanner = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 10); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📋 '有规划的人生，是蓝图。' 心智+15, 管理XP+10。", "success");
            }
          }
        }
      ]
    },

    // ====== B→H 事件公司故事 ======
    {
      id: "b789_event_corp_story", phase: "corporate", _isChainEvent: false, icon: "📖",
      title: "公司故事",
      story: "每一个创始人的故事，都是一部小说——{desc}",
      triggers: { minDay: 640, interval: 700, maxRepeats: 3, excludeFlags: ["_b789CorpCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._b789CorpCd) return false;
        return st.player && st.player.day >= 640 && st.startup && st.startup.active;
      },
      choices: [
        {
          text: "📖 记录创业故事", hint: "心智+12, 名气+8, 置_b789CorpStoryteller",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b789CorpCd = true;
            st.flags._b789CorpStoryteller = true;
            // 记录创业故事供H域消费
            var _company = st.startup && st.startup.company;
            var _valuation = _company ? _company.valuation || 0 : 0;
            var _stage = _company ? _company.stage || 0 : 0;
            st.flags._b789CorpStoryValuation = _valuation;
            st.flags._b789CorpStoryStage = _stage;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 12);
              st.player.fame = Math.min(100, (st.player.fame || 0) + 8);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每个创业故事，都值得被记住。' 心智+12, 名气+8。", "info");
            }
          }
        },
        {
          text: "🎯 提炼创业经验", hint: "心智+15, 管理XP+15, 置_b789CorpMentor",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._b789CorpCd = true;
            st.flags._b789CorpMentor = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 15);
            if (typeof addSkillXp === "function") { try { addSkillXp("management", 15); } catch(e) {} }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '经验是最好的创业导师。' 心智+15, 管理XP+15。", "success");
            }
          }
        }
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();