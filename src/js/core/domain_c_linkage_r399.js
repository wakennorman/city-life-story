/**
 * 域C(职业/成长) 联动增强 R399
 * 第十七轮循环——把隐藏在job_milestones/perf/skill_synergy中的数据转化为叙事体验。
 * 背景：域C 经 R243/R269/R357/R391 多轮加固后 A类净尽。
 * 本轮聚焦3个历轮未覆盖的数据→叙事桥接：
 *   C→G  c399_milestone_reflection  里程碑回望 → 消费 _jobMilestones+workDays 数据,
 *     工作里程碑触发"走了这么远"的回顾叙事,mental+happiness
 *   C→F  c399_perf_transparency      绩效透明感 → 消费 perf 评级数据,
 *     把绩效评分转化为"我的职场表现如何"的UI洞察
 *   C→D  c399_workplace_bond          职场情谊 → 消费 workplace_social+relationships,
 *     同事关系→"不只是同事,更是朋友"的社交叙事
 *
 * 严格照 domain_c_linkage_r391.js / r381.js 已验证IIFE注入范式。
 */
(function () {
  "use strict";

  if (typeof RANDOM_EVENTS === "undefined" || !RANDOM_EVENTS) return;
  if (RANDOM_EVENTS._domainCLinkageR399Loaded) return;
  RANDOM_EVENTS._domainCLinkageR399Loaded = true;

  // 安全技能经验
  function grantSkillXpR399(key, amount) {
    if (typeof addSkillXp === "function") {
      try { addSkillXp(key, amount); } catch (e) { /* safe */ }
    }
  }

  var EVENTS = [
    {
      // C→G: 里程碑回望 — 消费 _jobMilestones+workDays
      id: "c399_milestone_reflection",
      phase: "street",
      _isChainEvent: false,
      icon: "🏁",
      title: "里程碑回望",
      story:
        "你回望自己走过的职业之路——{milestoneText}\n\n每一步都算数。",
      triggers: { minDay: 50, excludeFlags: ["_c399MilestoneCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        // 需要有工作里程碑记录或累计工作天数
        var milestones = (st.flags && st.flags._jobMilestones) || [];
        var workDays = (st.stats && st.stats.totalWorkDays) || 0;
        return milestones.length >= 2 || workDays >= 30;
      },
      choices: [
        {
          text: "🌟 感恩每一段经历",
          hint: "心智+4,心情+5,置 _c399MilestoneCooldown(100天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c399MilestoneCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 4);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 5);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("🏁 你回望职业之路——每一段经历都是成长。心智+4,心情+5。", "success");
          }
        },
        {
          text: "💪 继续前行",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var milestones = (st.flags && st.flags._jobMilestones) || [];
        var workDays = (st.stats && st.stats.totalWorkDays) || 0;
        var text = "从第一天打工到今天,你已经走了" + workDays + "天";
        if (milestones.length > 0) {
          text += ",达成了" + milestones.length + "个工作里程碑";
        }
        return "你回望自己走过的职业之路——" + text + "。\n\n每一步都算数。";
      }
    },
    {
      // C→F: 绩效透明感 — 消费 perf 评级数据
      id: "c399_perf_transparency",
      phase: "corporate",
      _isChainEvent: false,
      icon: "📊",
      title: "绩效透明感",
      story:
        "你查看了最近的绩效评估——{perfSummary}\n\n了解自己是进步的第一步。",
      triggers: { minDay: 90, excludeFlags: ["_c399PerfCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        var corp = st.player.corporate;
        return (corp.perfHistory && corp.perfHistory.length > 0) || (corp.kpi !== undefined);
      },
      choices: [
        {
          text: "📈 把绩效当作成长指南",
          hint: "心智+3,management XP+4,置 _c399PerfCooldown(90天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c399PerfCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            grantSkillXpR399("management", 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("📊 你学会了从绩效反馈中学习——数据是指南针。心智+3,管理XP+4。", "success");
          }
        },
        {
          text: "😅 绩效只是参考",
          hint: "无奖励",
          apply: function (st) { /* 无奖励选择 */ }
        }
      ],
      text: function (st) {
        if (!st || !st.player || !st.player.corporate) return null;
        var corp = st.player.corporate;
        var summary = "暂无绩效记录";
        if (corp.perfHistory && corp.perfHistory.length > 0) {
          var recent = corp.perfHistory[corp.perfHistory.length - 1];
          summary = "最近一次绩效评级:" + ((recent && recent.grade) || "暂无");
        } else if (typeof corp.kpi === "number") {
          summary = "当前KPI得分:" + corp.kpi + "分";
        }
        return "你查看了最近的绩效评估——" + summary + "。\n\n了解自己是进步的第一步。";
      }
    },
    {
      // C→D: 职场情谊 — 消费 workplace_social+relationships
      id: "c399_workplace_bond",
      phase: "corporate",
      _isChainEvent: false,
      icon: "🤝",
      title: "职场情谊",
      story:
        "工作中你发现——{bondInsight}\n\n同事不只是共事的人,更是人生路上的同行者。",
      triggers: { minDay: 75, excludeFlags: ["_c399BondCooldown"] },
      conditions: function (st) {
        if (st.gameOver) return false;
        if (!st.player || !st.player.corporate) return false;
        return true;
      },
      choices: [
        {
          text: "💕 珍惜职场中的友谊",
          hint: "心智+3,心情+4,置 _c399BondCooldown(80天)",
          apply: function (st) {
            if (!st) return;
            st.flags = st.flags || {};
            st.flags._c399BondCooldown = true;
            if (st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 3);
            if (st.needs) st.needs.happiness = Math.min(100, (st.needs.happiness || 50) + 4);
            if (typeof StateManager !== "undefined" && StateManager.addMessage)
              StateManager.addMessage("💕 你珍惜职场中的友谊——同事是人生路上的同行者。心智+3,心情+4。", "success");
          }
        },
        {
          text: "😊 保持适当的距离",
          hint: "心智+2",
          apply: function (st) {
            if (st && st.player) st.player.mental = Math.min(100, (st.player.mental || 50) + 2);
          }
        }
      ],
      text: function (st) {
        if (!st) return null;
        var insight = "和同事的相处让工作变得更有温度";
        if (st.relationships) {
          var workFriends = 0;
          for (var id in st.relationships) {
            var r = st.relationships[id];
            if (r && r.met && (r.affinity || 0) >= 30) workFriends++;
          }
          if (workFriends > 0) insight = "你有" + workFriends + "位关系不错的同事,工作中互相支持";
        }
        return "工作中你发现——" + insight + "。\n\n同事不只是共事的人,更是人生路上的同行者。";
      }
    }
  ];

  // 注入 RANDOM_EVENTS
  for (var i = 0; i < EVENTS.length; i++) {
    var _e = EVENTS[i];
    if (RANDOM_EVENTS.find(function (ev) { return ev.id === _e.id; })) continue;
    RANDOM_EVENTS.push(_e);
  }
})();
