/**
 * 域F(UI/UX) 联动增强 R463（第二十三轮循环·续）
 * 桥接：
 *   F→A  f463_ui_data_insight    UI数据洞察 → 消费 UI 数据,
 *     界面信息→"你的数据长什么样"的经济面板
 *   F→H  f463_ui_corp_display    公司UI展示 → 消费 corporate 数据,
 *     职场阶段→"公司一屏通览"的UI体验
 *   F→G  f463_ui_health_track    健康追踪UI → 消费 status 数据,
 *     健康数据→"你的身体在说什么"的UI预警
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR463Loaded) return;
  RANDOM_EVENTS._domainFLinkageR463Loaded = true;

  var EVENTS = [
    {
      id: "f463_ui_data_insight", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据画像",
      story: "你看了看自己的数据面板——{desc}",
      triggers: { minDay: 35, interval: 70, maxRepeats: 5, excludeFlags: ["_f463DataInsightCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.stats) return false;
        return (st.flags && !st.flags._f463DataInsightCooldown);
      },
      choices: [
        { text: "📈 分析收支趋势", hint: "会计XP+2,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f463DataInsightCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📈 你分析了收支趋势——'数据不说谎，但需要解读。' 会计XP+2,智力+1。", "success");
        }},
        { text: "🎯 设定量化目标", hint: "心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f463DataInsightCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🎯 你设定了量化目标——'没有衡量，就没有改进。' 心智+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var totalEarned = st.resources && st.resources.totalEarned ? st.resources.totalEarned : 0;
        return "你看了看自己的数据面板——累计赚取¥" + totalEarned.toLocaleString() + "。数字背后，是你每一天的努力。";
      }
    },
    {
      id: "f463_ui_corp_display", phase: "corporate", _isChainEvent: false, icon: "🖥️",
      title: "一屏通览",
      story: "你设计了公司的管理驾驶舱——{desc}",
      triggers: { minDay: 70, interval: 120, maxRepeats: 3, excludeFlags: ["_f463CorpDisplayCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.company) return false;
        return (st.flags && !st.flags._f463CorpDisplayCooldown);
      },
      choices: [
        { text: "📊 数据驱动", hint: "管理XP+4,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f463CorpDisplayCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("management", 4); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你设计了数据驱动的管理驾驶舱——'用数据说话。' 管理XP+4,智力+1。", "success");
        }},
        { text: "❤️ 人文关怀", hint: "团队忠诚+5,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f463CorpDisplayCooldown = true;
          var t = st.corporate && st.corporate.team;
          if (t) { for (var i = 0; i < t.length; i++) { if (t[i]) t[i].loyalty = Math.min(100, (t[i].loyalty || 50) + 5); } }
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ 你设计了人文关怀的管理界面——'人不是指标。' 团队忠诚+5,心情+3。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var company = st.corporate && st.corporate.company;
        var name = company ? company.name : "公司";
        return "你设计了" + name + "的管理驾驶舱——一屏之间，团队状态、项目进度、财务状况尽收眼底。但更重要的是，你想让这个界面传递什么样的管理哲学？";
      }
    },
    {
      id: "f463_ui_health_track", phase: "street", _isChainEvent: false, icon: "💓",
      title: "身体信号",
      story: "你关注了一下自己的健康数据——{desc}",
      triggers: { minDay: 25, interval: 50, maxRepeats: 5, excludeFlags: ["_f463HealthTrackCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.status || !st.status.health) return false;
        return (st.flags && !st.flags._f463HealthTrackCooldown);
      },
      choices: [
        { text: "🏃 制定运动计划", hint: "健康+5,疲劳+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f463HealthTrackCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 5);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 你制定了运动计划——'身体是革命的本钱。' 健康+5,疲劳+3。", "success");
        }},
        { text: "😴 调整作息", hint: "疲劳-10,心情+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f463HealthTrackCooldown = true;
          if (st.needs) { st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 10); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("😴 你决定调整作息——'早睡早起，百病不侵。' 疲劳-10,心情+3。", "success");
        }},
        { text: "🍲 改善饮食", hint: "健康+3,现金-100", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f463HealthTrackCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 3);
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 100);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🍲 你决定改善饮食——'病从口入。' 健康+3,现金-100。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var health = st.status && st.status.health ? st.status.health : 70;
        if (health < 30) return "你的健康值只有" + health + "了——身体在发出严重警告。你不能继续忽视它了。";
        if (health < 60) return "你的健康值是" + health + "——不算太差，但已经开始走下坡路。是时候关注一下了。";
        return "你的健康值是" + health + "——状态不错。但保持健康需要持续的关注和投入。";
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
