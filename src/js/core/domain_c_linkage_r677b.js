/**
 * 域C(职业/成长) 联动增强 R677b
 * 三项桥接（首消费两个死flag + 培训班经营纵深）：
 *   C→E  c677b_legacy_investor   遗产项目经历变现 → 首消费 career_dev.js:5576 死flag _legacyProjectStarted(全力投入却写后零读) → 行业顾问邀约
 *   C→B  c677b_watched_regret    观望者的社会比较 → 首消费 career_dev.js:5597 死flag _legacyWatched(观望选择写后零读) → 错过项目的叙事回响
 *   C→E  c677b_training_scale    培训班口碑发酵 → 承接 R677b A类#1 的 _skillMasterTrainer 每日兑现 → 扩班抉择(_trainerScaleUp 提升日收益150→250)
 * 设计心理学：损失厌恶(错过的项目)/禀赋效应(自己的培训班)/峰终定律(职业生涯高光变现)
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR677bLoaded) return;
  RANDOM_EVENTS._domainCLinkageR677bLoaded = true;

  var EVENTS = [
    {
      id: "c677b_legacy_investor", phase: "street", _isChainEvent: false, icon: "💼",
      title: "行业里的名字",
      story: "当年你主导过的那个行业项目，至今仍有人提起。今天一家咨询公司辗转找到你，想请你做外部顾问，按次付费。",
      triggers: { minDay: 420, interval: 90, maxRepeats: 1 },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._legacyProjectStarted) return false; // [联动] 首消费 career_dev.js:5576 死flag
        if (st.flags._careerLegacyDueDay) return false; // 项目须已结算(成败皆可,经历本身即资本)
        if (st.flags._c677bLegacyInvestorDone) return false;
        return true;
      },
      choices: [
        { text: "💼 接下顾问单", hint: "顾问费¥2000-5000,会计XP+5,疲劳+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c677bLegacyInvestorDone = true;
          var fee = (typeof Random !== "undefined" && Random.int) ? Random.int(2000, 5000) : 3000;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + fee;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 5); } catch (e) {} }
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 50) + 10);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💼 你花了几个晚上写了份行业分析报告。顾问费¥" + fee + "到账——当年的项目经历，如今成了硬通货。会计XP+5，疲劳+10。", "success");
        }},
        { text: "🛋️ 婉拒，享受生活", hint: "心智+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c677bLegacyInvestorDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛋️ 你婉拒了邀约：『那一页翻过去了。』把名声放在身后，是另一种从容。心智+5。", "info");
        }}
      ]
    },
    {
      id: "c677b_watched_regret", phase: "street", _isChainEvent: false, icon: "📰",
      title: "别人做成了那个项目",
      story: "行业新闻里，当年你观望没接的那个项目被另一位资深人士做成了，报道铺天盖地。你盯着屏幕看了很久——那个位置，本可以是你的。",
      triggers: { minDay: 400, interval: 90, maxRepeats: 1 },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._legacyWatched) return false; // [联动] 首消费 career_dev.js:5597 死flag
        if (st.flags._c677bWatchedRegretDone) return false;
        return true;
      },
      choices: [
        { text: "🔥 化不甘为动力", hint: "管理XP+8,心情-5(损失厌恶的刺痛)", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c677bWatchedRegretDone = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 8); } catch (e) {} }
          if (st.needs) st.needs.happiness = Math.max(0, (st.needs.happiness || 50) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🔥 你把报道存进收藏夹，当作每天开工前的提醒：下一次机会来的时候，绝不再观望。管理XP+8，心情-5。", "warning");
        }},
        { text: "🍵 释然，各有各的路", hint: "心智+8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c677bWatchedRegretDone = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍵 你合上手机，泡了杯茶。『他赌赢了是他的本事，我守住的安稳也是我的选择。』心智+8。", "success");
        }}
      ]
    },
    {
      id: "c677b_training_scale", phase: "street", _isChainEvent: false, icon: "🏫",
      title: "培训班装不下了",
      story: "你的技能培训班口碑发酵，报名的人越来越多，小教室已经坐不下。房东提出隔壁的大间可以租给你——扩班意味着更高收入，也意味着更多投入。",
      triggers: { minDay: 90, interval: 60, maxRepeats: 2 },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (!st.flags || !st.flags._skillMasterTrainer) return false; // [联动] 承接 R677b A类#1 培训班每日兑现
        if (st.flags._trainerScaleUp) return false;
        var openDay = st.flags._skillMasterTrainerDay || 0;
        var day = (st.player && st.player.day) || 0;
        if (day - openDay < 30) return false; // 开班满30天口碑才发酵
        return true;
      },
      choices: [
        { text: "🏫 投入¥3000扩班", hint: "日收益150→250(需现金≥3000)", apply: function (st) {
          if (!st) return; st.flags = st.flags || {};
          var cash = (st.resources && st.resources.cash) || 0;
          if (cash < 3000) {
            if (typeof StateManager !== "undefined") StateManager.addMessage("🏫 你盘了盘账，手头现金不够¥3000，扩班只能再等等。机会还在，钱到位了再说。", "warning");
            return;
          }
          st.resources.cash = cash - 3000;
          st.flags._trainerScaleUp = true; // daily_pipeline 读取: 日收益150→250
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 5); } catch (e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏫 你租下大教室，添了桌椅设备。投入¥3000，培训班日收益提升至约¥250。管理XP+5——手艺人开始像经营者一样思考了。", "success");
        }},
        { text: "🪑 保持小而美", hint: "名气+5,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c677bScaleDeclined = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 5);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🪑 你谢绝了房东：『小班教学，每个学生我都看得见。』限量反而让名额更抢手。名气+5，心情+5。", "success");
        }}
      ]
    }
  ];

  for (var i = 0; i < EVENTS.length; i++) RANDOM_EVENTS.push(EVENTS[i]);
})();
