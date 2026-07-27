/**
 * 域F(UI/UX) 联动增强 R444
 * 桥接：
 *   F→G  f444_health_checkin      健康面板自检 → 消费 status/needs 数据,
 *     查看健康面板→"你的身体亮红灯了吗"的健康自检行动
 *   F→B  f444_event_timeline      事件时间线回顾 → 消费 flags 数据,
 *     回顾界面→"那些改变你命运的日子"的叙事回味
 *   F→A  f444_data_overview       数据面板概览 → 消费 resources/trade 数据,
 *     经济数据总览→"你的钱都花在哪了"的收支洞察
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainFLinkageR444Loaded) return;
  RANDOM_EVENTS._domainFLinkageR444Loaded = true;

  var EVENTS = [
    // F→G: 健康面板自检 → 健康行动
    {
      id: "f444_health_checkin", phase: "street", _isChainEvent: false, icon: "❤️",
      title: "健康自检",
      story: "你看了看镜子里的自己——{desc}",
      triggers: { minDay: 15, interval: 30, maxRepeats: 5, excludeFlags: ["_f444HealthCheckinCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f444HealthCheckinCooldown);
      },
      choices: [
        { text: "🏃 出门跑两圈", hint: "健康+2,疲劳+3,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f444HealthCheckinCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 2);
          if (st.needs) { st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 3); st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ 你出门跑了两圈——虽然累，但出了一身汗之后感觉整个人都清爽了。健康+2,疲劳+3,心情+1。", "success");
        }},
        { text: "🍎 注意饮食", hint: "健康+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f444HealthCheckinCooldown = true;
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("❤️ 你决定今天吃清淡点——少油少盐，多吃蔬菜。身体的每一分健康都是攒出来的。健康+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var h = (st.status && st.status.health) || 70;
        var healthStatus = h >= 80 ? "气色不错" : (h >= 50 ? "还行" : "有点差");
        return "你看了看镜子里的自己——气色" + healthStatus + "（健康" + h + "）。身体是革命的本钱，这话一点不假。";
      }
    },
    // F→B: 事件时间线回顾 → 叙事回味
    {
      id: "f444_event_timeline", phase: "street", _isChainEvent: false, icon: "📖",
      title: "回望来路",
      story: "翻着手机里的老照片，你想起了一路走来的点点滴滴——{desc}",
      triggers: { minDay: 60, interval: 90, maxRepeats: 3, excludeFlags: ["_f444TimelineCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return (st.flags && !st.flags._f444TimelineCooldown);
      },
      choices: [
        { text: "📝 写一段日记", hint: "心智+3,心情+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f444TimelineCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 2);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你翻出手机里的老照片，写下了一段日记——那些走过的路、吃过的苦，都成了今天的你。心智+3,心情+2。", "success");
        }},
        { text: "🤳 发个朋友圈感慨", hint: "名气+1,心情+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f444TimelineCooldown = true;
          if (st.player) st.player.fame = Math.min(100, (st.player.fame || 0) + 1);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📖 你发了条朋友圈回顾这些年的变化——朋友们纷纷点赞评论。名气+1,心情+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var day = (st.player && st.player.day) || 0;
        var month = Math.floor(day / 30) || 1;
        return "翻着手机里的老照片，你想起了一路走来的点点滴滴——已经在这座城市生活了" + month + "个月了。时间过得真快。";
      }
    },
    // F→A: 数据面板概览 → 收支洞察
    {
      id: "f444_data_overview", phase: "street", _isChainEvent: false, icon: "💳",
      title: "算算账",
      story: "你坐下来翻了翻这个月的流水——{desc}",
      triggers: { minDay: 20, interval: 30, maxRepeats: 5, excludeFlags: ["_f444DataOverviewCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var cash = (st.resources && st.resources.cash) || 0;
        return cash > 0 && (st.flags && !st.flags._f444DataOverviewCooldown);
      },
      choices: [
        { text: "📊 做收支分析", hint: "会计XP+3,心智+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f444DataOverviewCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 3); } catch(e) {} }
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("💳 你仔细分析了这个月的收支——钱花在哪、赚了多少，心里有数才能走得远。会计XP+3,心智+1。", "success");
        }},
        { text: "💰 存钱", hint: "存款+500", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._f444DataOverviewCooldown = true;
          if (st.resources && st.resources.cash >= 500) {
            st.resources.cash -= 500;
            st.resources.bankBalance = (st.resources.bankBalance || 0) + 500;
          }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💳 你算了算账，把省下来的500块存进了银行——积少成多。存款+¥500。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cash = (st.resources && st.resources.cash) || 0;
        var bank = (st.resources && st.resources.bankBalance) || 0;
        return "你坐下来翻了翻这个月的流水——手头现金¥" + Math.floor(cash).toLocaleString() + "，银行存款¥" + Math.floor(bank).toLocaleString() + "。钱花在哪了，你心里有数吗？";
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