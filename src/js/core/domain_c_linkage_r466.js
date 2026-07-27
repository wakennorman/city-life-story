/**
 * 域C(职业/成长) 联动增强 R466（第十五轮循环）
 * 桥接：
 *   C→H  c466_skill_entrepreneur    技能创业基础 → 消费 skills+startup 数据,
 *     技能积累→"用手艺吃饭"的创业桥接
 *   C→F  c466_career_portfolio      职业作品集 → 消费 employment+skills 数据,
 *     职业历程→"你的履历长什么样"的UI展示
 *   c466_burnout_prevention(C→G 倦怠预防): burnout+health→"停下来才能走更远"
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR466Loaded) return;
  RANDOM_EVENTS._domainCLinkageR466Loaded = true;

  function topSkillKey(st) {
    if (!st || !st.skills) return null;
    var best = null, bestLv = -1;
    for (var k in st.skills) {
      var lv = st.skills[k] && st.skills[k].level ? st.skills[k].level : 0;
      if (lv > bestLv) { bestLv = lv; best = k; }
    }
    return best;
  }

  var EVENTS = [
    {
      id: "c466_skill_entrepreneur", phase: "street", _isChainEvent: false, icon: "🔧",
      title: "手艺变现",
      story: "你的{skill}技能已经练到了Lv.{lv}——{desc}",
      triggers: { minDay: 60, interval: 100, maxRepeats: 3, excludeFlags: ["_c466SkillEntrepCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        var sk = topSkillKey(st);
        if (!sk) return false;
        return (st.skills[sk] && st.skills[sk].level >= 20) && (st.flags && !st.flags._c466SkillEntrepCooldown);
      },
      choices: [
        { text: "🏪 摆摊接单", hint: "现金+500~1500,最高技能XP+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c466SkillEntrepCooldown = true;
          var income = typeof Random !== "undefined" ? Random.int(500, 1500) : 1000;
          if (st.resources) st.resources.cash = (st.resources.cash || 0) + income;
          var sk = topSkillKey(st);
          if (sk && typeof addSkillXp === "function") { try { addSkillXp(sk, 3); } catch(e) {} }
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏪 你用手艺接了个私活——'学了就要用。' 现金+" + income + "。", "success");
        }},
        { text: "📚 继续深造", hint: "最高技能XP+8,现金-200", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c466SkillEntrepCooldown = true;
          var sk = topSkillKey(st);
          if (sk && typeof addSkillXp === "function") { try { addSkillXp(sk, 8); } catch(e) {} }
          if (st.resources) st.resources.cash = Math.max(0, (st.resources.cash || 0) - 200);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📚 你选择继续深造——'磨刀不误砍柴工。' 最高技能XP+8,现金-200。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var sk = topSkillKey(st);
        var lv = sk && st.skills[sk] ? st.skills[sk].level : 0;
        var name = sk && typeof getSkillChineseName === "function" ? getSkillChineseName(sk) : (sk || "技能");
        return "你的" + name + "技能已经练到了Lv." + lv + "——在打工之外，你是否想过用手艺自己干？";
      }
    },
    {
      id: "c466_career_portfolio", phase: "street", _isChainEvent: false, icon: "📋",
      title: "职业履历",
      story: "你整理了一下自己的职业履历——{desc}",
      triggers: { minDay: 40, interval: 70, maxRepeats: 4, excludeFlags: ["_c466PortfolioCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        return ((st.career && st.career.history && st.career.history.length >= 2) || (st.stats && st.stats.actionFreq && st.stats.actionFreq.work >= 10)) && (st.flags && !st.flags._c466PortfolioCooldown);
      },
      choices: [
        { text: "✨ 突出亮点", hint: "心智+2,魅力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c466PortfolioCooldown = true;
          if (st.player) { st.player.mental = Math.min(100, (st.player.mental || 50) + 2); st.player.charm = Math.min(100, (st.player.charm || 50) + 1); }
          if (typeof StateManager !== "undefined") StateManager.addMessage("✨ 你突出了履历中的亮点——'好履历会说话。' 心智+2,魅力+1。", "success");
        }},
        { text: "📊 量化成果", hint: "会计XP+2,智力+1", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c466PortfolioCooldown = true;
          if (typeof addSkillXp === "function") { try { addSkillXp("accounting", 2); } catch(e) {} }
          if (st.player) st.player.intelligence = Math.min(100, (st.player.intelligence || 50) + 1);
          if (typeof StateManager !== "undefined") StateManager.addMessage("📊 你用数据量化了成果——'数字不说谎。' 会计XP+2,智力+1。", "success");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var historyLen = st.career && st.career.history ? st.career.history.length : 0;
        var workDays = st.stats && st.stats.actionFreq ? (st.stats.actionFreq.work || 0) : 0;
        return "你整理了一下职业履历——" + historyLen + "份工作、" + workDays + "天的工作经历。这些经历就是你的资本。";
      }
    },
    {
      id: "c466_burnout_prevention", phase: "corporate", _isChainEvent: false, icon: "🧘",
      title: "停下来",
      story: "连续的加班让你身心俱疲——{desc}",
      triggers: { minDay: 120, interval: 100, maxRepeats: 3, excludeFlags: ["_c466BurnoutCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.career || !st.career.currentJob) return false;
        var cap = st.career.capital;
        if (!cap || (cap.burnout || 0) < 40) return false;
        return (st.flags && !st.flags._c466BurnoutCooldown);
      },
      choices: [
        { text: "🏖️ 申请调休", hint: "倦怠-20,业绩-3,心情+5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c466BurnoutCooldown = true;
          var cap = st.career && st.career.capital;
          if (cap) cap.burnout = Math.max(0, (cap.burnout || 0) - 20);
          if (st.career && st.career.currentJob) st.career.currentJob.performance = Math.max(0, (st.career.currentJob.performance || 50) - 3);
          if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏖️ 你申请了调休——'停下来，才能走得更远。' 倦怠-20,业绩-3,心情+5。", "success");
        }},
        { text: "🏃 运动减压", hint: "倦怠-10,健康+5,疲劳+3", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c466BurnoutCooldown = true;
          var cap = st.career && st.career.capital;
          if (cap) cap.burnout = Math.max(0, (cap.burnout || 0) - 10);
          if (st.status) st.status.health = Math.min(100, (st.status.health || 70) + 5);
          if (st.needs) st.needs.fatigue = Math.min(100, (st.needs.fatigue || 0) + 3);
          if (typeof StateManager !== "undefined") StateManager.addMessage("🏃 你用运动减压——'身体是革命的本钱。' 倦怠-10,健康+5,疲劳+3。", "success");
        }},
        { text: "☕ 硬扛到底", hint: "业绩+5,倦怠+8,健康-5", apply: function (st) {
          if (!st) return; st.flags = st.flags || {}; st.flags._c466BurnoutCooldown = true;
          if (st.career && st.career.currentJob) st.career.currentJob.performance = Math.min(100, (st.career.currentJob.performance || 50) + 5);
          var cap = st.career && st.career.capital;
          if (cap) cap.burnout = Math.min(100, (cap.burnout || 0) + 8);
          if (st.status) st.status.health = Math.max(0, (st.status.health || 70) - 5);
          if (typeof StateManager !== "undefined") StateManager.addMessage("☕ 你选择硬扛——'再撑一撑。' 业绩+5,但倦怠+8,健康-5。", "warning");
        }}
      ],
      text: function (st) {
        if (!st) return null;
        var cap = st.career && st.career.capital;
        var burnout = cap ? (cap.burnout || 0) : 0;
        if (burnout >= 70) return "你的倦怠值已经高达" + burnout + "了——身体在严重警告你，再不停下来就要出大问题。";
        return "你的倦怠值已经到了" + burnout + "——虽然还能撑，但你知道自己需要休息了。";
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
