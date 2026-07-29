/**
 * 域F(UI/UX) 联动增强 R816 (第十三轮循环)
 * 桥接：
 *   F→A  f816_data_insight 数据洞察 → 消费 全维度数据
 *   F→B  f816_event_timeline 事件时间线 → 消费 事件历史
 *   F→G  f816_health_dashboard 健康仪表盘 → 消费 status/needs
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR816Loaded) return;
  RANDOM_EVENTS._domainFLinkageR816Loaded = true;

  var EVENTS = [
    {
      id: "f816_data_insight", phase: "street", _isChainEvent: false, icon: "📊",
      title: "数据洞察",
      story: "你的数据正在讲述一个完整的故事——每一个数字,都是你成长的见证。",
      triggers: { minDay: 200, interval: 300, maxRepeats: 3, excludeFlags: ["_f816DataCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f816DataCd) return false;
        return st.player && st.player.day >= 200;
      },
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        var cash = st.resources && isFinite(st.resources.cash) ? Math.round(st.resources.cash) : 0;
        return "你已度过" + days + "天,存款¥" + cash.toLocaleString() + "——'每一个数字,都是你成长的见证。'";
      },
      choices: [
        {
          text: "📈 查看成长轨迹", hint: "心智+20,智力+15,置_f816Tracker",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f816DataCd = true;
            st.flags._f816Tracker = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
              st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📈 '数据是最好的见证者。' 心智+20,智力+15。", "success");
            }
          }
        },
        {
          text: "🎯 设定新目标", hint: "心智+25,置_f816Goal",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f816DataCd = true;
            st.flags._f816Goal = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 25);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🎯 '有目标,才有方向。' 心智+25。", "info");
            }
          }
        }
      ]
    },
    {
      id: "f816_event_timeline", phase: "street", _isChainEvent: false, icon: "📜",
      title: "事件时间线",
      story: "你经历的事件,串联成了一条时间线——每一件事,都改变了你的人生轨迹。",
      triggers: { minDay: 300, interval: 350, maxRepeats: 3, excludeFlags: ["_f816TimelineCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f816TimelineCd) return false;
        return st.player && st.player.day >= 300;
      },
      text: function (st) {
        if (!st) return null;
        var days = st.player && st.player.day ? st.player.day : 0;
        return "你已度过" + days + "天——'每一件事,都改变了你的人生轨迹。'";
      },
      choices: [
        {
          text: "📖 回顾关键事件", hint: "心智+20,魅力+15,置_f816Chronicler",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f816TimelineCd = true;
            st.flags._f816Chronicler = true;
            if (st.player) {
              st.player.mental = Math.min(100, (st.player.mental || 50) + 20);
              st.player.charm = Math.min(100, (st.player.charm || 50) + 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("📖 '每一个选择,都塑造了今天的你。' 心智+20,魅力+15。", "success");
            }
          }
        },
        {
          text: "✍️ 记录当下", hint: "心智+22,置_f816Writer",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f816TimelineCd = true;
            st.flags._f816Writer = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 22);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("✍️ '记录当下,就是为未来留下礼物。' 心智+22。", "info");
            }
          }
        }
      ]
    },
    {
      id: "f816_health_dashboard", phase: "street", _isChainEvent: false, icon: "💚",
      title: "健康仪表盘",
      story: "健康,是你最需要关注的核心指标——定期检查,才能及时调整。",
      triggers: { minDay: 400, interval: 400, maxRepeats: 4, excludeFlags: ["_f816HealthCd"] },
      conditions: function (st) {
        if (!st || st.gameOver) return false;
        if (st.flags && st.flags._f816HealthCd) return false;
        return st.player && st.player.day >= 400 && st.status && st.needs;
      },
      text: function (st) {
        if (!st) return null;
        var health = st.status && isFinite(st.status.health) ? Math.round(st.status.health) : 100;
        var fatigue = st.needs && isFinite(st.needs.fatigue) ? Math.round(st.needs.fatigue) : 0;
        return "健康" + health + "%,疲劳" + fatigue + "——'定期检查,才能及时调整。'";
      },
      choices: [
        {
          text: "🏃 制定健康计划", hint: "健康+20,疲劳-20,置_f816HealthPlan",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f816HealthCd = true;
            st.flags._f816HealthPlan = true;
            if (st.status) st.status.health = Math.min(100, (st.status.health || 100) + 20);
            if (st.needs) st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 20);
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("🏃 '健康是1,其他都是0。' 健康+20,疲劳-20。", "success");
            }
          }
        },
        {
          text: "😴 调整作息", hint: "心情+25,疲劳-15,置_f816Sleep",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._f816HealthCd = true;
            st.flags._f816Sleep = true;
            if (st.needs) {
              st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 25);
              st.needs.fatigue = Math.max(0, (st.needs.fatigue || 0) - 15);
            }
            if (typeof StateManager !== "undefined") {
              StateManager.addMessage("😴 '早睡早起,精神百倍。' 心情+25,疲劳-15。", "info");
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