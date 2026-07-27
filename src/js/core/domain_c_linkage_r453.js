/**
 * 域C(职业/成长) 联动增强 R453（第二轮循环·续）
 * 桥接：
 *   C→D  c453_colleague_competitor   职场竞争 → 消费 corporate.colleagues 数据,
 *     同事晋升竞争→"既生瑜何生亮"的职场张力叙事
 *   C→B  c453_workplace_milestone    职场里程碑 → 消费 employment 数据,
 *     职业成就→"被看见"的叙事回响
 *   C→G  c453_burnout_recovery       职业倦怠恢复 → 消费 career capital 数据,
 *     高压工作后的身心恢复→"停下来才能走更远"的生命叙事
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR453Loaded) return;
  RANDOM_EVENTS._domainCLinkageR453Loaded = true;

  function ensureCareerCapital(st) {
    if (!st) return null;
    if (!st.career) st.career = {};
    if (!st.career.capital) st.career.capital = { burnout: 0, reputation: 0, industryResources: 0, clientLeads: 0 };
    return st.career.capital;
  }
  function firstHighRelationColleague(st) {
    if (!st || !st.corporate || !st.corporate.colleagues) return null;
    var net = st.corporate.colleagues.network;
    if (!net || !Array.isArray(net)) return null;
    for (var i = 0; i < net.length; i++) {
      if (net[i] && (net[i].relationship || 0) >= 50) return net[i];
    }
    return null;
  }

  var EVENTS = [
    {
      id: "c453_colleague_competitor", phase: "corporate", _isChainEvent: false, icon: "⚔️",
      title: "职场对手",
      story: "你和{name}同时竞争一个晋升机会——{desc}",
      triggers: { minDay: 120, interval: 120, maxRepeats: 3, excludeFlags: ["_c453CompetitorCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.corporate || !st.corporate.colleagues) return false;
        if (!st.career || !st.career.currentJob) return false;
        if ((st.career.currentJob.workDays || 0) < 90) return false;
        var net = st.corporate.colleagues.network;
        if (!net || !Array.isArray(net) || net.length < 2) return false;
        return (st.flags && !st.flags._c453CompetitorCooldown);
      },
      choices: [
        { text: "💪 正面竞争", hint: "业绩+8,关系-10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453CompetitorCooldown = true;
          if (st.career && st.career.currentJob) st.career.currentJob.performance = Math.min(100, (st.career.currentJob.performance || 50) + 8);
          var c = firstHighRelationColleague(st);
          if (c && typeof decreaseColleagueRelationship === "function") { try { decreaseColleagueRelationship(st, c.id, 10, "晋升竞争"); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("💪 你选择正面迎战——职场上没有退路，只有前进。业绩+8。", "success");
        }},
        { text: "🤝 合作共赢", hint: "关系+5,行业资源+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453CompetitorCooldown = true;
          var c = firstHighRelationColleague(st);
          if (c && typeof increaseColleagueRelationship === "function") { try { increaseColleagueRelationship(st, c.id, 5, "良性竞争"); } catch(e) {} }
          var cap = ensureCareerCapital(st);
          cap.industryResources = (cap.industryResources || 0) + 3;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🤝 你选择了良性竞争——职场不是零和博弈，一起进步才是双赢。行业资源+3。", "success");
        }},
        { text: "🧘 专注自身", hint: "心智+3,倦怠-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453CompetitorCooldown = true;
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          var cap = ensureCareerCapital(st);
          cap.burnout = Math.max(0, (cap.burnout || 0) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🧘 你选择专注自身——与其盯着对手，不如做好自己。心智+3,倦怠-5。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var c = firstHighRelationColleague(st);
        var name = c ? c.name : "一位同事";
        return "你和" + name + "同时竞争一个晋升机会——你们的业绩不相上下，但名额只有一个。这是职场最残酷的考场。";
      }
    },
    {
      id: "c453_workplace_milestone", phase: "corporate", _isChainEvent: false, icon: "🏆",
      title: "被看见",
      story: "你的职业成就引起了关注——{desc}",
      triggers: { minDay: 200, interval: 150, maxRepeats: 2, excludeFlags: ["_c453MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob) return false;
        if ((st.career.currentJob.workDays || 0) < 180) return false;
        var cap = ensureCareerCapital(st);
        return (cap.reputation || 0) >= 20 && (st.flags && !st.flags._c453MilestoneCooldown);
      },
      choices: [
        { text: "📢 接受采访", hint: "名望+5,心智+2", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453MilestoneCooldown = true;
          if (st.player) { st.player.fame = Math.min(100, (st.player.fame || 0) + 5); st.player.mental = Math.min(100, (st.player.mental || 50) + 2); }
          var cap = ensureCareerCapital(st); cap.reputation = (cap.reputation || 0) + 8;
          if (typeof StateManager !== "undefined") StateManager.addMessage("📢 你接受了行业媒体的采访——'我只是做了该做的事。' 名望+5,心智+2,声誉+8。", "success");
        }},
        { text: "🙈 低调做事", hint: "行业资源+10", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453MilestoneCooldown = true;
          var cap = ensureCareerCapital(st);
          cap.industryResources = (cap.industryResources || 0) + 10;
          if (typeof StateManager !== "undefined") StateManager.addMessage("🙈 你婉拒了采访——真正的高手不需要聚光灯。行业资源+10。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var job = st.career && st.career.currentJob;
        var pathName = "";
        if (job && job.path && typeof CAREER_PATHS !== "undefined" && CAREER_PATHS[job.path]) {
          pathName = CAREER_PATHS[job.path].name;
        }
        return "你在" + (pathName || "职场") + "的努力终于被看见了——行业媒体想采访你，朋友圈在传你的故事。你第一次感受到'被看见'的滋味。";
      }
    },
    {
      id: "c453_burnout_recovery", phase: "corporate", _isChainEvent: false, icon: "🌙",
      title: "停下来",
      story: "连续的加班让你身心俱疲——{desc}",
      triggers: { minDay: 150, interval: 100, maxRepeats: 3, excludeFlags: ["_c453BurnoutCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob) return false;
        var cap = ensureCareerCapital(st);
        if ((cap.burnout || 0) < 50) return false;
        return (st.flags && !st.flags._c453BurnoutCooldown);
      },
      choices: [
        { text: "🛌 彻底休息", hint: "倦怠-30,健康+10,业绩-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453BurnoutCooldown = true;
          var cap = ensureCareerCapital(st);
          cap.burnout = Math.max(0, (cap.burnout || 0) - 30);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 10);
          if (st.career && st.career.currentJob) st.career.currentJob.performance = Math.max(0, (st.career.currentJob.performance || 50) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🛌 你决定彻底休息几天——停下来，才能走得更远。倦怠-30,健康+10,业绩-5。", "success");
        }},
        { text: "🏃 运动解压", hint: "倦怠-15,健康+5,心智+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453BurnoutCooldown = true;
          var cap = ensureCareerCapital(st);
          cap.burnout = Math.max(0, (cap.burnout || 0) - 15);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 5);
          if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 你选择用运动解压——流汗是最好的减压方式。倦怠-15,健康+5,心智+3。", "success");
        }},
        { text: "☕ 硬扛到底", hint: "业绩+5,倦怠+10,健康-8", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c453BurnoutCooldown = true;
          if (st.career && st.career.currentJob) st.career.currentJob.performance = Math.min(100, (st.career.currentJob.performance || 50) + 5);
          var cap = ensureCareerCapital(st);
          cap.burnout = Math.min(100, (cap.burnout || 0) + 10);
          if (st.status) st.status.health = Math.max(0, (st.status.health || 70) - 8);
          if (typeof StateManager !== "undefined") StateManager.addMessage("☕ 你选择硬扛——再撑一撑就过去了。业绩+5,但倦怠+10,健康-8。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cap = ensureCareerCapital(st);
        var burnout = cap ? (cap.burnout || 0) : 0;
        if (burnout >= 80) return "你已经连续加班好几个月了。今天早上照镜子，发现自己眼里全是血丝。身体在发出警告——你真的需要停下来了。";
        return "连续的加班让你身心俱疲，桌上的咖啡杯已经堆成了小山。你知道这样下去不是办法，但手头的工作又放不下。";
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
