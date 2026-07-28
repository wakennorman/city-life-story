/**
 * 域C(职业/成长) 联动增强 R626
 * 桥接：
 *   C→D  c626_career_colleague_circle  职业同事圈 → 消费 state.career+state.corporate 数据,
 *     职业→"同事圈层"社交回响
 *   C→E  c626_skill_side_income  技能副业收入 → 消费 state.skills+state.player 数据,
 *     职业→"一技之长"经济回响
 *   C→G  c626_career_health_warning  职业健康预警 → 消费 state.career+state.needs 数据,
 *     职业→"高压工作"生命回响
 */
(function () {
  "use strict";
  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR626Loaded) return;
  RANDOM_EVENTS._domainCLinkageR626Loaded = true;

  var EVENTS = [
    // ================================================================
    // C→D: 职业同事圈 — 同事网络社交提醒
    // ================================================================
    {
      id: "c626_career_colleague_circle",
      phase: "street",
      _isChainEvent: false,
      icon: "👥",
      title: "同事圈",
      triggers: { minDay: 5 },
      story: function (st) {
        var net = st.corporate && st.corporate.colleagues && st.corporate.colleagues.network;
        if (!net || net.length === 0) {
          return "你目前还没有固定工作或同事圈。上班后会和同事建立联系，这些人脉对你的职业发展很重要。";
        }
        var highRel = 0;
        for (var i = 0; i < net.length; i++) {
          if (net[i] && (net[i].relationship || 0) >= 60) highRel++;
        }
        var total = net.length;
        if (highRel >= 2) {
          return "你在同事中人缘不错！" + total + "位同事中有" + highRel + "位关系很好（好感≥60）。" +
            "这些关系好的同事可能会在关键时刻帮你一把——比如内推、透露晋升信息、或者分担工作压力。";
        } else if (highRel >= 1) {
          return "你有一位关系不错的同事（好感≥60），" +
            "平时多聊聊天、偶尔请客吃饭，职场路上有人帮衬很重要。";
        }
        return "你和同事们的关系一般（" + total + "位同事，最高好感" +
          Math.max.apply(null, net.map(function(c) { return c.relationship || 0; })) + "）。" +
          "俗话说「多个朋友多条路」，在职场中维护好同事关系，对晋升和跳槽都有帮助。";
      },
      choices: [
        { text: "💬 和同事闲聊", apply: function(st) {
          if (typeof careerSocialAction === "function") {
            careerSocialAction("chat", null);
          } else {
            StateManager.addMessage("💬 找同事聊了聊，关系更近了一步", "info");
          }
        }},
        { text: "🍚 请同事吃饭", apply: function(st) {
          if (typeof careerSocialAction === "function") {
            careerSocialAction("meal", null);
          } else {
            StateManager.addMessage("🍚 请同事吃了顿饭，关系升温", "info");
          }
        }},
      ],
      conditions: function (st) {
        return st.career && st.career.currentJob;
      },
      weight: 1,
    },

    // ================================================================
    // C→E: 技能副业收入 — 利用专业技能接私活
    // ================================================================
    {
      id: "c626_skill_side_income",
      phase: "street",
      _isChainEvent: false,
      icon: "💡",
      title: "技能变现",
      triggers: { minDay: 15 },
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

        if (!topSkill || topLevel < 20) {
          return "你的技能还不够熟练。当某项技能达到Lv.20以上时，就可以考虑接私活赚外快了。" +
            "比如编程接外包、维修接私单、烹饪做私房菜。";
        }

        var skillName = (typeof getSkillChineseName === "function") ? getSkillChineseName(topSkill) : topSkill;
        var income = Math.floor(topLevel * 2.5 + 20);

        if (topLevel >= 50) {
          return "你的" + skillName + "技能已经达到Lv." + topLevel + "，在业内算是专家水平了。" +
            "以你的水平，接私活每月至少能赚 ¥" + income + " 额外收入。" +
            "如果有时间，可以考虑在业余时间接一些相关项目，让技能变成实实在在的收入。";
        }
        return "你的" + skillName + "技能Lv." + topLevel + "，已经可以接一些入门级的私活了。" +
          "预计每月能带来 ¥" + income + " 左右的额外收入。" +
          "继续提升技能等级，收入会跟着水涨船高。";
      },
      choices: [
        { text: "💰 接私活", apply: function(st) {
          var skills = st.skills || {};
          var topLv = 0;
          for (var k in skills) {
            if (skills[k] && typeof skills[k].level === "number" && skills[k].level > topLv) {
              topLv = skills[k].level;
            }
          }
          var earn = Math.floor(topLv * 2.5 + 20);
          st.resources = st.resources || {};
          st.resources.cash = (st.resources.cash || 0) + earn;
          st.resources.totalEarned = (st.resources.totalEarned || 0) + earn;
          StateManager.addMessage("💼 接了一单私活，赚了 ¥" + earn, "success");
        }},
        { text: "📚 继续提升", apply: function(st) {
          StateManager.addMessage("📚 你决定先把技能练到更高水平再考虑变现", "info");
        }},
      ],
      conditions: function (st) {
        var skills = st.skills || {};
        for (var k in skills) {
          if (skills[k] && typeof skills[k].level === "number" && skills[k].level >= 20) return true;
        }
        return false;
      },
      weight: 1,
    },

    // ================================================================
    // C→G: 职业健康预警 — 高压工作影响健康
    // ================================================================
    {
      id: "c626_career_health_warning",
      phase: "street",
      _isChainEvent: false,
      icon: "⚠️",
      title: "健康预警",
      triggers: { minDay: 20 },
      story: function (st) {
        if (!st.career || !st.career.currentJob) {
          return "你目前没有固定工作，自由度较高，注意保持作息规律就好。";
        }
        var job = st.career.currentJob;
        var wd = job.workDays || 0;
        var perf = job.performance || 50;
        var burnout = (typeof ensureCareerCapital === "function") ? (ensureCareerCapital(st).burnout || 0) : 0;
        var health = st.status && st.status.health || 100;
        var fatigue = st.needs && st.needs.fatigue || 0;

        if (burnout >= 70 || health < 40) {
          return "⚠️ 你的健康状况不容乐观！倦怠" + Math.round(burnout) + "%" +
            (health < 60 ? "，健康仅" + Math.round(health) : "") +
            "。在职" + wd + "天的高压工作正在透支你的身体。" +
            "建议尽快安排调休或年假，否则可能引发健康危机。";
        } else if (burnout >= 40 || fatigue >= 60) {
          return "你的身体在发出警告——倦怠" + Math.round(burnout) + "%" +
            (fatigue >= 50 ? "，疲劳度" + Math.round(fatigue) : "") +
            "。在职" + wd + "天，绩效" + perf + "分。" +
            "虽然还能坚持，但长期高负荷运转不是办法。适当休息反而能提高效率。";
        }
        return "你的身体状况良好（健康" + Math.round(health) + "，倦怠" + Math.round(burnout) + "%）。" +
          "在职" + wd + "天，绩效" + perf + "分。" +
          "继续保持良好的工作节奏，注意劳逸结合。";
      },
      choices: [
        { text: "😴 调休一天", apply: function(st) {
          if (typeof careerTakeBreak === "function") {
            careerTakeBreak();
          } else {
            var cap = (typeof ensureCareerCapital === "function") ? ensureCareerCapital(st) : null;
            if (cap) cap.burnout = Math.max(0, (cap.burnout || 0) - 20);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 3);
            StateManager.addMessage("😴 休息了一天，倦怠-20，心情+3", "success");
          }
        }},
        { text: "💪 坚持一下", apply: function(st) {
          StateManager.addMessage("💪 你决定再坚持一下，但要注意身体发出的信号", "info");
        }},
      ],
      conditions: function (st) {
        return st.career && st.career.currentJob && (st.career.currentJob.workDays || 0) >= 30;
      },
      weight: 1,
    },
  ];

  // 注册事件
  for (var i = 0; i < EVENTS.length; i++) {
    RANDOM_EVENTS.push(EVENTS[i]);
  }
})();